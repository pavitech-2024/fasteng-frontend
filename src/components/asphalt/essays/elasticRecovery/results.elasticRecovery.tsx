import { EssayPageProps } from '@/components/templates/essay';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import { t } from 'i18next';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import Result_Card from '@/components/atoms/containers/result-card';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { Box } from '@mui/material';
import useElasticRecoveryStore from '@/stores/asphalt/elasticRecovery/elasticRecovery.store';

const ElasticRecovery_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { results: elasticRecovery_results, generalData } = useElasticRecoveryStore();

  const data = {
    // container "Resultados"
    container_other_data: [],
  };

  if (elasticRecovery_results) {
    data.container_other_data.push({
      label: t('elasticRecovery.elasticRecovery'),
      value: elasticRecovery_results.elasticRecovery,
      unity: '%',
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
        <ResultSubTitle title={t('asphalt.essays.elasticRecovery')} sx={{ margin: '.65rem' }} />
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

export default ElasticRecovery_Results;
