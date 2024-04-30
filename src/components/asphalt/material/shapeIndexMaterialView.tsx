import FlexColumnBorder from "@/components/atoms/containers/flex-column-with-border";
import Result_Card from "@/components/atoms/containers/result-card";
import { EssaysData } from "@/pages/asphalt/materials/material/[id]";
import { Box } from "@mui/material";
import exp from "constants";
import { t } from "i18next";

export interface IShapeIndexMaterialView {
  shapeIndexData: EssaysData['shapeIndexData']
}

const ShapeIndexMaterialView = ({ shapeIndexData }: IShapeIndexMaterialView) => {

  const data = {
    shapeIndexContainer: [],
  };

  if (shapeIndexData) {
    data.shapeIndexContainer.push({
      label: t('shapeIndex.shapeIndex'),
      value: shapeIndexData.results.shape_index,
      unity: '',
    });
  }

  return (
    <FlexColumnBorder title={t('asphalt.essays.shapeIndex')} open={true}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' },
          gap: '10px',
          mt: '20px',
        }}
      >
        {data.shapeIndexContainer.map((item, index) => (
          <Result_Card key={index} label={item.label} value={item.value} unity={item.unity} />
        ))}
      </Box>
    </FlexColumnBorder>
  );
};

export default ShapeIndexMaterialView
