import FlexColumnBorder from "@/components/atoms/containers/flex-column-with-border";
import Result_Card from "@/components/atoms/containers/result-card";
import ResultSubTitle from "@/components/atoms/titles/result-sub-title";
import ExperimentResume, { ExperimentResumeData } from "@/components/molecules/boxes/experiment-resume";
import Loading from "@/components/molecules/loading";
import { EssayPageProps } from "@/components/templates/essay";
import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { t } from "i18next";
import Chart from "react-google-charts";

const ConcreteConcreteRt_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
    nextDisabled && setNextDisabled(false);
    const { results: concreteRt_results, step2Data, generalData } = useConcreteConcreteRtStore();
  
    const data = {
      // container "Resultados"
      container_other_data: [],
    };
  
    if (concreteRt_results) {
      data.container_other_data.push(
        { label: t('concreteRt-concrete.total-retained'), value: concreteRt_results.total_retained, unity: 'g' },
        { label: t('concreteRt-concrete.nominal-size'), value: concreteRt_results.nominal_size, unity: 'mm' },
        { label: t('concreteRt-concrete.nominal-diameter'), value: concreteRt_results.nominal_diameter, unity: 'mm' },
        { label: t('concreteRt-concrete.fineness-module'), value: concreteRt_results.fineness_module, unity: '%' },
        { label: t('concreteRt-concrete.cc'), value: concreteRt_results.cc },
        { label: t('concreteRt-concrete.cnu'), value: concreteRt_results.cnu },
        { label: t('concreteRt-concrete.error'), value: concreteRt_results.error, unity: '%' }
      );
    }
  
    // criando o objeto que será passado para o componente ExperimentResume
    const experimentResumeData: ExperimentResumeData = {
      experimentName: generalData.name,
      materials: [{ name: generalData.material.name, type: generalData.material.type }],
    };
  
    const graph_data = [
      [t('concreteRt-concrete.passant'), t('concreteRt-concrete.diameter')],
      ...concreteRt_results.graph_data,
    ];
  
    const rows = [];
  
    step2Data.table_data.map((value, index) => {
      rows.push({
        sieve: value.sieve,
        passant_porcentage: value.passant,
        passant: concreteRt_results.passant[index],
        retained_porcentage: concreteRt_results.retained_porcentage[index],
        retained: value.retained,
        accumulated_retained: concreteRt_results.accumulated_retained[index],
      });
    });
  
    const columns: GridColDef[] = [
      {
        field: 'sieve',
        headerName: t('concreteRt-concrete.sieves'),
        valueFormatter: ({ value }) => `${value}`,
      },
      {
        field: 'passant_porcentage',
        headerName: t('concreteRt-concrete.passant') + ' (%)',
        valueFormatter: ({ value }) => `${value}`,
      },
      {
        field: 'passant',
        headerName: t('concreteRt-concrete.passant') + ' (g)',
        valueFormatter: ({ value }) => `${value}`,
      },
      {
        field: 'retained_porcentage',
        headerName: t('concreteRt-concrete.retained') + ' (%)',
        valueFormatter: ({ value }) => `${value}`,
      },
      {
        field: 'retained',
        headerName: t('concreteRt-concrete.retained') + ' (g)',
        valueFormatter: ({ value }) => `${value}`,
      },
      {
        field: 'accumulated_retained',
        headerName: t('concreteRt-concrete.accumulated-retained') + ' (%)',
        valueFormatter: ({ value }) => `${value}`,
      },
    ];
  
    return (
      <>
        <ExperimentResume data={experimentResumeData} />
        <FlexColumnBorder title={t('results')} open={true}>
          <ResultSubTitle title={t('concrete.essays.concreteRt')} sx={{ margin: '.65rem' }} />
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
              title: t('concreteRt-concrete.concreteRt'),
              backgroundColor: 'transparent',
              pointSize: '2',
              hAxis: {
                title: `${t('concreteRt-concrete.sieve-openness') + ' (mm)'}`,
                type: 'number',
                scaleType: 'log',
              },
              vAxis: {
                title: `${t('concreteRt-concrete.passant') + ' (%)'}`,
                minValue: '0',
                maxValue: '105',
              },
              legend: 'none',
            }}
          />
          <ConcreteConcreteRt_resultsTable rows={rows} columns={columns} />
        </FlexColumnBorder>
      </>
    );
  };
  
  export default ConcreteConcreteRt_Results;

function useConcreteConcreteRtStore(): { results: any; step2Data: any; generalData: any; } {
    throw new Error("Function not implemented.");
}
  