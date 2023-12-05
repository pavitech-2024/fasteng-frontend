/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { Result_CardContainer } from '@/components/atoms/containers/result-card';
import samplesService from '@/services/promedina/binder-asphalt-concrete/binder-asphalt-concrete-view.service';
import { Box, Button, Typography } from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NextIcon } from '@/assets';

const SpecificSample_BinderAsphaltConcrete = () => {
  const [samples, setSamples] = useState<any>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const query = router.query as any;
  console.log('🚀 ~ file: [id].tsx:12 ~ SpecificSample ~ id:', query.id);

  useEffect(() => {
    console.log('🚀 ~ file: [id].tsx:17 ~ SpecificSample ~ samples:', samples);
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
  console.log('🚀 ~ file: [id].tsx:65 ~ columns:', columns);

  const rows = samples?.step2Data.structuralComposition.map((item, index) => ({
    id: index,
    layer: item.layer,
    material: item.material,
    thickness: item.thickness,
  }));

  return (
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
              display: 'flex',
              flexDirection: { mobile: 'column', desktop: 'row' },
              alignItems: 'center',
              justifyContent: 'space-around',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('pm.granularLayer.name')}</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.generalData.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('pm.granularLayer.zone')}</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.generalData.zone}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('pm.granularLayer.layer')}</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.generalData.layer}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('pm.granularLayer.cityState')}</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.generalData.cityState}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                {t('pm.granularLayer.observations')}
              </Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                {samples?.generalData.observations}
              </Typography>
            </Box>
          </Box>
        </FlexColumnBorder>
        <FlexColumnBorder title={t('pm-datasheet')} open={true} theme={'#07B811'}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { mobile: 'column', desktop: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                justifyItems: 'center',
                gap: '2rem',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {samples?.step2Data.sectionType && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('pm-type-of-section')}</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step2Data.sectionType}
                    </Typography>
                  </>
                )}
                {samples?.step2Data.extension && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.binderAsphaltConcrete.extension')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step2Data.extension}
                    </Typography>
                  </>
                )}
                {samples?.step2Data.initialStakeMeters && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.binderAsphaltConcrete.initial.stake.meters')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step2Data.initialStakeMeters}
                    </Typography>
                  </>
                )}
                {samples?.step2Data.latitudeI && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.binderAsphaltConcrete.latitudeI')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step2Data.latitudeI}
                    </Typography>
                  </>
                )}
                {samples?.step2Data.longitudeI && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.binderAsphaltConcrete.longitudeI')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step2Data.longitudeI}
                    </Typography>
                  </>
                )}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {samples?.step2Data.identification && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.binderAsphaltConcrete.identification')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step2Data.identification}
                    </Typography>
                  </>
                )}
                {samples?.step2Data.finalStakeMeters && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.binderAsphaltConcrete.final.stake.meters')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step2Data.finalStakeMeters}
                    </Typography>
                  </>
                )}
                {samples?.step2Data.latitudeF && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.binderAsphaltConcrete.latitudeF')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step2Data.latitudeF}
                    </Typography>
                  </>
                )}
                {samples?.step2Data.longitudeF && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.binderAsphaltConcrete.longitudeF')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step2Data.longitudeF}
                    </Typography>
                  </>
                )}
                {samples?.step2Data.monitoringPhase && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.binderAsphaltConcrete.monitoring.phase')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step2Data.monitoringPhase}
                    </Typography>
                  </>
                )}
                {samples?.step2Data.observation && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.granularLayer.mf.observations')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step2Data.observation}
                    </Typography>
                  </>
                )}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {samples?.step2Data.milling && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.binderAsphaltConcrete.milling')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step2Data.milling}</Typography>
                  </>
                )}
                {samples?.step2Data.interventionAtTheBase && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.binderAsphaltConcrete.intervention.at.the.base')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step2Data.interventionAtTheBase}
                    </Typography>
                  </>
                )}
                {samples?.step2Data.sami && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>SAMI</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step2Data.sami}</Typography>
                  </>
                )}
                {samples?.step2Data.bondingPaint && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.binderAsphaltConcrete.bonding.paint')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step2Data.bondingPaint}
                    </Typography>
                  </>
                )}
                {samples?.step2Data.priming && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.binderAsphaltConcrete.priming')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step2Data.priming}</Typography>
                  </>
                )}{' '}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {samples?.step3Data.mctGroup && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.granularLayer.mctGroup')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step3Data.mctGroup}
                    </Typography>
                  </>
                )}
                {samples?.step3Data.mctCoefficientC && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.granularLayer.mctCoefficientC')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step3Data.mctCoefficientC}
                    </Typography>
                  </>
                )}
                {samples?.step3Data.mctIndexE && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.granularLayer.mctIndexE')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step3Data.mctIndexE}
                    </Typography>
                  </>
                )}
                {samples?.step3Data.especificMass && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.granularLayer.especific.mass')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step3Data.especificMass}
                    </Typography>
                  </>
                )}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {samples?.step3Data.compressionEnergy && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.granularLayer.compressionEnergy')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step3Data.compressionEnergy}
                    </Typography>
                  </>
                )}
                {samples?.step3Data.granulometricRange && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.granularLayer.granulometric.range')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step3Data.granulometricRange}
                    </Typography>
                  </>
                )}
                {samples?.step3Data.optimalHumidity && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.granularLayer.optimal.humidity')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step3Data.optimalHumidity}
                    </Typography>
                  </>
                )}
                {samples?.step3Data.abrasionLA && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.granularLayer.abrasionLA')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step3Data.abrasionLA}
                    </Typography>
                  </>
                )}
                {samples?.stabilizer && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.granularLayer.stabilizer')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.stabilizer}</Typography>
                  </>
                )}
                {samples?.tenor && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('pm.granularLayer.tenor')}</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.tenor}</Typography>
                  </>
                )}
                {samples?.rtcd && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('pm.granularLayer.rtcd')}</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.rtcd}</Typography>
                  </>
                )}
                {samples?.rtf && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('pm.granularLayer.rtf')}</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.rtf}</Typography>
                  </>
                )}
                {samples?.rcs && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('pm.granularLayer.rcs')}</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.rcs}</Typography>
                  </>
                )}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {samples?.refinery && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.binderAsphaltConcrete.refinery')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.refinery}</Typography>
                  </>
                )}
                {samples?.company && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.binderAsphaltConcrete.company')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.company}</Typography>
                  </>
                )}
                {samples?.collectionDate && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.binderAsphaltConcrete.collectionDate')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.collectionDate}</Typography>
                  </>
                )}
                {samples?.certificateDate && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.binderAsphaltConcrete.certificateDate')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.certificateDate}</Typography>
                  </>
                )}
                {samples?.invoiceNumber && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.binderAsphaltConcrete.invoiceNumber')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.invoiceNumber}</Typography>
                  </>
                )}
                {samples?.dataInvoice && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.binderAsphaltConcrete.dataInvoice')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.ataInvoice}</Typography>
                  </>
                )}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {samples?.capType && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.binderAsphaltConcrete.capType')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.capType}</Typography>
                  </>
                )}
                {samples?.performanceGrade && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.binderAsphaltConcrete.performanceGrade')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.performanceGrade}</Typography>
                  </>
                )}
                {samples?.penetration && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.binderAsphaltConcrete.penetration')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.penetration}</Typography>
                  </>
                )}
                {samples?.softeningPoint && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.binderAsphaltConcrete.softeningPoint')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.softeningPoint}</Typography>
                  </>
                )}
                {samples?.elasticRecovery && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      Recuperação elástica, 25°C (%)
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.elasticRecovery}</Typography>
                  </>
                )}
                {samples?.tmn && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>TMN (mm)</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.tmn}</Typography>
                  </>
                )}
                {samples?.sphaltTenor && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Teor de asfalto (%)</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.asphaltTenor}</Typography>
                  </>
                )}
                {samples?.specificMass && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.binderAsphaltConcrete.asphaltTenor')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.specificMass}</Typography>
                  </>
                )}
                {samples?.volumeVoids && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {t('pm.binderAsphaltConcrete.volumeVoids')}
                    </Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.volumeVoids}</Typography>
                  </>
                )}
                {samples?.rt && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>RT (MPa)</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.rt}</Typography>
                  </>
                )}
                {samples?.flowNumber && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Flow number (FN)</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.flowNumber}</Typography>
                  </>
                )}
                {samples?.mr && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>MR, 25°C (MPa)</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.mr}</Typography>
                  </>
                )}
              </Box>
            </Box>

            {/**MÓDULO DE RESILIÊNCIA MPa */}
            {samples?.step3Data.k1 && samples?.step3Data.k2 && samples?.step3Data.k3 && samples?.step3Data.k4 && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { mobile: 'column', desktop: 'row' },
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  marginBottom: '-1rem',
                  gap: '2rem',
                }}
              >
                <Result_CardContainer hideBorder title={t('pm.resilience.module')}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {samples?.step3Data.k1 && (
                      <>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k1</Typography>
                        <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step3Data.k1}</Typography>
                      </>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {samples?.step3Data.k2 && (
                      <>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k2</Typography>
                        <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step3Data.k2}</Typography>
                      </>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {samples?.step3Data.k3 && (
                      <>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k3</Typography>
                        <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step3Data.k3}</Typography>
                      </>
                    )}
                  </Box>{' '}
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {samples?.step3Data.k4 && (
                      <>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k4</Typography>
                        <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step3Data.k4}</Typography>
                      </>
                    )}
                  </Box>
                </Result_CardContainer>
              </Box>
            )}

            {/** DEFORMAÇÃO PERMANENTE */}
            {samples?.step3Data.k1psi1 &&
              samples?.step3Data.k2psi2 &&
              samples?.step3Data.k3psi3 &&
              samples?.step3Data.k4psi4 && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { mobile: 'column', desktop: 'row' },
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    marginBottom: '-1rem',
                  }}
                >
                  <Result_CardContainer hideBorder title={t('pm.permanent.deformation')}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      {samples?.step3Data.k1psi1 && (
                        <>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                            {t('pm.granularLayer.k1.psi1')}
                          </Typography>
                          <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                            {samples?.step3Data.k1psi1}
                          </Typography>
                        </>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      {samples?.step3Data.k2psi2 && (
                        <>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                            {t('pm.granularLayer.k2.psi2')}
                          </Typography>
                          <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                            {samples?.step3Data.k2psi2}
                          </Typography>
                        </>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      {samples?.step3Data.k3psi3 && (
                        <>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                            {t('pm.granularLayer.k3.psi3')}
                          </Typography>
                          <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                            {samples?.step3Data.k3psi3}
                          </Typography>
                        </>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      {samples?.step3Data.k4psi4 && (
                        <>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                            {t('pm.granularLayer.k4.psi4')}
                          </Typography>
                          <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                            {samples?.step3Data.k4psi4}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Result_CardContainer>
                </Box>
              )}

            {/** MÓDULO DE RESILIÊNCIA 28 DIAS MPa */}
            {samples?.rsInitial && samples?.rsFinal && samples?.constantA && samples?.constantB && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { mobile: 'column', desktop: 'row' },
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  marginBottom: '-1rem',
                }}
              >
                <Result_CardContainer hideBorder title={t('pm.resilience.module')}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {samples?.rsInitial && (
                      <>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('pm.rm.initial')}</Typography>
                        <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.rsInitial}</Typography>
                      </>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {samples?.rsFinal && (
                      <>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Final (Ef)</Typography>
                        <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.rsFinal}</Typography>
                      </>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {samples?.constantA && (
                      <>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                          {t('pm.granularLayer.constant.A')}
                        </Typography>
                        <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.constantA}</Typography>
                      </>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {samples?.constantB && (
                      <>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                          {t('pm.granularLayer.constant.B')}
                        </Typography>
                        <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.constantB}</Typography>
                      </>
                    )}
                  </Box>
                </Result_CardContainer>
              </Box>
            )}

            {/** FADIGA DO MATERIAL */}
            {samples?.fatiguek1psi1 && samples?.fatiguek2psi2 && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { mobile: 'column', desktop: 'row' },
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  marginBottom: '-1rem',
                }}
              >
                <Result_CardContainer hideBorder title={t('pm.material-fadigue')}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {samples?.fatiguek1psi1 && (
                      <>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                          {t('pm.granularLayer.k1.psi1')}
                        </Typography>
                        <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.fatiguek1psi1}</Typography>
                      </>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {samples?.fatiguek2psi2 && (
                      <>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                          {t('pm.granularLayer.k2.psi2')}
                        </Typography>
                        <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.fatiguek2psi2}</Typography>
                      </>
                    )}
                  </Box>
                </Result_CardContainer>
              </Box>
            )}

            {/** VISCOSIDADE BROOKFIELD */}
            {samples?.vb_sp21_20 && samples?.vb_sp21_50 && samples?.vb_sp21_100 && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { mobile: 'column', desktop: 'row' },
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  marginBottom: '-1rem',
                }}
              >
                <Result_CardContainer hideBorder title={t('pm.brookfield.viscosity')}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {samples?.vb_sp21_20 && (
                      <>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>135°C (SP21, 20rpm)</Typography>
                        <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.vb_sp21_20}</Typography>
                      </>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {samples?.vb_sp21_50 && (
                      <>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>150°C (SP21, 50rpm)</Typography>
                        <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.vb_sp21_50}</Typography>
                      </>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {samples?.vb_sp21_100 && (
                      <>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>177°C (SP21, 100rpm)</Typography>
                        <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.vb_sp21_100}</Typography>
                      </>
                    )}
                  </Box>
                </Result_CardContainer>
              </Box>
            )}

            {/** CURVA DE FADIGA À COMPRESSÃO DIAMETRAL */}
            {samples?.fatigueCurve_n_cps &&
              samples?.fatigueCurve_k1 &&
              samples?.fatigueCurve_k2 &&
              samples?.fatigueCurve_r2 && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { mobile: 'column', desktop: 'row' },
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    marginBottom: '-1rem',
                    gap: '2rem',
                  }}
                >
                  <Result_CardContainer hideBorder title={t('pm.diametral.compression.fatigue.curve')}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {samples?.samples?.fatigueCurve_n_cps && (
                        <>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>N° CPs</Typography>
                          <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                            {samples?.fatigueCurve_n_cps}
                          </Typography>
                        </>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {samples?.fatigueCurve_k1 && (
                        <>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k1</Typography>
                          <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                            {samples?.fatigueCurve_k1}
                          </Typography>
                        </>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {samples?.fatigueCurve_k2 && (
                        <>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k2</Typography>
                          <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                            {samples?.fatigueCurve_k2}
                          </Typography>
                        </>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {samples?.fatigueCurve_r2 && (
                        <>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>R²</Typography>
                          <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                            {samples?.fatigueCurve_r2}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Result_CardContainer>
                </Box>
              )}

            {/** COMPOSIÇÃO ESTRUTURAL  */}
            <Result_CardContainer hideBorder title={t('pm.structural.composition')}>
              <Box />
            </Result_CardContainer>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '-7rem',
              }}
            >
              <div style={{ height: 'fit-content', width: '100%' }}>
                {rows !== undefined && (
                  <DataGrid
                    rows={rows}
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
            <Box sx={{ marginBottom: '1rem' }}>
              <Typography sx={{ fontWeight: 'bold', marginTop: '0.5rem' }}>
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
              <Typography>
                {t('pm-estructural-composition-image-date')} {samples?.step2Data.imagesDate}
              </Typography>
            </Box>
          </Box>
        </FlexColumnBorder>
      </Box>
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
  );
};

export default SpecificSample_BinderAsphaltConcrete;
