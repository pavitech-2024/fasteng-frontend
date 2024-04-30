import FlexColumnBorder from "@/components/atoms/containers/flex-column-with-border";
import Result_Card from "@/components/atoms/containers/result-card";
import { EssaysData } from "@/pages/asphalt/materials/material/[id]";
import { Box } from "@mui/material";
import { t } from "i18next";

export interface IAdhesivenessData {
  adhesivenessData: EssaysData['adhesivenessData']
}

const AdhesivenessData = ({ adhesivenessData }) => {

  const filmDisplacement = adhesivenessData.filmDisplacement
  ? t('adhesiveness.filmDisplacement-true')
  : t('adhesiveness.filmDisplacement-false');

  return (
    <FlexColumnBorder title={t('asphalt.essay.adhesiveness')} open={true}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Result_Card label={t('adhesiveness.chosen-filmDisplacement')} value={filmDisplacement} unity={''} />
      </Box>
    </FlexColumnBorder>
  );
};

export default AdhesivenessData;
