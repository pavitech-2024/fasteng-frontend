import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card, { Result_CardContainer } from '@/components/atoms/containers/result-card';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import { EssayPageProps } from '@/components/templates/essay';
import useUnitMassStore from '@/stores/concrete/unitMass/unitMass.store';
import { Box } from '@mui/material';
import { t } from 'i18next';

const UnitMass_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { result: result, generalData } = useUnitMassStore();

  const experimentResumeData: ExperimentResumeData = {
    experimentName: generalData.experimentName,
    materials: [{ name: generalData.material.name, type: generalData.material.type }],
  };

  const unitMassResult = Number(result.result).toFixed(1);

  return (
    <>
      <ExperimentResume data={experimentResumeData} />
      <FlexColumnBorder title={t('results')} open={true}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            gap: '10px',
            justifyContent: { mobile: 'center', notebook: 'flex-start' },
          }}
        >
          <Result_Card label={t('unitMass.unitMass')} value={unitMassResult} unity={'Kg/L'} />
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default UnitMass_Results;
