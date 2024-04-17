import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import samplesService from '@/services/promedina/binder-asphalt-concrete/binder-asphalt-concrete-view.service';
import { Box, Button, Typography } from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NextIcon } from '@/assets';
import Loading from '@/components/molecules/loading';
import Link from 'next/link';

const SpecificSample_BinderAsphaltConcrete = () => {
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

  const fieldKeys = ['name', 'zone', 'layer', 'cityState', 'highway', 'guideLineSpeed', 'observations'];

  const generalData = fieldKeys.map((key) => ({
    title: t(`pm.granularLayer.${key}`),
    value: key === 'guideLineSpeed' ? `${samples?.generalData[key]} km/h` : samples?.generalData[key],
  }));

  const pavimentFields = [
    { title: t('pm-type-of-section'), key: 'sectionType' },
    { title: t('pm.binderAsphaltConcrete.extension'), key: 'extension' },
    { title: t('pm.binderAsphaltConcrete.identification'), key: 'identification' },
    { title: t('pm.binderAsphaltConcrete.initialStakeMeters'), key: 'initialStakeMeters' },
    { title: t('pm.binderAsphaltConcrete.finalStakeMeters'), key: 'finalStakeMeters' },
    { title: t('pm.binderAsphaltConcrete.latitudeI'), key: 'latitudeI' },
    { title: t('pm.binderAsphaltConcrete.longitudeI'), key: 'longitudeI' },
    { title: t('pm.binderAsphaltConcrete.latitudeF'), key: 'latitudeF' },
    { title: t('pm.binderAsphaltConcrete.longitudeF'), key: 'longitudeF' },
    { title: t('pm.binderAsphaltConcrete.averageAltitude'), key: 'averageAltitude' },
    { title: t('pm.binderAsphaltConcrete.monitoring.phase'), key: 'monitoringPhase' },
    { title: t('pm.binderAsphaltConcrete.trackWidth'), key: 'trackWidth' },
    { title: t('pm.binderAsphaltConcrete.monitoredTrack'), key: 'monitoredTrack' },
    { title: t('pm.binderAsphaltConcrete.numberOfTracks'), key: 'numberOfTracks' },
    { title: t('pm.binderAsphaltConcrete.trafficLiberation'), key: 'trafficLiberation' },
    { title: t('pm.binderAsphaltConcrete.mf.observations'), key: 'observation' },
  ];

  const pavimentData = pavimentFields.map((field) => ({
    title: field.title,
    value:
      field.key === 'averageAltitude' ||
      field.key === 'trackWidth' ||
      field.key === 'numberOfTracks' ||
      field.key === 'trafficLiberation'  ||
      field.key === 'extension'
        ? `${samples?.step2Data[field.key]} m`
        : `${samples?.step2Data[field.key]}`,
  }));

  const fatigueCurveFields = [
    { title: 'N° CPs', key: 'fatigueCurve_n_cps' },
    { title: 'k1', key: 'fatigueCurve_k1' },
    { title: 'k2', key: 'fatigueCurve_k2' },
    { title: 'R²', key: 'fatigueCurve_r2' },
  ];

  const fadigueCurveCD = fatigueCurveFields.map((field) => ({
    title: field.title,
    value: samples?.step4Data?.[field.key],
  }));

  const pavimentPreparationFields = [
    { title: t('pm.binderAsphaltConcrete.milling'), key: 'milling' },
    { title: t('pm.binderAsphaltConcrete.intervention.at.the.base'), key: 'interventionAtTheBase' },
    { title: 'SAMI', key: 'sami' },
    { title: t('pm.binderAsphaltConcrete.bonding.paint'), key: 'bondingPaint' },
    { title: t('pm.binderAsphaltConcrete.priming'), key: 'priming' },
  ];

  const pavimentPreparation = pavimentPreparationFields.map((field) => ({
    title: field.title,
    value: samples?.step2Data?.[field.key],
  }));

  const brookfieldFields = [
    { title: t('pm.binderAsphaltConcrete.vb_sp21_20'), key: 'vb_sp21_20' },
    { title: t('pm.binderAsphaltConcrete.vb_sp21_50'), key: 'vb_sp21_50' },
    { title: t('pm.binderAsphaltConcrete.vb_sp21_100'), key: 'vb_sp21_100' },
    { title: t('pm.binderAsphaltConcrete.observations'), key: 'observations' },
  ];

  const brookfield = brookfieldFields.map((field) => ({
    title: field.title,
    value: samples?.step3Data?.[field.key],
  }));

  const sampleDataFields = [
    { title: t('pm.binderAsphaltConcrete.refinery'), key: 'refinery' },
    { title: t('pm.binderAsphaltConcrete.company'), key: 'company' },
    { title: t('pm.binderAsphaltConcrete.collectionDate'), key: 'collectionDate' },
    { title: t('pm.binderAsphaltConcrete.invoiceNumber'), key: 'invoiceNumber' },
    { title: t('pm.binderAsphaltConcrete.dataInvoice'), key: 'dataInvoice' },
    { title: t('pm.binderAsphaltConcrete.certificateDate'), key: 'certificateDate' },
    { title: t('pm.binderAsphaltConcrete.certificateNumber'), key: 'certificateNumber' },
    { title: t('pm.binderAsphaltConcrete.capType'), key: 'capType' },
    { title: t('pm.binderAsphaltConcrete.performanceGrade'), key: 'performanceGrade' },
    { title: t('pm.binderAsphaltConcrete.penetration'), key: 'penetration' },
    { title: t('pm.binderAsphaltConcrete.softeningPoint'), key: 'softeningPoint' },
    { title: t('pm.binderAsphaltConcrete.elasticRecovery'), key: 'elasticRecovery' },
  ];

  const sampleData = sampleDataFields.map((field) => ({
    title: field.title,
    value: samples?.step3Data?.[field.key],
  }));

  const techData = [
    'granulometricRange',
    'abrasionLA',
    'tmn',
    'volumeVoids',
    'rt',
    'flowNumber',
    'mr',
    'specificMass',
    'asphaltTenor',
  ].map((key) => ({
    title: t(`pm.binderAsphaltConcrete.${key}`),
    value: key.includes(key) ? samples?.step4Data?.[key] : samples?.step3Data?.[key],
  }));

  techData.push({
    title: t('pm.binderAsphaltConcrete.mf.observations'),
    value: samples?.step3Data?.observations,
  });

  const materialFatigue = ['k1psi1', 'k2psi2'].map((key) => ({
    title: t(`pm.binderAsphaltConcrete.${key.replace('psi', '.k')}`),
    value: samples?.step3Data?.[`fatigue${key}`],
  }));

  materialFatigue.push({
    title: t('pm.binderAsphaltConcrete.mf.observations'),
    value: samples?.step3Data?.observations,
  });

  const resilienceModuleKeys = ['rsInitial', 'rsFinal', 'constantA', 'constantB'];

  const resilienceModuleStabilized = resilienceModuleKeys.map((key) => ({
    title: t(`pm.binderAsphaltConcrete.${key.replace(/([A-Z])/g, '.$1').toLowerCase()}`),
    value: samples?.step3Data?.[key],
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
                              wordBreak: 'break-all',
                              whiteSpace: 'pre-wrap',
                              color: 'black',
                            }}
                          >
                            {item.value === null ? '-' : item.value}
                          </Typography>
                        </Box>
                      </>
                    )}
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
            <FlexColumnBorder
              title={t('pm.sample-data')}
              open={true}
              theme={'#07B811'}
              sx_title={{ whiteSpace: 'wrap' }}
            >
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

            {/** CURVA DE FADIGA À COMPRESSÃO DIAMETRAL */}
            <FlexColumnBorder
              title={t('pm.diametral.compression.fatigue.curve')}
              open={true}
              theme={'#07B811'}
              sx_title={{ whiteSpace: 'wrap' }}
            >
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
                {fadigueCurveCD.map((item, idx) => (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' }} key={idx}>
                    <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography sx={{ display: 'flex', fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                        {item.value === null ? '-' : item.value}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </FlexColumnBorder>

            {/** VISCOSIDADE BROOKFIELD */}
            <FlexColumnBorder title={t('pm.brookfield.viscosity')} open={true} theme={'#07B811'}>
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
                {brookfield.map((item, idx) => (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' }} key={idx}>
                    <>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                        {item.title}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ display: 'flex', fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                          {item.value === null || item.value === '' ? '-' : item.value}
                        </Typography>
                      </Box>
                    </>
                  </Box>
                ))}
              </Box>
            </FlexColumnBorder>

            {/** OUTRAS INFORMAÇÕES SOBRE O MATERIAL */}
            <FlexColumnBorder
              title={t('pm.sample-data')}
              open={true}
              theme={'#07B811'}
              sx_title={{ whiteSpace: 'wrap' }}
            >
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
                {sampleData.map((item, idx) => (
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
            <FlexColumnBorder
              title={t('pm.structural.composition')}
              open={true}
              theme={'#07B811'}
              sx_title={{ whiteSpace: 'wrap' }}
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
        </Box>
      )}
    </>
  );
};

export default SpecificSample_BinderAsphaltConcrete;
