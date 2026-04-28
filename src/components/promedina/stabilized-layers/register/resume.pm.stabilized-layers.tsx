import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { Box, Typography } from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { t } from 'i18next';
import Link from 'next/link';
import GeneratePDF_ProMedina from '@/components/generatePDF/promedina/granularLayers/generatePDF.promedina';
import { EssayPageProps } from '@/components/templates/essay';
import useStabilizedLayersStore from '@/stores/promedina/stabilized-layers/stabilized-layers.store';

const StabilizedLayersResume = ({ setNextDisabled }: EssayPageProps) => {
  const { generalData: data, step2Data, step3Data } = useStabilizedLayersStore();
  const samples = { generalData: { ...data }, step2Data, step3Data };

  const layers = step3Data?.layers || [];

  const sections = [
    'general-data',
    'identification',
    'preparo-pavimento',
    'data-atualizacao',
    'caracteristicas',
    'composicao-estrutural',
    'step2-coordinates',
    'step2-pavement-data',
    'step2-pavement-preparation',
    'step2-structural-composition',
    'step3-layers',
    'observations',
  ];

  const columns: GridColDef[] = [
    { field: 'layer', headerName: 'CAMADA', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'material', headerName: 'MATERIAL', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'thickness', headerName: 'ESPESSURA (mm)', flex: 1, headerAlign: 'center', align: 'center' },
  ];

  // ==================== HELPERS ====================
  const renderFields = (fields: { title: string; value: any }[], cols = '1fr 1fr 1fr 1fr') => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: cols },
        justifyItems: 'center',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      {fields.map((item, idx) =>
        item.value ? (
          <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
            <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.value}</Typography>
          </Box>
        ) : null
      )}
    </Box>
  );

  const renderSection = (id: string, title: string, fields: { title: string; value: any }[], cols = '1fr 1fr 1fr 1fr') => {
    const hasData = fields.some(f => f.value);
    if (!hasData) return null;
    return (
      <Box id={id} sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
        <FlexColumnBorder title={title} open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
          {renderFields(fields, cols)}
        </FlexColumnBorder>
      </Box>
    );
  };

  // ==================== STEP 1 - CAMPOS ====================
  const identificacaoFields = [
    { title: 'IDENTIFICAÇÃO', value: data?.name },
    { title: 'ZONA', value: data?.zone },
    { title: 'CAMADA', value: data?.layer },
    { title: 'MUNICÍPIO/ESTADO', value: data?.cityState },
    { title: 'RODOVIA', value: data?.highway },
    { title: 'VELOCIDADE DIRETRIZ', value: data?.guideLineSpeed ? `${data.guideLineSpeed} km/h` : '' },
    { title: 'OBSERVAÇÕES', value: data?.observations },
  ];

  const caracteristicasFields = [
    { title: 'LOCAL', value: data?.local },
    { title: 'MUNICÍPIO/ESTADO', value: data?.municipioEstado },
    { title: 'EXTENSÃO (m)', value: data?.extensao },
    { title: 'VELOCIDADE DIRETRIZ (km/h)', value: data?.velocidadeDiretriz },
    { title: 'KM INICIAL', value: data?.kmInicial },
    { title: 'KM FINAL', value: data?.kmFinal },
    { title: 'INÍCIO ESTACA', value: data?.inicioEstaca },
    { title: 'INÍCIO METROS', value: data?.inicioMetros },
    { title: 'FIM ESTACA', value: data?.fimEstaca },
    { title: 'FIM METROS', value: data?.fimMetros },
    { title: 'ALTITUDE MÉDIA (m)', value: data?.altitudeMedia },
    { title: 'NÚMERO DE FAIXAS', value: data?.numeroFaixas },
    { title: 'FAIXA MONITORADA', value: data?.faixaMonitorada },
    { title: 'LARGURA DA FAIXA (m)', value: data?.larguraFaixa },
  ];

  // STEP 2 - COORDENADAS
  const coordinatesFields = [
    { title: 'ESTACA/METROS INICIAL', value: step2Data?.initialStakeMeters },
    { title: 'LATITUDE INICIAL', value: step2Data?.latitudeI },
    { title: 'LONGITUDE INICIAL', value: step2Data?.longitudeI },
    { title: 'ESTACA/METROS FINAL', value: step2Data?.finalStakeMeters },
    { title: 'LATITUDE FINAL', value: step2Data?.latitudeF },
    { title: 'LONGITUDE FINAL', value: step2Data?.longitudeF },
  ];

  // STEP 2 - COMPOSIÇÃO ESTRUTURAL
  const structuralRows = step2Data?.structuralComposition?.map((item: any, index: number) => ({
    id: index,
    layer: item.layer || '-',
    material: item.material || '-',
    thickness: item.thickness ? `${item.thickness} mm` : '-',
  })) || [];

  setNextDisabled(false);

  return (
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
        }}
      >
        <GeneratePDF_ProMedina sample={samples} sections={sections} />

        {/* STEP 1 - IDENTIFICAÇÃO */}
        {renderSection('identification', 'IDENTIFICAÇÃO', identificacaoFields)}

        {/* STEP 1 - CARACTERÍSTICAS */}
        {renderSection('caracteristicas', 'CARACTERÍSTICAS', caracteristicasFields)}

        {/* STEP 2 - COORDENADAS */}
        {renderSection('step2-coordinates', 'COORDENADAS', coordinatesFields, '1fr 1fr 1fr')}

        {/* STEP 2 - COMPOSIÇÃO ESTRUTURAL */}
        {structuralRows.length > 0 && (
          <Box id="step2-structural-composition" sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
            <FlexColumnBorder title="COMPOSIÇÃO ESTRUTURAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <DataGrid rows={structuralRows} hideFooter disableColumnMenu disableColumnFilter columns={columns} sx={{ borderRadius: '10px' }} />
              {step2Data?.images && (
                <Box sx={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <Typography sx={{ fontWeight: 'bold', color: 'black' }}>{t('pm-image-structural-composition')}</Typography>
                  <img src={step2Data.images} alt="Estrutura" width="250px" height="250px" style={{ borderRadius: '8px' }} />
                  <Typography sx={{ color: 'gray' }}>{t('pm-estructural-composition-image-date')}</Typography>
                  <Typography sx={{ color: 'black' }}>{step2Data?.imagesDate || '-'}</Typography>
                </Box>
              )}
            </FlexColumnBorder>
          </Box>
        )}

        {/* STEP 3 - CAMADAS DINÂMICAS */}
        {layers.map((layer: any, index: number) => {
          const hasData = Object.values(layer).some((v: any) => v && v !== '');
          if (!hasData) return null;

          return (
            <Box key={layer.id || index} id="step3-layers" sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
              {/* PARÂMETROS DO MATERIAL */}
              <FlexColumnBorder title={`PARÂMETROS DO MATERIAL${layers.length > 1 ? ` - CAMADA ${index + 1}` : ''}`} open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
                {renderFields([
                  { title: 'TEOR ÓTIMO DE CIMENTO (%)', value: layer.teorCimento },
                  { title: 'RESISTÊNCIA À TRAÇÃO (MPa)', value: layer.rt },
                  { title: 'RTCD (MPa)', value: layer.rtcd },
                  { title: 'RCS (MPa)', value: layer.rcs },
                  { title: 'FAIXA GRANULOMÉTRICA', value: layer.faixaGranulometrica },
                  { title: 'MASSA ESPECÍFICA (g/cm³)', value: layer.massaEspecifica },
                  { title: 'UMIDADE ÓTIMA (%)', value: layer.umidadeOtima },
                  { title: 'ENERGIA DE COMPACTAÇÃO', value: layer.energiaCompactacao },
                ], '1fr 1fr 1fr')}
              </FlexColumnBorder>

              {/* MÓDULO DE RESILIÊNCIA (MPa) */}
              <Box sx={{ paddingTop: '1rem' }}>
                <FlexColumnBorder title="MÓDULO DE RESILIÊNCIA (MPa)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
                  {renderFields([
                    { title: 'Ei', value: layer.ei },
                    { title: 'Ef', value: layer.ef },
                    { title: 'CONSTANTE A', value: layer.constanteA },
                    { title: 'CONSTANTE B', value: layer.constanteB },
                  ], '1fr 1fr 1fr 1fr')}
                </FlexColumnBorder>
              </Box>

              {/* FADIGA DO MATERIAL */}
              <Box sx={{ paddingTop: '1rem' }}>
                <FlexColumnBorder title="FADIGA DO MATERIAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
                  {renderFields([
                    { title: 'K1 (PSI1)', value: layer.k1 },
                    { title: 'K2 (PSI2)', value: layer.k2 },
                  ], '1fr 1fr')}
                </FlexColumnBorder>
              </Box>
            </Box>
          );
        })}

        {/* OBSERVAÇÕES */}
        {step3Data?.observations && (
          <Box id="observations" sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
            <FlexColumnBorder title="OBSERVAÇÕES" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black', textAlign: 'center' }}>
                {step3Data.observations}
              </Typography>
            </FlexColumnBorder>
          </Box>
        )}
      </Box>

      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: { mobile: '4vh 4vw', notebook: '3vh 6vw' } }}>
        <Link
          href="/promedina/stabilized-layers/view"
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

export default StabilizedLayersResume;