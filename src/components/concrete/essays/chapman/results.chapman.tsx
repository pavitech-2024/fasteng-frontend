import { t } from 'i18next';
import useAuth from '../../../../contexts/auth';
import useChapmanStore from '../../../../stores/concrete/chapman/chapman.store';
import FlexColumnBorder from '../../../atoms/containers/flex-column-with-border';
import ExperimentResume, { ExperimentResumeData } from '../../../molecules/boxes/experiment-resume';
import { EssayPageProps } from '../../../templates/essay';
import { Box } from '@mui/material';
import Result_Card from '../../../atoms/containers/result-card';

const CHAPMAN_Results = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  if (nextDisabled) setNextDisabled(false);

  const { results: chapman_results, generalData } = useChapmanStore();
  const { user } = useAuth();

  // pegando a quantidade de casas decimais do usuário
  const {
    preferences: { decimal: user_decimal },
  } = user;

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
          <Result_Card label={'M.E'} value={chapman_results.m_e.toFixed(user_decimal)} unity={'kg/L'} />
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default CHAPMAN_Results;
