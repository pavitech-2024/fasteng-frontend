import { Box, Typography, Stack } from '@mui/material';
import { StepperData, StepperWelcome as Stepper } from '@/components/atoms/stepper';
import { CardMenuOptions as Card } from '@/components/styles/muis/welcome';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';
import { PageWelcomeContainer as Container } from '@/components/organisms/pageContainer';
import { ArrowDownIcon } from '@/assets';
import DescriptionModal from '@/components/atoms/modals/description';

export interface WelcomeData {
  name: string;
  icon: ReactNode;
  description?: any;
  path: string;
}

interface WelcomeTemplateProps {
  icon: JSX.Element;
  welcomeData: WelcomeData[];
  stepperData: StepperData[];
}

const WelcomeTemplate = ({ welcomeData, stepperData, icon }: WelcomeTemplateProps) => {
  const app = useRouter().pathname.split('/')[1];
  const title = t(`welcome.${app}`);

  const descriptionData = [
    {
      name: t('navbar.marshall'),
      description: t('description.marshall'),
    },
    {
      name: t('navbar.superpave'),
      description: t('description.superpave'),
    },
    {
      name: t('navbar.standards'),
      description: t('description.standards'),
    },
    {
      name: t('navbar.library'),
      description: t('description.library'),
    }
  ]

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignItems: 'center',
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</Box>
              <Box
                color="primary"
                sx={{
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  fontSize: { mobile: '1.45rem', notebook: '2rem' },
                  lineHeight: { mobile: '1.5rem', notebook: '2.05rem' },
                  textAlign: 'center',
                  pl: '15px',
                  color: 'primary.main',
                  div: { color: 'primaryTons.darkGray' },
                }}
              >
                <div>{t('welcome.title')}</div>
                {title}
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
                <Stepper stepperData={stepperData} variant="multicolor" />
              </Stack>
              <Box
                sx={{
                  display: modalOpen ? 'flex' : { mobile: 'none', notebook: 'flex' },
                  flexDirection: 'column',
                  width: '100%',
                  mt: { mobile: '3vh', notebook: '25px' },
                  transition: '0.5s ease-out',
                }}
              >
                <Typography
                  color="primary"
                  sx={{
                    fontWeight: 700,
                    textAlign: 'justify',
                    fontSize: '1rem',
                    mb: '16px',
                    span: {
                      color: 'primaryTons.mainGray',
                      fontWeight: 500,
                    },
                  }}
                >
                  • {t('navbar.materials')}:<span style={{ marginRight: '0.3rem' }}> {t('description.materials')}</span>
                  <DescriptionModal title={t('navbar.materials')} description={t('description.long.materials')} />
                </Typography>
                <Typography
                  color="primary"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    mb: '16px',
                    textAlign: 'justify',
                    span: {
                      color: 'primaryTons.mainGray',
                      fontWeight: 500,
                    },
                  }}
                >
                  • {t('navbar.essays')}:<span style={{ marginRight: '0.3rem' }}> {t('description.essays')}</span>
                  <DescriptionModal title={t('navbar.essays')} description={t('description.long.essays')} />
                </Typography>
                {descriptionData.map((element: any) => (
                  <Typography
                    color="primary"
                    sx={{
                      fontWeight: 700,
                      fontSize: '1rem',
                      mb: '16px',
                      textAlign: 'justify',
                      span: {
                        color: 'primaryTons.mainGray',
                        fontWeight: 500,
                      },
                    }}
                    key={element.name}
                  >
                    • {element.name}:<span style={{ marginRight: '0.3rem' }}> {element.description}</span>
                  </Typography>
                ))}
              </Box>
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
            <Card key={option.name} {...option} />
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default WelcomeTemplate;
