import FlexColumnBorder from "@/components/atoms/containers/flex-column-with-border";
import { EssayPageProps } from "@/components/templates/essay";
import { Box } from "@mui/material";
import { t } from "i18next";

const SayboltFurol_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  //const { results: results, generalData } = useSayboltFurolStore();

  // const data = {
  //   sayboltFurol: results.sayboltFurol.toString(),
  //   alerts: results.alerts[0],
  // };

  // criando o objeto que será passado para o componente ExperimentResume
  // const experimentResumeData: ExperimentResumeData = {
  //   experimentName: generalData.name,
  //   materials: [{ name: generalData.material.name, type: generalData.material.type }],
  // };

  return (
    <>
      {/* <ExperimentResume data={experimentResumeData} /> */}
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
          {/* {data.alerts && <Alert severity="warning">{data.alerts}</Alert>}

          <Result_Card label={t('sayboltFurol-sand-equivalent')} value={data.sayboltFurol} unity={'%'} /> */}
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default SayboltFurol_Results;