import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import { EssaysData } from '@/components/asphalt/material/types/material.types';
import { Box, Alert } from '@mui/material';
import { t } from 'i18next';

export interface ILosAngelesAbrasionMaterialView {
  losAngelesAbrasionData: EssaysData['losAngelesAbrasionData'];
}

const LosAngelesAbrasionMaterialView = ({ losAngelesAbrasionData }: ILosAngelesAbrasionMaterialView) => {
  const data = {
    losAngelesAbrasion: losAngelesAbrasionData.results.losAngelesAbrasion.toFixed(2).toString(),
    alerts: losAngelesAbrasionData.results.alerts[0],
  };

  return (
    <FlexColumnBorder title={t('asphalt.essays.abrasion')} open={true}>
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
        <Result_Card label={t('asphalt.essays.abrasion')} value={data.losAngelesAbrasion} unity={'%'} />
      </Box>
    </FlexColumnBorder>
  );
};

export default LosAngelesAbrasionMaterialView;
