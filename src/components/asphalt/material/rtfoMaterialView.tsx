import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import { EssaysData } from '@/pages/asphalt/materials/material/[id]';
import { Alert, Box } from '@mui/material';
import { t } from 'i18next';
import Rtfo_resultsTable from '../essays/rtfo/table/results-table.rtfo';
import { GridColDef } from '@mui/x-data-grid';

export interface IRtfoMaterialView {
  rtfoData: EssaysData['rtfoData'];
}

const RtfoMaterialView = ({ rtfoData }: IRtfoMaterialView) => {
  const data = {
    weightLossAverage: rtfoData.results.weightLossAverage.toFixed(2).toString(),
    list: rtfoData.results.list,
    alerts: rtfoData.results.alerts[0],
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
  return (
    <FlexColumnBorder title={t('asphalt.essays.rtfo')} open={true}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
          mt: '20px',
        }}
      >
        {data.alerts && <Alert severity="warning">{data.alerts}</Alert>}

        <Box
          sx={{
            width: 'fit-content',
            display: 'flex',
            alignItems: 'center',
            gap: '30px',
            mt: '20px',
          }}
        >
          <Result_Card label={t('rtfo-weight-loss-average')} value={data.weightLossAverage} unity={'%'} />

          <Rtfo_resultsTable rows={rows} columns={columns} />
        </Box>
      </Box>
    </FlexColumnBorder>
  );
};

export default RtfoMaterialView;
