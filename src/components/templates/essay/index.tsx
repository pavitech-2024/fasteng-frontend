import React from 'react';
import Stepper from '../../atoms/stepper';
import { Box } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { toast } from 'react-toastify';
import StepDescription from '../../atoms/titles/step-description';
import { PageGenericContainer as Container } from '@/components/organisms/pageContainer';
import Header from '@/components/organisms/header';
import Footer from '@/components/organisms/footer';
import BodyEssay from '@/components/organisms/bodyEssay';

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

  async function handleNextClick() {
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
  }

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
            }
          }}
        >
          <Stepper activeStep={activeStep} stepperData={stepperData} variant="multicolor" />
        </Box>
      </Header>

      <BodyEssay>
        <Box
          sx={{
            width: { mobile: '90%', notebook: '80%' },
            padding: '2rem',
            borderRadius: '20px',
            bgcolor: 'primaryTons.white',
            border: '1px solid',
            borderColor: 'primaryTons.border'
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
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {'Page not found or not implemented yet.'}
              </Box>
            )
          }
        </Box>
      </BodyEssay>

      <Footer
        previousText={t('previous')}
        previousDisabled={activeStep === 0}
        handlePreviousClick={() => setActiveStep(activeStep - 1)}
        nextText={childrens.length - 1 === activeStep ? t('save') : t('next')}
        nextDisabled={nextDisabled}
        handleNextClick={handleNextClick}
      />
    </Container>
  );
};

export default EssayTemplate;