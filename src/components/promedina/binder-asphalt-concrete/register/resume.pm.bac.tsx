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
  const { generalData: data, step2Data, step3Data, step4Data, _id } = useBinderAsphaltConcreteStore();
  const samples: BinderAsphaltConcreteData = {
    generalData: { ...data },
    step2Data,
    step3Data,
    step4Data,
    _id,
  };

  const columns: GridColDef[] = [
    { field: 'layer', headerName: 'CAMADA' },
    { field: 'material', headerName: 'MATERIAL' },
    { field: 'thickness', headerName: 'ESPESSURA (mm)' },
  ];

  const rows = samples?.step2Data.structuralComposition?.map((item, index) => ({
    id: index,
    layer: item.layer,
    material: item.material,
    thickness: item.thickness ? `${item.thickness} mm` : '-',
  }));

  // DADOS GERAIS
  const generalDataFields = [
    { title: 'NOME', value: samples?.generalData?.name },
    { title: 'LOCAL', value: samples?.generalData?.zone },
    { title: 'CAMADA', value: samples?.generalData?.layer },
    { title: 'MUNICÍPIO/ESTADO', value: samples?.generalData?.cityState },
    { title: 'RODOVIA', value: samples?.generalData?.highway },
    { title: 'VELOCIDADE DIRETRIZ', value: samples?.generalData?.guideLineSpeed ? `${samples?.generalData?.guideLineSpeed} km/h` : '-' },
    { title: 'OBSERVAÇÕES', value: samples?.generalData?.observations },
  ];

  // CARACTERÍSTICAS
  const characteristicsFields = [
    { title: 'LOCAL', value: step2Data?.roadName || step2Data?.identification },
    { title: 'MUNICÍPIO/ESTADO', value: step2Data?.cityState },
    { title: 'EXTENSÃO (m)', value: step2Data?.experimentalLength || step2Data?.extension },
    { title: 'VELOCIDADE DIRETRIZ DA VIA (km/h)', value: step2Data?.guideSpeed },
  ];

  // COORDENADAS
  const coordinatesFields = [
    { title: 'ESTACA/METROS INICIAL', value: step2Data?.initialStakeMeters },
    { title: 'LATITUDE INICIAL', value: step2Data?.latitudeI },
    { title: 'LONGITUDE INICIAL', value: step2Data?.longitudeI },
    { title: 'ESTACA/METROS FINAL', value: step2Data?.finalStakeMeters },
    { title: 'LATITUDE FINAL', value: step2Data?.latitudeF },
    { title: 'LONGITUDE FINAL', value: step2Data?.longitudeF },
  ];

  // DADOS DO PAVIMENTO
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

  // PREPARO DO PAVIMENTO
  const pavimentPreparationFields = [
    { title: 'IRI (m/km) PRÉ-REABILITAÇÃO', value: step2Data?.iriPrerehabilitation },
    { title: 'AT (%) PRÉ-REABILITAÇÃO', value: step2Data?.atPrerehabilitation },
    { title: 'FRESAGEM (cm)', value: step2Data?.millingThickness },
    { title: 'INTERVENÇÃO NA BASE', value: step2Data?.interventionAtTheBase },
    { title: 'SAMI', value: step2Data?.sami },
    { title: 'PINTURA DE LIGAÇÃO', value: step2Data?.bondingPaint },
    { title: 'IMPRIMAÇÃO', value: step2Data?.priming },
  ];

  // TEMPO EM SERVIÇO
  const serviceTimeFields = [
    { title: 'TEMPO EM SERVIÇO (ANOS)', value: step2Data?.serviceTimeYears },
    { title: 'TEMPO EM SERVIÇO (MESES)', value: step2Data?.serviceTimeMonths },
  ];

  // DATA DA ÚLTIMA ATUALIZAÇÃO
  const lastUpdateField = { title: 'DATA DA ÚLTIMA ATUALIZAÇÃO', value: step2Data?.lastUpdate };

  // DADOS DO MATERIAL (STEP3)
  const materialDataFields = [
    { title: 'REFINARIA', value: step3Data?.refinery },
    { title: 'EMPRESA', value: step3Data?.company },
    { title: 'DATA DO CARREGAMENTO', value: step3Data?.collectionDate },
    { title: 'NÚMERO DA NOTA FISCAL', value: step3Data?.invoiceNumber },
    { title: 'DATA DA NOTA FISCAL', value: step3Data?.dataInvoice },
    { title: 'DATA DO CERTIFICADO', value: step3Data?.certificateDate },
    { title: 'NÚMERO DO CERTIFICADO', value: step3Data?.certificateNumber },
    { title: 'TIPO DE CAP', value: step3Data?.capType },
    { title: 'PERFORMANCE GRADE (PG)', value: step3Data?.performanceGrade },
    { title: 'PENETRAÇÃO - 25°C (mm)', value: step3Data?.penetration },
    { title: 'PONTO DE AMOLECIMENTO (°C)', value: step3Data?.softeningPoint },
    { title: 'RECUPERAÇÃO ELÁSTICA - 25°C (%)', value: step3Data?.elasticRecovery },
  ];

  // VISCOSIDADE BROOKFIELD
  const brookfieldFields = [
    { title: '135°C (SP21, 20rpm)', value: step3Data?.vb_sp21_20 },
    { title: '150°C (SP21, 50rpm)', value: step3Data?.vb_sp21_50 },
    { title: '177°C (SP21, 100rpm)', value: step3Data?.vb_sp21_100 },
    { title: 'OBSERVAÇÕES', value: step3Data?.observations },
  ];

  // DADOS TÉCNICOS (STEP4)
  const techDataFields = [
    { title: 'FAIXA GRANULOMÉTRICA', value: step4Data?.granulometricRange },
    { title: 'TMN', value: step4Data?.tmn },
    { title: 'TEOR DE ASFALTO', value: step4Data?.asphaltTenor },
    { title: 'MASSA ESPECÍFICA (g/cm³)', value: step4Data?.specificMass },
    { title: 'VOLUME DE VAZIOS (%)', value: step4Data?.volumeVoids },
    { title: 'ABRASÃO LA', value: step4Data?.abrasionLA },
    { title: 'RT', value: step4Data?.rt },
    { title: 'FLOW NUMBER', value: step4Data?.flowNumber },
    { title: 'MR', value: step4Data?.mr },
    { title: 'OBSERVAÇÕES', value: step4Data?.observations },
  ];

  // CURVA DE FADIGA À COMPRESSÃO DIAMETRAL
  const fatigueCurveFields = [
    { title: 'N° CPs', value: step4Data?.fatigueCurve_n_cps },
    { title: 'k1', value: step4Data?.fatigueCurve_k1 },
    { title: 'k2', value: step4Data?.fatigueCurve_k2 },
    { title: 'R²', value: step4Data?.fatigueCurve_r2 },
  ];

  const sections = [
    'general-data',
    'characteristics',
    'coordinates',
    'paviment-data',
    'paviment-preparation',
    'service-time',
    'last-update',
    'material-data',
    'brookfield-viscosity',
    'technical-data',
    'diametral-compression',
    'structural-composition',
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

          {/* DADOS GERAIS */}
          <Box id="general-data" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="DADOS GERAIS" open={true} theme={'#07B811'}>
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
                {generalDataFields.map((item, idx) => (
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }}
                    key={idx}
                  >
                    {item.value && (
                      <>
                        <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                          {item.title}
                        </Typography>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                          {item.value === null || item.value === '' ? '-' : item.value}
                        </Typography>
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          {/* CARACTERÍSTICAS */}
          <Box id="characteristics" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="CARACTERÍSTICAS" open={true} theme={'#07B811'}>
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
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                    {item.value && (
                      <>
                        <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                          {item.value === null || item.value === '' ? '-' : item.value}
                        </Typography>
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          {/* COORDENADAS */}
          <Box id="coordinates" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="COORDENADAS" open={true} theme={'#07B811'}>
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
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                    {item.value && (
                      <>
                        <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                          {item.value === null || item.value === '' ? '-' : item.value}
                        </Typography>
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          {/* DADOS DO PAVIMENTO */}
          <Box id="paviment-data" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="DADOS DO PAVIMENTO" open={true} theme={'#07B811'}>
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
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                    {item.value && (
                      <>
                        <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                          {item.value === null || item.value === '' ? '-' : item.value}
                        </Typography>
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          {/* PREPARO DO PAVIMENTO */}
          <Box id="paviment-preparation" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="PREPARO DO PAVIMENTO" open={true} theme={'#07B811'}>
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
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                    {item.value && (
                      <>
                        <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                          {item.value === null || item.value === '' ? '-' : item.value}
                        </Typography>
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          {/* TEMPO EM SERVIÇO */}
          <Box id="service-time" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="TEMPO EM SERVIÇO" open={true} theme={'#07B811'}>
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
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                    {item.value && (
                      <>
                        <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                          {item.value === null || item.value === '' ? '-' : item.value}
                        </Typography>
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          {/* DATA DA ÚLTIMA ATUALIZAÇÃO */}
          <Box id="last-update" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="DATA DA ÚLTIMA ATUALIZAÇÃO" open={true} theme={'#07B811'}>
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

          {/* DADOS DO MATERIAL */}
          <Box id="material-data" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="DADOS DO MATERIAL" open={true} theme={'#07B811'}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {materialDataFields.map((item, idx) => (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                    {item.value && (
                      <>
                        <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                          {item.value === null || item.value === '' ? '-' : item.value}
                        </Typography>
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          {/* VISCOSIDADE BROOKFIELD */}
          <Box id="brookfield-viscosity" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="VISCOSIDADE BROOKFIELD" open={true} theme={'#07B811'}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {brookfieldFields.map((item, idx) => (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                    {item.value && (
                      <>
                        <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                          {item.value === null || item.value === '' ? '-' : item.value}
                        </Typography>
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          {/* DADOS TÉCNICOS */}
          <Box id="technical-data" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="DADOS TÉCNICOS" open={true} theme={'#07B811'}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {techDataFields.map((item, idx) => (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                    {item.value && (
                      <>
                        <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                          {item.value === null || item.value === '' ? '-' : item.value}
                        </Typography>
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          {/* CURVA DE FADIGA À COMPRESSÃO DIAMETRAL */}
          <Box id="diametral-compression" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="CURVA DE FADIGA À COMPRESSÃO DIAMETRAL" open={true} theme={'#07B811'}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {fatigueCurveFields.map((item, idx) => (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                    {item.value && (
                      <>
                        <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                          {item.value === null || item.value === '' ? '-' : item.value}
                        </Typography>
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          {/* COMPOSIÇÃO ESTRUTURAL */}
          <Box id="structural-composition" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="COMPOSIÇÃO ESTRUTURAL" open={true} theme={'#07B811'}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ height: 'fit-content', width: '100%' }}>
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
                </div>
              </Box>

              {samples.step2Data.images && (
                <Box sx={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <Typography sx={{ fontWeight: 'bold', marginTop: '0.5rem', color: 'black' }}>
                    IMAGEM DA COMPOSIÇÃO ESTRUTURAL
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { mobile: 'column', desktop: 'row' },
                      gap: '1rem',
                      alignItems: 'center',
                      border: '2px solid #07B811',
                      borderRadius: '10px',
                      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    }}
                  >
                    <img
                      src={samples?.step2Data.images}
                      alt="Imagem da composição estrutural"
                      width={'250px'}
                      height={'250px'}
                      style={{ borderRadius: '8px' }}
                    />
                  </Box>
                  <Typography sx={{ color: 'gray' }}>DATA DA IMAGEM</Typography>
                  <Typography sx={{ color: 'black' }}>{samples?.step2Data.imagesDate || '-'}</Typography>
                </Box>
              )}
            </FlexColumnBorder>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default BinderAsphaltConcreteResume;