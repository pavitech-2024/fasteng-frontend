import samplesService from '@/services/promedina/stabilized-layers/stabilized-layers-view.service';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { Box, Button, Typography } from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Loading from '@/components/molecules/loading';
import Link from 'next/link';

const SpecificSample_StabilizedLayers = () => {
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
      }
    };
    if (query.id) fetchData();
  }, [query.id]);

  const columns: GridColDef[] = [
    { field: 'layer', headerName: 'CAMADA', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'material', headerName: 'MATERIAL', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'thickness', headerName: 'ESPESSURA (mm)', flex: 1, headerAlign: 'center', align: 'center' },
  ];

  // Composição estrutural do generalData
  const structuralRows = samples?.generalData?.structuralComposition?.map((item: any, index: number) => ({
    id: index,
    layer: item.layer || '-',
    material: item.material || '-',
    thickness: item.thickness ? `${item.thickness} mm` : '-',
  })) || [];

  // Camadas do step2Data
  const layers = samples?.step2Data?.layers || [];

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

  const renderSection = (title: string, fields: { title: string; value: any }[], cols = '1fr 1fr 1fr 1fr') => {
    const hasData = fields.some(f => f.value);
    if (!hasData) return null;
    return (
      <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
        <FlexColumnBorder title={title} open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
          {renderFields(fields, cols)}
        </FlexColumnBorder>
      </Box>
    );
  };

  if (loading) return <Loading size={30} color={'secondary'} />;

  return (
    <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', marginTop: '3rem' }}>
      <Box sx={{ width: { mobile: '90%', notebook: '80%' }, maxWidth: '2200px', padding: '2rem', borderRadius: '20px', bgcolor: 'primaryTons.white', border: '1px solid', borderColor: 'primaryTons.border', margin: '1rem' }}>
        
        {/* IDENTIFICAÇÃO */}
        {renderSection('IDENTIFICAÇÃO', [
          { title: 'IDENTIFICAÇÃO', value: samples?.generalData?.identification },
          { title: 'TIPO DE SEÇÃO', value: samples?.generalData?.tipoSecao },
          { title: 'FASE DE MONITORAMENTO', value: samples?.generalData?.faseMonitoramento },
          { title: 'LIBERAÇÃO AO TRÁFEGO', value: samples?.generalData?.liberacaoTrafico },
          { title: 'UTILIZADA MEDINA', value: samples?.generalData?.utilizadaMedina },
          { title: 'UTILIZADA LVECD', value: samples?.generalData?.utilizadaLvec },
          { title: 'DADOS CONFIRMADOS ICT', value: samples?.generalData?.dadosConfirmadosICT },
          { title: 'OBSERVAÇÕES', value: samples?.generalData?.observations },
        ])}

        {/* PREPARO DO PAVIMENTO */}
        {renderSection('PREPARO DO PAVIMENTO', [
          { title: 'IRI (m/km) PRÉ-REABILITAÇÃO', value: samples?.generalData?.iriPreReabilitacao },
          { title: 'AT (%) PRÉ-REABILITAÇÃO', value: samples?.generalData?.atPreReabilitacao },
          { title: 'FRESAGEM', value: samples?.generalData?.fresagem },
          { title: 'ESPESSURA FRESADA (mm)', value: samples?.generalData?.espessuraFresagem },
          { title: 'INTERVENÇÃO NA BASE', value: samples?.generalData?.intervencaoBase },
          { title: 'SAMI', value: samples?.generalData?.sami },
          { title: 'PINTURA DE LIGAÇÃO', value: samples?.generalData?.pinturaLigacao },
          { title: 'IMPRIMAÇÃO', value: samples?.generalData?.imprimacao },
        ])}

        {/* DATA DA ÚLTIMA ATUALIZAÇÃO */}
        {renderSection('DATA DA ÚLTIMA ATUALIZAÇÃO', [
          { title: 'DATA DA ÚLTIMA ATUALIZAÇÃO', value: samples?.generalData?.dataUltimaAtualizacao },
          { title: 'TEMPO EM SERVIÇO (ANOS)', value: samples?.generalData?.tempoServicoAnos },
          { title: 'TEMPO EM SERVIÇO (MESES)', value: samples?.generalData?.tempoServicoMeses },
        ], '1fr 1fr')}

        {/* CARACTERÍSTICAS */}
        {renderSection('CARACTERÍSTICAS', [
          { title: 'LOCAL (RODOVIA/AVENIDA)', value: samples?.generalData?.local },
          { title: 'MUNICÍPIO/ESTADO', value: samples?.generalData?.municipioEstado },
          { title: 'EXTENSÃO (m)', value: samples?.generalData?.extensao },
          { title: 'VELOCIDADE DIRETRIZ (km/h)', value: samples?.generalData?.velocidadeDiretriz },
          { title: 'KM INICIAL', value: samples?.generalData?.kmInicial },
          { title: 'KM FINAL', value: samples?.generalData?.kmFinal },
          { title: 'NÚMERO DE FAIXAS', value: samples?.generalData?.numeroFaixas },
          { title: 'FAIXA MONITORADA', value: samples?.generalData?.faixaMonitorada },
          { title: 'LARGURA DA FAIXA (m)', value: samples?.generalData?.larguraFaixa },
        ])}

        {/* COORDENADAS */}
        {renderSection('COORDENADAS', [
          { title: 'INÍCIO - ESTACA', value: samples?.generalData?.inicioEstaca },
          { title: 'INÍCIO - METROS', value: samples?.generalData?.inicioMetros },
          { title: 'LATITUDE INICIAL', value: samples?.generalData?.latitudeI },
          { title: 'LONGITUDE INICIAL', value: samples?.generalData?.longitudeI },
          { title: 'FIM - ESTACA', value: samples?.generalData?.fimEstaca },
          { title: 'FIM - METROS', value: samples?.generalData?.fimMetros },
          { title: 'LATITUDE FINAL', value: samples?.generalData?.latitudeF },
          { title: 'LONGITUDE FINAL', value: samples?.generalData?.longitudeF },
          { title: 'ALTITUDE MÉDIA (m)', value: samples?.generalData?.altitudeMedia },
        ], '1fr 1fr 1fr')}

        {/* COMPOSIÇÃO ESTRUTURAL */}
        {structuralRows.length > 0 && (
          <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
            <FlexColumnBorder title="COMPOSIÇÃO ESTRUTURAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <DataGrid rows={structuralRows} hideFooter disableColumnMenu disableColumnFilter columns={columns} sx={{ borderRadius: '10px' }} />
              {samples?.generalData?.imagemEstrutural && (
                <Box sx={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <Typography sx={{ fontWeight: 'bold', color: 'black' }}>IMAGEM DA COMPOSIÇÃO ESTRUTURAL</Typography>
                  <img src={samples.generalData.imagemEstrutural} alt="Estrutura" width="250px" height="250px" style={{ borderRadius: '8px' }} />
                  <Typography sx={{ color: 'gray' }}>DATA DA IMAGEM</Typography>
                  <Typography sx={{ color: 'black' }}>{samples?.generalData?.dataImagens || '-'}</Typography>
                </Box>
              )}
            </FlexColumnBorder>
          </Box>
        )}

        {/* CAMADAS ESTABILIZADAS */}
        {layers.map((layer: any, index: number) => {
          const hasData = Object.values(layer).some((v: any) => v && v !== '');
          if (!hasData) return null;

          return (
            <Box key={layer.id || index} sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
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
        {samples?.step2Data?.observations && (
          <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
            <FlexColumnBorder title="OBSERVAÇÕES" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black', textAlign: 'center' }}>
                {samples.step2Data.observations}
              </Typography>
            </FlexColumnBorder>
          </Box>
        )}
      </Box>

      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: { mobile: '4vh 4vw', notebook: '3vh 6vw' } }}>
        <Link href="/promedina/stabilized-layers/view" style={{ backgroundColor: '#00A3FF', color: '#FFFFFF', height: '32px', width: '140px', fontSize: '1.2rem', alignItems: 'center', border: 'none', borderRadius: '30px', textAlign: 'center', fontWeight: 'bold', paddingTop: '0.2rem', textDecoration: 'none', display: 'inline-block' }}>
          {t('button-previous')}
        </Link>
      </Box>
    </Box>
  );
};

export default SpecificSample_StabilizedLayers;