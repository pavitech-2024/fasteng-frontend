import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { Box, Typography } from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { t } from 'i18next';
import Link from 'next/link';
import GeneratePDF_ProMedina from '@/components/generatePDF/promedina/granularLayers/generatePDF.promedina';
import { EssayPageProps } from '@/components/templates/essay';
import useGranularLayersStore from '@/stores/promedina/granular-layers/granular-layers.store';

const GranularLayersResume = ({ setNextDisabled }: EssayPageProps) => {
  const { generalData: data, step2Data } = useGranularLayersStore();
  const samples = { generalData: { ...data }, step2Data };

  const layers = step2Data?.layers || [];

  const sections = [
    'identification',
    'preparo-pavimento',
    'data-atualizacao',
    'caracteristicas',
    'coordenadas',
    'composicao-estrutural',
    'step2-layers',
    'observations',
  ];

  const columns: GridColDef[] = [
    { field: 'layer', headerName: 'CAMADA', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'material', headerName: 'MATERIAL', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'thickness', headerName: 'ESPESSURA (mm)', flex: 1, headerAlign: 'center', align: 'center' },
  ];

  const renderFields = (fields: { title: string; value: any }[], cols = '1fr 1fr 1fr 1fr') => (
    <Box sx={{ display: 'grid', gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: cols }, justifyItems: 'center', alignItems: 'center', gap: '1rem' }}>
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
        <FlexColumnBorder title={title} open={true} theme={'#0c4d0f'} sx_title={{ whiteSpace: 'wrap' }}>
          {renderFields(fields, cols)}
        </FlexColumnBorder>
      </Box>
    );
  };

  const identificacaoFields = [
    { title: 'NOME', value: data?.name },
    { title: 'TIPO DE SEÇÃO', value: data?.tipoSecao },
    { title: 'FASE DE MONITORAMENTO', value: data?.faseMonitoramento },
    { title: 'LIBERAÇÃO AO TRÁFEGO', value: data?.liberacaoTrafico },
    { title: 'UTILIZADA MEDINA', value: data?.utilizadaMedina },
    { title: 'UTILIZADA LVECD', value: data?.utilizadaLvec },
    { title: 'DADOS CONFIRMADOS ICT', value: data?.dadosConfirmadosICT },
    { title: 'OBSERVAÇÕES', value: data?.observation },
  ];

  const preparoPavimentoFields = [
    { title: 'IRI (m/km) PRÉ-REABILITAÇÃO', value: data?.iriPrerehabilitation },
    { title: 'AT (%) PRÉ-REABILITAÇÃO', value: data?.atPrerehabilitation },
    { title: 'FRESAGEM', value: data?.fresagem },
    { title: 'ESPESSURA FRESADA (mm)', value: data?.millingThickness },
    { title: 'INTERVENÇÃO NA BASE', value: data?.interventionAtTheBase },
    { title: 'SAMI', value: data?.sami },
    { title: 'PINTURA DE LIGAÇÃO', value: data?.bondingPaint },
    { title: 'IMPRIMAÇÃO', value: data?.priming },
  ];

  const dataAtualizacaoFields = [
    { title: 'DATA DA ÚLTIMA ATUALIZAÇÃO', value: data?.lastUpdate },
    { title: 'TEMPO EM SERVIÇO (ANOS)', value: data?.serviceTimeYears },
    { title: 'TEMPO EM SERVIÇO (MESES)', value: data?.serviceTimeMonths },
  ];

  const caracteristicasFields = [
    { title: 'LOCAL (RODOVIA/AVENIDA)', value: data?.roadName },
    { title: 'MUNICÍPIO/ESTADO', value: data?.cityState },
    { title: 'EXTENSÃO (m)', value: data?.experimentalLength },
    { title: 'VELOCIDADE DIRETRIZ (km/h)', value: data?.guideSpeed },
    { title: 'KM INICIAL', value: data?.kmInicial },
    { title: 'KM FINAL', value: data?.kmFinal },
    { title: 'NÚMERO DE FAIXAS', value: data?.numberOfTracks },
    { title: 'FAIXA MONITORADA', value: data?.monitoredTrack },
    { title: 'LARGURA DA FAIXA (m)', value: data?.trackWidth },
  ];

  const coordinatesFields = [
    { title: 'INÍCIO - ESTACA', value: data?.inicioEstaca },
    { title: 'INÍCIO - METROS', value: data?.inicioMetros },
    { title: 'FIM - ESTACA', value: data?.fimEstaca },
    { title: 'FIM - METROS', value: data?.fimMetros },
    { title: 'ALTITUDE MÉDIA (m)', value: data?.averageAltitude },
  ];

  const structuralRows = data?.structuralComposition?.map((item: any, index: number) => ({
    id: index,
    layer: item.layer || '-',
    material: item.material || '-',
    thickness: item.thickness ? `${item.thickness} mm` : '-',
  })) || [];

  setNextDisabled(false);

  return (
    <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', marginTop: '3rem' }}>
      <Box sx={{ width: { mobile: '90%', notebook: '100%' }, maxWidth: '2200px', padding: '2rem', borderRadius: '20px', bgcolor: 'primaryTons.white', border: '1px solid', borderColor: 'primaryTons.border', margin: '1rem' }}>
        <GeneratePDF_ProMedina sample={samples as any} sections={sections} />

        {renderSection('identification', 'IDENTIFICAÇÃO', identificacaoFields)}
        {renderSection('preparo-pavimento', 'PREPARO DO PAVIMENTO', preparoPavimentoFields)}
        {renderSection('data-atualizacao', 'DATA DA ÚLTIMA ATUALIZAÇÃO', dataAtualizacaoFields, '1fr 1fr')}
        {renderSection('caracteristicas', 'CARACTERÍSTICAS', caracteristicasFields)}
        {renderSection('coordenadas', 'COORDENADAS', coordinatesFields, '1fr 1fr 1fr')}

        {structuralRows.length > 0 && (
          <Box id="composicao-estrutural" sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
            <FlexColumnBorder title="COMPOSIÇÃO ESTRUTURAL" open={true} theme={'#0c4d0f'} sx_title={{ whiteSpace: 'wrap' }}>
              <DataGrid rows={structuralRows} hideFooter disableColumnMenu disableColumnFilter columns={columns} sx={{ borderRadius: '10px' }} />
              {data?.images && (
                <Box sx={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <Typography sx={{ fontWeight: 'bold', color: 'black' }}>IMAGEM DA COMPOSIÇÃO ESTRUTURAL</Typography>
                  <img src={data.images} alt="Estrutura" width="250px" height="250px" style={{ borderRadius: '8px' }} />
                  <Typography sx={{ color: 'gray' }}>DATA DA IMAGEM</Typography>
                  <Typography sx={{ color: 'black' }}>{data?.imagesDate || '-'}</Typography>
                </Box>
              )}
            </FlexColumnBorder>
          </Box>
        )}

        {layers.map((layer: any, index: number) => {
          const hasData = Object.values(layer).some((v: any) => v && v !== '');
          if (!hasData) return null;

          return (
            <Box key={layer.id || index} id="step2-layers" sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
              <FlexColumnBorder title={`GRUPO MCT${layers.length > 1 ? ` - CAMADA ${index + 1}` : ''}`} open={true} theme={'#0c4d0f'} sx_title={{ whiteSpace: 'wrap' }}>
                {renderFields([
                  { title: "COEFICIENTE c'", value: layer.mctCoefficientC },
                  { title: "ÍNDICE e'", value: layer.mctIndexE },
                  { title: 'MASSA ESPECÍFICA (g/cm³)', value: layer.especificMass },
                  { title: 'UMIDADE ÓTIMA (%)', value: layer.optimalHumidity },
                  { title: 'ENERGIA DE COMPACTAÇÃO', value: layer.compressionEnergy },
                ], '1fr 1fr 1fr')}
              </FlexColumnBorder>

              <Box sx={{ paddingTop: '1rem' }}>
                <FlexColumnBorder title="MÓDULO DE RESILIÊNCIA" open={true} theme={'#0c4d0f'} sx_title={{ whiteSpace: 'wrap' }}>
                  {renderFields([
                    { title: 'k1', value: layer.k1 },
                    { title: 'k2', value: layer.k2 },
                    { title: 'k3', value: layer.k3 },
                    { title: 'k4', value: layer.k4 },
                  ], '1fr 1fr 1fr 1fr')}
                </FlexColumnBorder>
              </Box>

              <Box sx={{ paddingTop: '1rem' }}>
                <FlexColumnBorder title="DEFORMAÇÃO PERMANENTE" open={true} theme={'#0c4d0f'} sx_title={{ whiteSpace: 'wrap' }}>
                  {renderFields([
                    { title: 'k1/psi', value: layer.k1psi1 },
                    { title: 'k2/psi', value: layer.k2psi2 },
                    { title: 'k3/psi', value: layer.k3psi3 },
                    { title: 'k4/psi', value: layer.k4psi4 },
                  ], '1fr 1fr 1fr 1fr')}
                </FlexColumnBorder>
              </Box>
            </Box>
          );
        })}

        {step2Data?.observations && (
          <Box id="observations" sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
            <FlexColumnBorder title="OBSERVAÇÕES" open={true} theme={'#0c4d0f'} sx_title={{ whiteSpace: 'wrap' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black', textAlign: 'center' }}>{step2Data.observations}</Typography>
            </FlexColumnBorder>
          </Box>
        )}
      </Box>

      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: { mobile: '4vh 4vw', notebook: '3vh 6vw' } }}>
        <Link href="/promedina/granular-layers/view" style={{ backgroundColor: '#00A3FF', color: '#FFFFFF', height: '32px', width: '140px', fontSize: '1.2rem', alignItems: 'center', border: 'none', borderRadius: '30px', textAlign: 'center', fontWeight: 'bold', paddingTop: '0.2rem', textDecoration: 'none', display: 'inline-block' }}>
          {t('button-previous')}
        </Link>
      </Box>
    </Box>
  );
};

export default GranularLayersResume;