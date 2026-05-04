import samplesService from '@/services/promedina/stabilized-layers/stabilized-layers-view.service';
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

const SpecificSample_StabilizedLayers = () => {
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
        // Formato ANTIGO: generalData contém 'name', 'zone', 'layer', 'cityState', 'highway'
        const hasNewFields =
          data?.generalData?.identification !== undefined ||
          data?.generalData?.tipoSecao !== undefined ||
          data?.generalData?.local !== undefined ||
          data?.generalData?.faseMonitoramento !== undefined;

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
    const validFields = fields.filter(
      (item) => item.value !== undefined && item.value !== null && item.value !== ''
    );
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

  const renderSection = (
    title: string,
    fields: { title: string; value: any }[],
    cols = '1fr 1fr 1fr 1fr'
  ) => {
    const hasData = fields.some((f) => f.value);
    if (!hasData) return null;
    return (
      <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
        <FlexColumnBorder
          title={title}
          open={true}
          theme={'#07B811'}
          sx_title={{ whiteSpace: 'wrap' }}
        >
          {renderFields(fields, cols)}
        </FlexColumnBorder>
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
        {renderSection(
          'DATA DA ÚLTIMA ATUALIZAÇÃO',
          [
            { title: 'DATA DA ÚLTIMA ATUALIZAÇÃO', value: samples?.generalData?.dataUltimaAtualizacao },
            { title: 'TEMPO EM SERVIÇO (ANOS)', value: samples?.generalData?.tempoServicoAnos },
            { title: 'TEMPO EM SERVIÇO (MESES)', value: samples?.generalData?.tempoServicoMeses },
          ],
          '1fr 1fr'
        )}

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
        {renderSection(
          'COORDENADAS',
          [
            { title: 'INÍCIO - ESTACA', value: samples?.generalData?.inicioEstaca },
            { title: 'INÍCIO - METROS', value: samples?.generalData?.inicioMetros },
            { title: 'LATITUDE INICIAL', value: samples?.generalData?.latitudeI },
            { title: 'LONGITUDE INICIAL', value: samples?.generalData?.longitudeI },
            { title: 'FIM - ESTACA', value: samples?.generalData?.fimEstaca },
            { title: 'FIM - METROS', value: samples?.generalData?.fimMetros },
            { title: 'LATITUDE FINAL', value: samples?.generalData?.latitudeF },
            { title: 'LONGITUDE FINAL', value: samples?.generalData?.longitudeF },
            { title: 'ALTITUDE MÉDIA (m)', value: samples?.generalData?.altitudeMedia },
          ],
          '1fr 1fr 1fr'
        )}

        {/* COMPOSIÇÃO ESTRUTURAL */}
        {structuralRows.length > 0 && (
          <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
            <FlexColumnBorder
              title="COMPOSIÇÃO ESTRUTURAL"
              open={true}
              theme={'#07B811'}
              sx_title={{ whiteSpace: 'wrap' }}
            >
              <DataGrid
                rows={structuralRows}
                hideFooter
                disableColumnMenu
                disableColumnFilter
                columns={columns}
                sx={{ borderRadius: '10px' }}
              />
              {samples?.generalData?.imagemEstrutural && (
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
                    src={samples.generalData.imagemEstrutural}
                    alt="Estrutura"
                    width="250px"
                    height="250px"
                    style={{ borderRadius: '8px' }}
                  />
                  <Typography sx={{ color: 'gray' }}>DATA DA IMAGEM</Typography>
                  <Typography sx={{ color: 'black' }}>
                    {samples?.generalData?.dataImagens || '-'}
                  </Typography>
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
            <Box
              key={layer.id || index}
              sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}
            >
              <FlexColumnBorder
                title={`PARÂMETROS DO MATERIAL${layers.length > 1 ? ` - CAMADA ${index + 1}` : ''}`}
                open={true}
                theme={'#07B811'}
                sx_title={{ whiteSpace: 'wrap' }}
              >
                {renderFields(
                  [
                    { title: 'TEOR ÓTIMO DE CIMENTO (%)', value: layer.teorCimento },
                    { title: 'RESISTÊNCIA À TRAÇÃO (MPa)', value: layer.rt },
                    { title: 'RTCD (MPa)', value: layer.rtcd },
                    { title: 'RCS (MPa)', value: layer.rcs },
                    { title: 'FAIXA GRANULOMÉTRICA', value: layer.faixaGranulometrica },
                    { title: 'MASSA ESPECÍFICA (g/cm³)', value: layer.massaEspecifica },
                    { title: 'UMIDADE ÓTIMA (%)', value: layer.umidadeOtima },
                    { title: 'ENERGIA DE COMPACTAÇÃO', value: layer.energiaCompactacao },
                  ],
                  '1fr 1fr 1fr'
                )}
              </FlexColumnBorder>

              <Box sx={{ paddingTop: '1rem' }}>
                <FlexColumnBorder
                  title="MÓDULO DE RESILIÊNCIA (MPa)"
                  open={true}
                  theme={'#07B811'}
                  sx_title={{ whiteSpace: 'wrap' }}
                >
                  {renderFields(
                    [
                      { title: 'Ei', value: layer.ei },
                      { title: 'Ef', value: layer.ef },
                      { title: 'CONSTANTE A', value: layer.constanteA },
                      { title: 'CONSTANTE B', value: layer.constanteB },
                    ],
                    '1fr 1fr 1fr 1fr'
                  )}
                </FlexColumnBorder>
              </Box>

              <Box sx={{ paddingTop: '1rem' }}>
                <FlexColumnBorder
                  title="FADIGA DO MATERIAL"
                  open={true}
                  theme={'#07B811'}
                  sx_title={{ whiteSpace: 'wrap' }}
                >
                  {renderFields(
                    [
                      { title: 'K1 (PSI1)', value: layer.k1 },
                      { title: 'K2 (PSI2)', value: layer.k2 },
                    ],
                    '1fr 1fr'
                  )}
                </FlexColumnBorder>
              </Box>
            </Box>
          );
        })}

        {/* OBSERVAÇÕES */}
        {samples?.step2Data?.observations && (
          <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
            <FlexColumnBorder
              title="OBSERVAÇÕES"
              open={true}
              theme={'#07B811'}
              sx_title={{ whiteSpace: 'wrap' }}
            >
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
      'general-data',
      'pavement-data',
      'pavement-preparation',
      'material-data',
      'material-fatigue',
      'permanent-deformation',
      'resilience-module-2',
      'diametrical-compression-fatigue-curve',
      'brookfield-viscosity',
      'other-info',
      'structural-composition',
    ];

    const rows =
      samples?.step2Data?.structuralComposition?.map((item: any, index: number) => ({
        id: index,
        layer: item.layer,
        material: item.material,
        thickness: `${item.thickness} mm`,
      })) || [];

    const fieldKeys = [
      'name',
      'zone',
      'layer',
      'cityState',
      'highway',
      'guideLineSpeed',
      'observations',
    ];

    const generalData = fieldKeys
      .filter((key) => samples?.generalData?.[key] !== undefined)
      .map((key) => ({
        title: t(`pm.granularLayer.${key}`),
        value:
          key === 'guideLineSpeed'
            ? `${samples?.generalData[key]} km/h`
            : samples?.generalData[key],
      }));

    const pavimentData = [
      { title: t('pm-type-of-section'), value: samples?.step2Data?.sectionType },
      { title: t('pm.binderAsphaltConcrete.extension'), value: `${samples?.step2Data?.extension} m` },
      { title: t('pm.binderAsphaltConcrete.identification'), value: samples?.step2Data?.identification },
      { title: t('pm.binderAsphaltConcrete.initial.stake.meters'), value: samples?.step2Data?.initialStakeMeters },
      { title: t('pm.binderAsphaltConcrete.final.stake.meters'), value: samples?.step2Data?.finalStakeMeters },
      { title: t('pm.binderAsphaltConcrete.latitudeI'), value: samples?.step2Data?.latitudeI },
      { title: t('pm.binderAsphaltConcrete.longitudeI'), value: samples?.step2Data?.longitudeI },
      { title: t('pm.binderAsphaltConcrete.latitudeF'), value: samples?.step2Data?.latitudeF },
      { title: t('pm.binderAsphaltConcrete.longitudeF'), value: samples?.step2Data?.longitudeF },
      { title: t('pm.granularLayer.averageAltitude'), value: `${samples?.step2Data?.averageAltitude} m` },
      { title: t('pm.binderAsphaltConcrete.monitoring.phase'), value: samples?.step2Data?.monitoringPhase },
      { title: t('pm.granularLayer.trackWidth'), value: `${samples?.step2Data?.trackWidth} m` },
      { title: t('pm.granularLayer.monitoredTrack'), value: `${samples?.step2Data?.monitoredTrack}` },
      { title: t('pm.granularLayer.numberOfTracks'), value: `${samples?.step2Data?.numberOfTracks}` },
      { title: t('pm.granularLayer.trafficLiberation'), value: `${samples?.step2Data?.trafficLiberation}` },
      { title: t('pm.granularLayer.mf.observations'), value: samples?.step2Data?.observation },
    ];

    const fadigueCurveCD = [
      { title: 'N° CPs', value: samples?.Step4Data?.fatigueCurve_n_cps },
      { title: 'k1', value: samples?.Step4Data?.fatigueCurve_k1 },
      { title: 'k2', value: samples?.Step4Data?.fatigueCurve_k2 },
      { title: 'R²', value: samples?.Step4Data?.fatigueCurve_r2 },
    ];

    const pavimentPreparation = [
      { title: t('pm.binderAsphaltConcrete.milling'), value: samples?.step2Data?.milling },
      { title: t('pm.binderAsphaltConcrete.intervention.at.the.base'), value: samples?.step2Data?.interventionAtTheBase },
      { title: 'SAMI', value: samples?.step2Data?.sami },
      { title: t('pm.binderAsphaltConcrete.bonding.paint'), value: samples?.step2Data?.bondingPaint },
      { title: t('pm.binderAsphaltConcrete.priming'), value: samples?.step2Data?.priming },
    ];

    const brookfield = [
      { title: t('pm.binderAsphaltConcrete.vb_sp21_20'), value: samples?.step3Data?.vb_sp21_20 },
      { title: t('pm.binderAsphaltConcrete.vb_sp21_50'), value: samples?.step3Data?.vb_sp21_50 },
      { title: t('pm.binderAsphaltConcrete.vb_sp21_100'), value: samples?.step3Data?.vb_sp21_100 },
      { title: t('pm.binderAsphaltConcrete.observations'), value: samples?.step3Data?.observations },
    ];

    const sampleData = [
      { title: t('pm.binderAsphaltConcrete.refinery'), value: samples?.step3Data?.refinery },
      { title: t('pm.binderAsphaltConcrete.company'), value: samples?.step3Data?.company },
      { title: t('pm.binderAsphaltConcrete.collectionDate'), value: samples?.step3Data?.collectionDate },
      { title: t('pm.binderAsphaltConcrete.invoiceNumber'), value: samples?.step3Data?.invoiceNumber },
      { title: t('pm.binderAsphaltConcrete.dataInvoice'), value: samples?.step3Data?.dataInvoice },
      { title: t('pm.binderAsphaltConcrete.certificateDate'), value: samples?.step3Data?.certificateDate },
      { title: t('pm.binderAsphaltConcrete.certificateNumber'), value: samples?.step3Data?.certificateNumber },
      { title: t('pm.binderAsphaltConcrete.capType'), value: samples?.step3Data?.capType },
      { title: t('pm.binderAsphaltConcrete.performanceGrade'), value: samples?.step3Data?.performanceGrade },
      { title: t('pm.binderAsphaltConcrete.penetration'), value: samples?.step3Data?.penetration },
      { title: t('pm.binderAsphaltConcrete.softeningPoint'), value: samples?.step3Data?.softeningPoint },
      { title: t('pm.binderAsphaltConcrete.elasticRecovery'), value: samples?.step3Data?.elasticRecovery },
    ];

    const resilienceModule = [
      { title: 'k1', value: samples?.step3Data?.k1 },
      { title: 'k2', value: samples?.step3Data?.k2 },
      { title: 'k3', value: samples?.step3Data?.k3 },
      { title: 'R²', value: samples?.step3Data?.r2 },
    ];

    const permanentDeformation = [
      { title: t('pm.granularLayer.k1.psi1'), value: samples?.step3Data?.k1psi1 },
      { title: t('pm.granularLayer.k2.psi2'), value: samples?.step3Data?.k2psi2 },
      { title: t('pm.granularLayer.k3.psi3'), value: samples?.step3Data?.k3psi3 },
      { title: t('pm.granularLayer.k4.psi4'), value: samples?.step3Data?.k4psi4 },
      { title: t('pm.granularLayer.mf.observations'), value: samples?.step3Data?.observations },
    ];

    const techData = [
      { title: t('pm.granularLayer.mctGroup'), value: samples?.step3Data?.mctGroup },
      { title: t('pm.granularLayer.mctCoefficientC'), value: samples?.step3Data?.mctGroupmctCoefficientC },
      { title: t('pm.granularLayer.mctIndexE'), value: samples?.step3Data?.mctIndexE },
      { title: t('pm.granularLayer.especific.mass'), value: samples?.step3Data?.especificMass },
      { title: t('pm.granularLayer.compressionEnergy'), value: samples?.step3Data?.compressionEnergy },
      { title: t('pm.granularLayer.granulometric.range'), value: samples?.step3Data?.granulometricRange },
      { title: t('pm.granularLayer.optimal.humidity'), value: samples?.step3Data?.optimalHumidity },
      { title: t('pm.granularLayer.abrasionLA'), value: samples?.step3Data?.abrasionLA },
      { title: t('pm.granularLayer.mf.observations'), value: samples?.step3Data?.observations },
      { title: t('pm.binderAsphaltConcrete.tmn'), value: samples?.step4Data?.tmn },
      { title: t('pm.binderAsphaltConcrete.volumeVoids'), value: samples?.step4Data?.volumeVoids },
      { title: t('pm.binderAsphaltConcrete.rt'), value: samples?.step4Data?.rt },
      { title: t('pm.binderAsphaltConcrete.flowNumber'), value: samples?.step4Data?.flowNumber },
      { title: t('pm.binderAsphaltConcrete.mr'), value: samples?.step4Data?.mr },
      { title: t('pm.binderAsphaltConcrete.specificMass'), value: samples?.step4Data?.specificMass },
      { title: t('pm.binderAsphaltConcrete.asphaltTenor'), value: samples?.step4Data?.asphaltTenor },
      { title: t('pm.binderAsphaltConcrete.stabilizer'), value: samples?.step4Data?.asphaltTenor },
      { title: t('pm.binderAsphaltConcrete.tenor'), value: samples?.step4Data?.asphaltTenor },
      { title: t('pm.binderAsphaltConcrete.rtcd'), value: samples?.step4Data?.asphaltTenor },
      { title: t('pm.binderAsphaltConcrete.rtf'), value: samples?.step4Data?.asphaltTenor },
      { title: t('pm.binderAsphaltConcrete.rcs'), value: samples?.step4Data?.asphaltTenor },
    ];

    const materialData = [
      { title: t('pm.granularLayer.mf.stabilizer'), value: samples?.step3Data?.stabilizer },
      { title: t('pm.granularLayer.mf.tenor'), value: samples?.step3Data?.tenor },
      { title: t('pm.granularLayer.mf.especificMass'), value: samples?.step3Data?.especificMass },
      { title: t('pm.granularLayer.mf.rtcd'), value: samples?.step3Data?.rtcd },
      { title: t('pm.granularLayer.mf.rtf'), value: samples?.step3Data?.rtf },
      { title: t('pm.granularLayer.mf.rcs'), value: samples?.step3Data?.rcs },
      { title: t('pm.granularLayer.mf.granulometricRange'), value: samples?.step3Data?.granulometricRange },
      { title: t('pm.granularLayer.mf.optimalHumidity'), value: samples?.step3Data?.optimalHumidity },
      { title: t('pm.granularLayer.mf.compressionEnergy'), value: samples?.step3Data?.compressionEnergy },
    ];

    const materialFatigue = [
      { title: t('pm.granularLayer.k1.psi1'), value: samples?.step3Data?.fatiguek1psi1 },
      { title: t('pm.granularLayer.k2.psi2'), value: samples?.step3Data?.fatiguek2psi2 },
      { title: t('pm.granularLayer.mf.observations'), value: samples?.step3Data?.observations },
    ];

    const resilienceModuleStabilized = [
      { title: t('pm.granularLayer.rs.initial'), value: samples?.step3Data?.rsInitial },
      { title: t('pm.granularLayer.rs.final'), value: samples?.step3Data?.rsFinal },
      { title: t('pm.granularLayer.constant.A'), value: samples?.step3Data?.constantA },
      { title: t('pm.granularLayer.constant.B'), value: samples?.step3Data?.constantB },
    ];

    return (
      <>
        <GeneratePDF_ProMedina sample={samples} sections={sections} />

        {/* DADOS GERAIS */}
        <Box id="general-data" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
          <FlexColumnBorder title={t('pm.general.data')} open={true} theme={'#07B811'}>
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
                            color: 'black',
                          }}
                        >
                          {item.value}
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
        <Box id="pavement-data" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
          <FlexColumnBorder
            title={t('pm.paviment.data')}
            open={true}
            theme={'#07B811'}
            sx_title={{ whiteSpace: 'wrap' }}
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
              }}
            >
              {pavimentData.map(
                (item, idx) =>
                  item.value && (
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
                          {item.value}
                        </Typography>
                      </Box>
                    </Box>
                  )
              )}
            </Box>
          </FlexColumnBorder>
        </Box>

        {/* PREPARO DO PAVIMENTO */}
        <Box id="pavement-preparation" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
          <FlexColumnBorder
            title={t('pm.paviment.preparation')}
            open={true}
            theme={'#07B811'}
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
              {pavimentPreparation.map(
                (item, idx) =>
                  item.value && (
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
                          {item.value}
                        </Typography>
                      </Box>
                    </Box>
                  )
              )}
            </Box>
          </FlexColumnBorder>
        </Box>

        {/* DADOS DO MATERIAL */}
        <Box id="material-data" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
          <FlexColumnBorder title={t('pm.material-data')} open={true} theme={'#07B811'}>
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
              {materialData.map(
                (item, idx) =>
                  item.value && (
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
                          {item.value}
                        </Typography>
                      </Box>
                    </Box>
                  )
              )}
            </Box>
          </FlexColumnBorder>
        </Box>

        {/* FADIGA DO MATERIAL */}
        <Box id="material-fatigue" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
          <FlexColumnBorder
            title={t('pm.material-permanentDeformation')}
            open={true}
            theme={'#07B811'}
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
              {materialFatigue.map(
                (item, idx) =>
                  item.value && (
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
                          {item.value}
                        </Typography>
                      </Box>
                    </Box>
                  )
              )}
            </Box>
          </FlexColumnBorder>
        </Box>

        {/* MÓDULO DE RESILIÊNCIA ESTABILIZADO */}
        <Box id="resilience-module" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
          <FlexColumnBorder
            title={t('pm.resilience.module')}
            open={true}
            theme={'#07B811'}
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
              {resilienceModuleStabilized.map(
                (item, idx) =>
                  item.value && (
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
                          {item.value}
                        </Typography>
                      </Box>
                    </Box>
                  )
              )}
            </Box>
          </FlexColumnBorder>
        </Box>

        {/* DADOS TÉCNICOS DA AMOSTRA */}
        <Box id="technical-data" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
          <FlexColumnBorder
            title={t('pm.sample-data')}
            open={true}
            theme={'#07B811'}
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
              {techData.map(
                (item, idx) =>
                  item.value && (
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
                          {item.value}
                        </Typography>
                      </Box>
                    </Box>
                  )
              )}
            </Box>
          </FlexColumnBorder>
        </Box>

        {/* DEFORMAÇÃO PERMANENTE */}
        <Box id="permanent-deformation" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
          <FlexColumnBorder
            title={t('pm.permanent.deformation')}
            open={true}
            theme={'#07B811'}
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
              {permanentDeformation.map(
                (item, idx) =>
                  item.value && (
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
                          {item.value}
                        </Typography>
                      </Box>
                    </Box>
                  )
              )}
            </Box>
          </FlexColumnBorder>
        </Box>

        {/* MÓDULO DE RESILIÊNCIA */}
        <Box id="resilience-module-2" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
          <FlexColumnBorder
            title={t('pm.resilience.module')}
            open={true}
            theme={'#07B811'}
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
              {resilienceModule.map(
                (item, idx) =>
                  item.value && (
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
                          {item.value}
                        </Typography>
                      </Box>
                    </Box>
                  )
              )}
            </Box>
          </FlexColumnBorder>
        </Box>

        {/* CURVA DE FADIGA À COMPRESSÃO DIAMETRAL */}
        <Box id="diametrical-compression-fatigue-curve" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
          <FlexColumnBorder
            title={t('pm.diametral.compression.fatigue.curve')}
            open={true}
            theme={'#07B811'}
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
              }}
            >
              {fadigueCurveCD.map(
                (item, idx) =>
                  item.value && (
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
                          {item.value}
                        </Typography>
                      </Box>
                    </Box>
                  )
              )}
            </Box>
          </FlexColumnBorder>
        </Box>

        {/* VISCOSIDADE BROOKFIELD */}
        <Box id="brookfield-viscosity" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
          <FlexColumnBorder
            title={t('pm.brookfield.viscosity')}
            open={true}
            theme={'#07B811'}
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
              {brookfield.map(
                (item, idx) =>
                  item.value && (
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
                          {item.value}
                        </Typography>
                      </Box>
                    </Box>
                  )
              )}
            </Box>
          </FlexColumnBorder>
        </Box>

        {/* OUTRAS INFORMAÇÕES SOBRE O MATERIAL */}
        <Box id="other-info" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
          <FlexColumnBorder
            title={t('pm.sample-data')}
            open={true}
            theme={'#07B811'}
            sx_title={{ whiteSpace: 'wrap' }}
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
              {sampleData.map(
                (item, idx) =>
                  item.value && (
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
                          {item.value}
                        </Typography>
                      </Box>
                    </Box>
                  )
              )}
            </Box>
          </FlexColumnBorder>
        </Box>

        {/* COMPOSIÇÃO ESTRUTURAL */}
        <Box id="structural-composition" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
          <FlexColumnBorder
            title={t('pm.structural.composition')}
            open={true}
            theme={'#07B811'}
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
                }}
              >
                <Typography
                  sx={{ fontWeight: 'bold', marginTop: '1rem', color: 'black' }}
                >
                  {t('pm-image-structural-composition')}
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
            href="/promedina/stabilized-layers/view"
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

export default SpecificSample_StabilizedLayers;