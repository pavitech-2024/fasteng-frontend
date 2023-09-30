import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import { EssayPageProps } from '@/components/templates/essay';
import useAdhesivenessStore from '@/stores/asphalt/adhesiveness.store';
import { Box } from '@mui/material';
import { t } from 'i18next';

const ADHESIVENESS_Results = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  if (nextDisabled) setNextDisabled(false);

  const { results: adhesiveness_results, generalData } = useAdhesivenessStore();
  const filmDisplacement = adhesiveness_results.filmDisplacement ? t('adhesiveness.filmDisplacement-true') : t('adhesiveness.filmDisplacement-false');

  const experimentResumeData: ExperimentResumeData = {
    experimentName: generalData.name,
    materials: [{ name: generalData.material.name, type: generalData.material.type }],
  };

  return (
    <>
      <ExperimentResume data={experimentResumeData} />
      <FlexColumnBorder title={t('results')} open={true}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >

          <Result_Card 
            label={t('adhesiveness.chosen-filmDisplacement')} 
            value={filmDisplacement} 
            unity={''}
          />
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default ADHESIVENESS_Results;
