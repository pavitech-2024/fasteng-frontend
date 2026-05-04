import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { Box, Typography } from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { t } from 'i18next';
import Link from 'next/link';
import GeneratePDF_ProMedina from '@/components/generatePDF/promedina/granularLayers/generatePDF.promedina';
import { EssayPageProps } from '@/components/templates/essay';
import useStabilizedLayersStore from '@/stores/promedina/stabilized-layers/stabilized-layers.store';

const StabilizedLayersResume = ({ setNextDisabled }: EssayPageProps) => {
  const { generalData: data, step2Data } = useStabilizedLayersStore();
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

  // ==================== STEP 1 - IDENTIFICAÇÃO ====================
  const identificacaoFields = [
   { title: 'IDENTIFICAÇÃO', value: data?.name },,
    { title: 'TIPO DE SEÇÃO', value: data?.tipoSecao },
    { title: 'FASE DE MONITORAMENTO', value: data?.faseMonitoramento },
    { title: 'LIBERAÇÃO AO TRÁFEGO', value: data?.liberacaoTrafico },
    { title: 'UTILIZADA MEDINA', value: data?.utilizadaMedina },
    { title: 'UTILIZADA LVECD', value: data?.utilizadaLvec },
    { title: 'DADOS CONFIRMADOS ICT', value: data?.dadosConfirmadosICT },
    { title: 'OBSERVAÇÕES', value: data?.observations },
  ];

  // ==================== STEP 1 - PREPARO DO PAVIMENTO ====================
  const preparoPavimentoFields = [
    { title: 'IRI (m/km) PRÉ-REABILITAÇÃO', value: data?.iriPreReabilitacao },
    { title: 'AT (%) PRÉ-REABILITAÇÃO', value: data?.atPreReabilitacao },
    { title: 'FRESAGEM', value: data?.fresagem },
    { title: 'ESPESSURA FRESADA (mm)', value: data?.espessuraFresagem },
    { title: 'INTERVENÇÃO NA BASE', value: data?.intervencaoBase },
    { title: 'SAMI', value: data?.sami },
    { title: 'PINTURA DE LIGAÇÃO', value: data?.pinturaLigacao },
    { title: 'IMPRIMAÇÃO', value: data?.imprimacao },
  ];

  // ==================== STEP 1 - DATA ATUALIZAÇÃO ====================
  const dataAtualizacaoFields = [
    { title: 'DATA DA ÚLTIMA ATUALIZAÇÃO', value: data?.dataUltimaAtualizacao },
    { title: 'TEMPO EM SERVIÇO (ANOS)', value: data?.tempoServicoAnos },
    { title: 'TEMPO EM SERVIÇO (MESES)', value: data?.tempoServicoMeses },
  ];

  // ==================== STEP 1 - CARACTERÍSTICAS ====================
  const caracteristicasFields = [
    { title: 'LOCAL (RODOVIA/AVENIDA)', value: data?.local },
    { title: 'MUNICÍPIO/ESTADO', value: data?.municipioEstado },
    { title: 'EXTENSÃO (m)', value: data?.extensao },
    { title: 'VELOCIDADE DIRETRIZ (km/h)', value: data?.velocidadeDiretriz },
    { title: 'KM INICIAL', value: data?.kmInicial },
    { title: 'KM FINAL', value: data?.kmFinal },
    { title: 'NÚMERO DE FAIXAS', value: data?.numeroFaixas },
    { title: 'FAIXA MONITORADA', value: data?.faixaMonitorada },
    { title: 'LARGURA DA FAIXA (m)', value: data?.larguraFaixa },
  ];

  // ==================== STEP 1 - COORDENADAS ====================
  const coordinatesFields = [
    { title: 'INÍCIO - ESTACA', value: data?.inicioEstaca },
    { title: 'INÍCIO - METROS', value: data?.inicioMetros },
    { title: 'LATITUDE INICIAL', value: data?.latitudeI },
    { title: 'LONGITUDE INICIAL', value: data?.longitudeI },
    { title: 'FIM - ESTACA', value: data?.fimEstaca },
    { title: 'FIM - METROS', value: data?.fimMetros },
    { title: 'LATITUDE FINAL', value: data?.latitudeF },
    { title: 'LONGITUDE FINAL', value: data?.longitudeF },
    { title: 'ALTITUDE MÉDIA (m)', value: data?.altitudeMedia },
  ];

  // ==================== STEP 1 - COMPOSIÇÃO ESTRUTURAL ====================
  const structuralRows = data?.structuralComposition?.map((item: any, index: number) => ({
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
        <GeneratePDF_ProMedina sample={samples as any} sections={sections} />

        {/* STEP 1 - IDENTIFICAÇÃO */}
        {renderSection('identification', 'IDENTIFICAÇÃO', identificacaoFields)}

        {/* STEP 1 - PREPARO DO PAVIMENTO */}
        {renderSection('preparo-pavimento', 'PREPARO DO PAVIMENTO', preparoPavimentoFields)}

        {/* STEP 1 - DATA DA ÚLTIMA ATUALIZAÇÃO */}
        {renderSection('data-atualizacao', 'DATA DA ÚLTIMA ATUALIZAÇÃO', dataAtualizacaoFields, '1fr 1fr')}

        {/* STEP 1 - CARACTERÍSTICAS */}
        {renderSection('caracteristicas', 'CARACTERÍSTICAS', caracteristicasFields)}

        {/* STEP 1 - COORDENADAS */}
        {renderSection('coordenadas', 'COORDENADAS', coordinatesFields, '1fr 1fr 1fr')}

        {/* STEP 1 - COMPOSIÇÃO ESTRUTURAL */}
        {structuralRows.length > 0 && (
          <Box id="composicao-estrutural" sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
            <FlexColumnBorder title="COMPOSIÇÃO ESTRUTURAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <DataGrid rows={structuralRows} hideFooter disableColumnMenu disableColumnFilter columns={columns} sx={{ borderRadius: '10px' }} />
              {data?.imagemEstrutural && (
                <Box sx={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <Typography sx={{ fontWeight: 'bold', color: 'black' }}>{t('pm-image-structural-composition')}</Typography>
                  <img src={data.imagemEstrutural} alt="Estrutura" width="250px" height="250px" style={{ borderRadius: '8px' }} />
                  <Typography sx={{ color: 'gray' }}>DATA DA IMAGEM</Typography>
                  <Typography sx={{ color: 'black' }}>{data?.dataImagens || '-'}</Typography>
                </Box>
              )}
            </FlexColumnBorder>
          </Box>
        )}

        {/* STEP 2 - CAMADAS DINÂMICAS */}
        {layers.map((layer: any, index: number) => {
          const hasData = Object.values(layer).some((v: any) => v && v !== '');
          if (!hasData) return null;

          return (
            <Box key={layer.id || index} id="step2-layers" sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
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
        {step2Data?.observations && (
          <Box id="observations" sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
            <FlexColumnBorder title="OBSERVAÇÕES" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black', textAlign: 'center' }}>
                {step2Data.observations}
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