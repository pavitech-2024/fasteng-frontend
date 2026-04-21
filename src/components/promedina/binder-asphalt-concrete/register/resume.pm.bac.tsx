import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { Box, Typography } from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { t } from 'i18next';
import GeneratePDF_ProMedina from '@/components/generatePDF/promedina/granularLayers/generatePDF.promedina';
import { EssayPageProps } from '@/components/templates/essay';
import useBinderAsphaltConcreteStore, {
  BinderAsphaltConcreteData,
} from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';

const BinderAsphaltConcreteResume = ({ setNextDisabled }: EssayPageProps) => {
  const { generalData, step2Data, step3Data, step4Data, step5Data, _id } = useBinderAsphaltConcreteStore();
  
  const samples: BinderAsphaltConcreteData = {
    generalData,
    step2Data,
    step3Data,
    step4Data,
    step5Data,
    _id,
  };

  // ==================== STEP 1 - DADOS GERAIS (generalData) ====================
  const generalDataFields = [
    { title: 'NOME', value: generalData?.name },
    { title: 'LOCAL', value: generalData?.zone },
    { title: 'CAMADA', value: generalData?.layer },
    { title: 'MUNICÍPIO/ESTADO', value: generalData?.cityState },
    { title: 'RODOVIA', value: generalData?.highway },
    { title: 'VELOCIDADE DIRETRIZ', value: generalData?.guideLineSpeed ? `${generalData?.guideLineSpeed} km/h` : '-' },
    { title: 'OBSERVAÇÕES', value: generalData?.observations },
  ];

  // ==================== STEP 2 - DADOS GENÉRICOS (step2Data) ====================
  const characteristicsFields = [
    { title: 'LOCAL', value: step2Data?.roadName || step2Data?.identification },
    { title: 'MUNICÍPIO/ESTADO', value: step2Data?.cityState },
    { title: 'EXTENSÃO (m)', value: step2Data?.experimentalLength || step2Data?.extension },
    { title: 'VELOCIDADE DIRETRIZ DA VIA (km/h)', value: step2Data?.guideSpeed },
  ];

  const coordinatesFields = [
    { title: 'ESTACA/METROS INICIAL', value: step2Data?.initialStakeMeters },
    { title: 'LATITUDE INICIAL', value: step2Data?.latitudeI },
    { title: 'LONGITUDE INICIAL', value: step2Data?.longitudeI },
    { title: 'ESTACA/METROS FINAL', value: step2Data?.finalStakeMeters },
    { title: 'LATITUDE FINAL', value: step2Data?.latitudeF },
    { title: 'LONGITUDE FINAL', value: step2Data?.longitudeF },
  ];

  const pavimentDataFields = [
    { title: 'IDENTIFICAÇÃO', value: step2Data?.identification },
    { title: 'TIPO DE SEÇÃO', value: step2Data?.sectionType },
    { title: 'FASE DE MONITORAMENTO', value: step2Data?.monitoringPhase },
    { title: 'LIBERAÇÃO AO TRÁFEGO', value: step2Data?.trafficLiberation },
    { title: 'ALTITUDE MÉDIA (m)', value: step2Data?.averageAltitude },
    { title: 'NÚMERO DE FAIXAS', value: step2Data?.numberOfTracks },
    { title: 'FAIXA MONITORADA', value: step2Data?.monitoredTrack },
    { title: 'LARGURA DA FAIXA (m)', value: step2Data?.trackWidth },
    { title: 'OBSERVAÇÕES', value: step2Data?.observation },
  ];

  const pavimentPreparationFields = [
    { title: 'IRI (m/km) PRÉ-REABILITAÇÃO', value: step2Data?.iriPrerehabilitation },
    { title: 'AT (%) PRÉ-REABILITAÇÃO', value: step2Data?.atPrerehabilitation },
    { title: 'FRESAGEM (cm)', value: step2Data?.millingThickness },
    { title: 'INTERVENÇÃO NA BASE', value: step2Data?.interventionAtTheBase },
    { title: 'SAMI', value: step2Data?.sami },
    { title: 'PINTURA DE LIGAÇÃO', value: step2Data?.bondingPaint },
    { title: 'IMPRIMAÇÃO', value: step2Data?.priming },
  ];

  const serviceTimeFields = [
    { title: 'TEMPO EM SERVIÇO (ANOS)', value: step2Data?.serviceTimeYears },
    { title: 'TEMPO EM SERVIÇO (MESES)', value: step2Data?.serviceTimeMonths },
  ];

  const lastUpdateField = { title: 'DATA DA ÚLTIMA ATUALIZAÇÃO', value: step2Data?.lastUpdate };

  const columns: GridColDef[] = [
    { field: 'layer', headerName: 'CAMADA' },
    { field: 'material', headerName: 'MATERIAL' },
    { field: 'thickness', headerName: 'ESPESSURA (mm)' },
  ];

  const rows = step2Data?.structuralComposition?.map((item, index) => ({
    id: index,
    layer: item.layer,
    material: item.material,
    thickness: item.thickness ? `${item.thickness} mm` : '-',
  }));

  // ==================== STEP 3 - TRATAMENTO SUPERFICIAL (step3Data) ====================
  const tratamentoFields = [
    { title: 'Tipo de Tratamento', value: step3Data?.tipoTratamento },
    { title: 'Tipo de Emulsão', value: step3Data?.tipoEmulsao },
    { title: 'Taxa de Emulsão (l/m²)', value: step3Data?.taxaEmulsao },
    { title: 'Taxa de Agregados (kg/m²)', value: step3Data?.taxaAgregados },
    { title: 'Faixa Granulométrica', value: step3Data?.faixaGranulometrica },
    { title: 'Abrasão Los Angeles (%)', value: step3Data?.abrasaoLosAngeles },
    { title: 'Massa Específica (g/cm³)', value: step3Data?.massaEspecifica },
  ];

  const emulsaoFields = [
    { title: 'Referência Comercial', value: step3Data?.referenciaComercial },
    { title: 'Refinaria', value: step3Data?.refinaria },
    { title: 'Empresa Distribuidora', value: step3Data?.empresaDistribuidora },
    { title: 'Data do Carregamento', value: step3Data?.dataCarregamento },
    { title: 'Número da Nota Fiscal', value: step3Data?.numeroNotaFiscal },
    { title: 'Data da Nota Fiscal', value: step3Data?.dataNotaFiscal },
    { title: 'Número do Certificado', value: step3Data?.numeroCertificado },
    { title: 'Data do Certificado', value: step3Data?.dataCertificado },
  ];

  const parametrosFields = [
    { title: 'Viscosidade (SSF)', value: step3Data?.viscosidadeSSF },
    { title: 'Peneiração (%)', value: step3Data?.peneiracao },
    { title: 'Resíduo (%)', value: step3Data?.residuo },
    { title: 'Carga de Partícula', value: step3Data?.cargaParticula },
    { title: 'Penetração (mm)', value: step3Data?.penetracao },
    { title: 'Recuperação Elástica (%)', value: step3Data?.recuperacaoElastica },
    { title: 'Ponto de Amolecimento (°C)', value: step3Data?.pontoAmolecimento },
  ];

  // ==================== STEP 4 - LIGANTE ASFÁLTICO (step4Data) ====================
  const comerciaisFields = [
    { title: 'Referência Comercial', value: step4Data?.referenciaComercial },
    { title: 'Refinaria', value: step4Data?.refinaria },
    { title: 'Empresa Distribuidora', value: step4Data?.empresaDistribuidora },
    { title: 'Data do Carregamento', value: step4Data?.dataCarregamento },
    { title: 'Número da Nota Fiscal', value: step4Data?.numeroNotaFiscal },
    { title: 'Data da Nota Fiscal', value: step4Data?.dataNotaFiscal },
    { title: 'Número do Certificado', value: step4Data?.numeroCertificado },
    { title: 'Data do Certificado', value: step4Data?.dataCertificado },
  ];

  const originalFields = [
    { title: 'Tipo de CAP', value: step4Data?.tipoCAP },
    { title: 'Performance Grade (PG)', value: step4Data?.performanceGrade },
    { title: 'Penetração (mm) - 25°C', value: step4Data?.penetracao25 },
    { title: 'Ponto de Amolecimento (°C)', value: step4Data?.pontoAmolecimento },
    { title: 'Viscosidade Brookfield 135°C (cP)', value: step4Data?.viscosidadeBrookfield_135 },
    { title: 'Viscosidade Brookfield 150°C (cP)', value: step4Data?.viscosidadeBrookfield_150 },
    { title: 'Viscosidade Brookfield 177°C (cP)', value: step4Data?.viscosidadeBrookfield_177 },
    { title: 'Recuperação Elástica (%)', value: step4Data?.recuperacaoElastica },
  ];

  const dsrOriginalFields = [
    { title: 'DSR - G*/sen(δ) (MPa)', value: step4Data?.dsr_original_G_sen },
    { title: 'Temperatura do Teste (°C)', value: step4Data?.dsr_original_temp },
  ];

  const dsrRtfotFields = [
    { title: 'DSR RTFOT - G*/sen(δ) (MPa)', value: step4Data?.dsr_rtfot_G_sen },
    { title: 'Temperatura do Teste (°C)', value: step4Data?.dsr_rtfot_temp },
  ];

  const mscrFields = [
    { title: 'MSCR - Jnr 3,2 (1/kPa)', value: step4Data?.mscr_Jnr_3_2 },
    { title: 'MSCR - Jndiff (%)', value: step4Data?.mscr_Jndiff },
  ];

  const lasFields = [
    { title: 'LAS - Strain 1,25% - Nº', value: step4Data?.las_strain_1_25 },
    { title: 'LAS - Strain 2,5% - Nº', value: step4Data?.las_strain_2_5 },
    { title: 'LAS - Strain 5% - Nº', value: step4Data?.las_strain_5 },
    { title: 'LAS - af (comprimento na trinca)', value: step4Data?.las_af },
    { title: 'LAS - FFL (Fator de fadiga)', value: step4Data?.las_FFL },
    { title: 'LAS - D³', value: step4Data?.las_D },
  ];

  const bbrFields = [
    { title: 'BBR - Módulo de rigidez S (MPa)', value: step4Data?.bbr_S },
    { title: 'BBR - Coeficiente angular m (MPa)', value: step4Data?.bbr_m },
    { title: 'Temperatura do Teste (°C)', value: step4Data?.bbr_temp },
  ];

  // ==================== STEP 5 - CONCRETO ASFÁLTICO (step5Data) ====================
  const geraisFields = [
    { title: 'Tipo de CAP', value: step5Data?.tipoCAP },
    { title: 'Massa Específica (g/cm³)', value: step5Data?.massaEspecifica },
    { title: 'Resistência à Tração (MPa)', value: step5Data?.resistenciaTracao },
    { title: 'Teor de Asfalto (%)', value: step5Data?.teorAsfalto },
    { title: 'Volume de Vazios (%)', value: step5Data?.volumeVazios },
    { title: 'Faixa Granulométrica', value: step5Data?.faixaGranulometrica },
    { title: 'TMN (mm)', value: step5Data?.tmn },
    { title: 'Abrasão Los Angeles (%)', value: step5Data?.abrasaoLosAngeles },
    { title: 'Flow Number (FN)', value: step5Data?.flowNumber },
    { title: 'Módulo de Resiliência 25°C (MPa)', value: step5Data?.moduloResiliencia },
  ];

  const curvaFadigaFields = [
    { title: 'Nº de Amostras (CPs)', value: step5Data?.curvaFadiga_n_cps },
    { title: 'Coeficiente de Regressão (k1)', value: step5Data?.curvaFadiga_k1 },
    { title: 'Coeficiente de Regressão (k2)', value: step5Data?.curvaFadiga_k2 },
    { title: 'Coef. de Determinação (R²)', value: step5Data?.curvaFadiga_r2 },
  ];

  const sigmoidalFields = [
    { title: 'Coeficiente a', value: step5Data?.sigmoidal_a },
    { title: 'Coeficiente b', value: step5Data?.sigmoidal_b },
    { title: 'Coeficiente d', value: step5Data?.sigmoidal_d },
    { title: 'Coeficiente g', value: step5Data?.sigmoidal_g },
    { title: 'Coeficiente a1', value: step5Data?.sigmoidal_a1 },
    { title: 'Coeficiente a2', value: step5Data?.sigmoidal_a2 },
    { title: 'Coeficiente a3', value: step5Data?.sigmoidal_a3 },
  ];

  const danoFields = [
    { title: 'Parâmetro "α" de evolução do dano', value: step5Data?.parametro_alfa },
    { title: 'C₁₀', value: step5Data?.dano_C10 },
    { title: 'C₁₁', value: step5Data?.dano_C11 },
    { title: 'C₁₂', value: step5Data?.dano_C12 },
    { title: 'a', value: step5Data?.dano_a },
    { title: 'b', value: step5Data?.dano_b },
    { title: 'Y', value: step5Data?.dano_Y },
    { title: 'Δ', value: step5Data?.dano_Delta },
  ];

  const shiftModelFields = [
    { title: 'Nº de Amostras (CPs)', value: step5Data?.shiftModel_n_cps },
    { title: 'ε₀', value: step5Data?.shiftModel_ε0 },
    { title: 'N1', value: step5Data?.shiftModel_N1 },
    { title: 'β', value: step5Data?.shiftModel_β },
    { title: 'p1', value: step5Data?.shiftModel_p1 },
    { title: 'p2', value: step5Data?.shiftModel_p2 },
    { title: 'd1', value: step5Data?.shiftModel_d1 },
    { title: 'd2', value: step5Data?.shiftModel_d2 },
  ];

  const sections = [
    'general-data',
    'step2-characteristics',
    'step2-coordinates',
    'step2-paviment-data',
    'step2-paviment-preparation',
    'step2-service-time',
    'step2-last-update',
    'step2-structural-composition',
    'step3-tratamento',
    'step3-emulsao',
    'step3-parametros',
    'step4-comerciais',
    'step4-original',
    'step4-dsr-original',
    'step4-rtfot',
    'step4-mscr',
    'step4-las',
    'step4-bbr',
    'step5-gerais',
    'step5-fadiga',
    'step5-sigmoidal',
    'step5-dano',
    'step5-prony',
    'step5-shift',
  ];

  setNextDisabled(false);

  return (
    <>
      <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', marginTop: '3rem' }}>
        <Box
          sx={{
            width: { mobile: '90%', notebook: '100%' },
            maxWidth: '2200px',
            padding: '2rem',
            borderRadius: '20px',
            bgcolor: 'primaryTons.white',
            border: '1px solid',
            borderColor: 'primaryTons.border',
            margin: '1rem',
            marginTop: '1rem',
          }}
        >
          <GeneratePDF_ProMedina sample={samples} sections={sections} />

          {/* ==================== STEP 1 - DADOS GERAIS ==================== */}
          <Box id="general-data" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="DADOS GERAIS" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {generalDataFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.value}</Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          {/* ==================== STEP 2 - CARACTERÍSTICAS ==================== */}
          <Box id="step2-characteristics" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="CARACTERÍSTICAS" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {characteristicsFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.value}</Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          {/* ==================== STEP 2 - COORDENADAS ==================== */}
          <Box id="step2-coordinates" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="COORDENADAS" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {coordinatesFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.value}</Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          {/* ==================== STEP 2 - DADOS DO PAVIMENTO ==================== */}
          <Box id="step2-paviment-data" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="DADOS DO PAVIMENTO" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {pavimentDataFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.value}</Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          {/* ==================== STEP 2 - PREPARO DO PAVIMENTO ==================== */}
          <Box id="step2-paviment-preparation" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="PREPARO DO PAVIMENTO" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {pavimentPreparationFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.value}</Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          {/* ==================== STEP 2 - TEMPO EM SERVIÇO ==================== */}
          <Box id="step2-service-time" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="TEMPO EM SERVIÇO" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {serviceTimeFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.value}</Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          {/* ==================== STEP 2 - DATA DA ÚLTIMA ATUALIZAÇÃO ==================== */}
          <Box id="step2-last-update" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="DATA DA ÚLTIMA ATUALIZAÇÃO" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                {lastUpdateField.value && (
                  <>
                    <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{lastUpdateField.title}</Typography>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{lastUpdateField.value}</Typography>
                  </>
                )}
              </Box>
            </FlexColumnBorder>
          </Box>

          {/* ==================== STEP 2 - COMPOSIÇÃO ESTRUTURAL ==================== */}
          <Box id="step2-structural-composition" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="COMPOSIÇÃO ESTRUTURAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                {rows && rows.length > 0 && (
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
                )}
              </Box>
              {step2Data?.images && (
                <Box sx={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <Typography sx={{ fontWeight: 'bold', marginTop: '0.5rem', color: 'black' }}>IMAGEM DA COMPOSIÇÃO ESTRUTURAL</Typography>
                  <img src={step2Data.images} alt="Estrutura" width="250px" height="250px" style={{ borderRadius: '8px' }} />
                  <Typography sx={{ color: 'gray' }}>DATA DA IMAGEM</Typography>
                  <Typography sx={{ color: 'black' }}>{step2Data?.imagesDate || '-'}</Typography>
                </Box>
              )}
            </FlexColumnBorder>
          </Box>

          {/* ==================== STEP 3 - TRATAMENTO SUPERFICIAL ==================== */}
          <Box id="step3-tratamento" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="TRATAMENTO SUPERFICIAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {tratamentoFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.value}</Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          <Box id="step3-emulsao" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="EMULSÃO ASFÁLTICA" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {emulsaoFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.value}</Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          <Box id="step3-parametros" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="PARÂMETROS DO MATERIAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {parametrosFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.value}</Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          {/* ==================== STEP 4 - LIGANTE ASFÁLTICO ==================== */}
          <Box id="step4-comerciais" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="DADOS COMERCIAIS" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {comerciaisFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.value}</Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          <Box id="step4-original" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="LIGANTE ORIGINAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {originalFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.value}</Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          <Box id="step4-dsr-original" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="DSR - LIGANTE ORIGINAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {dsrOriginalFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.value}</Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          <Box id="step4-rtfot" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="LIGANTE ENVELHECIDO RTFOT" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {dsrRtfotFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.value}</Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          <Box id="step4-mscr" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="MSCR" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {mscrFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.value}</Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          <Box id="step4-las" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="LAS" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {lasFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.value}</Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          <Box id="step4-bbr" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="BBR (RTFOT + PAV)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {bbrFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.value}</Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          {/* ==================== STEP 5 - CONCRETO ASFÁLTICO ==================== */}
          <Box id="step5-gerais" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="PROPRIEDADES GERAIS" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {geraisFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.value}</Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          <Box id="step5-fadiga" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="CURVA DE FADIGA (COMPRESSÃO DIAMETRAL)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {curvaFadigaFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.value}</Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          <Box id="step5-sigmoidal" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="CURVAS-MESTRAS (FUNÇÃO SIGMOIDAL)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {sigmoidalFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.value}</Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          <Box id="step5-dano" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="COEFICIENTES DE REGRESSÃO (G²)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {danoFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.value}</Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          <Box id="step5-prony" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="MÓDULOS DE RELAXAÇÃO (PRONY)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {step5Data?.einf && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>Einf (kPa)</Typography>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{step5Data.einf}</Typography>
                  </Box>
                )}
                {(step5Data?.prony_pi || []).map((pi, index) => (
                  <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>pi (s) - {index + 1}</Typography>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{pi}</Typography>
                    <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>Ei (kPa)</Typography>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{step5Data?.prony_Ei?.[index]}</Typography>
                  </Box>
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          <Box id="step5-shift" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="COEFICIENTES DE REGRESSÃO DO SHIFT MODEL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {shiftModelFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.value}</Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          {/* ==================== OBSERVAÇÕES ==================== */}
          {(step3Data?.observacoes || step4Data?.observacoes || step5Data?.observacoes) && (
            <Box id="observacoes" sx={{ paddingTop: '1rem', paddingX: '6rem', paddingBottom: '2rem' }}>
              <FlexColumnBorder title="OBSERVAÇÕES" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    justifyItems: 'center',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  {step3Data?.observacoes && (
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                      Tratamento Superficial: {step3Data.observacoes}
                    </Typography>
                  )}
                  {step4Data?.observacoes && (
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                      Ligante Asfáltico: {step4Data.observacoes}
                    </Typography>
                  )}
                  {step5Data?.observacoes && (
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                      Concreto Asfáltico: {step5Data.observacoes}
                    </Typography>
                  )}
                </Box>
              </FlexColumnBorder>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default BinderAsphaltConcreteResume;