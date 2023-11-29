/* eslint-disable react/jsx-no-undef */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import samplesService from '@/services/promedina/granular-layers/granular-layers-view.service';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { Result_CardContainer } from '@/components/atoms/containers/result-card';
import { Box, Button, Typography } from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NextIcon } from '@/assets';

const SpecificSample_GranularLayers = () => {
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
    { field: 'layer', headerName: 'Camada' },
    { field: 'material', headerName: 'Material' },
    { field: 'thickness', headerName: 'Espessura' },
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
        <FlexColumnBorder title={t('Dados Gerais')} open={true} theme={'#07B811'}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { mobile: 'column', desktop: 'row' },
              alignItems: 'center',
              justifyContent: 'space-around',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Nome</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.generalData.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Zona</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.generalData.zone}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Camada</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.generalData.layer}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Cidade/Estado</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.generalData.cityState}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Observações</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                {samples?.generalData.observations}
              </Typography>
            </Box>
          </Box>
        </FlexColumnBorder>
        <FlexColumnBorder title={t('Ficha Técnica')} open={true} theme={'#07B811'}>
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
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Tipo de seção</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step2Data.sectionType}
                    </Typography>
                  </>
                )}
                {samples?.step2Data.extension && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Extensão</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step2Data.extension}
                    </Typography>
                  </>
                )}
                {samples?.step2Data.initialStakeMeters && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Estaca/Metros inicial</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step2Data.initialStakeMeters}
                    </Typography>
                  </>
                )}
                {samples?.step2Data.latitudeI && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Latitude inicial</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step2Data.latitudeI}
                    </Typography>
                  </>
                )}
                {samples?.step2Data.longitudeI && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Longitude inicial</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step2Data.longitudeI}
                    </Typography>
                  </>
                )}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {samples?.step2Data.identification && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Identificação</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step2Data.identification}
                    </Typography>
                  </>
                )}
                {samples?.step2Data.finalStakeMeters && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Estaca/Metros final</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step2Data.finalStakeMeters}
                    </Typography>
                  </>
                )}
                {samples?.step2Data.latitudeF && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Latitude final</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step2Data.latitudeF}</Typography>
                  </>
                )}
                {samples?.step2Data.longitudeF && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Longitude final</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step2Data.longitudeF}
                    </Typography>
                  </>
                )}
                {samples?.step2Data.monitoringPhase && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Fase de monitoramento</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step2Data.monitoringPhase}
                    </Typography>
                  </>
                )}
                {samples?.step2Data.observation && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Observação</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step2Data.observation}
                    </Typography>
                  </>
                )}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {samples?.step2Data.milling && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Fresagem</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step2Data.milling}</Typography>
                  </>
                )}
                {samples?.step2Data.interventionAtTheBase && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Intervenção na base</Typography>
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
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Pintura de ligação</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step2Data.bondingPaint}
                    </Typography>
                  </>
                )}
                {samples?.step2Data.priming && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Imprimação</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step2Data.priming}</Typography>
                  </>
                )}{' '}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {samples?.step3Data.mctGroup && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Grupo MCT</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step3Data.mctGroup}
                    </Typography>
                  </>
                )}
                {samples?.step3Data.mctCoefficientC && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>MCT-Coeficiente c'</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step3Data.mctCoefficientC}
                    </Typography>
                  </>
                )}
                {samples?.step3Data.mctCoefficientC && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>MCT-Coeficiente c'</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step3Data.mctCoefficientC}
                    </Typography>
                  </>
                )}
                {samples?.step3Data.mctIndexE && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>MCT-Índice e'</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step3Data.mctIndexE}
                    </Typography>
                  </>
                )}
                {samples?.step3Data.especificMass && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Massa específica (g/cm³)</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step3Data.especificMass}
                    </Typography>
                  </>
                )}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {samples?.step3Data.compressionEnergy && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Energia de compactação</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step3Data.compressionEnergy}
                    </Typography>
                  </>
                )}
                {samples?.step3Data.granulometricRange && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Faixa granulométrica</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step3Data.granulometricRange}
                    </Typography>
                  </>
                )}
                {samples?.step3Data.optimalHumidity && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Umidade ótima (%)</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step3Data.optimalHumidity}
                    </Typography>
                  </>
                )}
                {samples?.step3Data.abrasionLA && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Abrasão Los Angeles (%)</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {samples?.step3Data.abrasionLA}
                    </Typography>
                  </>
                )}
                {samples?.stabilizer && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Estabilizante</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.stabilizer}</Typography>
                  </>
                )}
                {samples?.tenor && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Teor (%)</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.tenor}</Typography>
                  </>
                )}
                {samples?.rtcd && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>RTCD, 28 dias (MPa)</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.rtcd}</Typography>
                  </>
                )}
                {samples?.rtf && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>RTF, 28 dias (MPa)</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.rtf}</Typography>
                  </>
                )}
                {samples?.rcs && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>RCS, 28 dias (MPa)</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.rcs}</Typography>
                  </>
                )}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {samples?.refinery && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Refinaria</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.refinery}</Typography>
                  </>
                )}
                {samples?.company && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Empresa</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.company}</Typography>
                  </>
                )}
                {samples?.collectionDate && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Data de carregamento</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.collectionDate}</Typography>
                  </>
                )}
                {samples?.certificateDate && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Data do certificado</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.certificateDate}</Typography>
                  </>
                )}
                {samples?.certificateDate && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Data do certificado</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.certificateDate}</Typography>
                  </>
                )}
                {samples?.invoiceNumber && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Nº da nota fiscal</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.invoiceNumber}</Typography>
                  </>
                )}
                {samples?.dataInvoice && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Data da nota fiscal</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.ataInvoice}</Typography>
                  </>
                )}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {samples?.capType && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Tipo do CAP</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.capType}</Typography>
                  </>
                )}
                {samples?.performanceGrade && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Performace grade (PG)</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.performanceGrade}</Typography>
                  </>
                )}
                {samples?.penetration && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Penetração, 25°C (mm)</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.penetration}</Typography>
                  </>
                )}
                {samples?.softeningPoint && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Ponto de amolecimento (°C)</Typography>
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
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Massa específica (g/cm³)</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.specificMass}</Typography>
                  </>
                )}
                {samples?.volumeVoids && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Volume de vazios (%)</Typography>
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
                <Result_CardContainer hideBorder title={'Módulo de Resiliência (MPa)'}>
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
                  <Result_CardContainer hideBorder title={'Deformação Permanente'}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      {samples?.step3Data.k1psi1 && (
                        <>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k1 ou psi1</Typography>
                          <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                            {samples?.step3Data.k1psi1}
                          </Typography>
                        </>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      {samples?.step3Data.k2psi2 && (
                        <>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k2 ou psi2</Typography>
                          <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                            {samples?.step3Data.k2psi2}
                          </Typography>
                        </>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      {samples?.step3Data.k3psi3 && (
                        <>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k3 ou psi3</Typography>
                          <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                            {samples?.step3Data.k3psi3}
                          </Typography>
                        </>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      {samples?.step3Data.k4psi4 && (
                        <>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k4 ou psi4</Typography>
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
                <Result_CardContainer hideBorder title={'Módulo de Resiliência, 28 dias (MPa)'}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {samples?.rsInitial && (
                      <>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Inicial (Ei)</Typography>
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
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Constante A</Typography>
                        <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.constantA}</Typography>
                      </>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {samples?.constantB && (
                      <>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Constante B</Typography>
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
                <Result_CardContainer hideBorder title={'Fadiga do Material, 28 dias'}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {samples?.fatiguek1psi1 && (
                      <>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k1 ou psi1</Typography>
                        <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.fatiguek1psi1}</Typography>
                      </>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {samples?.fatiguek2psi2 && (
                      <>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k2 ou psi2</Typography>
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
                <Result_CardContainer hideBorder title={'Viscosidade Brookfield'}>
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
                  <Result_CardContainer hideBorder title={'Curva de Fadiga à Compressão Diametral'}>
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
            <Result_CardContainer hideBorder title={'Composição Estrutural'}>
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
              <Typography sx={{ fontWeight: 'bold', marginTop: '0.5rem' }}>Imagem do Segmento Experimental</Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { mobile: 'column', desktop: 'row' },
                  gap: '1rem',
                  alignItems: 'center',
                }}
              >
                <img src={samples?.step2Data.images} alt="Imagem do Segmento Experimental" width={'250px'} height={'250px'} />
              </Box>
              <Typography>Data da imagem: {samples?.step2Data.imagesDate}</Typography>
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
          VOLTAR
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
          Próximo
        </Button>
      </Box>
    </Box>
  );
};

export default SpecificSample_GranularLayers;
