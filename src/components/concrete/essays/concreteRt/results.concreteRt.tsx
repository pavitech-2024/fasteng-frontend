import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useConcreteRtStore from '@/stores/concrete/concreteRt/concreteRt.store';
import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import Chart from 'react-google-charts';

const ConcreteRt_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { results: results, generalData } = useConcreteRtStore();
  console.log("🚀 ~ results:", results)

  // criando o objeto que será passado para o componente ExperimentResume
  const experimentResumeData: ExperimentResumeData = {
    experimentName: generalData.name,
    materials: [{ name: generalData.material.name, type: generalData.material.type }],
  };

  const resultCards = [
    {
      key: 'flexualTensileStrength',
      label: t('results.flexual-tensile'),
      value: results.flexualTensileStrength?.toFixed(4).toString(),
    },
    {
      key: 'compressionResistance',
      label: t('results.compression'),
      value: results.compressionResistance?.toFixed(4).toString(),
    },
  ];

  return (
    <>
      <ExperimentResume data={experimentResumeData} />
      <FlexColumnBorder title={t('results')} open={true}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            gap: '10px',
            mt: '20px',
          }}
        >
          {resultCards.map((item) => (
            <Result_Card key={item.key} label={item.label} value={item.value} unity={'Mpa'} />
          ))}
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default ConcreteRt_Results;
