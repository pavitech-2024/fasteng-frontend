import React from 'react';
import Stepper from '../../atoms/stepper';
import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { NextIcon, PreviousIcon } from '@/assets';
import Link from 'next/link';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { toast } from 'react-toastify';

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

  const [activeStep, setActiveStep] = React.useState(0);
  const [nextDisabled, setNextDisabled] = React.useState(true);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <Box>
        <Box
          sx={{
            width: '100%',
            minHeight: '184px',
            display: 'flex',
            flexDirection: { mobile: 'column', notebook: 'row' },
          }}
        >
          <Box
            sx={{
              width: { mobile: '100%', notebook: '57%' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image alt="essay icon" src={icon} width={90} height={90} />
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography
                  variant="h5"
                  color="primaryTons.darkerGray"
                  sx={{ fontSize: { mobile: '1.25rem', notebook: '2.25rem' }, fontWeight: '700' }}
                >
                  {t(`${app}.essays.${key}`)}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { mobile: '0.8rem', notebook: '1.5rem' },
                    fontWeight: '700',
                    ':hover': { opacity: 0.8, cursor: 'pointer', transition: '.3s' },
                  }}
                >
                  <Link
                    href={standard.link}
                    target="standard"
                    style={{
                      textDecoration: 'none',
                      color: '#383838' /* primaryTons.mainGray */,
                    }}
                  >
                    {standard.name}
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
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
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box
            sx={{
              width: { mobile: '100%', notebook: '90%' },
              bgcolor: 'primaryTons.mainWhite',
              borderRadius: '20px',
              padding: '1rem',
              border: '1px solid #CFCFCF',
            }}
          >
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
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
                height: '33px',
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
          {stepperData.length - 1 !== activeStep && (
            <Button
              variant="contained"
              disabled={nextDisabled}
              onClick={async () => {
                // create a loading toast
                const nextToast = toast.loading(t('loading.nextStep.pending'), { autoClose: 5000 });
                try {
                  // check if the activeStep is the same as the step of the current child
                  if (activeStep !== childrens[activeStep]?.step) throw t('loading.invalid-step');

                  // call and wait the callback function
                  await nextCallback(activeStep, childrens[activeStep]['data']);
                  toast.update(nextToast, {
                    autoClose: 5000,
                    type: 'success',
                    render: t('loading.nextStep.success'),
                    isLoading: false,
                    closeButton: true,
                  });
                  // if the callback function is successful, go to the next step
                  setActiveStep(activeStep + 1);
                  // disable the next step button
                  setNextDisabled(true);
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
                height: '33px',
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
                {t('next')}
              </Typography>
              <NextIcon />
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EssayTemplate;