import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import { EssayPageProps } from '@/components/templates/essay';
import useSofteningPointStore from '@/stores/asphalt/softeningPoint/softeningPoint.store';
import { Alert, Box } from '@mui/material';
import { t } from 'i18next';

const SofteningPoint_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { results: results, generalData } = useSofteningPointStore();

  const data = {
    softeningPoint: results.softeningPoint.toString(),
    alerts: results.alerts,
  };

  // criando o objeto que será passado para o componente ExperimentResume
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
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '30px',
            mt: '20px',
          }}
        >
          {data.alerts.length > 0 &&
            data.alerts.map((alert, index) => (
              <Alert key={index} severity="warning">
                {alert}
              </Alert>
            ))}

          <Result_Card label={t('softeningPoint-result')} value={data.softeningPoint} unity={'°C'} />
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default SofteningPoint_Results;
