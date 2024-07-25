import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Loading from '@/components/molecules/loading';
import { t } from 'i18next';
import Chart from 'react-google-charts';
import AsphaltGranulometry_resultsTable from '../essays/granulometry/tables/results-table.granulometry';
import { EssaysData } from '@/pages/asphalt/materials/material/[id]';
import { GridColDef } from '@mui/x-data-grid';

export interface IGranulometryMateriaView {
  granulometryData: EssaysData['asphaltGranulometryData'];
}

const GranulometryMateriaView = ({ granulometryData }: IGranulometryMateriaView) => {

  const rows = [];
  let graph_data;

  const columns: GridColDef[] = [
    {
      field: 'sieve',
      headerName: t('granulometry-asphalt.sieves'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'passant_porcentage',
      headerName: t('granulometry-asphalt.passant') + ' (%)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'passant',
      headerName: t('granulometry-asphalt.passant') + ' (g)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'retained_porcentage',
      headerName: t('granulometry-asphalt.retained') + ' (%)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'retained',
      headerName: t('granulometry-asphalt.retained') + ' (g)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'accumulated_retained',
      headerName: t('granulometry-asphalt.accumulated-retained') + ' (%)',
      valueFormatter: ({ value }) => `${value}`,
    },
  ];

  if (granulometryData?.results.graph_data) {
    graph_data = [
      [t('granulometry-asphalt.passant'), t('granulometry-asphalt.diameter')],
      ...granulometryData?.results.graph_data,
    ];

    granulometryData.step2Data.table_data.map((value, index) => {
      rows.push({
        sieve: value.sieve_label,
        passant_porcentage: value.passant,
        passant: granulometryData.results.passant[index][1],
        retained_porcentage: granulometryData.results.retained_porcentage[index][1],
        retained: value.retained,
        accumulated_retained: granulometryData.results.accumulated_retained[index][1],
      });
    });
  }

  return (
    <FlexColumnBorder title={t('asphalt.essays.granulometry')} open={true}>
      <AsphaltGranulometry_resultsTable rows={rows} columns={columns} />
      <Chart
        chartType="LineChart"
        width={'100%'}
        height={'400px'}
        loader={<Loading />}
        data={graph_data}
        options={{
          title: t('granulometry-asphalt.granulometry'),
          backgroundColor: 'transparent',
          pointSize: '2',
          hAxis: {
            title: `${t('granulometry-asphalt.sieve-openness') + ' (mm)'}`,
            type: 'number',
            scaleType: 'log',
          },
          vAxis: {
            title: `${t('granulometry-asphalt.passant') + ' (%)'}`,
            minValue: '0',
            maxValue: '105',
          },
          legend: 'none',
        }}
      />
    </FlexColumnBorder>
  );
};

export default GranulometryMateriaView;
