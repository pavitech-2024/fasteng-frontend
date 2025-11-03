import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import { EssaysData } from '@/pages/asphalt/materials/material/types/material.types';
import { Box } from '@mui/material';
import { t } from 'i18next';

export interface IFlashPointMaterialView {
  flashPointData: EssaysData['flashPointData'];
}

const FlashPointMaterialView = ({ flashPointData }: IFlashPointMaterialView) => {
  const data = {
    // container "Resultados"
    container_other_data: [],
  };

  if (flashPointData) {
    data.container_other_data.push({
      label: t('flashPoint.temperature'),
      value: flashPointData.results.temperature,
      unity: '°C',
    });
  }

  return (
    <FlexColumnBorder title={t('asphalt.essays.flashPoint')} open={true}>
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

export default FlashPointMaterialView;
