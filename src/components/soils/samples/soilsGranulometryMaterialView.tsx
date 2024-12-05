import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import Loading from '@/components/molecules/loading';
import { EssaysData } from '@/pages/soils/samples/sample/[id]';
import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import Chart from 'react-google-charts';
import SoilsGranulometry_resultsTable from '../essays/granulometry/tables/results-table.granulometry';

export interface IGranulometrySampleView {
  granulometryData: EssaysData['saoilGranulometryData'];
}

const GranulometrySampleView = ({ granulometryData }: IGranulometrySampleView) => {
  const data = {
    // container "Resultados"
    container_other_data: [],
  };

  if (granulometryData) {
    data.container_other_data.push(
      { label: t('granulometry-soils.total-retained'), value: granulometryData.results.total_retained, unity: 'g' },
      { label: t('granulometry-soils.nominalSize'), value: granulometryData.results.nominal_size, unity: 'mm' },
      {
        label: t('granulometry-soils.nominalDiammeter'),
        value: granulometryData.results.nominal_diameter,
        unity: 'mm',
      },
      { label: t('granulometry-soils.finenessModule'), value: granulometryData.results.fineness_module, unity: '%' },
      { label: t('granulometry-soils.cc'), value: granulometryData.results.cc },
      { label: t('granulometry-soils.cnu'), value: granulometryData.results.cnu },
      { label: t('granulometry-soils.error'), value: granulometryData.results.error, unity: '%' }
    );
  }

  const graph_data = [
    [t('granulometry-soils.passant'), t('granulometry-soils.diameter')],
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
      headerName: t('granulometry-soils.sieves'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'passant_porcentage',
      headerName: t('granulometry-soils.passant') + ' (%)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'passant',
      headerName: t('granulometry-soils.passant') + ' (g)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'retained_porcentage',
      headerName: t('granulometry-soils.retained') + ' (%)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'retained',
      headerName: t('granulometry-soils.retained') + ' (g)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'accumulated_retained',
      headerName: t('granulometry-soils.accumulated-retained') + ' (%)',
      valueFormatter: ({ value }) => `${value}`,
    },
  ];

  return (
    <FlexColumnBorder title={t('results')} open={true}>
      <ResultSubTitle title={t('soils.essays.granulometry')} sx={{ margin: '.65rem' }} />
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          // gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
          gap: '10px',
          mt: '20px',
        }}
      >
        {data.container_other_data.map((item, index) => (
          <Result_Card key={index} label={item.label} value={item.value} unity={item.unity} />
        ))}
      </Box>
      <Chart
        chartType="LineChart"
        width={'100%'}
        height={'400px'}
        loader={<Loading />}
        data={graph_data}
        options={{
          title: t('granulometry-soils.granulometry'),
          backgroundColor: 'transparent',
          pointSize: '2',
          hAxis: {
            title: `${t('granulometry-soils.sieve-openness') + ' (mm)'}`,
            type: 'number',
            scaleType: 'log',
          },
          vAxis: {
            title: `${t('granulometry-soils.passant') + ' (%)'}`,
            minValue: '0',
            maxValue: '105',
          },
          legend: 'none',
        }}
      />
      <SoilsGranulometry_resultsTable rows={rows} columns={columns} />
    </FlexColumnBorder>
  );
};

export default GranulometrySampleView;
