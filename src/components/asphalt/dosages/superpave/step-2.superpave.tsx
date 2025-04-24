import { EssayPageProps } from "@/components/templates/essay";
import { Box } from "@mui/material";
import Superpave_SERVICE from "@/services/asphalt/dosages/superpave/superpave.service";
import useSuperpaveStore from "@/stores/asphalt/superpave/superpave.store";
import CreateMaterialDosageTable from "./tables/createMaterialDosageTable";
import AsphaltGranulometry_step2Table from "../../essays/granulometry/tables/step2-table.granulometry";

const Superpave_Step2 = ({ setNextDisabled, nextDisabled }: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const { granulometryEssayData: data, setData } = useSuperpaveStore();

  return (
    <Box>
      <CreateMaterialDosageTable/>
      <AsphaltGranulometry_step2Table rows={[]} columns={[]}/>
    </Box>
  );
};

export default Superpave_Step2;