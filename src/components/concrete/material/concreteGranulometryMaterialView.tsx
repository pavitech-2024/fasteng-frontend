import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import { EssaysData } from '@/pages/concrete/materials/material/[id]';
import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import Chart from 'react-google-charts';
import ConcreteGranulometry_resultsTable from '../essays/granulometry/tables/results-table.granulometry';
import Loading from '@/components/molecules/loading';

export interface IGranulometryMateriaView {
  granulometryData: EssaysData['concreteGranulometryData'];
}

const GranulometryMateriaView = ({ granulometryData }: IGranulometryMateriaView) => {
  const data = {
    container_other_data: [],
  };

  if (granulometryData) {
    data.container_other_data.push(
      { label: t('granulometry-concrete.total-retained'), value: granulometryData.results.total_retained, unity: 'g' },
      { label: t('granulometry-concrete.nominal-size'), value: granulometryData.results.nominal_size, unity: 'mm' },
      {
        label: t('granulometry-concrete.nominal-diameter'),
        value: granulometryData.results.nominal_diameter,
        unity: 'mm',
      },
      {
        label: t('granulometry-concrete.fineness-module'),
        value: granulometryData.results.fineness_module,
        unity: '%',
      },
      { label: t('granulometry-concrete.cc'), value: granulometryData.results.cc },
      { label: t('granulometry-concrete.cnu'), value: granulometryData.results.cnu },
      { label: t('granulometry-concrete.error'), value: granulometryData.results.error, unity: '%' }
    );
  }

  const graph_data = [
    [t('granulometry-concrete.passant'), t('granulometry-concrete.diameter')],
    ...granulometryData.results.graph_data,
  ];

  const rows = [];

  granulometryData.step2Data.table_data.map((value, index) => {
    rows.push({
      sieve: value.sieve,
      passant_porcentage: value.passant,
      passant: granulometryData.results.passant[index],
      retained_porcentage: granulometryData.results.retained_porcentage[index],
      retained: value.retained,
      accumulated_retained: granulometryData.results.accumulated_retained[index],
    });
  });

  const columns: GridColDef[] = [
    {
      field: 'sieve',
      headerName: t('granulometry-concrete.sieves'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'passant_porcentage',
      headerName: t('granulometry-concrete.passant') + ' (%)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'passant',
      headerName: t('granulometry-concrete.passant') + ' (g)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'retained_porcentage',
      headerName: t('granulometry-concrete.retained') + ' (%)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'retained',
      headerName: t('granulometry-concrete.retained') + ' (g)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'accumulated_retained',
      headerName: t('granulometry-concrete.accumulated-retained') + ' (%)',
      valueFormatter: ({ value }) => `${value}`,
    },
  ];

  return (
    <FlexColumnBorder title={t('concrete.essays.granulometry')} open={true}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          gap: '10px',
          mt: '20px',
        }}
      >
        {data.container_other_data.map((item, index) => (
          <Result_Card key={index} label={item.label} value={item.value} unity={item.unity} />
        ))}
      </Box>
      <div id="chart-div-granulometry-concrete">
        <Chart
          chartType="LineChart"
          width={'100%'}
          height={'400px'}
          loader={<Loading />}
          data={graph_data}
          options={{
            title: t('granulometry-concrete.granulometry'),
            backgroundColor: 'transparent',
            pointSize: '5',
            hAxis: {
              title: `${t('granulometry-concrete.sieve-openness') + ' (mm)'}`,
              type: 'number',
              scaleType: 'log',
            },
            vAxis: {
              title: `${t('granulometry-concrete.passant') + ' (%)'}`,
              minValue: '0',
              maxValue: '105',
            },
            legend: 'none',
          }}
        />
      </div>
      <ConcreteGranulometry_resultsTable rows={rows} columns={columns} />
    </FlexColumnBorder> 
  );
};

export default GranulometryMateriaView;
