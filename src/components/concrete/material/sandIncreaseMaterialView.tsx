import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import { EssaysData } from '@/pages/concrete/materials/material/[id]';
import { Box } from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { t } from 'i18next';
import GraphSandIncrease from '../essays/sandIncrease/graphSandIncrease';

export interface ISandIncreaseMaterialView {
  sandIncreaseData: EssaysData['sandIncreaseData'];
}

const SandIncreaseMaterialView = ({ sandIncreaseData }: ISandIncreaseMaterialView) => {
  const newArray = [];

  for (let i = 0; i < sandIncreaseData.results.unitMasses.length; i++) {
    const sampleNumber = (i + 1).toString();

    const newObj = {
      sample: sampleNumber,
      moistureContent: sandIncreaseData.results.moistureContent[i].toFixed(2),
      swellings: sandIncreaseData.results.swellings[i].toFixed(2),
      unitMass: sandIncreaseData.results.unitMasses[i],
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
    <FlexColumnBorder title={t('concrete.essays.sandIncrease')} open={true}>
      <Box>
        <DataGrid
          sx={{ borderRadius: '10px', mb: '1rem' }}
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
            value={sandIncreaseData.results?.averageCoefficient?.toFixed(3).toString()}
            unity={''}
          />
          <Result_Card
            label={`${t('sandIncrease.criticalHumidity')}`}
            value={sandIncreaseData.results?.criticalHumidity?.toFixed(3).toString()}
            unity={''}
          />
        </Box>
        <div id="chart-div-sand-increase-material">
          <GraphSandIncrease results={sandIncreaseData.results} />
        </div>
      </Box>
    </FlexColumnBorder>
  );
};

export default SandIncreaseMaterialView;
