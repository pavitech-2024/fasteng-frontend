import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import { EssayPageProps } from '@/components/templates/essay';
import useConcreteRcStore from '@/stores/concrete/concreteRc/concreteRc.store';
import { Box } from '@mui/material';
import { t } from 'i18next';

const ConcreteRc_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { results: data, step2Data, generalData } = useConcreteRcStore();

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
            // gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
            gap: '10px',
            mt: '20px',
          }}
        >
          <Result_Card label={'fc'} value={data.finalCorrectionFactor.toFixed(2).toString()} unity={'Mpa'}/>
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default ConcreteRc_Results;
