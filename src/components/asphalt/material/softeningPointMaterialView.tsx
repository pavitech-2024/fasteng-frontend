import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import { EssaysData } from '@/pages/asphalt/materials/material/types/material.types';
import { Box, Alert } from '@mui/material';
import { t } from 'i18next';

export interface ISofteningPointMaterialView {
  softeningPointData: EssaysData['softeningPointData'];
}

const SofteningPointMaterialView = ({ softeningPointData }: ISofteningPointMaterialView) => {
  const data = {
    softeningPoint: softeningPointData.results.softeningPoint.toString(),
    alerts: softeningPointData.results.alerts,
  };

  return (
    <FlexColumnBorder title={t('asphalt.essays.softeningPoint')} open={true}>
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
  );
};

export default SofteningPointMaterialView;
