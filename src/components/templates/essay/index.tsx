import React, { useState } from 'react';
import { Stepper } from '../../atoms/stepper';
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
import { useSessionStorage } from '../../../utils/hooks/useSessionStorage';



export interface EssayTemplateProps {

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

  const isIGG = essay === 'igg'; // Condicional para alterar somente o titulo do igg sem afetar o titulo dos outros ensaios

  const isSuperpavePage = router.pathname.includes('superpave');

  // persiste the active step in the sessionStorage, if the user reload the page, the active step will be the same  example: cbr-{step}
  const step = parseInt(sessionStorage.getItem(essay + '-step')) || 0;
  const [activeStep, setActiveStep] = useSessionStorage({ key: essay + '-step', initialValue: step });
  const [isEssaySaved, setIsEssaySaved] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(true);

  /**
   * Function to handle the click event of the next button.
   * If the user is in the last step, it will save the essay and in the next click it will reset the essay.
   * If the user is not in the last step, it will call the nextCallback function with the current step and data.
   * If the nextCallback function is successful, it will go to the next step and thenext button will change to save essay and if the user save the essay the button will change to reset essay.
   * If the nextCallback function fails, it will show an error toast.
   *
   * @remarks
   * This function is used in the EssayTemplate component.
   */
  async function handleNextClick() {
    if (isEssaySaved && childrens.length - 1 === activeStep) {
      childrens.forEach(({ children }) => {
        const essayProps = children.props[essay];
        if (essayProps) {
          essayProps.store_actions.reset();
        }
      });
      sessionStorage.clear();
      setIsEssaySaved(false);
      setActiveStep(0);
      return;
    }

    // to check if the button is saving or going to the next step
    const isSaving = childrens.length - 1 === activeStep;

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

      if (isSaving) {
        setIsEssaySaved(true);
      } else {
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
      <Header
        title={isIGG ? 'Índice de Gravidade Global (IGG)' : t(`${app}.essays.${key}`)}
        subTitle={standard.name}
        image={icon}
        link={standard.link}
      >
        <Box
          sx={{
            width: { mobile: '100%', notebook: isSuperpavePage ? '100%' : '75%' },
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

      <BodyEssay>
        <Box
          sx={{
            width: { mobile: '90%', notebook: '80%' },
            maxWidth: '2200px',
            padding: '2rem',
            borderRadius: '20px',
            bgcolor: 'primaryTons.white',
            border: '1px solid',
            borderColor: 'primaryTons.border',
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
      </BodyEssay>

      <Footer
        previousText={t('footer.previous')}
        previousDisabled={activeStep === 0}
        handlePreviousClick={() => {
          setActiveStep(activeStep - 1);
        }}
        nextText={
          isEssaySaved && childrens.length - 1 === activeStep
            ? t('footer.newEssay')
            : childrens.length - 1 === activeStep
            ? t('footer.save')
            : t('footer.next')
        }
        nextDisabled={nextDisabled}
        handleNextClick={handleNextClick}
      />
    </Container>
  );
};

export default EssayTemplate;
