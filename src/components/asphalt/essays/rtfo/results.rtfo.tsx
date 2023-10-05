import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import { EssayPageProps } from '@/components/templates/essay';
import useRtfoStore from '@/stores/asphalt/rtfo/rtfo.store';
import { Alert, Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import Rtfo_resultsTable from './table/results-table.rtfo';

const Rtfo_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { results: results, generalData } = useRtfoStore();

  const data = {
    weightLossAverage: results.weightLossAverage.toFixed(2).toString(),
    list: results.list,
    alerts: results.alerts[0],
  };

  const columns: GridColDef[] = [
    {
      field: 'weightLoss',
      headerName: t('rtfo.weight-loss'),
    },
  ];

  const rows = data.list.map((item, index) => ({
    id: index + 1,
    weightLoss: item.weightLoss.toFixed(2),
  }));

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

          <Result_Card label={t('rtfo-weight-loss-average')} value={data.weightLossAverage} unity={'%'} />

          <Rtfo_resultsTable rows={rows} columns={columns}/>
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default Rtfo_Results;
