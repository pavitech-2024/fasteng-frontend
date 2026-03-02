// No EssayTemplate.tsx - ATUALIZADO

import React, { useState, useEffect } from 'react';
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
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';

export interface EssayTemplateProps {
  essayInfo: IEssayService['info'];
  childrens: { step: number; children: JSX.Element; data: unknown }[];
  nextCallback: (step: number, data: unknown) => Promise<void>;
  // 🔥 NOVAS PROPS
  marshallService?: Marshall_SERVICE;
  userId?: string;
}

export interface EssayPageProps {
  nextDisabled?: boolean;
  setNextDisabled?: React.Dispatch<React.SetStateAction<boolean>>;
}

const EssayTemplate = ({
  essayInfo: { stepperData, icon, key, standard },
  childrens,
  nextCallback,
  marshallService, // 👈 RECEBE
  userId, // 👈 RECEBE
}: EssayTemplateProps) => {
  const router = useRouter();
  const app = router.pathname.split('/')[1];
  const essay = router.pathname.split('/')[3];

  const isIGG = essay === 'igg';
  const isSuperpavePage = router.pathname.includes('superpave');

  const step = parseInt(sessionStorage.getItem(essay + '-step')) || 0;
  const [activeStep, setActiveStep] = useSessionStorage({ key: essay + '-step', initialValue: step });
  const [isEssaySaved, setIsEssaySaved] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(true);

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

    const isSaving = childrens.length - 1 === activeStep;

    const nextToast = toast.loading(isSaving ? t('loading.save.pending') : t('loading.nextStep.pending'), {
      autoClose: 5000,
    });

    try {
      if (activeStep !== childrens[activeStep]?.step) throw t('loading.invalid-step');
      
      await nextCallback(activeStep, childrens[activeStep]['data']);
      
      toast.update(nextToast, {
        autoClose: 5000,
        type: 'success',
        render: isSaving ? t('loading.save.success') : t('loading.nextStep.success'),
        isLoading: false,
        closeButton: true,
      });

      // 🔥 AQUI - Se for o último passo (isSaving = true)
      if (isSaving) {
        // Pega os dados COMPLETOS
        const completeData = childrens[activeStep]['data'];
        
        // 👇 CHAMA A ROTA NOVA (se for Marshall)
        if (essay === 'marshall' && marshallService && userId) {
          console.log('🔸 Salvando dosagem completa...');
          await marshallService.submitMarshalDosageData(completeData as any, userId);
        }
        
        setIsEssaySaved(true);
      } else {
        setActiveStep(activeStep + 1);
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
            activeStep === childrens[activeStep]?.step ? (
              React.Children.map(childrens[activeStep].children, (child) => {
                try {
                  const PROPS_TO_EXTEND: EssayPageProps = {
                    nextDisabled,
                    setNextDisabled,
                  };
                  if (React.isValidElement(child))
                    return React.cloneElement(child, PROPS_TO_EXTEND);
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