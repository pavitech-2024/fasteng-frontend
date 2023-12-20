import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card, { Result_CardContainer } from '@/components/atoms/containers/result-card';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import { EssayPageProps } from '@/components/templates/essay';
import useUnitMassStore from '@/stores/concrete/unitMass/unitMass.store';
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
        <Result_CardContainer hideBorder mt={'none'} title={t('unitMass.result')}>
          <Result_Card label={''} value={unitMassResult} unity={'Kg/L'} />
        </Result_CardContainer>
      </FlexColumnBorder>
    </>
  );
};

export default UnitMass_Results;
