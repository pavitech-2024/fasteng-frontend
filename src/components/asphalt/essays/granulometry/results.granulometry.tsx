import FlexColumnBorder from "@/components/atoms/containers/flex-column-with-border";
import Result_Card from "@/components/atoms/containers/result-card";
import ResultSubTitle from "@/components/atoms/titles/result-sub-title";
import ExperimentResume, { ExperimentResumeData } from "@/components/molecules/boxes/experiment-resume";
import Loading from "@/components/molecules/loading";
import { EssayPageProps } from "@/components/templates/essay";
import useAsphaltGranulometryStore from "@/stores/asphalt/granulometry/asphalt-granulometry.store";
import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { t } from "i18next";
import Chart from "react-google-charts";
import AsphaltGranulometry_resultsTable from "./tables/results-table.granulometry";


const AsphaltGranulometry_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { results: granulometry_results, step2Data, generalData } = useAsphaltGranulometryStore();

  const data = {
    // container "Resultados"
    container_other_data: [],
  };

  if (granulometry_results) {
    data.container_other_data.push(
      { label: t('granulometry.total-retained'), value: granulometry_results.total_retained, unity: 'g' },
      { label: t('granulometry.nominal-size'), value: granulometry_results.nominal_size, unity: 'mm' },
      { label: t('granulometry.nominal-diameter'), value: granulometry_results.nominal_diameter, unity: 'mm' },
      { label: t('granulometry.fineness-module'), value: granulometry_results.fineness_module, unity: '%' },
      { label: t('granulometry.cc'), value: granulometry_results.cc },
      { label: t('granulometry.cnu'), value: granulometry_results.cnu },
      { label: t('granulometry.error'), value: granulometry_results.error, unity: '%' }
    );
  }

  // criando o objeto que será passado para o componente ExperimentResume
  const experimentResumeData: ExperimentResumeData = {
    experimentName: generalData.name,
    materials: [{ name: generalData.material.name, type: generalData.material.type }],
  };

  const graph_data = [[t('granulometry.passant'), t('granulometry.diameter')], ...granulometry_results.graph_data];

  const rows = [];

  step2Data.table_data.map((value, index) => {
    rows.push({
      sieve: value.sieve,
      passant_porcentage: value.passant,
      passant: granulometry_results.passant[index],
      retained_porcentage: granulometry_results.retained_porcentage[index],
      retained: value.retained,
      accumulated_retained: granulometry_results.accumulated_retained[index],
    });
  });

  const columns: GridColDef[] = [
    {
      field: 'sieve',
      headerName: t('granulometry.sieves'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'passant_porcentage',
      headerName: t('granulometry.passant') + ' (%)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'passant',
      headerName: t('granulometry.passant') + ' (g)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'retained_porcentage',
      headerName: t('granulometry.retained') + ' (%)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'retained',
      headerName: t('granulometry.retained') + ' (g)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'accumulated_retained',
      headerName: t('granulometry.accumulated-retained') + ' (%)',
      valueFormatter: ({ value }) => `${value}`,
    },
  ];

  return (
    <>
      <ExperimentResume data={experimentResumeData} />
      <FlexColumnBorder title={t('results')} open={true}>
        <ResultSubTitle title={t('asphalt.essays.granulometry')} sx={{ margin: '.65rem' }} />
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
            title: t('granulometry.granulometry'),
            backgroundColor: 'transparent',
            pointSize: '2',
            hAxis: {
              title: `${t('granulometry.sieve-openness') + ' (mm)'}`,
              type: 'number',
              scaleType: 'log',
            },
            vAxis: {
              title: `${t('granulometry.passant') + ' (%)'}`,
              minValue: '0',
              maxValue: '105',
            },
            legend: 'none',
          }}
        />
        <AsphaltGranulometry_resultsTable rows={rows} columns={columns} />
      </FlexColumnBorder>
    </>
  );
};

export default AsphaltGranulometry_Results;