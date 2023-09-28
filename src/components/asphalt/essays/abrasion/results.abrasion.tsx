import FlexColumnBorder from "@/components/atoms/containers/flex-column-with-border";
import ExperimentResume, { ExperimentResumeData } from "@/components/molecules/boxes/experiment-resume";
import { EssayPageProps } from "@/components/templates/essay";
import useAbrasionStore from "@/stores/asphalt/abrasion.store";
import { Box} from "@mui/material";
import { t } from "i18next";

const Abrasion_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { results: results, generalData } = useAbrasionStore();
  console.log("🚀 ~ file: results.abrasion.tsx:11 ~ results:", results)

  // const data = {
  //   abrasion: results.abrasion.toString(),
  //   alerts: results.alerts[0],
  // };

  // criando o objeto que será passado para o componente ExperimentResume
  const experimentResumeData: ExperimentResumeData = {
    experimentName: generalData.name,
    materials: [{ name: generalData.material.name, type: generalData.material.type }],
  };

  return (
    <>
      <ExperimentResume data={experimentResumeData} />
      <FlexColumnBorder title={t('results')} open={true}>
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
      </FlexColumnBorder>
    </>
  );
};

export default Abrasion_Results;