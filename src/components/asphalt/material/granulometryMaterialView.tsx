import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Loading from '@/components/molecules/loading';
import { t } from 'i18next';
import Chart from 'react-google-charts';
import AsphaltgranulometryDataTable from '../essays/granulometry/tables/results-table.granulometry';
import { EssaysData } from '@/components/asphalt/material/types/material.types';
import { GridColDef } from '@mui/x-data-grid';
import Result_Card, { Result_CardContainer } from '@/components/atoms/containers/result-card';
import { isArray } from 'util';

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

  const resultCards = [
    {
      label: t('granulometry-asphalt.accumulated-retained'),
      value: granulometryData.results.accumulated_retained,
      unity: '%',
    },
    { label: t('granulometry-asphalt.total-retained'), value: granulometryData.results.total_retained, unity: 'g' },
    {
      label: t('asphalt.essays.granulometry.results.nominalSize'),
      value: granulometryData.results.nominal_size,
      unity: 'mm',
    },
    {
      label: t('asphalt.essays.granulometry.results.nominalDiammeter'),
      value: granulometryData.results.nominal_diameter,
      unity: 'mm',
    },
    {
      label: t('asphalt.essays.granulometry.results.finenessModule'),
      value: granulometryData.results.fineness_module,
      unity: '%',
    },
    { label: t('granulometry-asphalt.cc'), value: granulometryData.results.cc },
    { label: t('granulometry-asphalt.cnu'), value: granulometryData.results.cnu },
    { label: t('granulometry-asphalt.error'), value: granulometryData.results.error, unity: '%' },
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
      <Result_CardContainer>
        {resultCards.map((item, index) => {
          if (!Array.isArray(item.value)) {
            return <Result_Card key={index} label={item.label} value={item.value.toString()} unity={item.unity} />;
          }
        })}
      </Result_CardContainer>

      <AsphaltgranulometryDataTable rows={rows} columns={columns} />
      <div id="chart-div-granulometry">
        <Chart
          chartType="LineChart"
          width={'100%'}
          height={'400px'}
          loader={<Loading />}
          data={graph_data}
          options={{
            title: t('granulometry-asphalt.granulometry'),
            backgroundColor: 'transparent',
            pointSize: '5',
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
      </div>
    </FlexColumnBorder>
  );
};

export default GranulometryMateriaView;
