import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import { EssayPageProps } from '@/components/templates/essay';
import usePenetrationStore from '@/stores/asphalt/penetration/penetration.store';
import { Alert, Box } from '@mui/material';
import { t } from 'i18next';

const Penetration_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { results: results, generalData } = usePenetrationStore();

  const data = {
    penetration: Number(results.penetration?.toFixed(2)).toString(),
    alerts: Array.isArray(results.alerts) ? results.alerts[0] : null,
  };

  const experimentResumeData: ExperimentResumeData = {
    experimentName: generalData.name,
    materials: [{ name: generalData.material?.name, type: generalData.material?.type }],
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
          {data.alerts && <Alert severity="warning">{data.alerts}</Alert>}
          <Result_Card label={t('asphalt.essays.penetration-asphalt')} value={data.penetration} unity={'mm'} />
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default Penetration_Results;
