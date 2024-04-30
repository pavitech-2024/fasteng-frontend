import React from 'react';
import { Box } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { PageGenericContainer as Container } from '@/components/organisms/pageContainer';
import Header from '@/components/organisms/header';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import BodyEssay from '@/components/organisms/bodyEssay';
import { IMaterialService } from '@/interfaces/common/material';
import { AsphaltMaterial } from '@/interfaces/asphalt';

export interface MaterialTemplateProps {
  materialInfo: IMaterialService['info'];
  children: JSX.Element;
  data: AsphaltMaterial;
}

const MaterialTemplate = ({ materialInfo: { icon, key, standard }, children }: MaterialTemplateProps) => {
  const router = useRouter();
  const app = router.pathname.split('/')[1];
  const material = router.pathname.split('/')[3];

  return (
    <Container>
      <Header
        title={t(`${app}.materials.${key}`)}
        subTitle={standard?.name}
        image={icon}
        link={standard?.link}
      ></Header>

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
          {children}

          {/* {activeStep !== 0 && <StepDescription text={t(`${material}.step-${activeStep + 1}-description`)} />}
          {
            // to render the childrens with the props [ nextDisabled and setNextDisabled ]
            activeStep === childrens[activeStep]?.step ? (
              React.Children.map(childrens[activeStep].children, (child) => {
                try {
                  const PROPS_TO_EXTEND: MaterialPageProps = {
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
          } */}
        </Box>
      </BodyEssay>

      {/* <Footer
        previousText={t('footer.previous')}
        previousDisabled={activeStep === 0}
        handlePreviousClick={() => setActiveStep(activeStep - 1)}
        nextText={childrens.length - 1 === activeStep ? t('footer.save') : t('footer.next')}
        nextDisabled={nextDisabled}
        handleNextClick={handleNextClick}
      /> */}
    </Container>
  );
};

export default MaterialTemplate;
