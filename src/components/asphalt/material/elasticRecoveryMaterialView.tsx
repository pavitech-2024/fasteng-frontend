import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import { EssaysData } from '@/pages/asphalt/materials/material/types/material.types';
import { Box } from '@mui/material';
import { t } from 'i18next';

export interface IElasticRecoveryMaterialView {
  elasticRecoveryData: EssaysData['elasticRecoveryData'];
}

const ElasticRecoveryMaterialView = ({ elasticRecoveryData }: IElasticRecoveryMaterialView) => {
  const data = {
    // container "Resultados"
    container_other_data: [],
  };

  if (elasticRecoveryData) {
    data.container_other_data.push({
      label: t('elasticRecovery.elasticRecovery'),
      value: elasticRecoveryData.results.elasticRecovery,
      unity: '%',
    });
  }

  return (
    <FlexColumnBorder title={t('asphalt.essays.elasticRecovery')} open={true}>
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
  );
};

export default ElasticRecoveryMaterialView;
