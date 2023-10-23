import ExperimentResume, { ExperimentResumeData } from "@/components/molecules/boxes/experiment-resume";
import { EssayPageProps } from "@/components/templates/essay";
import useRtcdStore from "@/stores/asphalt/rtcd.store";
import { Box } from "@mui/material";

const Rtcd_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
    nextDisabled && setNextDisabled(false);
    const { results: results, generalData } = useRtcdStore();
    console.log("🚀 ~ file: results.rtcd.tsx:9 ~ results:", results)
  
  
    // criando o objeto que será passado para o componente ExperimentResume
    const experimentResumeData: ExperimentResumeData = {
      experimentName: generalData.name,
      materials: [{ name: generalData.material.name, type: generalData.material.type }],
    };
  
    return (
      <>
        <ExperimentResume data={experimentResumeData} />
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
            
          </Box>
      </>
    );
  };
  
  export default Rtcd_Results;