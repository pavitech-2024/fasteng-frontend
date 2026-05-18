import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import samplesService from '@/services/promedina/binder-asphalt-concrete/binder-asphalt-concrete-view.service';
import { Box, Button, Typography } from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NextIcon } from '@/assets';
import Loading from '@/components/molecules/loading';
import Link from 'next/link';
import GeneratePDF_ProMedina from '@/components/generatePDF/promedina/granularLayers/generatePDF.promedina';

const SpecificSample_BinderAsphaltConcrete = () => {
  const [samples, setSamples] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [isLegacyFormat, setIsLegacyFormat] = useState(false);
  const router = useRouter();
  const query = router.query as any;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await samplesService.getSample(query.id);
        const data = response.data;
        setSamples(data);

        // 🔍 DETECÇÃO PRECISA DO FORMATO
        // Formato NOVO: generalData contém 'identification', 'tipoSecao', 'local', 'faseMonitoramento'
        // Formato ANTIGO: generalData contém 'name', 'zone', 'layer', 'cityState'
        const hasNewFields =
          data?.generalData?.identification !== undefined ||
          data?.generalData?.tipoSecao !== undefined ||
          data?.generalData?.faseMonitoramento !== undefined ||
          data?.generalData?.local !== undefined;

        const hasLegacyFields =
          data?.generalData?.name !== undefined ||
          data?.generalData?.zone !== undefined ||
          data?.generalData?.layer !== undefined ||
          data?.generalData?.cityState !== undefined;

        // Só é legacy se NÃO tem campos novos E tem campos legacy
        setIsLegacyFormat(!hasNewFields && hasLegacyFields);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load samples:', error);
        setLoading(false);
      }
    };
    if (query.id) fetchData();
  }, [query.id]);

  // ==================== COLUNAS COMUNS ====================
  const columns: GridColDef[] = [
    { field: 'layer', headerName: 'CAMADA', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'material', headerName: 'MATERIAL', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'thickness', headerName: 'ESPESSURA (mm)', flex: 1, headerAlign: 'center', align: 'center' },
  ];

  // ==================== HELPERS (VERSÃO NOVA) ====================
  const renderFields = (
    data: any,
    fields: { label: string; key: string; suffix?: string }[],
    cols = '1fr 1fr 1fr 1fr'
  ) => {
    if (!data) return null;
    const hasData = fields.some((f) => {
      const v = data[f.key];
      return v !== undefined && v !== null && v !== '';
    });
    if (!hasData) return null;

    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: cols },
          justifyItems: 'center',
          alignItems: 'center',
          gap: '1rem',
          paddingBottom: '1rem',
        }}
      >
        {fields.map((field, idx) => {
          const value = data[field.key];
          if (value === undefined || value === null || value === '') return null;
          return (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.3rem',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                {field.label}
              </Typography>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                {field.suffix ? `${value}${field.suffix}` : value}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  };

  const renderSection = (
    title: string,
    data: any,
    fields: { label: string; key: string; suffix?: string }[],
    cols = '1fr 1fr 1fr 1fr'
  ) => {
    if (!data) return null;
    const content = renderFields(data, fields, cols);
    if (!content) return null;
    return (
      <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
        <FlexColumnBorder title={title} open={true} theme={ '#0ab39f'} sx_title={{ whiteSpace: 'wrap' }}>
          {content}
        </FlexColumnBorder>
      </Box>
    );
  };

  // ==================== FIELDS NOVA VERSÃO ====================
  const identificacaoFields = [
    { label: 'IDENTIFICAÇÃO', key: 'identification' },
    { label: 'TIPO DE SEÇÃO', key: 'tipoSecao' },
    { label: 'FASE DE MONITORAMENTO', key: 'faseMonitoramento' },
    { label: 'LIBERAÇÃO AO TRÁFEGO', key: 'liberacaoTrafico' },
    { label: 'UTILIZADA NA CALIBRAÇÃO DO MEDINA', key: 'utilizadaMedina' },
    { label: 'UTILIZADA NA CALIBRAÇÃO DO LVECD', key: 'utilizadaLvec' },
    { label: 'DADOS CONFIRMADOS PELA ICT', key: 'dadosConfirmadosICT' },
    { label: 'OBSERVAÇÕES', key: 'observations' },
  ];

  const preparoPavimentoFields = [
    { label: 'IRI (m/km) PRÉ-REABILITAÇÃO', key: 'iriPreReabilitacao' },
    { label: 'AT (%) PRÉ-REABILITAÇÃO', key: 'atPreReabilitacao' },
    { label: 'FRESAGEM', key: 'fresagem' },
    { label: 'ESPESSURA FRESADA (mm)', key: 'espessuraFresagem' },
    { label: 'INTERVENÇÃO NA BASE', key: 'intervencaoBase' },
    { label: 'SAMI', key: 'sami' },
    { label: 'PINTURA DE LIGAÇÃO', key: 'pinturaLigacao' },
    { label: 'IMPRIMAÇÃO', key: 'imprimacao' },
  ];

  const dataAtualizacaoFields = [
    { label: 'DATA DA ÚLTIMA ATUALIZAÇÃO', key: 'dataUltimaAtualizacao' },
    { label: 'TEMPO EM SERVIÇO (ANOS)', key: 'tempoServicoAnos' },
    { label: 'TEMPO EM SERVIÇO (MESES)', key: 'tempoServicoMeses' },
  ];

  const caracteristicasFields = [
    { label: 'LOCAL (RODOVIA/AVENIDA)', key: 'local' },
    { label: 'MUNICÍPIO/ESTADO', key: 'municipioEstado' },
    { label: 'EXTENSÃO (m)', key: 'extensao' },
    { label: 'VELOCIDADE DIRETRIZ DA VIA (km/h)', key: 'velocidadeDiretriz' },
    { label: 'KM INICIAL', key: 'kmInicial' },
    { label: 'KM FINAL', key: 'kmFinal' },
    { label: 'INÍCIO - ESTACA', key: 'inicioEstaca' },
    { label: 'INÍCIO - METROS', key: 'inicioMetros' },
    { label: 'FIM - ESTACA', key: 'fimEstaca' },
    { label: 'FIM - METROS', key: 'fimMetros' },
    { label: 'ALTITUDE MÉDIA (m)', key: 'altitudeMedia' },
    { label: 'NÚMERO DE FAIXAS', key: 'numeroFaixas' },
    { label: 'FAIXA MONITORADA', key: 'faixaMonitorada' },
    { label: 'LARGURA DA FAIXA (m)', key: 'larguraFaixa' },
  ];

  const coordinatesFields = [
    { label: 'ESTACA/METROS INICIAL', key: 'initialStakeMeters' },
    { label: 'LATITUDE INICIAL', key: 'latitudeI' },
    { label: 'LONGITUDE INICIAL', key: 'longitudeI' },
    { label: 'ESTACA/METROS FINAL', key: 'finalStakeMeters' },
    { label: 'LATITUDE FINAL', key: 'latitudeF' },
    { label: 'LONGITUDE FINAL', key: 'longitudeF' },
  ];

  const tratamentoFields = [
    { label: 'TIPO DE TRATAMENTO', key: 'tipoTratamento' },
    { label: 'TIPO DE EMULSÃO', key: 'tipoEmulsao' },
    { label: 'TAXA DE EMULSÃO (l/m²)', key: 'taxaEmulsao', suffix: ' l/m²' },
    { label: 'TAXA DE AGREGADOS POR CAMADA (kg/m²)', key: 'taxaAgregados', suffix: ' kg/m²' },
    { label: 'FAIXA GRANULOMÉTRICA', key: 'faixaGranulometrica' },
    { label: 'ABRASÃO LOS ANGELES (%)', key: 'abrasaoLosAngeles', suffix: ' %' },
    { label: 'MASSA ESPECÍFICA (g/cm³)', key: 'massaEspecifica', suffix: ' g/cm³' },
  ];

  const emulsaoFields = [
    { label: 'REFERÊNCIA COMERCIAL', key: 'referenciaComercial' },
    { label: 'REFINARIA', key: 'refinaria' },
    { label: 'EMPRESA DISTRIBUIDORA', key: 'empresaDistribuidora' },
    { label: 'DATA DO CARREGAMENTO', key: 'dataCarregamento' },
    { label: 'NÚMERO DA NOTA FISCAL', key: 'numeroNotaFiscal' },
    { label: 'DATA DA NOTA FISCAL', key: 'dataNotaFiscal' },
    { label: 'NÚMERO DO CERTIFICADO', key: 'numeroCertificado' },
    { label: 'DATA DO CERTIFICADO', key: 'dataCertificado' },
  ];

  const parametrosFields = [
    { label: 'VISCOSIDADE (SSF)', key: 'viscosidadeSSF' },
    { label: 'PENEIRAÇÃO (%)', key: 'peneiracao', suffix: ' %' },
    { label: 'RESÍDUO (%)', key: 'residuo', suffix: ' %' },
    { label: 'CARGA DE PARTÍCULA', key: 'cargaParticula' },
    { label: 'PENETRAÇÃO (mm)', key: 'penetracao', suffix: ' mm' },
    { label: 'RECUPERAÇÃO ELÁSTICA (%)', key: 'recuperacaoElastica', suffix: ' %' },
    { label: 'PONTO DE AMOLECIMENTO (°C)', key: 'pontoAmolecimento', suffix: ' °C' },
  ];

  const comerciaisFields = [
    { label: 'REFERÊNCIA COMERCIAL', key: 'referenciaComercial' },
    { label: 'REFINARIA', key: 'refinaria' },
    { label: 'EMPRESA DISTRIBUIDORA', key: 'empresaDistribuidora' },
    { label: 'DATA DO CARREGAMENTO', key: 'dataCarregamento' },
    { label: 'NÚMERO DA NOTA FISCAL', key: 'numeroNotaFiscal' },
    { label: 'DATA DA NOTA FISCAL', key: 'dataNotaFiscal' },
    { label: 'NÚMERO DO CERTIFICADO', key: 'numeroCertificado' },
    { label: 'DATA DO CERTIFICADO', key: 'dataCertificado' },
  ];

  const originalFields = [
    { label: 'TIPO DE CAP', key: 'tipoCAP' },
    { label: 'PERFORMANCE GRADE (PG)', key: 'performanceGrade' },
    { label: 'PENETRAÇÃO (mm) - 25°C', key: 'penetracao25', suffix: ' mm' },
    { label: 'PONTO DE AMOLECIMENTO (°C)', key: 'pontoAmolecimento', suffix: ' °C' },
    { label: 'VISCOSIDADE BROOKFIELD 135°C (cP)', key: 'viscosidadeBrookfield_135', suffix: ' cP' },
    { label: 'VISCOSIDADE BROOKFIELD 150°C (cP)', key: 'viscosidadeBrookfield_150', suffix: ' cP' },
    { label: 'VISCOSIDADE BROOKFIELD 177°C (cP)', key: 'viscosidadeBrookfield_177', suffix: ' cP' },
    { label: 'RECUPERAÇÃO ELÁSTICA (%)', key: 'recuperacaoElastica', suffix: ' %' },
  ];

  const mscrFields = [
    { label: 'MSCR - JNR 3,2 (1/KPA)', key: 'mscr_Jnr_3_2', suffix: ' 1/kPa' },
    { label: 'MSCR - JNDIFF (%)', key: 'mscr_Jndiff', suffix: ' %' },
  ];

  const lasFields = [
    { label: 'TEMPERATURA DO TESTE (°C)', key: 'las_temperatura', suffix: ' °C' },
    { label: 'LAS - STRAIN 1,25% - Nº', key: 'las_strain_1_25' },
    { label: 'LAS - STRAIN 2,5% - Nº', key: 'las_strain_2_5' },
    { label: 'LAS - STRAIN 5% - Nº', key: 'las_strain_5' },
    { label: 'LAS - AF (COMPRIMENTO NA TRINCA)', key: 'las_af' },
    { label: 'LAS - FFL (FATOR DE FADIGA)', key: 'las_FFL' },
    { label: 'LAS - D³', key: 'las_D' },
  ];

  const bbrFields = [
    { label: 'BBR - MÓDULO DE RIGIDEZ S (MPa)', key: 'bbr_S', suffix: ' MPa' },
    { label: 'BBR - COEFICIENTE ANGULAR M (MPa)', key: 'bbr_m', suffix: ' MPa' },
    { label: 'TEMPERATURA DO TESTE (°C)', key: 'bbr_temp', suffix: ' °C' },
  ];

  const geraisFields = [
    { label: 'TIPO DE CAP', key: 'tipoCAP' },
    { label: 'MASSA ESPECÍFICA (g/cm³)', key: 'massaEspecifica', suffix: ' g/cm³' },
    { label: 'RESISTÊNCIA À TRAÇÃO (MPa)', key: 'resistenciaTracao', suffix: ' MPa' },
    { label: 'TEOR DE ASFALTO (%)', key: 'teorAsfalto', suffix: ' %' },
    { label: 'VOLUME DE VAZIOS (%)', key: 'volumeVazios', suffix: ' %' },
    { label: 'FAIXA GRANULOMÉTRICA', key: 'faixaGranulometrica' },
    { label: 'TMN (mm)', key: 'tmn', suffix: ' mm' },
    { label: 'ABRASÃO LOS ANGELES (%)', key: 'abrasaoLosAngeles', suffix: ' %' },
    { label: 'FLOW NUMBER (FN)', key: 'flowNumber' },
    { label: 'MÓDULO DE RESILIÊNCIA 25°C (MPa)', key: 'moduloResiliencia', suffix: ' MPa' },
  ];

  const curvaFadigaFields = [
    { label: 'Nº DE AMOSTRAS (CPs) CONSIDERADAS', key: 'curvaFadiga_n_cps' },
    { label: 'COEFICIENTE DE REGRESSÃO (k1)', key: 'curvaFadiga_k1' },
    { label: 'COEFICIENTE DE REGRESSÃO (k2)', key: 'curvaFadiga_k2' },
    { label: 'COEF. DE DETERMINAÇÃO DO AJUSTE (R²)', key: 'curvaFadiga_r2' },
  ];

  const sigmoidalFields = [
    { label: 'COEFICIENTE a', key: 'sigmoidal_a' },
    { label: 'COEFICIENTE b', key: 'sigmoidal_b' },
    { label: 'COEFICIENTE d', key: 'sigmoidal_d' },
    { label: 'COEFICIENTE g', key: 'sigmoidal_g' },
    { label: 'COEFICIENTE a1', key: 'sigmoidal_a1' },
    { label: 'COEFICIENTE a2', key: 'sigmoidal_a2' },
    { label: 'COEFICIENTE a3', key: 'sigmoidal_a3' },
  ];

  const parametroAlfaFields = [
    { label: 'PARÂMETRO "α" DE EVOLUÇÃO DO DANO', key: 'parametro_alfa' },
  ];

  const danoFields = [
    { label: 'C₁₀', key: 'dano_C10' },
    { label: 'C₁₁', key: 'dano_C11' },
    { label: 'C₁₂', key: 'dano_C12' },
    { label: 'a', key: 'dano_a' },
    { label: 'b', key: 'dano_b' },
    { label: 'Y', key: 'dano_Y' },
    { label: 'Δ', key: 'dano_Delta' },
  ];

  const shiftModelFields = [
    { label: 'Nº DE AMOSTRAS (CPs) CONSIDERADAS', key: 'shiftModel_n_cps' },
    { label: 'ε₀', key: 'shiftModel_ε0' },
    { label: 'N1', key: 'shiftModel_N1' },
    { label: 'β', key: 'shiftModel_β' },
    { label: 'p1', key: 'shiftModel_p1' },
    { label: 'p2', key: 'shiftModel_p2' },
    { label: 'd1', key: 'shiftModel_d1' },
    { label: 'd2', key: 'shiftModel_d2' },
  ];

  // ==================== SEÇÕES ESPECIAIS (NOVA VERSÃO) ====================
  const renderDsrSection = (title: string, dsrArray: { temp: string; G_sen: string }[] | undefined) => {
    if (!dsrArray || dsrArray.length === 0) return null;
    return (
      <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
        <FlexColumnBorder title={title} open={true} theme={ '#0ab39f'} sx_title={{ whiteSpace: 'wrap' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
              justifyItems: 'center',
              alignItems: 'center',
              gap: '1rem',
              paddingBottom: '1rem',
            }}
          >
            {dsrArray.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                  TEMPERATURA {index + 1} (°C)
                </Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                  {item.temp || '-'}
                </Typography>
                <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                  G*/sen(δ) (MPa)
                </Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                  {item.G_sen || '-'}
                </Typography>
              </Box>
            ))}
          </Box>
        </FlexColumnBorder>
      </Box>
    );
  };

  const renderPronySection = () => {
    const pronyPi = samples?.step5Data?.prony_pi || [];
    const pronyEi = samples?.step5Data?.prony_Ei || [];
    const einf = samples?.step5Data?.einf;
    if (pronyPi.length === 0 && pronyEi.length === 0 && !einf) return null;
    return (
      <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
        <FlexColumnBorder
          title="MÓDULOS DE RELAXAÇÃO (PRONY)"
          open={true}
          theme={ '#0ab39f'}
          sx_title={{ whiteSpace: 'wrap' }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
              justifyItems: 'center',
              alignItems: 'center',
              gap: '1rem',
              paddingBottom: '1rem',
            }}
          >
            {einf && einf !== '-' && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                  EINF (kPa)
                </Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                  {einf}
                </Typography>
              </Box>
            )}
            {pronyPi.map((pi: string, index: number) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                  pi (s) - {index + 1}
                </Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                  {pi || '-'}
                </Typography>
                <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                  Ei (kPa)
                </Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                  {pronyEi[index] || '-'}
                </Typography>
              </Box>
            ))}
          </Box>
        </FlexColumnBorder>
      </Box>
    );
  };

  const renderObservacoesSection = () => {
    const obs1 = samples?.generalData?.observations;
    const obs3 = samples?.step3Data?.observacoes;
    const obs4 = samples?.step4Data?.observacoes;
    const obs5 = samples?.step5Data?.observacoes;

    const hasObs = obs1 || obs3 || obs4 || obs5;
    if (!hasObs) return null;

    return (
      <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
        <FlexColumnBorder title="OBSERVAÇÕES" open={true} theme={ '#0ab39f'} sx_title={{ whiteSpace: 'wrap' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1rem' }}>
            {obs1 && (
              <Box>
                <Typography sx={{ fontWeight: 'bold', color: 'gray' }}>IDENTIFICAÇÃO</Typography>
                <Typography>{obs1}</Typography>
              </Box>
            )}
            {obs3 && (
              <Box>
                <Typography sx={{ fontWeight: 'bold', color: 'gray' }}>TRATAMENTO SUPERFICIAL</Typography>
                <Typography>{obs3}</Typography>
              </Box>
            )}
            {obs4 && (
              <Box>
                <Typography sx={{ fontWeight: 'bold', color: 'gray' }}>LIGANTE ASFÁLTICO</Typography>
                <Typography>{obs4}</Typography>
              </Box>
            )}
            {obs5 && (
              <Box>
                <Typography sx={{ fontWeight: 'bold', color: 'gray' }}>CONCRETO ASFÁLTICO</Typography>
                <Typography>{obs5}</Typography>
              </Box>
            )}
          </Box>
        </FlexColumnBorder>
      </Box>
    );
  };

  // ==================== RENDER NOVA VERSÃO ====================
  const renderNewView = () => {
    const rows =
      samples?.generalData?.camadasEstruturais?.map((item: any, index: number) => ({
        id: index,
        layer: item.tipo || '-',
        material: item.material || '-',
        thickness: item.espessura ? `${item.espessura} mm` : '-',
      })) || [];

    return (
      <>
        {/* STEP 1 - IDENTIFICAÇÃO */}
        {renderSection('IDENTIFICAÇÃO', samples?.generalData, identificacaoFields)}

        {/* STEP 1 - PREPARO DO PAVIMENTO */}
        {renderSection('PREPARO DO PAVIMENTO', samples?.generalData, preparoPavimentoFields)}

        {/* STEP 1 - DATA DA ÚLTIMA ATUALIZAÇÃO */}
        {renderSection('DATA DA ÚLTIMA ATUALIZAÇÃO', samples?.generalData, dataAtualizacaoFields, '1fr 1fr')}

        {/* STEP 1 - CARACTERÍSTICAS */}
        {renderSection('CARACTERÍSTICAS', samples?.generalData, caracteristicasFields)}

        {/* STEP 1 - COMPOSIÇÃO ESTRUTURAL */}
        {rows.length > 0 && (
          <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
            <FlexColumnBorder
              title="COMPOSIÇÃO ESTRUTURAL"
              open={true}
              theme={ '#0ab39f'}
              sx_title={{ whiteSpace: 'wrap' }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ height: 'fit-content', width: '100%' }}>
                  <DataGrid
                    rows={rows}
                    hideFooter
                    disableColumnMenu
                    disableColumnFilter
                    columns={columns}
                    sx={{ borderRadius: '10px' }}
                  />
                </div>
              </Box>
              {samples?.generalData?.imagemEstrutural && (
                <Box
                  sx={{
                    marginBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: '2rem',
                  }}
                >
                  <Typography sx={{ fontWeight: 'bold', marginTop: '0.5rem', color: 'black' }}>
                    IMAGEM DA COMPOSIÇÃO ESTRUTURAL
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={samples.generalData.imagemEstrutural}
                      alt="Estrutura"
                      width="250px"
                      height="250px"
                      style={{ borderRadius: '8px', objectFit: 'contain' }}
                    />
                    <Typography sx={{ color: 'gray' }}>DATA DA IMAGEM</Typography>
                    <Typography sx={{ color: 'black' }}>
                      {samples.generalData.dataImagens || '-'}
                    </Typography>
                  </Box>
                </Box>
              )}
            </FlexColumnBorder>
          </Box>
        )}

        {/* STEP 2 - COORDENADAS */}
        {renderSection('COORDENADAS', samples?.step2Data, coordinatesFields, '1fr 1fr 1fr')}

        {/* STEP 2 - COMPOSIÇÃO ESTRUTURAL */}
        {samples?.step2Data?.structuralComposition &&
          samples.step2Data.structuralComposition.length > 0 && (
            <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
              <FlexColumnBorder
                title="COMPOSIÇÃO ESTRUTURAL"
                open={true}
                theme={ '#0ab39f'}
                sx_title={{ whiteSpace: 'wrap' }}
              >
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
                >
                  <div style={{ height: 'fit-content', width: '100%' }}>
                    <DataGrid
                      rows={samples.step2Data.structuralComposition.map(
                        (item: any, index: number) => ({
                          id: index,
                          layer: item.layer || '-',
                          material: item.material || '-',
                          thickness: item.thickness ? `${item.thickness} mm` : '-',
                        })
                      )}
                      hideFooter
                      disableColumnMenu
                      disableColumnFilter
                      columns={columns}
                      sx={{ borderRadius: '10px' }}
                    />
                  </div>
                </Box>
                {samples?.step2Data?.images && samples?.step2Data?.images !== '-' && (
                  <Box
                    sx={{
                      marginBottom: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      marginTop: '2rem',
                    }}
                  >
                    <Typography sx={{ fontWeight: 'bold', marginTop: '0.5rem', color: 'black' }}>
                      IMAGEM DA COMPOSIÇÃO ESTRUTURAL
                    </Typography>
                    <Box
                      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
                    >
                      <img
                        src={samples.step2Data.images}
                        alt="Estrutura"
                        width="250px"
                        height="250px"
                        style={{ borderRadius: '8px', objectFit: 'contain' }}
                      />
                      <Typography sx={{ color: 'gray' }}>DATA DA IMAGEM</Typography>
                      <Typography sx={{ color: 'black' }}>
                        {samples.step2Data.imagesDate || '-'}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </FlexColumnBorder>
            </Box>
          )}

        {/* STEP 3 - TRATAMENTO SUPERFICIAL */}
        {renderSection('TRATAMENTO SUPERFICIAL', samples?.step3Data, tratamentoFields)}
        {renderSection('EMULSÃO ASFÁLTICA', samples?.step3Data, emulsaoFields)}
        {renderSection('PARÂMETROS DO MATERIAL', samples?.step3Data, parametrosFields)}

        {/* STEP 4 - LIGANTE ASFÁLTICO */}
        {renderSection('DADOS COMERCIAIS', samples?.step4Data, comerciaisFields)}
        {renderSection('LIGANTE ORIGINAL', samples?.step4Data, originalFields)}

        {/* DSR ORIGINAL */}
        {renderDsrSection('DSR - LIGANTE ORIGINAL', samples?.step4Data?.dsr_original)}

        {/* DSR RTFOT */}
        {renderDsrSection(
          'LIGANTE ENVELHECIDO NO RTFOT (75 MIN, 163°C)',
          samples?.step4Data?.dsr_rtfot
        )}

        {/* MSCR */}
        {renderSection(
          'MSCR (MULTIPLE STRESS CREEP RECOVERY)',
          samples?.step4Data,
          mscrFields,
          '1fr 1fr'
        )}

        {/* LAS */}
        {renderSection('LAS (LINEAR AMPLITUDE SWEEP)', samples?.step4Data, lasFields, '1fr 1fr 1fr')}

        {/* BBR */}
        {renderSection(
          'LIGANTE ENVELHECIDO NO RTFOT + PAV (20 HORAS, 100°C)',
          samples?.step4Data,
          bbrFields,
          '1fr 1fr 1fr'
        )}

        {/* STEP 5 - CONCRETO ASFÁLTICO */}
        {renderSection('PROPRIEDADES GERAIS', samples?.step5Data, geraisFields, '1fr 1fr 1fr')}
        {renderSection(
          'CURVA DE FADIGA (COMPRESSÃO DIAMETRAL)',
          samples?.step5Data,
          curvaFadigaFields
        )}
        {renderSection(
          'CURVAS-MESTRAS E COEFICIENTES DE TRANSLAÇÃO',
          samples?.step5Data,
          sigmoidalFields
        )}
        {renderSection(
          'PARÂMETRO α DE EVOLUÇÃO DO DANO',
          samples?.step5Data,
          parametroAlfaFields,
          '1fr'
        )}
        {renderSection(
          'COEFICIENTES DE REGRESSÃO DAS CURVAS CARACTERÍSTICAS DE DANO (G²)',
          samples?.step5Data,
          danoFields
        )}
        {renderSection(
          'COEFICIENTES DE REGRESSÃO DO SHIFT MODEL',
          samples?.step5Data,
          shiftModelFields
        )}

        {/* PRONY */}
        {renderPronySection()}

        {/* OBSERVAÇÕES */}
        {renderObservacoesSection()}
      </>
    );
  };

  // ==================== RENDER LEGACY (VERSÃO ANTIGA) ====================
  const renderLegacyView = () => {
    const sections = [
      'general-data',
      'paviment-data',
      'paviment-preparation',
      'technical-data',
      'diametral-compression',
      'brookfield-viscosity',
      'material-info',
      'structural-composition',
    ];

    const fieldKeys = ['name', 'zone', 'layer', 'cityState', 'highway', 'guideLineSpeed', 'observations'];

    const generalData = fieldKeys.map((key) => ({
      title: t(`pm.granularLayer.${key}`),
      value: key === 'guideLineSpeed' ? `${samples?.generalData[key]} km/h` : samples?.generalData[key],
    }));

    const pavimentFields = [
      { title: t('pm-type-of-section'), key: 'sectionType' },
      { title: t('pm.binderAsphaltConcrete.extension'), key: 'extension' },
      { title: t('pm.binderAsphaltConcrete.identification'), key: 'identification' },
      { title: t('pm.binderAsphaltConcrete.initialStakeMeters'), key: 'initialStakeMeters' },
      { title: t('pm.binderAsphaltConcrete.finalStakeMeters'), key: 'finalStakeMeters' },
      { title: t('pm.binderAsphaltConcrete.latitudeI'), key: 'latitudeI' },
      { title: t('pm.binderAsphaltConcrete.longitudeI'), key: 'longitudeI' },
      { title: t('pm.binderAsphaltConcrete.latitudeF'), key: 'latitudeF' },
      { title: t('pm.binderAsphaltConcrete.longitudeF'), key: 'longitudeF' },
      { title: t('pm.binderAsphaltConcrete.averageAltitude'), key: 'averageAltitude' },
      { title: t('pm.binderAsphaltConcrete.monitoring.phase'), key: 'monitoringPhase' },
      { title: t('pm.binderAsphaltConcrete.trackWidth'), key: 'trackWidth' },
      { title: t('pm.binderAsphaltConcrete.monitoredTrack'), key: 'monitoredTrack' },
      { title: t('pm.binderAsphaltConcrete.numberOfTracks'), key: 'numberOfTracks' },
      { title: t('pm.binderAsphaltConcrete.trafficLiberation'), key: 'trafficLiberation' },
      { title: t('pm.binderAsphaltConcrete.mf.observations'), key: 'observation' },
    ];

    const pavimentData = pavimentFields
      .filter((field) => samples?.step2Data?.[field.key] !== undefined)
      .map((field) => ({
        title: field.title,
        value:
          field.key === 'averageAltitude' || field.key === 'trackWidth' || field.key === 'extension'
            ? `${samples?.step2Data?.[field.key]} m`
            : `${samples?.step2Data?.[field.key]}`,
      }));

    const fatigueCurveFields = [
      { title: 'N° CPs', key: 'fatigueCurve_n_cps' },
      { title: 'k1', key: 'fatigueCurve_k1' },
      { title: 'k2', key: 'fatigueCurve_k2' },
      { title: 'R²', key: 'fatigueCurve_r2' },
    ];

    const fadigueCurveCD = fatigueCurveFields.map((field) => ({
      title: field.title,
      value: samples?.step4Data?.[field.key],
    }));

    const pavimentPreparationFields = [
      { title: t('pm.binderAsphaltConcrete.milling'), key: 'milling' },
      { title: t('pm.binderAsphaltConcrete.intervention.at.the.base'), key: 'interventionAtTheBase' },
      { title: 'SAMI', key: 'sami' },
      { title: t('pm.binderAsphaltConcrete.bonding.paint'), key: 'bondingPaint' },
      { title: t('pm.binderAsphaltConcrete.priming'), key: 'priming' },
    ];

    const pavimentPreparation = pavimentPreparationFields.map((field) => ({
      title: field.title,
      value: samples?.step2Data?.[field.key],
    }));

    const brookfieldFields = [
      { title: t('pm.binderAsphaltConcrete.vb_sp21_20'), key: 'vb_sp21_20' },
      { title: t('pm.binderAsphaltConcrete.vb_sp21_50'), key: 'vb_sp21_50' },
      { title: t('pm.binderAsphaltConcrete.vb_sp21_100'), key: 'vb_sp21_100' },
      { title: t('pm.binderAsphaltConcrete.observations'), key: 'observations' },
    ];

    const brookfield = brookfieldFields.map((field) => ({
      title: field.title,
      value: samples?.step3Data?.[field.key],
    }));

    const sampleDataFields = [
      { title: t('pm.binderAsphaltConcrete.refinery'), key: 'refinery' },
      { title: t('pm.binderAsphaltConcrete.company'), key: 'company' },
      { title: t('pm.binderAsphaltConcrete.collectionDate'), key: 'collectionDate' },
      { title: t('pm.binderAsphaltConcrete.invoiceNumber'), key: 'invoiceNumber' },
      { title: t('pm.binderAsphaltConcrete.dataInvoice'), key: 'dataInvoice' },
      { title: t('pm.binderAsphaltConcrete.certificateDate'), key: 'certificateDate' },
      { title: t('pm.binderAsphaltConcrete.certificateNumber'), key: 'certificateNumber' },
      { title: t('pm.binderAsphaltConcrete.capType'), key: 'capType' },
      { title: t('pm.binderAsphaltConcrete.performanceGrade'), key: 'performanceGrade' },
      { title: t('pm.binderAsphaltConcrete.penetration'), key: 'penetration' },
      { title: t('pm.binderAsphaltConcrete.softeningPoint'), key: 'softeningPoint' },
      { title: t('pm.binderAsphaltConcrete.elasticRecovery'), key: 'elasticRecovery' },
    ];

    const sampleData = sampleDataFields.map((field) => ({
      title: field.title,
      value: samples?.step3Data?.[field.key],
    }));

    const techData = [
      'granulometricRange',
      'abrasionLA',
      'tmn',
      'volumeVoids',
      'rt',
      'flowNumber',
      'mr',
      'specificMass',
      'asphaltTenor',
    ].map((key) => ({
      title: t(`pm.binderAsphaltConcrete.${key}`),
      value: samples?.step4Data?.[key] || samples?.step3Data?.[key],
    }));

    techData.push({
      title: t('pm.binderAsphaltConcrete.mf.observations'),
      value: samples?.step3Data?.observations,
    });

    const rows =
      samples?.step2Data?.structuralComposition?.map((item: any, index: number) => ({
        id: index,
        layer: item.layer,
        material: item.material,
        thickness: `${item.thickness} mm`,
      })) || [];

    return (
      <>
        <GeneratePDF_ProMedina sample={samples} sections={sections} />

        {/* DADOS GERAIS */}
        <Box id="general-data" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
          <FlexColumnBorder title={t('pm.general.data')} open={true} theme={ '#0ab39f'}>
            <Box
              sx={{
                display: { mobile: 'flex', notebook: 'grid' },
                flexDirection: 'column',
                gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                justifyItems: 'center',
                alignItems: 'center',
                gap: '1rem',
                justifyContent: 'space-evenly',
              }}
            >
              {generalData.map((item, idx) => (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem',
                    alignItems: 'center',
                    alignSelf: 'start',
                    textAlign: 'center',
                  }}
                  key={idx}
                >
                  {item.value && (
                    <>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                        {item.title}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography
                          sx={{
                            display: 'flex',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            wordBreak: 'break-all',
                            whiteSpace: 'pre-wrap',
                            color: 'black',
                          }}
                        >
                          {item.value === null ? '-' : item.value}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
              ))}
            </Box>
          </FlexColumnBorder>
        </Box>

        {/* DADOS DO PAVIMENTO */}
        <Box id="paviment-data" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
          <FlexColumnBorder
            title={t('pm.paviment.data')}
            open={true}
            theme={ '#0ab39f'}
            sx_title={{ whiteSpace: 'wrap' }}
          >
            <Box
              sx={{
                display: { mobile: 'flex', notebook: 'grid' },
                flexDirection: 'column',
                gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr 1fr' },
                justifyItems: 'center',
                alignItems: 'center',
                gap: '1rem',
                justifyContent: 'space-evenly',
              }}
            >
              {pavimentData.map((item, idx) => (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem',
                    alignItems: 'center',
                    alignSelf: 'start',
                    textAlign: 'center',
                  }}
                  key={idx}
                >
                  <>
                    <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                      {item.title}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography
                        sx={{ display: 'flex', fontWeight: 'bold', fontSize: '14px', color: 'black' }}
                      >
                        {item.value === undefined || item.value === null || item.value === 'null'
                          ? '-'
                          : item.value}
                      </Typography>
                    </Box>
                  </>
                </Box>
              ))}
            </Box>
          </FlexColumnBorder>
        </Box>

        {/* PREPARO DO PAVIMENTO */}
        <Box id="paviment-preparation" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
          <FlexColumnBorder title={t('pm.paviment.preparation')} open={true} theme={ '#0ab39f'}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr 1fr' },
                justifyItems: 'center',
                alignItems: 'center',
                gap: '1rem',
                justifyContent: 'space-evenly',
                marginBottom: '0.5rem',
              }}
            >
              {pavimentPreparation.map((item, idx) => (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem',
                    alignItems: 'center',
                    alignSelf: 'start',
                    textAlign: 'center',
                  }}
                  key={idx}
                >
                  <>
                    <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                      {item.title}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography
                        sx={{ display: 'flex', fontWeight: 'bold', fontSize: '14px', color: 'black' }}
                      >
                        {item.value === null ? '-' : item.value}
                      </Typography>
                    </Box>
                  </>
                </Box>
              ))}
            </Box>
          </FlexColumnBorder>
        </Box>

        {/* DADOS TÉCNICOS DA AMOSTRA */}
        <Box id="technical-data" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
          <FlexColumnBorder
            title={t('pm.sample-data')}
            open={true}
            theme={ '#0ab39f'}
            sx_title={{ whiteSpace: 'wrap' }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                justifyItems: 'center',
                alignItems: 'center',
                gap: '1rem',
                justifyContent: 'space-evenly',
                marginBottom: '0.5rem',
              }}
            >
              {techData.map((item, idx) => (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem',
                    alignItems: 'center',
                    alignSelf: 'start',
                    textAlign: 'center',
                  }}
                  key={idx}
                >
                  <>
                    <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                      {item.title}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography
                        sx={{ display: 'flex', fontWeight: 'bold', fontSize: '14px', color: 'black' }}
                      >
                        {item.value === null ? '-' : item.value}
                      </Typography>
                    </Box>
                  </>
                </Box>
              ))}
            </Box>
          </FlexColumnBorder>
        </Box>

        {/* CURVA DE FADIGA À COMPRESSÃO DIAMETRAL */}
        <Box id="diametral-compression" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
          <FlexColumnBorder
            title={t('pm.diametral.compression.fatigue.curve')}
            open={true}
            theme={ '#0ab39f'}
            sx_title={{ whiteSpace: 'wrap' }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                justifyItems: 'center',
                alignItems: 'center',
                gap: '1rem',
                justifyContent: 'space-evenly',
              }}
            >
              {fadigueCurveCD.map((item, idx) => (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem',
                    alignItems: 'center',
                    alignSelf: 'start',
                    textAlign: 'center',
                  }}
                  key={idx}
                >
                  <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                    {item.title}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      sx={{ display: 'flex', fontWeight: 'bold', fontSize: '14px', color: 'black' }}
                    >
                      {item.value === null ? '-' : item.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </FlexColumnBorder>
        </Box>

        {/* VISCOSIDADE BROOKFIELD */}
        <Box id="brookfield-viscosity" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
          <FlexColumnBorder title={t('pm.brookfield.viscosity')} open={true} theme={ '#0ab39f'}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                justifyItems: 'center',
                alignItems: 'center',
                gap: '1rem',
                justifyContent: 'space-evenly',
                marginBottom: '0.5rem',
              }}
            >
              {brookfield.map((item, idx) => (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem',
                    alignItems: 'center',
                    alignSelf: 'start',
                    textAlign: 'center',
                  }}
                  key={idx}
                >
                  <>
                    <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                      {item.title}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography
                        sx={{ display: 'flex', fontWeight: 'bold', fontSize: '14px', color: 'black' }}
                      >
                        {item.value === null || item.value === '' ? '-' : item.value}
                      </Typography>
                    </Box>
                  </>
                </Box>
              ))}
            </Box>
          </FlexColumnBorder>
        </Box>

        {/* OUTRAS INFORMAÇÕES SOBRE O MATERIAL */}
        <Box id="material-info" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
          <FlexColumnBorder
            title={t('pm.sample-data')}
            open={true}
            theme={ '#0ab39f'}
            sx_title={{ whiteSpace: 'wrap' }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr 1fr' },
                justifyItems: 'center',
                alignItems: 'center',
                gap: '1rem',
                justifyContent: 'space-evenly',
                marginBottom: '0.5rem',
              }}
            >
              {sampleData.map((item, idx) => (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem',
                    alignItems: 'center',
                    alignSelf: 'start',
                    textAlign: 'center',
                  }}
                  key={idx}
                >
                  <>
                    <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                      {item.title}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography
                        sx={{ display: 'flex', fontWeight: 'bold', fontSize: '14px', color: 'black' }}
                      >
                        {item.value === null ? '-' : item.value}
                      </Typography>
                    </Box>
                  </>
                </Box>
              ))}
            </Box>
          </FlexColumnBorder>
        </Box>

        {/* COMPOSIÇÃO ESTRUTURAL */}
        {rows.length > 0 && (
          <Box id="structural-composition" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder
              title={t('pm.structural.composition')}
              open={true}
              theme={ '#0ab39f'}
              sx_title={{ whiteSpace: 'wrap' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <div style={{ height: 'fit-content', width: '100%' }}>
                  <DataGrid
                    rows={rows}
                    hideFooter
                    disableColumnMenu
                    disableColumnFilter
                    columns={columns.map((column) => ({
                      ...column,
                      disableColumnMenu: true,
                      sortable: false,
                      align: 'center',
                      headerAlign: 'center',
                      minWidth: 100,
                      flex: 1,
                    }))}
                  />
                </div>
              </Box>
              {samples?.step2Data?.images && (
                <Box
                  sx={{
                    marginBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography sx={{ fontWeight: 'bold', marginTop: '0.5rem', color: 'black' }}>
                    {t('pm-image-structural-composition')}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { mobile: 'column', desktop: 'row' },
                      gap: '1rem',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={samples?.step2Data.images}
                      alt={t('pm-image-structural-composition')}
                      width={'250px'}
                      height={'250px'}
                    />
                  </Box>
                  <Typography sx={{ color: 'gray' }}>
                    {t('pm-estructural-composition-image-date')}
                  </Typography>
                  <Typography sx={{ color: 'black' }}>
                    {samples?.step2Data.imagesDate}
                  </Typography>
                </Box>
              )}
            </FlexColumnBorder>
          </Box>
        )}

        {/* FOOTER LEGACY */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: { mobile: '4vh 4vw', notebook: '3vh 6vw' },
          }}
        >
          <Link
            href="/promedina/binder-asphalt-concrete/view"
            style={{
              backgroundColor: '#00A3FF',
              color: '#FFFFFF',
              height: '32px',
              width: '140px',
              fontSize: '1.2rem',
              alignItems: 'center',
              border: '#00A3FF',
              borderRadius: '30px',
              textAlign: 'center',
              fontWeight: 'bold',
              paddingTop: '0.2rem',
            }}
          >
            {t('button-previous')}
          </Link>

          <Button
            endIcon={<NextIcon />}
            variant="contained"
            disabled
            sx={{
              bgcolor: 'secondaryTons.blue',
              color: 'primaryTons.white',
              height: '32px',
              width: '140px',
              fontSize: '1rem',
              display: 'none',

              ':hover': {
                transition: 'all 0.1s ease-in-out',
                bgcolor: 'secondaryTons.blueDisabled',
              },

              ':active': {
                transition: 'all 0.1s ease-in-out',
                bgcolor: 'secondaryTons.blueClick',
              },
            }}
          >
            {t('button-next')}
          </Button>
        </Box>
      </>
    );
  };

  // ==================== RENDER PRINCIPAL ====================
  if (loading) return <Loading size={30} color={'secondary'} />;

  return (
    <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', marginTop: '3rem' }}>
      <Box
        sx={{
          width: { mobile: '95%', notebook: '85%' },
          maxWidth: '2200px',
          padding: '2rem',
          borderRadius: '20px',
          bgcolor: 'primaryTons.white',
          border: '1px solid',
          borderColor: 'primaryTons.border',
          margin: '1rem',
        }}
      >
        {/* 🎯 RENDERIZAÇÃO CONDICIONAL BASEADA NA DETECÇÃO */}
        {isLegacyFormat ? renderLegacyView() : renderNewView()}
      </Box>
    </Box>
  );
};

export default SpecificSample_BinderAsphaltConcrete;