import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAsphaltGranulometryStore from '@/stores/asphalt/granulometry/asphalt-granulometry.store';
import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import Chart, { GoogleChartOptions, ReactGoogleChartProps } from 'react-google-charts';
import AsphaltGranulometry_resultsTable from './tables/results-table.granulometry';
import SettingsOverscanIcon from '@mui/icons-material/SettingsOverscan';
import { useState } from 'react';

const AsphaltGranulometry_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { results: granulometry_results, step2Data, generalData } = useAsphaltGranulometryStore();
  console.log("🚀 ~ constAsphaltGranulometry_Results= ~ granulometry_results:", granulometry_results)

  const [graphOptions, setGraphOptions] = useState<GoogleChartOptions>(
    {
      title: '',
      hAxis: {
        title: 'Abertura das peneiras (mm)',
        logScale: true,
        titleTextStyle: {
          color: '#3d3d3d',
          bold: true,
          italic: false,
        },
        gridlines: {
          color: '#000',
          count: 4,
        },
        minorGridlines: {
          count: 8,
        },
        // ticks: [0, 0.1, 1, 10, 100],
        ticks: granulometry_results.graph_data.map((item: any) => item[0]),
      },
      vAxis: {
        title: 'Porcentagem passante',
        titleTextStyle: {
          color: '#3d3d3d',
          bold: true,
          italic: false,
        },
        ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      },
      legend: 'none',
      chartArea: { width: '80%', height: '80%' },
      backgroundColor: 'transparent'
    }
  );
  console.log("🚀 ~ constAsphaltGranulometry_Results= ~ graphOptions:", graphOptions)

  const [graphIsFullscreen, setGraphIsFullscreen] = useState(false);

  const data = {
    container_other_data: [],
  };

  if (granulometry_results) {
    data.container_other_data.push(
      {
        label: t('granulometry-asphalt.accumulated-retained'),
        value: granulometry_results.accumulated_retained,
        unity: '%',
      },
      { label: t('granulometry-asphalt.total-retained'), value: granulometry_results.total_retained, unity: 'g' },
      {
        label: t('asphalt.essays.granulometry.results.nominalSize'),
        value: granulometry_results.nominal_size,
        unity: 'mm',
      },
      {
        label: t('asphalt.essays.granulometry.results.nominalDiammeter'),
        value: granulometry_results.nominal_diameter,
        unity: 'mm',
      },
      {
        label: t('asphalt.essays.granulometry.results.finenessModule'),
        value: granulometry_results.fineness_module,
        unity: '%',
      },
      { label: t('granulometry-asphalt.cc'), value: granulometry_results.cc },
      { label: t('granulometry-asphalt.cnu'), value: granulometry_results.cnu },
      { label: t('granulometry-asphalt.error'), value: granulometry_results.error, unity: '%' }
    );
  }

  // criando o objeto que será passado para o componente ExperimentResume
  const experimentResumeData: ExperimentResumeData = {
    experimentName: generalData.name,
    materials: [{ name: generalData.material.name, type: generalData.material.type }],
  };

  const graph_data = [
    [t('granulometry-asphalt.passant'), t('granulometry-asphalt.diameter')],
    ...granulometry_results.graph_data,
  ];

  const rows = [];

  step2Data.table_data.map((value, index) => {
    rows.push({
      sieve: value.sieve_label,
      passant_porcentage: value.passant,
      passant: granulometry_results.passant[index][1],
      retained_porcentage: granulometry_results.retained_porcentage[index][1],
      retained: value.retained,
      accumulated_retained: granulometry_results.accumulated_retained[index][1],
    });
  });

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

  const updateWindowDimensions = (fullScreen) => {
    
  };

  function Grafico(valors, valors2) {
    let data = [];
    data.unshift(['Abertura das peneiras (mm)', 'Porcentagem passante']);
    for (let index = 1; index < valors.length + 1; index++) {
      const index1 = valors[index - 1];
      const index2 = valors2[index - 1];
      data[index] = [index1, index2];
    }
    return data;
  }

  

  return (
    <>
      <ExperimentResume data={experimentResumeData} />
      <FlexColumnBorder title={t('results')} open={true}>
        <ResultSubTitle title={t('asphalt.essays.granulometry')} sx={{ margin: '.65rem' }} />
        <Box
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

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            background: '#ffffffff',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: 'flex-end',
            }}
          >
            <Box
              onClick={() => {
                updateWindowDimensions(true);
              }}
            >
              Expandir gráfico
              <SettingsOverscanIcon />
            </Box>
          </Box>
          <Chart
            chartType="LineChart"
            width={'100%'}
            height={'400px'}
            loader={<Loading />}
            data={graph_data}
            options={graphOptions}
          />
        </Box>

        {/* <AsphaltGranulometry_resultsTable rows={rows} columns={columns} /> */}
      </FlexColumnBorder>
    </>
  );
};

export default AsphaltGranulometry_Results;
