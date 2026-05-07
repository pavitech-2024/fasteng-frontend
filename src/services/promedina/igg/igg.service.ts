import { t } from 'i18next';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { IggAnalysisData, IggAnalysisActions } from '@/stores/promedina/igg/igg.store';
import iggAnalysisService from './igg-view.service';
import iggImage from '../../../assets/pro-medina/igg/igg.png'

// Constantes do DNIT (copiadas do componente original)
const FATORES_PONDERACAO: Record<number, number> = {
  1: 0.2, 2: 0.5, 3: 0.8, 4: 0.9, 5: 1.0, 6: 0.5, 7: 0.3, 8: 0.6
};

const CLASSIFICACAO = [
  { min: 0, max: 20, classificacao: "ÓTIMO", cor: "#2ecc71" },
  { min: 20, max: 40, classificacao: "BOM", cor: "#3498db" },
  { min: 40, max: 80, classificacao: "REGULAR", cor: "#f39c12" },
  { min: 80, max: 160, classificacao: "RUIM", cor: "#e74c3c" },
  { min: 160, max: Infinity, classificacao: "PÉSSIMO", cor: "#c0392b" }
];

const DEFEITOS_INFO: Record<string, { description: string; type: number; priority: number }> = {
  "FI": { description: "Fissuras Isoladas", type: 1, priority: 3 },
  "TTC": { description: "Trincas Transversais Curtas", type: 1, priority: 3 },
  "TTL": { description: "Trincas Transversais Longas", type: 1, priority: 3 },
  "TLC": { description: "Trincas Longitudinais Curtas", type: 1, priority: 3 },
  "TLL": { description: "Trincas Longitudinais Longas", type: 1, priority: 3 },
  "TRR": { description: "Trincas por Retração Térmica", type: 1, priority: 3 },
  "J": { description: "Trincas em Jacaré (sem erosão)", type: 2, priority: 2 },
  "TB": { description: "Trincas em Bloco (sem erosão)", type: 2, priority: 2 },
  "JE": { description: "Trincas em Jacaré (com erosão)", type: 3, priority: 1 },
  "TBE": { description: "Trincas em Bloco (com erosão)", type: 3, priority: 1 },
  "ALP": { description: "Afundamento Plástico Local", type: 4, priority: 1 },
  "ATP": { description: "Afundamento Plástico na Trilha", type: 4, priority: 1 },
  "ALC": { description: "Afundamento por Consolidação Local", type: 4, priority: 1 },
  "ATC": { description: "Afundamento por Consolidação na Trilha", type: 4, priority: 1 },
  "O": { description: "Ondulações/Corrugações", type: 5, priority: 1 },
  "P": { description: "Panelas/Buracos", type: 5, priority: 1 },
  "E": { description: "Escorregamento", type: 5, priority: 1 },
  "EX": { description: "Exsudação", type: 6, priority: 1 },
  "D": { description: "Desgaste", type: 7, priority: 1 },
  "R": { description: "Remendos", type: 8, priority: 1 }
};

class IGG_SERVICE implements IEssayService {
  info = {
    key: 'igg',
    icon: iggImage,
    title: t('pm.igg-register'),
    path: '/promedina/igg',
    steps: 3,
    backend_path: 'promedina/igg/igg-analysis',
    standard: {
      name: 'DNIT 006/2003-PRO',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/procedimento-pro/dnit006_2003_pro.pdf',
    },
    stepperData: [
      { step: 0, description: t('pm.general.data'), path: 'generalData' },
      { step: 1, description: t('pm.stations.defects'), path: 'stations' },
      { step: 2, description: t('pm.register.resume'), path: 'results' },
    ],
  };

