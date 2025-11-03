import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import { EssaysData } from '@/components/asphalt/material/types/material.types';
import { Box, Alert } from '@mui/material';
import { t } from 'i18next';

export interface IpenetrationMaterialView {
  penetrationData: EssaysData['penetrationData'];
}

const PenetrationMaterialView = ({ penetrationData }: IpenetrationMaterialView) => {
  const data = {
    penetration: penetrationData.results.penetration.toString(),
    alerts: penetrationData.results.alerts[0],
  };

  return (
    <FlexColumnBorder title={t('asphalt.essays.penetration-asphalt')} open={true}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
          mt: '20px',
        }}
      >
        {data.alerts && <Alert severity="warning">{data.alerts}</Alert>}
        <Result_Card label={t('asphalt.essays.penetration-asphalt')} value={data.penetration} unity={'mm'} />
      </Box>
    </FlexColumnBorder>
  );
};

export default PenetrationMaterialView;
