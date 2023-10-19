import { EssayPageProps } from "@/components/templates/essay";
import useDduiStore from "@/stores/asphalt/ddui.store";
import { Box } from "@mui/material";

const Ddui_Step3 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  console.log("🚀 ~ file: ddui-step3.ddui.tsx:6 ~ setNextDisabled:", setNextDisabled)
  const { dduiStep3: data, setData } = useDduiStore();
  console.log("🚀 ~ file: ddui-step3.ddui.tsx:8 ~ setData:", setData)
  console.log("🚀 ~ file: ddui-step3.ddui.tsx:8 ~ data:", data)

  if (nextDisabled) {
    // const hasEmptyValues = data.dnitRange && data.pressConstant && data.pressSpecification && data.sampleOrigin && data.sampleVoidVolume !== null;
    // if (hasEmptyValues) setNextDisabled(false);
  }

  return (
    <Box sx={{ width: '100%', marginX: 'auto' }}>
      
    </Box>
  );
};

export default Ddui_Step3;