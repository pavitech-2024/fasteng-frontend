import FlexColumnBorder from "@/components/atoms/containers/flex-column-with-border";
import { EssaysData } from "@/pages/concrete/materials/material/[id]";
import { Box } from "@mui/material";
import { t } from "i18next";

export interface ICoarseAggregateSpecificMassMaterialView {
  specificMassData: EssaysData['coarseAggregateSpecificMassRepositoryData']
}

const CoarseAggregateSpecificMassMaterialView = ({ specificMassData }: ICoarseAggregateSpecificMassMaterialView) => {

  return (
    <FlexColumnBorder title={t('concrete.essays.coarseAggregate')} open={true}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' },
          gap: '10px',
        }}
      >
      </Box>
    </FlexColumnBorder>
  );
};

export default CoarseAggregateSpecificMassMaterialView;