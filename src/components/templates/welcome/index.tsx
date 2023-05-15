import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  styled,
  StepConnector,
  stepConnectorClasses,
  Stack
} from '@mui/material';
import { CardMenuOptions as Card } from '@/components/styles/muis/welcome';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

export interface WelcomeData {
  name: string;
  icon: ReactNode;
  description: string;
  path: string;
}

export interface StepData {
  step: string;
  description: string;
}

interface WelcomeTemplateProps {
  icon: JSX.Element;
  welcomeData: WelcomeData[];
  stepperData: StepData[];
}

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.secondaryTons.green,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.secondaryTons.green,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.secondaryTons.green,
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const WelcomeTemplate = ({ welcomeData, stepperData, icon }: WelcomeTemplateProps) => {
  const app = useRouter().pathname.split('/')[1];
  const title = t(`welcome.${app}`);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'center',
        width: '100vw',
        padding: 0,
        position: 'absolute',
        zIndex: 2,
        top: '52px',
        left: 0,
        '@media only screen and (min-width: 1024px)': {
          flexDirection: 'row',
          justifyContent: 'center'
        }
      }}
    >
      <Box
        sx={{
          mobile: '100%',
          pt: '3vh',
          '@media only screen and (min-width: 1024px)': {
            width: '60%'
          },
          '@media only screen and (min-width: 1366px)': {
            width: '40%'
          }
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
              width: "90%"
            }}
          >
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {icon}
            </Box>
            <Box
              color="secondaryTons.main"
              sx={{
                textTransform: 'uppercase',
                fontWeight: 700,
                fontSize: { mobile: '1.3rem', notebook: '2rem' },
                lineHeight: { mobile: '1.35rem', notebook: '2.05rem' },
                textAlign: 'center',
                pl: '15px',
                color: 'secondaryTons.main',
                div: { color: 'primaryTons.darkGray' }
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
              mt: '2vh',
              padding: { mobile: '3vh 4vw', notebook: '25px' },
              width: { mobile: '90vw', notebook: '500px', desktop: '550px' },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography
              sx={{
                fontWeight: { mobile: 700, desktop: 500 },
                fontSize: { mobile: '1.25rem', desktop: '1.5rem' },
                color: 'primaryTons.mainGray',
                mb: { mobile: '3vh', notebook: '25px' }
              }}
            >
              {t('welcome.how it works')}
            </Typography>
            <Stack>
              <Stepper activeStep={stepperData.length} alternativeLabel connector={<QontoConnector />}>
                {stepperData.map((step: StepData) => (
                  <Step key={step.step} completed>
                    <StepLabel>{step.description}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Stack>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                mt: { mobile: '3vh', notebook: '25px' }
              }}
            >
              {welcomeData.map((element: WelcomeData) => (
                <Typography
                  color="secondaryTons.main"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    mb: '16px',
                    span: {
                      color: 'primaryTons.mainGray',
                      fontWeight: 400
                    },
                  }}
                  key={element.name}
                >
                  • {element.name}:<span> {element.description}</span>
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
          padding: '4vh 0',

          '@media only screen and (min-width: 768px)': {
            gridTemplateColumns: '1fr 1fr',
            justifyItems: 'center',
            width: '90%'
          },

          '@media only screen and (min-width: 1024px)': {
            gridTemplateColumns: '1fr',
            width: '325px'
          }
        }}
      >
        {welcomeData.map((option: WelcomeData) => (
          <Card key={option.name} {...option} />
        ))}
      </Box>
    </Box>
  );
};

export default WelcomeTemplate;
