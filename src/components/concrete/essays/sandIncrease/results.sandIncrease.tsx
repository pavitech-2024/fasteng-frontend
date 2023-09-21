import useSandIncreaseStore from '@/stores/concrete/sandIncrease/sandIncrease.store';
import { EssayPageProps } from '../../../templates/essay';
import { Box } from '@mui/material';
import { t } from 'i18next';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Result_Card from '@/components/atoms/containers/result-card';
import GraphSandIncrease from './graphSandIncrease';

const Sand_Increase_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { results: sand_increase_results } = useSandIncreaseStore();

  const newArray = [];

  for (let i = 0; i < sand_increase_results.unitMasses.length; i++) {
    const sampleNumber = (i + 1).toString();

    const newObj = {
      sample: sampleNumber,
      moistureContent: sand_increase_results.moistureContent[i].toFixed(2),
      swellings: sand_increase_results.swellings[i].toFixed(2),
      unitMass: sand_increase_results.unitMasses[i],
    };

    newArray.push(newObj);
  }

  const rows = newArray;

  const columns: GridColDef[] = [
    {
      field: 'sample',
      headerName: t('sandIncrease.samples'),
      valueFormatter: ({ value }) => `Amostra ${value}`,
    },
    {
      field: 'unitMass',
      headerName: t('sandIncrease.unitMass'),
      valueFormatter: ({ value }) => `${value.toFixed(2)}`,
    },
    {
      field: 'moistureContent',
      headerName: t('sandIncrease.moistureContent') + ' encontrado (%)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'swellings',
      headerName: t('sandIncrease.swellings'),
      valueFormatter: ({ value }) => `${value}`,
    },
  ];

  return (
    <Box>
      <DataGrid
        sx={{ mt: '1rem', borderRadius: '10px', mb: '1rem' }}
        density="compact"
        hideFooter
        showCellVerticalBorder
        showColumnVerticalBorder
        columns={columns.map((column) => ({
          ...column,
          disableColumnMenu: true,
          sortable: false,
          align: 'center',
          headerAlign: 'center',
          minWidth: 100,
          flex: 1,
        }))}
        rows={rows.map((row, index) => ({ ...row, id: index }))}
      />
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <Result_Card
          label={`${t('sandIncrease.averageCoefficient')}`}
          value={sand_increase_results?.averageCoefficient?.toFixed(3).toString()}
          unity={''}
        />
        <Result_Card
          label={`${t('sandIncrease.criticalHumidity')}`}
          value={sand_increase_results?.criticalHumidity?.toFixed(3).toString()}
          unity={''}
        />
      </Box>

      <GraphSandIncrease results={sand_increase_results} />
    </Box>
  );
};

export default Sand_Increase_Results;
