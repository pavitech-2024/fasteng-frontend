import { t } from 'i18next';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { IggAnalysisData, IggAnalysisActions } from '@/stores/promedina/igg/igg.store';
import iggAnalysisService from './igg-view.service';
import Iggicon from '@/assets/asphalt/essays/Igg.png';

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
    icon: Iggicon,
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
  
  // ✅ CORREÇÃO: Frequências - conta POR ESTAÇÃO (não por tipo único)
  const freq_abs: Record<number, number> = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0};
  
  stations.forEach(station => {
    const tiposNaEstacao = new Set<number>();
    
    Object.keys(station.defects).forEach(code => {
      if (station.defects[code] > 0 && DEFEITOS_INFO[code]) {
        tiposNaEstacao.add(DEFEITOS_INFO[code].type);
      }
    });
    
    // ✅ CONTAGEM CORRETA: conta o tipo de maior prioridade por estação
    const tiposArray = Array.from(tiposNaEstacao).sort((a, b) => b - a);
    
    if (tiposArray.length > 0) {
      // Se tem tipo 3, conta só tipos >= 3
      if (tiposArray.includes(3)) {
        tiposArray.filter(t => t >= 3).forEach(t => { freq_abs[t]++; });
      }
      // Se tem tipo 2 (e não tem 3), conta tipos >= 2
      else if (tiposArray.includes(2)) {
        tiposArray.filter(t => t >= 2).forEach(t => { freq_abs[t]++; });
      }
      // Se só tem tipo 1, conta tipo 1
      else {
        freq_abs[1]++;
      }
    }
  });
  
  // Frequências relativas (%)
  const freq_rel: Record<number, number> = {};
  Object.entries(freq_abs).forEach(([t, count]) => {
    const tipo = parseInt(t);
    freq_rel[tipo] = (count / n) * 100;
  });
  
  // Resto do cálculo...
  const IGI_tipos: Record<number, number> = {};
  Object.entries(freq_rel).forEach(([t, freq]) => {
    const tipo = parseInt(t);
    IGI_tipos[tipo] = freq * FATORES_PONDERACAO[tipo];
  });
  
  const IGI_F = F <= 30 ? F * (4/3) : 40;
  const IGI_FV = FV <= 50 ? FV : 50;
  const IGG = Object.values(IGI_tipos).reduce((a, b) => a + b, 0) + IGI_F + IGI_FV;
  
  const classificacaoObj = CLASSIFICACAO.find(c => IGG >= c.min && IGG < c.max) || CLASSIFICACAO[CLASSIFICACAO.length - 1];
  
  // ✅ CORREÇÃO: Estação crítica com contagem de defeitos
  const estacaoCritica = stations.reduce((critica, station) => {
    const totalAtual = Object.values(station.defects).reduce((sum: number, count: any) => sum + (count || 0), 0);
    const totalCritica = Object.values(critica.defects).reduce((sum: number, count: any) => sum + (count || 0), 0);
    return totalAtual > totalCritica ? station : critica;
  }, stations[0]);
  
  const total_defeitos = stations.reduce((sum, s) => 
    sum + Object.values(s.defects).reduce((s2: number, count: any) => s2 + (count || 0), 0), 0
  );

  // Total de defeitos da estação crítica
  const totalDefeitosCritica = Object.values(estacaoCritica.defects).reduce((sum: number, count: any) => sum + (count || 0), 0);

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
      estacao_critica: {
        ...estacaoCritica,
        totalDefeitos: totalDefeitosCritica // ✅ Adiciona total de defeitos
      },
      total_defeitos,
      composicao_igg,
      total_estacoes: n
    }
  };
};

 // services/promedina/igg/igg.service.ts

saveAnalysis = async (store: IggAnalysisData): Promise<void> => {
  console.log("🚀 [saveIGGAnalysis] INÍCIO");
  console.log("📦 store.generalData:", store.generalData);
  console.log("📦 store.generalData?.name:", store.generalData?.name);

  const { _id } = store;
  
  // ✅ DEBUG: Verifica o que está chegando
  console.log("🆔 _id:", _id);
  console.log("🔑 store keys:", Object.keys(store));

  // ✅ Garante que generalData existe
  const generalData = store.generalData || (store as any)?.generalData;
  
  if (!generalData) {
    console.error("❌ generalData NÃO ENCONTRADO no store!");
    throw new Error("Dados gerais não encontrados");
  }

  const stations = store.stations || [];
  const results = store.results;
  const status = store.status || 'draft';

  console.log("📄 name:", generalData.name);
  console.log("📄 road:", generalData.road);
  console.log("📄 stations:", stations.length);

  try {
    let response;

    // ✅ Payload LIMPO
    const payload = {
      name: generalData.name || '',
      description: generalData.description || '',
      road: generalData.road || '',
      section: generalData.section || '',
      subtrack: generalData.subtrack || '',
      pavementType: generalData.pavementType || '',
      evaluationDate: generalData.evaluationDate || '',
      stations: stations,
      results: results || null,
      status: status,
      userId: this.userId || '',
    };

    console.log("📤 PAYLOAD:", JSON.stringify({
      name: payload.name,
      road: payload.road,
      section: payload.section,
      pavementType: payload.pavementType,
      evaluationDate: payload.evaluationDate,
      stationsCount: payload.stations?.length,
      hasResults: !!payload.results,
      status: payload.status,
      userId: payload.userId,
    }));

    if (!_id || _id === '---') {
      console.log("🆕 MODO: CREATE");
      response = await iggAnalysisService.saveAnalysis(payload);
    } else {
      console.log("✏️ MODO: UPDATE");
      response = await iggAnalysisService.updateAnalysis(_id, payload);
    }

    console.log("📥 RESPONSE:", response?.data);

    if (response?.data?._id) {
      this.store_actions.setData({ _id: response.data._id } as Partial<IggAnalysisData>);
      console.log("🎉 SALVO! ID:", response.data._id);
    }

  } catch (error: any) {
    console.error("💥 ERRO:", error?.response?.status, JSON.stringify(error?.response?.data));
    
    if (error?.response?.status === 413) {
      throw new Error(t('pm.register.payload-too-large-error'));
    }
    if (error?.response?.status === 409) {
      throw new Error(t('pm.register.already-exists-error'));
    }
    
    throw error;
  }
};
}
;

export default IGG_SERVICE;