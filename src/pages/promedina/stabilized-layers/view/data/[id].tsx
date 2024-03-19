/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import samplesService from '@/services/promedina/stabilized-layers/stabilized-layers-view.service';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { Box, Button, Typography } from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NextIcon } from '@/assets';
import Loading from '@/components/molecules/loading';

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

  const generalData = [
    {
      title: t('pm.granularLayer.name'),
      value: samples?.generalData.name,
    },
    {
      title: t('pm.granularLayer.zone'),
      value: samples?.generalData.zone,
    },
    {
      title: t('pm.granularLayer.layer'),
      value: samples?.generalData.layer,
    },
    {
      title: t('pm.granularLayer.cityState'),
      value: samples?.generalData.cityState,
    },
    {
      title: t('pm.granularLayer.highway'),
      value: samples?.generalData.highway,
    },
    {
      title: t('pm.granularLayer.guideLineSpeed'),
      value: `${samples?.generalData.guideLineSpeed} Km/h`,
    },
    {
      title: t('pm.granularLayer.zone'),
      value: samples?.generalData.zone,
    },
    {
      title: t('pm.granularLayer.observations'),
      value: samples?.generalData.observations,
    },
  ];

  const pavimentData = [
    {
      title: t('pm-type-of-section'),
      value: samples?.step2Data.sectionType,
    },
    {
      title: t('pm.binderAsphaltConcrete.extension'),
      value: samples?.step2Data.extension,
    },
    {
      title: t('pm.binderAsphaltConcrete.identification'),
      value: samples?.step2Data.identification,
    },
    {
      title: t('pm.binderAsphaltConcrete.initial.stake.meters'),
      value: samples?.step2Data.initialStakeMeters,
    },
    {
      title: t('pm.binderAsphaltConcrete.final.stake.meters'),
      value: samples?.step2Data.finalStakeMeters,
    },
    {
      title: t('pm.binderAsphaltConcrete.latitudeI'),
      value: samples?.step2Data.latitudeI,
    },
    {
      title: t('pm.binderAsphaltConcrete.longitudeI'),
      value: samples?.step2Data.longitudeI,
    },
    {
      title: t('pm.binderAsphaltConcrete.latitudeF'),
      value: samples?.step2Data.latitudeF,
    },
    {
      title: t('pm.binderAsphaltConcrete.longitudeF'),
      value: samples?.step2Data.longitudeF,
    },
    {
      title: t('pm.granularLayer.averageAltitude'),
      value: `${samples?.step2Data.averageAltitude} m`,
    },
    {
      title: t('pm.binderAsphaltConcrete.monitoring.phase'),
      value: samples?.step2Data.monitoringPhase,
    },
    {
      title: t('pm.granularLayer.trackWidth'),
      value: `${samples?.step2Data.trackWidth} m`,
    },
    {
      title: t('pm.granularLayer.monitoredTrack'),
      value: `${samples?.step2Data.monitoredTrack}`,
    },
    {
      title: t('pm.granularLayer.numberOfTracks'),
      value: `${samples?.step2Data.numberOfTracks}`,
    },
    {
      title: t('pm.granularLayer.trafficLiberation'),
      value: `${samples?.step2Data.trafficLiberation}`,
    },
    {
      title: t('pm.granularLayer.mf.observations'),
      value: samples?.step2Data.observation,
    },
  ];

  const fadigueCurveCD = [
    {
      title: 'N° CPs',
      value: samples?.Step4Data?.fatigueCurve_n_cps,
    },
    {
      title: 'k1',
      value: samples?.Step4Data?.fatigueCurve_k1,
    },
    {
      title: 'k2',
      value: samples?.Step4Data?.fatigueCurve_k2,
    },
    {
      title: 'R²',
      value: samples?.Step4Data?.fatigueCurve_r2,
    },
  ];

  const pavimentPreparation = [
    {
      title: t('pm.binderAsphaltConcrete.milling'),
      value: samples?.step2Data?.milling,
    },
    {
      title: t('pm.binderAsphaltConcrete.intervention.at.the.base'),
      value: samples?.step2Data?.interventionAtTheBase,
    },
    {
      title: 'SAMI',
      value: samples?.step2Data?.sami,
    },
    {
      title: t('pm.binderAsphaltConcrete.bonding.paint'),
      value: samples?.step2Data?.bondingPaint,
    },
    {
      title: t('pm.binderAsphaltConcrete.priming'),
      value: samples?.step2Data?.priming,
    },
  ];

  const brookfield = [
    {
      title: t('pm.binderAsphaltConcrete.vb_sp21_20'),
      value: samples?.step3Data?.vb_sp21_20,
    },
    {
      title: t('pm.binderAsphaltConcrete.vb_sp21_50'),
      value: samples?.step3Data?.vb_sp21_50,
    },
    {
      title: t('pm.binderAsphaltConcrete.vb_sp21_100'),
      value: samples?.step3Data?.vb_sp21_100,
    },
    {
      title: t('pm.binderAsphaltConcrete.observations'),
      value: samples?.step3Data?.observations,
    },
  ];

  const sampleData = [
    {
      title: t('pm.binderAsphaltConcrete.refinery'),
      value: samples?.step3Data?.refinery,
    },
    {
      title: t('pm.binderAsphaltConcrete.company'),
      value: samples?.step3Data?.company,
    },
    {
      title: t('pm.binderAsphaltConcrete.collectionDate'),
      value: samples?.step3Data?.collectionDate,
    },
    {
      title: t('pm.binderAsphaltConcrete.invoiceNumber'),
      value: samples?.step3Data?.invoiceNumber,
    },
    {
      title: t('pm.binderAsphaltConcrete.dataInvoice'),
      value: samples?.step3Data?.dataInvoice,
    },
    {
      title: t('pm.binderAsphaltConcrete.certificateDate'),
      value: samples?.step3Data?.certificateDate,
    },
    {
      title: t('pm.binderAsphaltConcrete.certificateNumber'),
      value: samples?.step3Data?.certificateNumber,
    },
  ];

  const resilienceModule = [
    {
      title: 'k1',
      value: samples?.step3Data?.k1,
    },
    {
      title: 'k2',
      value: samples?.step3Data?.k2,
    },
    {
      title: 'k3',
      value: samples?.step3Data?.k3,
    },
    {
      title: 'k4',
      value: samples?.step3Data?.k4,
    },
  ];

  const permanentDeformation = [
    {
      title: t('pm.granularLayer.k1.psi1'),
      value: samples?.step3Data?.k1psi1,
    },
    {
      title: t('pm.granularLayer.k2.psi2'),
      value: samples?.step3Data?.k2psi2,
    },
    {
      title: t('pm.granularLayer.k3.psi3'),
      value: samples?.step3Data?.k3psi3,
    },
    {
      title: t('pm.granularLayer.k4.psi4'),
      value: samples?.step3Data?.k4psi4,
    },
    {
      title: t('pm.granularLayer.mf.observations'),
      value: samples?.step3Data?.observations,
    },
  ];

  const techData = [
    {
      title: t('pm.granularLayer.mctGroup'),
      value: samples?.step3Data?.mctGroup,
    },
    {
      title: t('pm.granularLayer.mctCoefficientC'),
      value: samples?.step3Data?.mctGroupmctCoefficientC,
    },
    {
      title: t('pm.granularLayer.mctIndexE'),
      value: samples?.step3Data?.mctIndexE,
    },
    {
      title: t('pm.granularLayer.especific.mass'),
      value: samples?.step3Data?.especificMass,
    },
    {
      title: t('pm.granularLayer.compressionEnergy'),
      value: samples?.step3Data?.compressionEnergy,
    },
    {
      title: t('pm.granularLayer.granulometric.range'),
      value: samples?.step3Data?.granulometricRange,
    },
    {
      title: t('pm.granularLayer.optimal.humidity'),
      value: samples?.step3Data?.optimalHumidity,
    },
    {
      title: t('pm.granularLayer.abrasionLA'),
      value: samples?.step3Data?.abrasionLA,
    },
    {
      title: t('pm.granularLayer.mf.observations'),
      value: samples?.step3Data?.observations,
    },
    {
      title: t('pm.binderAsphaltConcrete.tmn'),
      value: samples?.step4Data?.tmn,
    },
    {
      title: t('pm.binderAsphaltConcrete.volumeVoids'),
      value: samples?.step4Data?.volumeVoids,
    },
    {
      title: t('pm.binderAsphaltConcrete.rt'),
      value: samples?.step4Data?.rt,
    },
    {
      title: t('pm.binderAsphaltConcrete.flowNumber'),
      value: samples?.step4Data?.flowNumber,
    },
    {
      title: t('pm.binderAsphaltConcrete.mr'),
      value: samples?.step4Data?.mr,
    },
    {
      title: t('pm.binderAsphaltConcrete.specificMass'),
      value: samples?.step4Data?.specificMass,
    },
    {
      title: t('pm.binderAsphaltConcrete.asphaltTenor'),
      value: samples?.step4Data?.asphaltTenor,
    },

    {
      title: t('pm.binderAsphaltConcrete.stabilizer'),
      value: samples?.step4Data?.asphaltTenor,
    },
    {
      title: t('pm.binderAsphaltConcrete.tenor'),
      value: samples?.step4Data?.asphaltTenor,
    },
    {
      title: t('pm.binderAsphaltConcrete.rtcd'),
      value: samples?.step4Data?.asphaltTenor,
    },
    {
      title: t('pm.binderAsphaltConcrete.rtf'),
      value: samples?.step4Data?.asphaltTenor,
    },
    {
      title: t('pm.binderAsphaltConcrete.rcs'),
      value: samples?.step4Data?.asphaltTenor,
    },
    {
      title: t('pm.binderAsphaltConcrete.capType'),
      value: samples?.step3Data?.capType,
    },
    {
      title: t('pm.binderAsphaltConcrete.performanceGrade'),
      value: samples?.step3Data?.performanceGrade,
    },
    {
      title: t('pm.binderAsphaltConcrete.penetration'),
      value: samples?.step3Data?.penetration,
    },
    {
      title: t('pm.binderAsphaltConcrete.softeningPoint'),
      value: samples?.step3Data?.softeningPoint,
    },
    {
      title: t('pm.binderAsphaltConcrete.elasticRecovery'),
      value: samples?.step3Data?.elasticRecovery,
    },
  ];

  const materialData = [
    {
      title: t('pm.granularLayer.mf.stabilizer'),
      value: samples?.step3Data?.stabilizer,
    },
    {
      title: t('pm.granularLayer.mf.tenor'),
      value: samples?.step3Data?.tenor,
    },
    {
      title: t('pm.granularLayer.mf.especificMass'),
      value: samples?.step3Data?.especificMass,
    },
    {
      title: t('pm.granularLayer.mf.rtcd'),
      value: samples?.step3Data?.rtcd,
    },
    {
      title: t('pm.granularLayer.mf.rtf'),
      value: samples?.step3Data?.rtf,
    },
    {
      title: t('pm.granularLayer.mf.rcs'),
      value: samples?.step3Data?.rcs,
    },
    {
      title: t('pm.granularLayer.mf.granulometricRange'),
      value: samples?.step3Data?.granulometricRange,
    },
    {
      title: t('pm.granularLayer.mf.optimalHumidity'),
      value: samples?.step3Data?.optimalHumidity,
    },
    {
      title: t('pm.granularLayer.mf.compressionEnergy'),
      value: samples?.step3Data?.compressionEnergy,
    },
  ];

  const materialFatigue = [
    {
      title: t('pm.granularLayer.k1.psi1'),
      value: samples?.step3Data?.fatiguek1psi1,
    },
    {
      title: t('pm.granularLayer.k2.psi2'),
      value: samples?.step3Data?.fatiguek2psi2,
    },
    {
      title: t('pm.granularLayer.mf.observations'),
      value: samples?.step3Data?.observations,
    },
  ];

  const resilienceModuleStabilized = [
    {
      title: t('pm.granularLayer.rs.initial'),
      value: samples?.step3Data?.rsInitial,
    },
    {
      title: t('pm.granularLayer.rs.final'),
      value: samples?.step3Data?.rsFinal,
    },
    {
      title: t('pm.granularLayer.constant.A'),
      value: samples?.step3Data?.constantA,
    },
    {
      title: t('pm.granularLayer.constant.B'),
      value: samples?.step3Data?.constantB,
    },
  ];

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
            {samples?.generalData?.name &&
              samples?.generalData?.zone &&
              samples?.generalData?.layer &&
              samples?.generalData?.cityState && (
                <FlexColumnBorder title={t('pm.general.data')} open={true} theme={'#07B811'}>
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
                    {generalData.map((item, idx) => (
                      <Box
                        sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' }}
                        key={idx}
                      >
                        {item.value && (
                          <>
                            <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                              {item.title}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography
                                sx={{ display: 'flex', fontWeight: 'bold', fontSize: '14px', color: 'black' }}
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
              )}
            {/** DADOS DO PAVIMENTO NO QUAL O MATERIAL ESTÁ INSERIDO */}
            {samples?.step2Data.sectionType &&
              samples?.step2Data.extension &&
              samples?.step2Data.initialStakeMeters &&
              samples?.step2Data.latitudeI &&
              samples?.step2Data.longitudeI &&
              samples?.step2Data.identification &&
              samples?.step2Data.finalStakeMeters &&
              samples?.step2Data.latitudeF &&
              samples?.step2Data.longitudeF &&
              samples?.step2Data.monitoringPhase && (
                <FlexColumnBorder title={t('pm.paviment.data')} open={true} theme={'#07B811'}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr 1fr' },
                      justifyItems: 'center',
                      alignItems: 'center',
                      gap: '1rem',
                      justifyContent: 'space-evenly',
                    }}
                  >
                    {pavimentData.map((item, idx) => (
                      <Box
                        sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' }}
                        key={idx}
                      >
                        {item.value && (
                          <>
                            <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                              {item.title}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography
                                sx={{ display: 'flex', fontWeight: 'bold', fontSize: '14px', color: 'black' }}
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
              )}

            {/**  PREPARO DO PAVIMENTO */}
            {samples?.step2Data?.milling &&
              samples?.step2Data?.interventionAtTheBase &&
              samples?.step2Data?.sami &&
              samples?.step2Data?.bondingPaint &&
              samples?.step2Data?.priming && (
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
                      <Box
                        sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' }}
                        key={idx}
                      >
                        {item.value && (
                          <>
                            <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                              {item.title}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography
                                sx={{ display: 'flex', fontWeight: 'bold', fontSize: '14px', color: 'black' }}
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
              )}

            <FlexColumnBorder title={t('pm.material-data')} open={true} theme={'#07B811'}>
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
                {materialData.map((item, idx) => (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' }} key={idx}>
                    {item.value && (
                      <>
                        <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                          {item.title}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography sx={{ display: 'flex', fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                            {item.value}
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            </FlexColumnBorder>

            {/** FADIGUA DO MATERIAL */}
            {samples?.step3Data?.fatiguek1psi1 && samples?.step3Data?.fatiguek2psi2 && (
              <FlexColumnBorder title={t('pm.material-permanentDeformation')} open={true} theme={'#07B811'}>
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
                  {materialFatigue.map((item, idx) => (
                    <Box
                      sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' }}
                      key={idx}
                    >
                      {item.value && (
                        <>
                          <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                            {item.title}
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ display: 'flex', fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                              {item.value}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Box>
                  ))}
                </Box>
              </FlexColumnBorder>
            )}

            {/** MÓDULO DE RESILIÊNCIA */}
            {samples?.step3Data?.rsInitial &&
              samples?.step3Data?.rsFinal &&
              samples?.step3Data?.constantA &&
              samples?.step3Data?.constantB && (
                <FlexColumnBorder title={t('pm.resilience.module')} open={true} theme={'#07B811'}>
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
                    {resilienceModuleStabilized.map((item, idx) => (
                      <Box
                        sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' }}
                        key={idx}
                      >
                        {item.value && (
                          <>
                            <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                              {item.title}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography
                                sx={{ display: 'flex', fontWeight: 'bold', fontSize: '14px', color: 'black' }}
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
              )}

            {/** DADOS TÉCNICOS DA AMOSTRA */}
            {samples?.step3Data?.mctGroup &&
              samples?.step3Data?.mctGroupmctCoefficientC &&
              samples?.step3Data?.mctIndexE &&
              samples?.step3Data?.especificMass &&
              samples?.step3Data?.compressionEnergy &&
              samples?.step3Data?.granulometricRange &&
              samples?.step3Data?.optimalHumidity &&
              samples?.step3Data?.abrasionLA && (
                <FlexColumnBorder title={t('pm.sample-data')} open={true} theme={'#07B811'}>
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
                      <Box
                        sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' }}
                        key={idx}
                      >
                        {item.value && (
                          <>
                            <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                              {item.title}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography
                                sx={{ display: 'flex', fontWeight: 'bold', fontSize: '14px', color: 'black' }}
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
              )}
            {/** DEFORMAÇÃO PERMANENTE */}
            {samples?.step3Data?.k1psi1 &&
              samples?.step3Data?.k2psi2 &&
              samples?.step3Data?.k3psi3 &&
              samples?.step3Data?.k4psi4 && (
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
                      <Box
                        sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' }}
                        key={idx}
                      >
                        {item.value && (
                          <>
                            <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                              {item.title}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography
                                sx={{ display: 'flex', fontWeight: 'bold', fontSize: '14px', color: 'black' }}
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
              )}

            {/**  MÓDULO DE RESILIÊNCIA */}
            {samples?.step3Data?.k1 && samples?.step3Data?.k2 && samples?.step3Data?.k3 && samples?.step3Data?.k4 && (
              <FlexColumnBorder title={t('pm.resilience.module')} open={true} theme={'#07B811'}>
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
                    <Box
                      sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' }}
                      key={idx}
                    >
                      {item.value && (
                        <>
                          <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                            {item.title}
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ display: 'flex', fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                              {item.value}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Box>
                  ))}
                </Box>
              </FlexColumnBorder>
            )}
            {/** CURVA DE FADIGA À COMPRESSÃO DIAMETRAL */}
            {samples?.Step4Data?.fatigueCurve_n_cps &&
              samples?.Step4Data?.fatigueCurve_k1 &&
              samples?.Step4Data?.fatigueCurve_k2 &&
              samples?.Step4Data?.fatigueCurve_r2 && (
                <FlexColumnBorder title={t('pm.diametral.compression.fatigue.curve')} open={true} theme={'#07B811'}>
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
                      <Box
                        sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' }}
                        key={idx}
                      >
                        {item.value && (
                          <>
                            <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                              {item.title}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography
                                sx={{ display: 'flex', fontWeight: 'bold', fontSize: '14px', color: 'black' }}
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
              )}
            {/** VISCOSIDADE BROOKFIELD */}
            {samples?.step3Data?.vb_sp21_20 && samples?.step3Data?.vb_sp21_50 && samples?.step3Data?.vb_sp21_100 && (
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
                    <Box
                      sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' }}
                      key={idx}
                    >
                      {item.value && (
                        <>
                          <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                            {item.title}
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ display: 'flex', fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                              {item.value}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Box>
                  ))}
                </Box>
              </FlexColumnBorder>
            )}
            {/** OUTRAS INFORMAÇÕES SOBRE O MATERIAL */}
            {samples?.step3Data?.refinery &&
              samples?.step3Data?.company &&
              samples?.step3Data?.collectionDate &&
              samples?.step3Data?.invoiceNumber &&
              samples?.step3Data?.dataInvoice &&
              samples?.step3Data?.certificateDate &&
              samples?.step3Data?.certificateNumber &&
              samples?.step3Data?.capType &&
              samples?.step3Data?.performanceGrade &&
              samples?.step3Data?.penetration &&
              samples?.step3Data?.softeningPoint &&
              samples?.step3Data?.elasticRecovery && (
                <FlexColumnBorder title={t('pm.sample-data')} open={true} theme={'#07B811'}>
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
                      <Box
                        sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' }}
                        key={idx}
                      >
                        {item.value && (
                          <>
                            <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                              {item.title}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography
                                sx={{ display: 'flex', fontWeight: 'bold', fontSize: '14px', color: 'black' }}
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
              )}
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
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    marginTop: '1rem',
                    color: 'black',
                  }}
                >
                  {t('pm-image-structural-composition')}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { mobile: 'column', desktop: 'row' },
                    gap: '1rem',
                    alignItems: 'center',
                    marginY: '1rem',
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

export default SpecificSample_StabilizedLayers;
