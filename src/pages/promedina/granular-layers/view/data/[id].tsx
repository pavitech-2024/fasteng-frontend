import samplesService from '@/services/promedina/granular-layers/granular-layers-view.service';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { Box, Button, Typography } from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NextIcon } from '@/assets';
import Loading from '@/components/molecules/loading';
import Link from 'next/link';
import GeneratePDF_ProMedina from '@/components/generatePDF/promedina/granularLayers/generatePDF.promedina';

const SpecificSample_GranularLayers = () => {
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
        // Formato NOVO: generalData contém 'tipoSecao', 'faseMonitoramento', 'roadName', 'liberacaoTrafico'
        // Formato ANTIGO: generalData contém 'name', 'zone', 'layer', 'cityState', 'highway'
        const hasNewFields =
          data?.generalData?.tipoSecao !== undefined ||
          data?.generalData?.faseMonitoramento !== undefined ||
          data?.generalData?.roadName !== undefined ||
          data?.generalData?.liberacaoTrafico !== undefined;

        const hasLegacyFields =
          data?.generalData?.name !== undefined ||
          data?.generalData?.zone !== undefined ||
          data?.generalData?.layer !== undefined ||
          data?.generalData?.highway !== undefined;

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
  const renderFields = (fields: { title: string; value: any }[], cols = '1fr 1fr 1fr 1fr') => {
    const validFields = fields.filter((item) => item.value !== undefined && item.value !== null && item.value !== '');
    if (validFields.length === 0) return null;

    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: cols },
          justifyItems: 'center',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        {validFields.map((item, idx) => (
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
              {item.title}
            </Typography>
            <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  // ==================== RENDER NOVA VERSÃO ====================
  const renderNewView = () => {
    const structuralRows =
      samples?.generalData?.structuralComposition?.map((item: any, index: number) => ({
        id: index,
        layer: item.layer || '-',
        material: item.material || '-',
        thickness: item.thickness ? `${item.thickness} mm` : '-',
      })) || [];

    const layers = samples?.step2Data?.layers || [];

    return (
      <>
        {/* IDENTIFICAÇÃO */}
        <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
          <FlexColumnBorder title="IDENTIFICAÇÃO" open={true} theme={'#0c4d0f'}>
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
          <FlexColumnBorder title="PREPARO DO PAVIMENTO" open={true} theme={'#0c4d0f'}>
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
          <FlexColumnBorder title="DATA DA ÚLTIMA ATUALIZAÇÃO" open={true} theme={'#0c4d0f'}>
            {renderFields([
              { title: 'DATA DA ÚLTIMA ATUALIZAÇÃO', value: samples?.generalData?.lastUpdate },
              { title: 'TEMPO EM SERVIÇO (ANOS)', value: samples?.generalData?.serviceTimeYears },
              { title: 'TEMPO EM SERVIÇO (MESES)', value: samples?.generalData?.serviceTimeMonths },
            ], '1fr 1fr')}
          </FlexColumnBorder>
        </Box>

        {/* CARACTERÍSTICAS */}
        <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
          <FlexColumnBorder title="CARACTERÍSTICAS" open={true} theme={'#0c4d0f'}>
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
          <FlexColumnBorder title="COORDENADAS" open={true} theme={'#0c4d0f'}>
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
            <FlexColumnBorder title="COMPOSIÇÃO ESTRUTURAL" open={true} theme={'#0c4d0f'}>
              <DataGrid
                rows={structuralRows}
                hideFooter
                disableColumnMenu
                disableColumnFilter
                columns={columns}
                sx={{ borderRadius: '10px' }}
              />
              {samples?.generalData?.images && (
                <Box
                  sx={{
                    marginTop: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <Typography sx={{ fontWeight: 'bold', color: 'black' }}>
                    IMAGEM DA COMPOSIÇÃO ESTRUTURAL
                  </Typography>
                  <img
                    src={samples.generalData.images}
                    alt="Estrutura"
                    width="250px"
                    height="250px"
                    style={{ borderRadius: '8px' }}
                  />
                  <Typography sx={{ color: 'gray' }}>DATA DA IMAGEM</Typography>
                  <Typography sx={{ color: 'black' }}>
                    {samples?.generalData?.imagesDate || '-'}
                  </Typography>
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
            <Box
              key={layer.id || index}
              sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}
            >
              <FlexColumnBorder
                title={`GRUPO MCT${layers.length > 1 ? ` - CAMADA ${index + 1}` : ''}`}
                open={true}
                theme={'#0c4d0f'}
              >
                {renderFields(
                  [
                    { title: "COEFICIENTE c'", value: layer.mctCoefficientC },
                    { title: "ÍNDICE e'", value: layer.mctIndexE },
                    { title: 'MASSA ESPECÍFICA (g/cm³)', value: layer.especificMass },
                    { title: 'UMIDADE ÓTIMA (%)', value: layer.optimalHumidity },
                    { title: 'ENERGIA DE COMPACTAÇÃO', value: layer.compressionEnergy },
                  ],
                  '1fr 1fr 1fr'
                )}
              </FlexColumnBorder>

              <Box sx={{ paddingTop: '1rem' }}>
                <FlexColumnBorder title="MÓDULO DE RESILIÊNCIA" open={true} theme={'#0c4d0f'}>
                  {renderFields(
                    [
                      { title: 'k1', value: layer.k1 },
                      { title: 'k2', value: layer.k2 },
                      { title: 'k3', value: layer.k3 },
                      { title: 'k4', value: layer.k4 },
                    ],
                    '1fr 1fr 1fr 1fr'
                  )}
                </FlexColumnBorder>
              </Box>

              <Box sx={{ paddingTop: '1rem' }}>
                <FlexColumnBorder title="DEFORMAÇÃO PERMANENTE" open={true} theme={'#0c4d0f'}>
                  {renderFields(
                    [
                      { title: 'k1/psi', value: layer.k1psi1 },
                      { title: 'k2/psi', value: layer.k2psi2 },
                      { title: 'k3/psi', value: layer.k3psi3 },
                      { title: 'k4/psi', value: layer.k4psi4 },
                    ],
                    '1fr 1fr 1fr 1fr'
                  )}
                </FlexColumnBorder>
              </Box>
            </Box>
          );
        })}

        {/* OBSERVAÇÕES */}
        {samples?.step2Data?.observations && (
          <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
            <FlexColumnBorder title="OBSERVAÇÕES" open={true} theme={'#0c4d0f'}>
              <Typography
                sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black', textAlign: 'center' }}
              >
                {samples.step2Data.observations}
              </Typography>
            </FlexColumnBorder>
          </Box>
        )}
      </>
    );
  };

  // ==================== RENDER LEGACY (VERSÃO ANTIGA) ====================
  const renderLegacyView = () => {
    const sections = [
      'first-section',
      'pavement-data',
      'pavement-preparation',
      'technical-data',
      'permanent-deformation',
      'resilience-module',
      'structural-composition',
    ];

    const rows =
      samples?.step2Data?.structuralComposition?.map((item: any, index: number) => ({
        id: index,
        layer: item.layer,
        material: item.material,
        thickness: `${item.thickness} mm`,
      })) || [];

    const generalDataFieldKeys = [
      'name',
      'zone',
      'layer',
      'cityState',
      'highway',
      'guideLineSpeed',
      'observations',
    ];

    const generalData = generalDataFieldKeys.map((key) => ({
      title: t(`pm.granularLayer.${key}`),
      value:
        key === 'guideLineSpeed'
          ? `${samples?.generalData[key]} km/h`
          : samples?.generalData[key],
    }));

    const pavimentDataFieldKeys = [
      'sectionType',
      'extension',
      'identification',
      'initialStakeMeters',
      'finalStakeMeters',
      'latitudeI',
      'longitudeI',
      'latitudeF',
      'longitudeF',
      'averageAltitude',
      'monitoringPhase',
      'trackWidth',
      'monitoredTrack',
      'numberOfTracks',
      'trafficLiberation',
      'observation',
    ];

    const pavimentData = pavimentDataFieldKeys
      .filter((key) => samples?.step2Data?.[key] !== undefined)
      .map((key) => ({
        title: t(`pm.granularLayer.${key}`),
        value:
          key === 'averageAltitude' || key === 'trackWidth' || key === 'extension'
            ? `${samples?.step2Data[key]} m`
            : `${samples?.step2Data[key]}`,
      }));

    const preparationFields = [
      { title: t('pm.granularLayer.milling'), key: 'milling' },
      { title: t('pm.granularLayer.intervention.at.the.base'), key: 'interventionAtTheBase' },
      { title: 'SAMI', key: 'sami' },
      { title: t('pm.granularLayer.bonding.paint'), key: 'bondingPaint' },
      { title: t('pm.granularLayer.priming'), key: 'priming' },
    ];

    const pavimentPreparation = preparationFields.map((field) => ({
      title: field.title,
      value: samples?.step2Data?.[field.key],
    }));

    const resilienceModuleFields = [
      { title: 'k1', key: 'k1' },
      { title: 'k2', key: 'k2' },
      { title: 'k3', key: 'k3' },
      { title: 'k4', key: 'k4' },
    ];

    const resilienceModule = resilienceModuleFields.map((field) => ({
      title: field.title,
      value: samples?.step3Data?.[field.key],
    }));

    const deformationFields = [
      { title: t('pm.granularLayer.k1.psi1'), key: 'k1psi1' },
      { title: t('pm.granularLayer.k2.psi2'), key: 'k2psi2' },
      { title: t('pm.granularLayer.k3.psi3'), key: 'k3psi3' },
      { title: t('pm.granularLayer.k4.psi4'), key: 'k4psi4' },
      { title: t('pm.granularLayer.mf.observations'), key: 'observations' },
    ];

    const permanentDeformation = deformationFields.map((field) => ({
      title: field.title,
      value: samples?.step3Data?.[field.key],
    }));

    const techFields = [
      { title: t('pm.granularLayer.mctGroup'), key: 'mctGroup' },
      { title: t('pm.granularLayer.mctCoefficientC'), key: 'mctCoefficientC' },
      { title: t('pm.granularLayer.mctIndexE'), key: 'mctIndexE' },
      { title: t('pm.granularLayer.specificMass'), key: 'especificMass' },
      { title: t('pm.granularLayer.compressionEnergy'), key: 'compressionEnergy' },
      { title: t('pm.granularLayer.granulometric.range'), key: 'granulometricRange' },
      { title: t('pm.granularLayer.optimal.humidity'), key: 'optimalHumidity' },
      { title: t('pm.granularLayer.abrasionLA'), key: 'abrasionLA' },
      { title: t('pm.granularLayer.mf.observations'), key: 'observations' },
    ];

    const techData = techFields.map((field) => ({
      title: field.title,
      value: samples?.step3Data?.[field.key],
    }));

    return (
      <>
        <GeneratePDF_ProMedina sample={samples} sections={sections} />

        {/* DADOS GERAIS */}
        <Box id="first-section" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
          <FlexColumnBorder title={t('pm.general.data')} open={true} theme={'#0c4d0f'}>
            <Box
              sx={{
                display: { mobile: 'flex', notebook: 'grid' },
                flexDirection: 'column',
                gridTemplateColumns: {
                  mobile: '1fr',
                  tablet: '1fr 1fr',
                  desktop: '1fr 1fr 1fr 1fr',
                },
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
                      sx={{
                        display: 'flex',
                        fontWeight: 'bold',
                        fontSize: { mobile: '13px', notebook: '14px' },
                        color: 'black',
                      }}
                    >
                      {item.value === null ? '-' : item.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </FlexColumnBorder>
        </Box>

        {/* DADOS DO PAVIMENTO */}
        <Box id="pavement-data" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
          <FlexColumnBorder
            title={t('pm.paviment.data')}
            open={true}
            theme={'#0c4d0f'}
            sx_title={{ whiteSpace: 'wrap' }}
          >
            <Box
              sx={{
                display: { mobile: 'flex', notebook: 'grid' },
                flexDirection: 'column',
                gridTemplateColumns: {
                  mobile: '1fr',
                  tablet: '1fr 1fr',
                  desktop: '1fr 1fr 1fr 1fr 1fr',
                },
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
                  {item.value !== undefined && (
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
                            color: 'black',
                          }}
                        >
                          {item.value === undefined ||
                          item.value === null ||
                          item.value === 'null'
                            ? '-'
                            : item.value}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
              ))}
            </Box>
          </FlexColumnBorder>
        </Box>

        {/* PREPARO DO PAVIMENTO */}
        <Box
          id="pavement-preparation"
          sx={{ paddingTop: '1rem', paddingX: '6rem' }}
          className="third-section"
        >
          <FlexColumnBorder
            title={t('pm.paviment.preparation')}
            open={true}
            theme={'#0c4d0f'}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  mobile: '1fr',
                  tablet: '1fr 1fr',
                  desktop: '1fr 1fr 1fr 1fr 1fr',
                },
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
                  <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                    {item.title}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      sx={{
                        display: 'flex',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        color: 'black',
                      }}
                    >
                      {item.value === null ? '-' : item.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </FlexColumnBorder>
        </Box>

        {/* DADOS TÉCNICOS DA AMOSTRA */}
        <Box
          id="technical-data"
          sx={{ paddingTop: '1rem', paddingX: '6rem' }}
          className="fourth-section"
        >
          <FlexColumnBorder
            title={t('pm.sample-data')}
            open={true}
            theme={'#0c4d0f'}
            sx_title={{ whiteSpace: 'wrap' }}
          >
            <Box
              sx={{
                display: { mobile: 'flex', notebook: 'grid' },
                flexDirection: 'column',
                gridTemplateColumns: {
                  mobile: '1fr',
                  tablet: '1fr 1fr',
                  desktop: '1fr 1fr 1fr 1fr',
                },
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
                  <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                    {item.title}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      sx={{
                        display: 'flex',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        color: 'black',
                      }}
                    >
                      {item.value === null ? '-' : item.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </FlexColumnBorder>
        </Box>

        {/* DEFORMAÇÃO PERMANENTE */}
        <Box id="permanent-deformation" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
          <FlexColumnBorder
            title={t('pm.permanent.deformation')}
            open={true}
            theme={'#0c4d0f'}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  mobile: '1fr',
                  tablet: '1fr 1fr',
                  desktop: '1fr 1fr 1fr 1fr',
                },
                justifyItems: 'center',
                alignItems: 'center',
                gap: '1rem',
                justifyContent: 'space-evenly',
                marginBottom: '0.5rem',
              }}
            >
              {permanentDeformation.map((item, idx) => (
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
                      sx={{
                        display: 'flex',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        color: 'black',
                      }}
                    >
                      {item.value === null ? '-' : item.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </FlexColumnBorder>
        </Box>

        {/* MÓDULO DE RESILIÊNCIA */}
        <Box id="resilience-module" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
          <FlexColumnBorder
            title={t('pm.granularLayers.resilience.module')}
            open={true}
            theme={'#0c4d0f'}
            sx_title={{ whiteSpace: 'wrap' }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  mobile: '1fr',
                  tablet: '1fr 1fr',
                  desktop: '1fr 1fr 1fr 1fr',
                },
                justifyItems: 'center',
                alignItems: 'center',
                gap: '1rem',
                justifyContent: 'space-evenly',
                marginBottom: '0.5rem',
              }}
            >
              {resilienceModule.map((item, idx) => (
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
                      sx={{
                        display: 'flex',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        color: 'black',
                      }}
                    >
                      {item.value === null ? '-' : item.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </FlexColumnBorder>
        </Box>

        {/* COMPOSIÇÃO ESTRUTURAL */}
        <Box id="structural-composition" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
          <FlexColumnBorder
            title={t('pm.structural.composition')}
            open={true}
            theme={'#0c4d0f'}
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
                {rows.length > 0 && (
                  <DataGrid
                    rows={rows}
                    hideFooter
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
            {samples?.step2Data?.images && (
              <Box
                sx={{
                  marginBottom: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                  marginTop: '1rem',
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
                    border: '2px solid #0c4d0f',
                    borderRadius: '10px',
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                  }}
                >
                  <img
                    src={samples?.step2Data.images}
                    alt={t('pm-image-structural-composition')}
                    width={'250px'}
                    height={'250px'}
                    style={{ borderRadius: '8px' }}
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
            href="/promedina/granular-layers/view"
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
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        marginTop: '3rem',
      }}
    >
      <Box
        sx={{
          width: { mobile: '90%', notebook: '80%' },
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
//
export default SpecificSample_GranularLayers;