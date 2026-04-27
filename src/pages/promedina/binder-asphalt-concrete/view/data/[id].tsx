import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import samplesService from '@/services/promedina/binder-asphalt-concrete/binder-asphalt-concrete-view.service';
import { Box, Typography } from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Loading from '@/components/molecules/loading';
import Link from 'next/link';
import { t } from 'i18next';

const SpecificSample_BinderAsphaltConcrete = () => {
  const [samples, setSamples] = useState<any>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const query = router.query as any;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await samplesService.getSample(query.id);
        setSamples(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load samples:', error);
        setLoading(false);
      }
    };
    if (query.id) fetchData();
  }, [query.id]);

  // ==================== HELPERS ====================
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
            <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{field.label}</Typography>
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
    const content = renderFields(data, fields, cols);
    if (!content) return null;
    return (
      <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
        <FlexColumnBorder title={title} open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
          {content}
        </FlexColumnBorder>
      </Box>
    );
  };

  // ==================== FIELDS ====================
  
  // STEP 1 - IDENTIFICAÇÃO
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

  // STEP 1 - PREPARO DO PAVIMENTO
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

  // STEP 1 - DATA ÚLTIMA ATUALIZAÇÃO
  const dataAtualizacaoFields = [
    { label: 'DATA DA ÚLTIMA ATUALIZAÇÃO', key: 'dataUltimaAtualizacao' },
    { label: 'TEMPO EM SERVIÇO (ANOS)', key: 'tempoServicoAnos' },
    { label: 'TEMPO EM SERVIÇO (MESES)', key: 'tempoServicoMeses' },
  ];

  // STEP 1 - CARACTERÍSTICAS
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

  // STEP 2 - COORDENADAS
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

  // ==================== SEÇÕES ESPECIAIS ====================

  // DSR dinâmico
  const renderDsrSection = (title: string, dsrArray: { temp: string; G_sen: string }[] | undefined) => {
    if (!dsrArray || dsrArray.length === 0) return null;
    return (
      <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
        <FlexColumnBorder title={title} open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
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
              <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                  TEMPERATURA {index + 1} (°C)
                </Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.temp || '-'}</Typography>
                <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                  G*/sen(δ) (MPa)
                </Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.G_sen || '-'}</Typography>
              </Box>
            ))}
          </Box>
        </FlexColumnBorder>
      </Box>
    );
  };

  // Prony
  const renderPronySection = () => {
    const pronyPi = samples?.step5Data?.prony_pi || [];
    const pronyEi = samples?.step5Data?.prony_Ei || [];
    const einf = samples?.step5Data?.einf;
    if (pronyPi.length === 0 && pronyEi.length === 0 && !einf) return null;
    return (
      <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
        <FlexColumnBorder title="MÓDULOS DE RELAXAÇÃO (PRONY)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
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
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>EINF (kPa)</Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{einf}</Typography>
              </Box>
            )}
            {pronyPi.map((pi: string, index: number) => (
              <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>pi (s) - {index + 1}</Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{pi || '-'}</Typography>
                <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>Ei (kPa)</Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{pronyEi[index] || '-'}</Typography>
              </Box>
            ))}
          </Box>
        </FlexColumnBorder>
      </Box>
    );
  };

  // Observações
  const renderObservacoesSection = () => {
    const obs1 = samples?.generalData?.observations;
    const obs3 = samples?.step3Data?.observacoes;
    const obs4 = samples?.step4Data?.observacoes;
    const obs5 = samples?.step5Data?.observacoes;
    
    const hasObs = obs1 || obs3 || obs4 || obs5;
    if (!hasObs) return null;
    
    return (
      <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
        <FlexColumnBorder title="OBSERVAÇÕES" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
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

  // ==================== COMPOSIÇÃO ESTRUTURAL ====================
  const columns: GridColDef[] = [
    { field: 'layer', headerName: 'CAMADA', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'material', headerName: 'MATERIAL', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'thickness', headerName: 'ESPESSURA (mm)', flex: 1, headerAlign: 'center', align: 'center' },
  ];

  const rows =
    samples?.generalData?.camadasEstruturais?.map((item: any, index: number) => ({
      id: index,
      layer: item.tipo || '-',
      material: item.material || '-',
      thickness: item.espessura ? `${item.espessura} mm` : '-',
    })) || [];

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
            <FlexColumnBorder title="COMPOSIÇÃO ESTRUTURAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ height: 'fit-content', width: '100%' }}>
                  <DataGrid rows={rows} hideFooter disableColumnMenu disableColumnFilter columns={columns} sx={{ borderRadius: '10px' }} />
                </div>
              </Box>
              {samples?.generalData?.imagemEstrutural && (
                <Box sx={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
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
                    <Typography sx={{ color: 'black' }}>{samples.generalData.dataImagens || '-'}</Typography>
                  </Box>
                </Box>
              )}
            </FlexColumnBorder>
          </Box>
        )}

        {/* STEP 2 - COORDENADAS */}
        {renderSection('COORDENADAS', samples?.step2Data, coordinatesFields, '1fr 1fr 1fr')}

        {/* STEP 2 - COMPOSIÇÃO ESTRUTURAL */}
        {samples?.step2Data?.structuralComposition && samples.step2Data.structuralComposition.length > 0 && (
          <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
            <FlexColumnBorder title="COMPOSIÇÃO ESTRUTURAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ height: 'fit-content', width: '100%' }}>
                  <DataGrid 
                    rows={samples.step2Data.structuralComposition.map((item: any, index: number) => ({
                      id: index,
                      layer: item.layer || '-',
                      material: item.material || '-',
                      thickness: item.thickness ? `${item.thickness} mm` : '-',
                    }))} 
                    hideFooter 
                    disableColumnMenu 
                    disableColumnFilter 
                    columns={columns} 
                    sx={{ borderRadius: '10px' }} 
                  />
                </div>
              </Box>
              {samples?.step2Data?.images && samples?.step2Data?.images !== '-' && (
                <Box sx={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
                  <Typography sx={{ fontWeight: 'bold', marginTop: '0.5rem', color: 'black' }}>
                    IMAGEM DA COMPOSIÇÃO ESTRUTURAL
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={samples.step2Data.images}
                      alt="Estrutura"
                      width="250px"
                      height="250px"
                      style={{ borderRadius: '8px', objectFit: 'contain' }}
                    />
                    <Typography sx={{ color: 'gray' }}>DATA DA IMAGEM</Typography>
                    <Typography sx={{ color: 'black' }}>{samples.step2Data.imagesDate || '-'}</Typography>
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

        {/* DSR ORIGINAL - dinâmico */}
        {renderDsrSection('DSR - LIGANTE ORIGINAL', samples?.step4Data?.dsr_original)}

        {/* DSR RTFOT - dinâmico */}
        {renderDsrSection('LIGANTE ENVELHECIDO NO RTFOT (75 MIN, 163°C)', samples?.step4Data?.dsr_rtfot)}

        {/* MSCR */}
        {renderSection('MSCR (MULTIPLE STRESS CREEP RECOVERY)', samples?.step4Data, mscrFields, '1fr 1fr')}

        {/* LAS - inclui las_temperatura */}
        {renderSection('LAS (LINEAR AMPLITUDE SWEEP)', samples?.step4Data, lasFields, '1fr 1fr 1fr')}

        {/* BBR */}
        {renderSection('LIGANTE ENVELHECIDO NO RTFOT + PAV (20 HORAS, 100°C)', samples?.step4Data, bbrFields, '1fr 1fr 1fr')}

        {/* STEP 5 - CONCRETO ASFÁLTICO */}
        {renderSection('PROPRIEDADES GERAIS', samples?.step5Data, geraisFields, '1fr 1fr 1fr')}
        {renderSection('CURVA DE FADIGA (COMPRESSÃO DIAMETRAL)', samples?.step5Data, curvaFadigaFields)}
        {renderSection('CURVAS-MESTRAS E COEFICIENTES DE TRANSLAÇÃO', samples?.step5Data, sigmoidalFields)}
        {renderSection('PARÂMETRO α DE EVOLUÇÃO DO DANO', samples?.step5Data, parametroAlfaFields, '1fr')}
        {renderSection('COEFICIENTES DE REGRESSÃO DAS CURVAS CARACTERÍSTICAS DE DANO (G²)', samples?.step5Data, danoFields)}
        {renderSection('COEFICIENTES DE REGRESSÃO DO SHIFT MODEL', samples?.step5Data, shiftModelFields)}

        {/* PRONY */}
        {renderPronySection()}

        {/* OBSERVAÇÕES */}
        {renderObservacoesSection()}
      </Box>

      {/* FOOTER */}
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
            border: 'none',
            borderRadius: '30px',
            textAlign: 'center',
            fontWeight: 'bold',
            paddingTop: '0.2rem',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          {t('button-previous')}
        </Link>
      </Box>
    </Box>
  );
};

export default SpecificSample_BinderAsphaltConcrete;