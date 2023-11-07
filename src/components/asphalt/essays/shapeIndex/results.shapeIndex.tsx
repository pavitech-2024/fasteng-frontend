import { EssayPageProps } from '@/components/templates/essay';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import { t } from 'i18next';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import Result_Card from '@/components/atoms/containers/result-card';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { Box } from '@mui/material';
import useShapeIndexStore from '@/stores/asphalt/shapeIndex/shapeIndex.store';
import StepDescription from '@/components/atoms/titles/step-description';

const ShapeIndex_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { results: shapeIndex_results, generalData } = useShapeIndexStore();

  const data = {
    // container "Resultados"
    container_other_data: [],
  };

  if (shapeIndex_results) {
    data.container_other_data.push({
      label: t('shapeIndex.shapeIndex'),
      value: shapeIndex_results.shape_index,
      unity: '',
    });
  }

  // criando o objeto que será passado para o componente ExperimentResume
  const experimentResumeData: ExperimentResumeData = {
    experimentName: generalData.name,
    materials: [{ name: generalData.material.name, type: generalData.material.type }],
  };

  return (
    <>
      <ExperimentResume data={experimentResumeData} />
      <FlexColumnBorder title={t('results')} open={true}>
        <ResultSubTitle title={t('asphalt.essays.shapeIndex')} sx={{ margin: '.65rem' }} />
        {shapeIndex_results.alerts.map((item, index) => (
          <StepDescription key={`alert-${index}`} text={t(item)} warning />
        ))}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' },
            gap: '10px',
            mt: '20px',
          }}
        >
          {data.container_other_data.map((item, index) => (
            <Result_Card key={index} label={item.label} value={item.value} unity={item.unity} />
          ))}
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default ShapeIndex_Results;
