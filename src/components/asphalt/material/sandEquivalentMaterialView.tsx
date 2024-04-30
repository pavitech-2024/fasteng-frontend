import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import { EssaysData } from '@/pages/asphalt/materials/material/[id]';
import { Box, Alert } from '@mui/material';
import { t } from 'i18next';

export interface ISandEquivalentMaterialView {
  sandEquivalentData: EssaysData['sandEquivalentData'];
}

const SandEquivalentMaterialView = ({ sandEquivalentData }: ISandEquivalentMaterialView) => {
  const data = {
    sandEquivalent: sandEquivalentData.results.sandEquivalent.toString(),
    alerts: sandEquivalentData.results.alerts[0],
  };

  return (
    <FlexColumnBorder title={t('asphalt.essays.sandEquivalent')} open={true}>
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

        <Result_Card label={t('sandEquivalent-sand-equivalent')} value={data.sandEquivalent} unity={'%'} />
      </Box>
    </FlexColumnBorder>
  );
};

export default SandEquivalentMaterialView;