  store_actions: IggAnalysisActions;
  userId: string;

  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as IggAnalysisData['generalData']);
          break;
        case 1:
          // ✅ PROCESSA O IGG ANTES DE IR PRO STEP 2!
          await this.processIGG(data as IggAnalysisData);
          break;
        case 2:
          await this.saveAnalysis(data as IggAnalysisData);
          break;
        default:
          throw new Error(t('errors.invalid-step'));
      }
    } catch (error) {
      throw error;
    }
  };

  submitGeneralData = async (generalData: IggAnalysisData['generalData']): Promise<void> => {
    console.log('📋 Dados gerais IGG:', generalData);
  };

  // ✅ NOVA FUNÇÃO: Processa o IGG quando clica "Próximo" no Step 1
 processIGG = async (data: IggAnalysisData): Promise<void> => {
  console.log('🔧 Processando IGG...');
  console.log('📦 Data recebida:', data);
  
  const { generalData, stations } = data;
  
  console.log('📄 GeneralData:', generalData);
  console.log('🚉 Stations:', stations?.length);
  
  if (!stations || stations.length === 0) {
    throw new Error('Adicione pelo menos uma estação');
  }

  // Converte o formato da store para o formato de cálculo
  const stationsParaCalculo = stations.map(s => ({
    id: s.id,
    stationNumber: s.stationNumber,
    section: s.section,
    tri: s.tri,
    tre: s.tre,
    defects: s.defects.reduce((acc, d) => ({ ...acc, [d.code]: d.count }), {} as Record<string, number>)
  }));

  console.log('🔢 Stations para cálculo:', stationsParaCalculo);

  const results = this.calcularIGG(generalData, stationsParaCalculo);
  
  // ✅ Salva os resultados na store
  this.store_actions.setResults(results);
  
  console.log('✅ IGG Processado:', results.statistics.IGG);
};

  // ✅ Função de cálculo do IGG (adaptada do componente original)
  calcularIGG = (generalData: any, stations: any[]) => {
    const n = stations.length;

    // Cálculo das flechas
    const media_tri = stations.reduce((sum, s) => sum + s.tri, 0) / n;
    const media_tre = stations.reduce((sum, s) => sum + s.tre, 0) / n;
    const var_tri = stations.reduce((sum, s) => sum + Math.pow(s.tri - media_tri, 2), 0) / n;
    const var_tre = stations.reduce((sum, s) => sum + Math.pow(s.tre - media_tre, 2), 0) / n;
    
    const F = (media_tri + media_tre) / 2;
    const FV = (var_tri + var_tre) / 2;
    
    // Processamento de defeitos
    const tiposDefeitos = stations.map(station => {
      const tiposEncontrados: number[] = [];
      Object.keys(station.defects).forEach(code => {
        if (station.defects[code] > 0 && DEFEITOS_INFO[code]) {
          tiposEncontrados.push(DEFEITOS_INFO[code].type);
        }
      });
      return tiposEncontrados;
    });
    
    const tiposPriorizados = tiposDefeitos.map(tipos => {
      const tiposUnicos = Array.from(new Set(tipos)).sort((a, b) => b - a);
      if (tiposUnicos.includes(3)) return tiposUnicos.filter(t => t >= 3);
      if (tiposUnicos.includes(2)) return tiposUnicos.filter(t => t >= 2);
      return tiposUnicos;
    });
    
    const freq_abs: Record<number, number> = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0};
    tiposPriorizados.forEach(tipos => {
      Array.from(new Set(tipos)).forEach(t => { freq_abs[t]++; });
    });
    
    const freq_rel = Object.fromEntries(
      Object.entries(freq_abs).map(([t, count]) => [parseInt(t), (count / n) * 100])
    );
    
    const IGI_tipos: Record<number, number> = {};
    Object.entries(freq_rel).forEach(([t, freq]) => {
      const tipo = parseInt(t);
      IGI_tipos[tipo] = freq * FATORES_PONDERACAO[tipo];
    });
    
    const IGI_F = F <= 30 ? F * (4/3) : 40;
    const IGI_FV = FV <= 50 ? FV : 50;
    const IGG = Object.values(IGI_tipos).reduce((a, b) => a + b, 0) + IGI_F + IGI_FV;
    
    const classificacaoObj = CLASSIFICACAO.find(c => IGG >= c.min && IGG < c.max) || CLASSIFICACAO[CLASSIFICACAO.length - 1];
    
    const estacaoCritica = stations.reduce((critica, station) => {
      const totalAtual = Object.values(station.defects).reduce((sum: number, count: any) => sum + count, 0);
      const totalCritica = Object.values(critica.defects).reduce((sum: number, count: any) => sum + count, 0);
      return totalAtual > totalCritica ? station : critica;
    }, stations[0]);
    
    const total_defeitos = stations.reduce((sum, s) => 
      sum + Object.values(s.defects).reduce((s2: number, count: any) => s2 + count, 0), 0
    );

    const composicao_igg = [
      ...Object.entries(IGI_tipos)
        .filter(([, valor]) => valor > 0.01)
        .map(([tipo, valor]) => ({ fator: `IGI Tipo ${tipo}`, valor, tipo: parseInt(tipo) })),
      { fator: "IGI Flechas (F)", valor: IGI_F },
      { fator: "IGI Variância (FV)", valor: IGI_FV },
    ].sort((a, b) => b.valor - a.valor);

    return {
      generalData,
      statistics: {
        flechas_TRI: { media: media_tri, variancia: var_tri },
        flechas_TRE: { media: media_tre, variancia: var_tre },
        F, FV,
        frequencias_absolutas: freq_abs,
        frequencias_relativas: freq_rel,
        IGI_tipos, IGI_F, IGI_FV, IGG,
        classificacao: classificacaoObj.classificacao,
        cor_classificacao: classificacaoObj.cor,
        estacao_critica: estacaoCritica,
        total_defeitos,
        composicao_igg,
        total_estacoes: n
      }
    };
  };

  saveAnalysis = async (store: IggAnalysisData): Promise<void> => {
    console.log("🚀 [saveIGGAnalysis] INÍCIO");
    console.log("📦 STORE ORIGINAL:", store);

    const { _id } = store;
    console.log("🆔 ID:", _id);

    // Normalização de valores null
    const replaceNullValues = (data: any): any => {
      const newData = { ...data };

      const recursiveReplaceNull = (obj: Record<string, any>, path = '') => {
        for (const key in obj) {
          const fullPath = path ? `${path}.${key}` : key;

          if (obj[key] === null) {
            console.log(`⚠️ NULL encontrado em: ${fullPath}`);
            obj[key] = '-';
          } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            recursiveReplaceNull(obj[key], fullPath);
          } else if (Array.isArray(obj[key])) {
            obj[key].forEach((item: any, index: number) => {
              if (typeof item === 'object' && item !== null) {
                recursiveReplaceNull(item, `${fullPath}[${index}]`);
              }
            });
          }
        }
      };

      recursiveReplaceNull(newData);
      return newData;
    };

    console.log("🔧 Normalizando nulls...");
    const updatedData = replaceNullValues(store);
    console.log("✅ DATA APÓS NORMALIZAÇÃO:", updatedData);

    const { name, description, road, section, subtrack, pavementType, evaluationDate, stations, results, status, userId } = updatedData;

    console.log("📄 NAME:", name);
    console.log("📄 ROAD:", road);
    console.log("📄 STATIONS:", stations?.length);

    try {
      let response;

      if (!_id || _id === '---') {
        console.log("🆕 MODO: CREATE");

        const { _id, ...storeWithoutId } = store;

        console.log("📤 PAYLOAD CREATE:", {
          name,
          description,
          road,
          section,
          subtrack,
          pavementType,
          evaluationDate,
          stations,
          results,
          status,
          userId,
        });

        response = await iggAnalysisService.saveAnalysis({
          name,
          description,
          road,
          section,
          subtrack,
          pavementType,
          evaluationDate,
          stations,
          results,
          status: status || 'draft',
          userId,
        });

      } else {
        console.log("✏️ MODO: UPDATE");

        console.log("📤 PAYLOAD UPDATE:", {
          name,
          description,
          road,
          section,
          subtrack,
          pavementType,
          evaluationDate,
          stations,
          results,
          status,
        });

        response = await iggAnalysisService.updateAnalysis(_id, {
          name,
          description,
          road,
          section,
          subtrack,
          pavementType,
          evaluationDate,
          stations,
          results,
          status,
        });
      }

      console.log("📥 RESPONSE RECEBIDA:", response);

      const { data } = response;

      console.log("📊 DATA:", data);

      if (data && data._id) {
        console.log("🎉 ANÁLISE IGG SALVA COM SUCESSO! ID:", data._id);
      }

      console.log("🎉 FINALIZADO COM SUCESSO");

    } catch (error: any) {
      console.log("💥 ERRO CAPTURADO:", error);

      console.log("📡 STATUS:", error?.response?.status);
      console.log("📡 DATA:", error?.response?.data);

      if (error?.response?.status === 413) {
        console.log("🚨 PAYLOAD MUITO GRANDE");
        throw new Error(t('pm.register.payload-too-large-error'));
      }

      if (error?.response?.status === 409) {
        console.log("🚨 ANÁLISE JÁ EXISTE");
        throw new Error(t('pm.register.already-exists-error'));
      }

      throw error;
    }
  };
}

export default IGG_SERVICE;