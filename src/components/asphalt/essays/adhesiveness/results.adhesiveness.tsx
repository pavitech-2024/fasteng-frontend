import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import useAdhesivenessStore from '@/stores/asphalt/adhesiveness.store';
import { Box } from '@mui/material';
import { t } from 'i18next';

const ADHESIVENESS_Results = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  if (nextDisabled) setNextDisabled(false);

  const { results: adhesiveness_results, generalData } = useAdhesivenessStore();
  console.log('🚀 ~ file: results.adhesiveness.tsx:13 ~ adhesiveness_results:', adhesiveness_results);
  const { user } = useAuth();
  console.log('🚀 ~ file: results.adhesiveness.tsx:15 ~ user:', user);

  // // pegando a quantidade de casas decimais do usuário
  // const {
  //   preferences: { decimal: user_decimal },
  // } = user;

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
        ></Box>
      </FlexColumnBorder>
    </>
  );
};

export default ADHESIVENESS_Results;
