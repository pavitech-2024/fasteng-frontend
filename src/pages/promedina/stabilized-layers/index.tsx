import { ArrowDownIcon, MaterialsIcon, MarshallIcon } from '@/assets';
import Image from 'next/image';
import { WelcomeData } from '@/components/templates/welcome';
import { Container, Box, Typography, Stack } from '@mui/material';
import { StepperData, StepperWelcome as Stepper } from '@/components/atoms/stepper';
import { t } from 'i18next';
import { NextPage } from 'next';
import { useState } from 'react';
import { PMCardMenuOptions } from '@/components/atoms/cards/view-register-card';
import stabilizedLayersImage from '../../../assets/pro-medina/stabilizedLayers/stabilized-layers-image.png';

const StabilizedLayers: NextPage = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const stepperDataView: StepperData[] = [
    {
      step: 1,
      description: t('welcome.step.stabilized-layers.view.1'),
    },
    {
      step: 2,
      description: t('welcome.step.stabilized-layers.view.2'),
    },
  ];

  const stepperDataRegister: StepperData[] = [
    {
      step: 1,
      description: t('welcome.step.stabilized-layers.register.1'),
    },
    {
      step: 2,
      description: t('welcome.step.stabilized-layers.register.2'),
    },
    {
      step: 2,
      description: t('welcome.step.stabilized-layers.register.3'),
    },
  ];

  const welcomeData: WelcomeData[] = [
    {
      name: t('pm.register'),
      icon: <MaterialsIcon width="30px" height="35px" />,
      description: t('pm.register'),
      path: '/promedina/stabilized-layers/register',
    },
    {
      name: t('pm.view'),
      icon: <MarshallIcon width="30px" height="35px" />,
      description: t('pm.view'),
      path: '/promedina/stabilized-layers/view',
    },
  ];

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignItems: 'center',
          marginTop: '3rem',
          pt: { mobile: 0, desktop: '4vh' },
          '@media only screen and (min-width: 1024px)': {
            flexDirection: 'row',
            justifyContent: 'center',
          },
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '900px',
            pt: { mobile: '2vh', desktop: '1vh' },
            '@media only screen and (min-width: 1024px)': {
              width: '60%',
            },
            '@media only screen and (min-width: 1366px)': {
              width: '40%',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
                m: { mobile: '2vh 0 4vh', desktop: '1vh 0 2vh' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image width={100} height={90} src={stabilizedLayersImage.src} alt="logo promedina granular layers" />
              </Box>
              <Box
                color="primary"
                sx={{
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  fontSize: { mobile: '1.45rem', notebook: '2rem' },
                  lineHeight: { mobile: '1.5rem', notebook: '2.05rem' },
                  textAlign: 'center',
                  pl: '15px',
                  color: '#07B811',
                  div: { color: 'primaryTons.darkGray' },
                }}
              >
                <div>{t('welcome.title')}</div>
                {t('home.pm.stabilized')}
              </Box>
            </Box>
            <Box
              sx={{
                bgcolor: 'primaryTons.white',
                borderRadius: '10px',
                p: modalOpen ? { mobile: '3vh 4vw', notebook: '25px' } : '2vh',
                width: { mobile: '90vw', notebook: '500px', desktop: '550px' },
                border: '1px solid',
                borderColor: 'primaryTons.border',
                display: 'flex',
                flexDirection: 'column',
                alignItems: modalOpen ? 'center' : { mobile: 'flex-start', notebook: 'center' },
                justifyContent: 'center',
                position: 'relative',
                transition: '0.5s ease-out',
              }}
            >
              <Typography
                sx={{
                  fontWeight: { mobile: 700, desktop: 500 },
                  fontSize: { mobile: '1.25rem', desktop: '1.5rem' },
                  color: 'primaryTons.mainGray',
                  mb: modalOpen ? { mobile: '3vh', notebook: '25px' } : { mobile: 0, notebook: '25px' },
                  transition: '0.5s ease-out',
                }}
              >
                {t('welcome.how it works')}
              </Typography>
              <Typography sx={{ marginBottom: '1rem' }}>{t('pm.stabilized.works.register')}</Typography>
              <Box
                sx={{
                  position: 'absolute',
                  top: '2vh',
                  right: '2vh',
                  transform: modalOpen ? 'rotate(0.5turn)' : 'none',
                  transition: '0.5s ease-out',
                  display: { mobile: 'flex', notebook: 'none' },
                }}
              >
                <ArrowDownIcon onClick={() => setModalOpen((prev) => !prev)} />
              </Box>

              <Stack
                sx={{
                  display: modalOpen ? 'flex' : { mobile: 'none', notebook: 'flex' },
                  transition: '0.5s ease-out',
                }}
              >
                <Stepper stepperData={stepperDataRegister} variant="multicolor" />
              </Stack>
              <Typography sx={{ marginTop: '2rem', marginBottom: '1rem' }}>{t('pm.stabilized.works.view')}</Typography>
              <Box
                sx={{
                  position: 'absolute',
                  top: '2vh',
                  right: '2vh',
                  transform: modalOpen ? 'rotate(0.5turn)' : 'none',
                  transition: '0.5s ease-out',
                  display: { mobile: 'flex', notebook: 'none' },
                }}
              >
                <ArrowDownIcon onClick={() => setModalOpen((prev) => !prev)} />
              </Box>

              <Stack
                sx={{
                  display: modalOpen ? 'flex' : { mobile: 'none', notebook: 'flex' },
                  transition: '0.5s ease-out',
                  marginBottom: '1rem',
                }}
              >
                <Stepper stepperData={stepperDataView} variant="multicolor" />
              </Stack>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gap: '20px 0',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            width: '300px',
            p: { mobile: '4vh 0', desktop: 0 },

            '@media only screen and (min-width: 768px)': {
              gridTemplateColumns: '1fr 1fr',
              justifyItems: 'center',
              width: '90%',
            },

            '@media only screen and (min-width: 1024px)': {
              gridTemplateColumns: '1fr',
              width: '325px',
            },
          }}
        >
          {welcomeData.map((option: WelcomeData) => (
            <PMCardMenuOptions key={option.name} {...option} />
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default StabilizedLayers;
