import React from 'react';
import Stepper from '../../atoms/stepper';
import { Box, Button, Typography } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { NextIcon, PreviousIcon, SaveIcon } from '@/assets';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { toast } from 'react-toastify';
import StepDescription from '../../atoms/titles/step-description';
import { PageGenericContainer as Container } from '@/components/organisms/pageContainer';
import Header from '@/components/organisms/header';

interface EssayTemplateProps {
  essayInfo: IEssayService['info'];
  childrens: { step: number; children: JSX.Element; data: unknown }[];
  nextCallback: (step: number, data: unknown) => Promise<void>;
}

// interface that export the props of the childrens
export interface EssayPageProps {
  nextDisabled?: boolean;
  setNextDisabled?: React.Dispatch<React.SetStateAction<boolean>>;
}

const EssayTemplate = ({
  essayInfo: { stepperData, icon, key, standard },
  childrens,
  nextCallback,
}: EssayTemplateProps) => {
  const router = useRouter();
  const app = router.pathname.split('/')[1];
  const essay = router.pathname.split('/')[3];

  const [activeStep, setActiveStep] = React.useState(0);
  const [nextDisabled, setNextDisabled] = React.useState(true);

  return (
    <Container>
      <Header title={t(`${app}.essays.${key}`)} subTitle={standard.name} image={icon} link={standard.link}>
        <Box
          sx={{
            width: { mobile: '100%', notebook: '57%' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: {
              mobile: '1rem 0',
              notebook: '0',
            },
          }}
        >
          <Stepper activeStep={activeStep} stepperData={stepperData} variant="multicolor" />
        </Box>
      </Header>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '90%'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginInline: { mobile: '1rem', notebook: '0' },
          }}
        >
          <Box
            sx={{
              width: { mobile: '100%', notebook: '90%' },
              padding: '1rem',
              borderRadius: '20px',
              bgcolor: 'primaryTons.white',
              border: '1px solid #CFCFCF',
            }}
          >
            {activeStep !== 0 && <StepDescription text={t(`${essay}.step-${activeStep + 1}-description`)} />}
            {
              // to render the childrens with the props [ nextDisabled and setNextDisabled ]
              activeStep === childrens[activeStep]?.step ? (
                React.Children.map(childrens[activeStep].children, (child) => {
                  try {
                    const PROPS_TO_EXTEND: EssayPageProps = {
                      nextDisabled,
                      setNextDisabled,
                    };
                    // check if the child is a valid element
                    if (React.isValidElement(child))
                      // clone the element and pass the props
                      return React.cloneElement(child, PROPS_TO_EXTEND);
                    // if not, throw an error
                    else throw new Error('Invalid element');
                  } catch (error) {
                    toast.error(`${error}`);
                  }
                })
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>{'Page not found or not implemented yet.'}</Box>
              )
            }
          </Box>
        </Box>
        <Box
          sx={{
            width: { mobile: '95%', notebook: 'calc(90% - 3.3rem)' },
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: activeStep <= 0 ? 'flex-end' : 'space-between',
          }}
        >
          {activeStep > 0 && (
            <Button
              variant="contained"
              disabled={activeStep === 0}
              onClick={() => {
                setActiveStep(activeStep - 1);
              }}
              sx={{
                bgcolor: 'secondaryTons.blue',
                color: 'primaryTons.mainWhite',
                height: '40px',
                borderRadius: '5px',
                padding: 1,
                width: {
                  mobile: 'fit-content',
                  notebook: '200px',
                },
                ':hover': {
                  transition: 'all 0.1s ease-in-out',
                  bgcolor: 'secondaryTons.blue',
                  transform: 'scale(1.02)',
                },
              }}
            >
              <PreviousIcon />
              <Typography sx={{ fontSize: { mobile: '0.8rem', notebook: '1.25rem', width: '90%' } }}>
                {t('previous')}
              </Typography>
            </Button>
          )}

          <Button
            variant="contained"
            disabled={nextDisabled}
            onClick={async () => {
              // to check if the button is saving or going to the next step
              const isSaving = childrens.length - 1 === activeStep ? true : false;

              // create a loading toast
              const nextToast = toast.loading(isSaving ? t('loading.save.pending') : t('loading.nextStep.pending'), {
                autoClose: 5000,
              });
              try {
                // check if the activeStep is the same as the step of the current child
                if (activeStep !== childrens[activeStep]?.step) throw t('loading.invalid-step');
                // call and wait the callback function
                await nextCallback(activeStep, childrens[activeStep]['data']);
                toast.update(nextToast, {
                  autoClose: 5000,
                  type: 'success',
                  render: isSaving ? t('loading.save.success') : t('loading.nextStep.success'),
                  isLoading: false,
                  closeButton: true,
                });

                if (!isSaving) {
                  // if the callback function is successful, go to the next step
                  setActiveStep(activeStep + 1);
                  // disable the next step button
                  setNextDisabled(true);
                }
              } catch (error) {
                toast.update(nextToast, {
                  autoClose: 5000,
                  type: 'error',
                  render: t(`${error}`),
                  isLoading: false,
                  closeButton: true,
                });
              }
            }}
            sx={{
              bgcolor: 'secondaryTons.blue',
              color: 'primaryTons.mainWhite',
              height: '40px',
              padding: 1,
              width: {
                mobile: 'fit-content',
                notebook: '200px',
              },
              ':hover': {
                transition: 'all 0.1s ease-in-out',
                bgcolor: 'secondaryTons.blue',
                transform: 'scale(1.02)',
              },
            }}
          >
            <Typography sx={{ fontSize: { mobile: '0.8rem', notebook: '1.25rem', width: '90%' } }}>
              {childrens.length - 1 === activeStep ? t('save') : t('next')}
            </Typography>
            {childrens.length - 1 === activeStep ? <SaveIcon /> : <NextIcon />}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EssayTemplate;