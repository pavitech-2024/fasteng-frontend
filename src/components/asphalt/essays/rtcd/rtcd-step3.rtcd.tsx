import { EssayPageProps } from "@/components/templates/essay";
import useRtcdStore from "@/stores/asphalt/rtcd.store";
import { Box } from "@mui/material";

const Rtcd_Step3 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  console.log("🚀 ~ file: rtcd-step3.rtcd.tsx:6 ~ setNextDisabled:", setNextDisabled)
  const { rtcdStep3: data, setData } = useRtcdStore();
  console.log("🚀 ~ file: rtcd-step3.rtcd.tsx:8 ~ setData:", setData)
  console.log("🚀 ~ file: rtcd-step3.rtcd.tsx:8 ~ data:", data)

  if (nextDisabled) {
    // const hasEmptyValues = data.dnitRange && data.pressConstant && data.pressSpecification && data.sampleOrigin && data.sampleVoidVolume !== null;
    // if (hasEmptyValues) setNextDisabled(false);
  }

  return (
    <Box sx={{ width: '100%', marginX: 'auto' }}>
      
    </Box>
  );
};

export default Rtcd_Step3;