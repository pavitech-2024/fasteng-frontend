import FlexColumnBorder from "@/components/atoms/containers/flex-column-with-border";
import Result_Card from "@/components/atoms/containers/result-card";
import ExperimentResume, { ExperimentResumeData } from "@/components/molecules/boxes/experiment-resume";
import { EssayPageProps } from "@/components/templates/essay";
import useSandEquivalentStore from "@/stores/asphalt/sandEquivalent/sandEquivalent.store";
import { Alert, Box } from "@mui/material";
import { t } from "i18next";

const SandEquivalent_Results = ({ 
  setNextDisabled, 
  nextDisabled 
}: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { results: results, generalData } = useSandEquivalentStore();

  const data = {
    sandEquivalent: results.sandEquivalent.toString(),
    alerts: results.alerts[0],
  };

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
          {data.alerts && <Alert severity="warning">{data.alerts}</Alert>}

          <Result_Card label={t('sandEquivalent-sand-equivalent')} value={data.sandEquivalent} unity={'%'} />

        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default SandEquivalent_Results;