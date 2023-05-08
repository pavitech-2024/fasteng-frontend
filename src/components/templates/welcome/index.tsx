import { Box, Typography, Stepper, Step, StepLabel } from '@mui/material';
import { t } from 'i18next';
import Link from 'next/link';
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

const WelcomeTemplate = ({ welcomeData, stepperData, icon }: WelcomeTemplateProps) => {
  const app = useRouter().pathname.split('/')[1];
  const title = t(`welcome.${app}`);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: {
          mobile: 'column',
          notebook: 'row',
        },
        justifyContent: 'center',
        width: '100%',
        paddingTop: {
          mobile: '0',
          notebook: '2rem',
        },
        gap: '1rem',
      }}
    >
      <Box
        sx={{
          width: {
            mobile: '100%',
            notebook: '50%',
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h2"
              color="primary"
              sx={{
                textTransform: 'uppercase',
                fontWeight: 700,
                fontSize: { mobile: '1.2rem', notebook: '2rem' },
                span: { color: '#000' },
                mr: '1rem',
              }}
            >
              <span>{t('welcome.title')}</span>
              {title}
            </Typography>
            {icon}
          </Box>
          <Box
            sx={{
              bgcolor: '#fff',
              borderRadius: '10px',
              padding: '2rem .5rem',
              margin: '1rem auto',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography
                variant="body1"
                sx={{
                  margin: '1rem 0',
                  fontWeight: 700,
                }}
              >
                {t('welcome.how it works')}
              </Typography>
              <Stepper activeStep={stepperData.length} alternativeLabel>
                {stepperData.map((step: StepData) => (
                  <Step key={step.step}>
                    <StepLabel>{step.description}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gap: '20px',
                width: 'calc(100% - 2.4rem)',
                margin: '2rem 1.2rem',
              }}
            >
              {welcomeData.map((element: WelcomeData) => (
                <Typography
                  color="primary"
                  sx={{
                    fontWeight: 700,
                    span: { color: '#000', fontWeight: 400 },
                    fontSize: '16px',
                  }}
                  key={element.name}
                >
                  {element.name}:<span> {element.description}</span>
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          height: 'fit-content',
          gap: '20px',
          gridTemplateColumns: {
            mobile: 'repeat(auto-fit, minmax(200px, 1fr))',
            notebook: '1fr',
          },
          justifyItems: {
            mobile: 'center',
            notebook: 'start',
          },
        }}
      >
        {welcomeData.map((element: WelcomeData) => (
          <Box
            key={element.name}
            sx={{
              bgcolor: 'transparent',
              width: {
                mobile: '200px',
                notebook: '350px',
              },
              height: '100px',
              ':hover': { cursor: 'pointer' },
            }}
          >
            <Link key={element.name} href={element.path} style={{ textDecoration: 'none' }}>
              <Box sx={{ display: 'flex', height: '100%' }}>
                <Box
                  sx={{
                    width: '100px',
                    bgcolor: 'primary.main',
                    borderRadius: '20px 0 0 20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {element.icon}
                </Box>
                <Box
                  sx={{
                    width: {
                      mobile: '100px',
                      notebook: '250px',
                    },
                    bgcolor: 'primaryTons.darkGray',
                    borderRadius: '0 20px 20px 0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: 'all .3s',
                    ':hover': {
                      bgcolor: 'primaryTons.mainGray',
                    },
                  }}
                >
                  <Typography variant="body1" color="primaryTons.mainWhite">
                    {element.name}
                  </Typography>
                </Box>
              </Box>
            </Link>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default WelcomeTemplate;
