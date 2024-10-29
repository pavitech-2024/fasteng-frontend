import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import { EssayPageProps } from '@/components/templates/essay';
import useConcreteRcStore from '@/stores/concrete/concreteRc/concreteRc.store';
import { Box, Typography } from '@mui/material';
import { t } from 'i18next';

const ConcreteRc_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { results: data, step2Data, step3Data, generalData } = useConcreteRcStore();

  // criando o objeto que será passado para o componente ExperimentResume
  const experimentResumeData: ExperimentResumeData = {
    experimentName: generalData.name,
    materials: [{ name: generalData.material.name, type: generalData.material.type }],
  };

  return (
    <>
      <ExperimentResume data={experimentResumeData} />
      <FlexColumnBorder title={t('results')} open={true}>
        <ResultSubTitle title={t('concrete.essays.concreteRc')} sx={{ margin: '.65rem' }} />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            gap: '10px',
            mt: '20px',
          }}
        >
          <Result_Card label={'fc'} value={data.finalCorrectionFactor?.toFixed(2).toString()} unity={'Mpa'} />
        </Box>

        <Box sx={{ width: 'fit-content', display: 'flex', flexDirection: 'column', gap: '10px', mt: '20px' }}>
          <Box
            component={'img'}
            sx={{ width: { mobile: '50%', notebook: '35%' }, height: '50%' }}
            src={step3Data.rupture.src}
            alt={'rupture image'}
          />
          <Typography
            sx={{
              margin: '.65rem',
              mb: '2rem',
              fontWeight: '500',
              textAlign: 'justify',
              lineHeight: '1.2rem',
              width: 'fit-content',
            }}
          >
            {step3Data.rupture.type}
          </Typography>
        </Box>

        <Box sx={{ width: 'fit-content', display: 'flex', flexDirection: 'column', gap: '10px', mt: '20px' }}>
          <Box
            component={'img'}
            sx={{ width: '100%', height: '50%' }}
            src={step3Data.graphImg.src}
            alt={'rupture image'}
          />
          <Typography
            sx={{
              margin: '.65rem',
              mb: '2rem',
              fontWeight: '500',
              textAlign: 'justify',
              lineHeight: '1.2rem',
              width: 'fit-content',
            }}
          >
            {step3Data.graphImg.name}
          </Typography>
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default ConcreteRc_Results;
