import samplesService from '@/services/promedina/granular-layers/granular-layers-view.service';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { Box, Button, Typography } from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NextIcon } from '@/assets';
import Loading from '@/components/molecules/loading';

const SpecificSample_GranularLayers = () => {
  const [samples, setSamples] = useState<any>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const query = router.query as any;

  useEffect(() => {
    console.log('🚀 ~ samples:', samples);
  }, [samples]);

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

    fetchData();
  }, [query.id]);

  const columns: GridColDef[] = [
    { field: 'layer', headerName: t('materials.template.layer') },
    { field: 'material', headerName: t('pm.binderAsphaltConcrete.material') },
    { field: 'thickness', headerName: t('pm.binderAsphaltConcrete.thickness') },
  ];

  const rows = samples?.step2Data.structuralComposition.map((item, index) => ({
    id: index,
    layer: item.layer,
    material: item.material,
    thickness: `${item.thickness} mm`,
  }));

  const generalDataFieldKeys = ['name', 'zone', 'layer', 'cityState', 'highway', 'guideLineSpeed', 'observations'];

  const generalData = generalDataFieldKeys.map((key) => ({
    title: t(`pm.granularLayer.${key}`),
    value: key === 'guideLineSpeed' ? `${samples?.generalData[key]} km/h` : samples?.generalData[key],
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

  const pavimentData = pavimentDataFieldKeys.map((key) => ({
    title: t(`pm.granularLayer.${key}`),
    value:
      key === 'averageAltitude' || key === 'trackWidth' ? `${samples?.step2Data[key]} m` : `${samples?.step2Data[key]}`,
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
  console.log("🚀 ~ techData ~ techData:", techData)

  const fatigueFields = [
    { title: t('pm.granularLayer.k1.psi1'), key: 'fatiguek1psi1' },
    { title: t('pm.granularLayer.k2.psi2'), key: 'fatiguek2psi2' },
    { title: t('pm.granularLayer.mf.observations'), key: 'observations' },
  ];

  const materialFatigue = fatigueFields.map((field) => ({
    title: field.title,
    value: samples?.step3Data?.[field.key],
  }));

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
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
              marginTop: '1rem',
            }}
          >
            <FlexColumnBorder title={t('pm.general.data')} open={true} theme={'#07B811'}>
              <Box
                sx={{
                  display: { mobile: 'flex', notebook: 'grid' },
                  flexDirection: 'column',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                  justifyContent: 'space-evenly',
                }}
              >
                {generalData.map((item, idx) => (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' }} key={idx}>
                    <>
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
                    </>
                  </Box>
                ))}
              </Box>
            </FlexColumnBorder>
            {/** DADOS DO PAVIMENTO NO QUAL O MATERIAL ESTÁ INSERIDO */}
            <FlexColumnBorder
              title={t('pm.paviment.data')}
              open={true}
              theme={'#07B811'}
              sx_title={{ whiteSpace: 'wrap' }}
            >
              <Box
                sx={{
                  display: { mobile: 'flex', notebook: 'grid' },
                  flexDirection: 'column',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                  justifyContent: 'space-evenly',
                }}
              >
                {pavimentData.map((item, idx) => (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' }} key={idx}>
                    {item.value !== undefined && (
                      <>
                        <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                          {item.title}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography sx={{ display: 'flex', fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                            {item.value === undefined || item.value === null || item.value === 'null' ? '-' : item.value}
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            </FlexColumnBorder>
            {/**  PREPARO DO PAVIMENTO */}
            <FlexColumnBorder title={t('pm.paviment.preparation')} open={true} theme={'#07B811'}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                  justifyContent: 'space-evenly',
                  marginBottom: '0.5rem',
                }}
              >
                {pavimentPreparation.map((item, idx) => (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' }} key={idx}>
                    <>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                        {item.title}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ display: 'flex', fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                          {item.value === null ? '-' : item.value}
                        </Typography>
                      </Box>
                    </>
                  </Box>
                ))}
              </Box>
            </FlexColumnBorder>

            {/** DADOS TÉCNICOS DA AMOSTRA */}
            <FlexColumnBorder title={t('pm.sample-data')} open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: { mobile: 'flex', notebook: 'grid' },
                  flexDirection: 'column',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                  justifyContent: 'space-evenly',
                  marginBottom: '0.5rem',
                }}
              >
                {techData.map((item, idx) => (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' }} key={idx}>
                    <>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                        {item.title}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ display: 'flex', fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                          {item.value === null ? '-' : item.value}
                        </Typography>
                      </Box>
                    </>
                  </Box>
                ))}
              </Box>
            </FlexColumnBorder>

            {/** DEFORMAÇÃO PERMANENTE */}
            <FlexColumnBorder title={t('pm.permanent.deformation')} open={true} theme={'#07B811'}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                  justifyContent: 'space-evenly',
                  marginBottom: '0.5rem',
                }}
              >
                {permanentDeformation.map((item, idx) => (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' }} key={idx}>
                    <>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                        {item.title}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ display: 'flex', fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                          {item.value === null ? '-' : item.value}
                        </Typography>
                      </Box>
                    </>
                  </Box>
                ))}
              </Box>
            </FlexColumnBorder>
            {/**  MÓDULO DE RESILIÊNCIA */}
            <FlexColumnBorder title={t('pm.resilience.module')} open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                  justifyContent: 'space-evenly',
                  marginBottom: '0.5rem',
                }}
              >
                {resilienceModule.map((item, idx) => (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' }} key={idx}>
                    <>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                        {item.title}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ display: 'flex', fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                          {item.value === null ? '-' : item.value}
                        </Typography>
                      </Box>
                    </>
                  </Box>
                ))}
              </Box>
            </FlexColumnBorder>

            {/** COMPOSIÇÃO ESTRUTURAL  */}
            <FlexColumnBorder title={t('pm.structural.composition')} open={true} theme={'#07B811'}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <div style={{ height: 'fit-content', width: '100%' }}>
                  {rows !== undefined && (
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
              <Box sx={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 'bold', marginTop: '0.5rem', color: 'black' }}>
                  {t('pm-image-structural-composition')}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { mobile: 'column', desktop: 'row' },
                    gap: '1rem',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={samples?.step2Data.images}
                    alt={t('pm-image-structural-composition')}
                    width={'250px'}
                    height={'250px'}
                  />
                </Box>
                <Typography sx={{ color: 'gray' }}>{t('pm-estructural-composition-image-date')}</Typography>
                <Typography sx={{ color: 'black' }}>{samples?.step2Data.imagesDate}</Typography>
              </Box>
            </FlexColumnBorder>
          </Box>

          {/** FOOTER */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: { mobile: '4vh 4vw', notebook: '3vh 6vw' },
            }}
          >
            <a
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
            </a>

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
        </Box>
      )}
    </>
  );
};

export default SpecificSample_GranularLayers;
