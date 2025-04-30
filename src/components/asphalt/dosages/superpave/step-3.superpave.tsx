import Result_Card from '@/components/atoms/containers/result-card';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import Chart from 'react-google-charts';
import AsphaltGranulometry_resultsTable from '../../essays/granulometry/tables/results-table.granulometry';

const Superpave_Step3 = ({
  nextDisabled,
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const { granulometryResultsData, granulometryEssayData } = useSuperpaveStore();
  console.log("🚀 ~ granulometryResultsData:", granulometryResultsData)

  const data = {
    container_other_data: [],
  };

  // if (granulometryResultsData) {
  //   data.container_other_data.push(
  //     {
  //       label: t('granulometry-asphalt.accumulated-retained'),
  //       value: granulometryResultsData.accumulated_retained,
  //       unity: '%',
  //     },
  //     { label: t('granulometry-asphalt.total-retained'), value: granulometryResultsData.total_retained, unity: 'g' },
  //     {
  //       label: t('asphalt.essays.granulometry.results.nominalSize'),
  //       value: granulometryResultsData.nominal_size,
  //       unity: 'mm',
  //     },
  //     {
  //       label: t('asphalt.essays.granulometry.results.nominalDiammeter'),
  //       value: granulometryResultsData.nominal_diameter,
  //       unity: 'mm',
  //     },
  //     {
  //       label: t('asphalt.essays.granulometry.results.finenessModule'),
  //       value: granulometryResultsData.fineness_module,
  //       unity: '%',
  //     },
  //     { label: t('granulometry-asphalt.cc'), value: granulometryResultsData.cc },
  //     { label: t('granulometry-asphalt.cnu'), value: granulometryResultsData.cnu },
  //     { label: t('granulometry-asphalt.error'), value: granulometryResultsData.error, unity: '%' }
  //   );
  // }

  // const graph_data = [
  //   [t('granulometry-asphalt.passant'), t('granulometry-asphalt.diameter')],
  //   ...granulometryResultsData.graph_data,
  // ];

  const granulometryRows = [];

  // granulometryEssayData.table_data.map((value, index) => {
  //   rows.push({
  //     sieve: value.sieve_label,
  //     passant_porcentage: value.passant,
  //     passant: granulometryResultsData.passant[index][1],
  //     retained_porcentage: granulometryResultsData.retained_porcentage[index][1],
  //     retained: value.retained,
  //     accumulated_retained: granulometryResultsData.accumulated_retained[index][1],
  //   });
  // });

  const granulometryColumns: GridColDef[] = [
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

  // setNextDisabled(false);

  return (
    <>
      {/* <Box
        sx={{
          width: '100%',
          display: 'flex',
          gap: '10px',
          mt: '20px',
        }}
      >
        {data.container_other_data.map((item, index) => {
          if (Array.isArray(item.value)) {
            return null;
          } else {
            return <Result_Card key={index} label={item.label} value={item.value} unity={item.unity} />;
          }
        })}
      </Box>

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

      <AsphaltGranulometry_resultsTable rows={rows} columns={columns} /> */}
    </>
  );
};

export default Superpave_Step3;
