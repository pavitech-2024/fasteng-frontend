import samplesService from '@/services/promedina/granular-layers/granular-layers-view.service';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { Box, Button, Typography } from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Loading from '@/components/molecules/loading';
import Link from 'next/link';

const SpecificSample_GranularLayers = () => {
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

  // Camadas dinâmicas do step2Data
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

  if (loading) return <Loading size={30} color={'secondary'} />;

  return (
    <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', marginTop: '3rem' }}>
      <Box sx={{ width: { mobile: '90%', notebook: '80%' }, maxWidth: '2200px', padding: '2rem', borderRadius: '20px', bgcolor: 'primaryTons.white', border: '1px solid', borderColor: 'primaryTons.border', margin: '1rem' }}>
        
        {/* IDENTIFICAÇÃO */}
        <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
          <FlexColumnBorder title="IDENTIFICAÇÃO" open={true} theme={'#07B811'}>
            {renderFields([
              { title: 'NOME', value: samples?.generalData?.name },
              { title: 'TIPO DE SEÇÃO', value: samples?.generalData?.tipoSecao },
              { title: 'FASE DE MONITORAMENTO', value: samples?.generalData?.faseMonitoramento },
              { title: 'LIBERAÇÃO AO TRÁFEGO', value: samples?.generalData?.liberacaoTrafico },
              { title: 'UTILIZADA MEDINA', value: samples?.generalData?.utilizadaMedina },
              { title: 'UTILIZADA LVECD', value: samples?.generalData?.utilizadaLvec },
              { title: 'DADOS CONFIRMADOS ICT', value: samples?.generalData?.dadosConfirmadosICT },
              { title: 'OBSERVAÇÕES', value: samples?.generalData?.observation },
            ])}
          </FlexColumnBorder>
        </Box>

        {/* PREPARO DO PAVIMENTO */}
        <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
          <FlexColumnBorder title="PREPARO DO PAVIMENTO" open={true} theme={'#07B811'}>
            {renderFields([
              { title: 'IRI (m/km) PRÉ-REABILITAÇÃO', value: samples?.generalData?.iriPrerehabilitation },
              { title: 'AT (%) PRÉ-REABILITAÇÃO', value: samples?.generalData?.atPrerehabilitation },
              { title: 'FRESAGEM', value: samples?.generalData?.fresagem },
              { title: 'ESPESSURA FRESADA (mm)', value: samples?.generalData?.millingThickness },
              { title: 'INTERVENÇÃO NA BASE', value: samples?.generalData?.interventionAtTheBase },
              { title: 'SAMI', value: samples?.generalData?.sami },
              { title: 'PINTURA DE LIGAÇÃO', value: samples?.generalData?.bondingPaint },
              { title: 'IMPRIMAÇÃO', value: samples?.generalData?.priming },
            ])}
          </FlexColumnBorder>
        </Box>

        {/* DATA DA ÚLTIMA ATUALIZAÇÃO */}
        <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
          <FlexColumnBorder title="DATA DA ÚLTIMA ATUALIZAÇÃO" open={true} theme={'#07B811'}>
            {renderFields([
              { title: 'DATA DA ÚLTIMA ATUALIZAÇÃO', value: samples?.generalData?.lastUpdate },
              { title: 'TEMPO EM SERVIÇO (ANOS)', value: samples?.generalData?.serviceTimeYears },
              { title: 'TEMPO EM SERVIÇO (MESES)', value: samples?.generalData?.serviceTimeMonths },
            ], '1fr 1fr')}
          </FlexColumnBorder>
        </Box>

        {/* CARACTERÍSTICAS */}
        <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
          <FlexColumnBorder title="CARACTERÍSTICAS" open={true} theme={'#07B811'}>
            {renderFields([
              { title: 'LOCAL', value: samples?.generalData?.roadName },
              { title: 'MUNICÍPIO/ESTADO', value: samples?.generalData?.cityState },
              { title: 'EXTENSÃO (m)', value: samples?.generalData?.experimentalLength },
              { title: 'VELOCIDADE DIRETRIZ (km/h)', value: samples?.generalData?.guideSpeed },
              { title: 'KM INICIAL', value: samples?.generalData?.kmInicial },
              { title: 'KM FINAL', value: samples?.generalData?.kmFinal },
              { title: 'NÚMERO DE FAIXAS', value: samples?.generalData?.numberOfTracks },
              { title: 'FAIXA MONITORADA', value: samples?.generalData?.monitoredTrack },
              { title: 'LARGURA DA FAIXA (m)', value: samples?.generalData?.trackWidth },
            ])}
          </FlexColumnBorder>
        </Box>

        {/* COORDENADAS */}
        <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
          <FlexColumnBorder title="COORDENADAS" open={true} theme={'#07B811'}>
            {renderFields([
              { title: 'INÍCIO - ESTACA', value: samples?.generalData?.inicioEstaca },
              { title: 'INÍCIO - METROS', value: samples?.generalData?.inicioMetros },
              { title: 'FIM - ESTACA', value: samples?.generalData?.fimEstaca },
              { title: 'FIM - METROS', value: samples?.generalData?.fimMetros },
              { title: 'ALTITUDE MÉDIA (m)', value: samples?.generalData?.averageAltitude },
            ], '1fr 1fr 1fr')}
          </FlexColumnBorder>
        </Box>

        {/* COMPOSIÇÃO ESTRUTURAL */}
        {structuralRows.length > 0 && (
          <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
            <FlexColumnBorder title="COMPOSIÇÃO ESTRUTURAL" open={true} theme={'#07B811'}>
              <DataGrid rows={structuralRows} hideFooter disableColumnMenu disableColumnFilter columns={columns} sx={{ borderRadius: '10px' }} />
              {samples?.generalData?.images && (
                <Box sx={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <Typography sx={{ fontWeight: 'bold', color: 'black' }}>IMAGEM DA COMPOSIÇÃO ESTRUTURAL</Typography>
                  <img src={samples.generalData.images} alt="Estrutura" width="250px" height="250px" style={{ borderRadius: '8px' }} />
                  <Typography sx={{ color: 'gray' }}>DATA DA IMAGEM</Typography>
                  <Typography sx={{ color: 'black' }}>{samples?.generalData?.imagesDate || '-'}</Typography>
                </Box>
              )}
            </FlexColumnBorder>
          </Box>
        )}

        {/* CAMADAS DINÂMICAS */}
        {layers.map((layer: any, index: number) => {
          const hasData = Object.values(layer).some((v: any) => v && v !== '');
          if (!hasData) return null;

          return (
            <Box key={layer.id || index} sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
              <FlexColumnBorder title={`GRUPO MCT${layers.length > 1 ? ` - CAMADA ${index + 1}` : ''}`} open={true} theme={'#07B811'}>
                {renderFields([
                  { title: "COEFICIENTE c'", value: layer.mctCoefficientC },
                  { title: "ÍNDICE e'", value: layer.mctIndexE },
                  { title: 'MASSA ESPECÍFICA (g/cm³)', value: layer.especificMass },
                  { title: 'UMIDADE ÓTIMA (%)', value: layer.optimalHumidity },
                  { title: 'ENERGIA DE COMPACTAÇÃO', value: layer.compressionEnergy },
                ], '1fr 1fr 1fr')}
              </FlexColumnBorder>

              <Box sx={{ paddingTop: '1rem' }}>
                <FlexColumnBorder title="MÓDULO DE RESILIÊNCIA" open={true} theme={'#07B811'}>
                  {renderFields([
                    { title: 'k1', value: layer.k1 },
                    { title: 'k2', value: layer.k2 },
                    { title: 'k3', value: layer.k3 },
                    { title: 'k4', value: layer.k4 },
                  ], '1fr 1fr 1fr 1fr')}
                </FlexColumnBorder>
              </Box>

              <Box sx={{ paddingTop: '1rem' }}>
                <FlexColumnBorder title="DEFORMAÇÃO PERMANENTE" open={true} theme={'#07B811'}>
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

        {/* OBSERVAÇÕES */}
        {samples?.step2Data?.observations && (
          <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
            <FlexColumnBorder title="OBSERVAÇÕES" open={true} theme={'#07B811'}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black', textAlign: 'center' }}>
                {samples.step2Data.observations}
              </Typography>
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

export default SpecificSample_GranularLayers;