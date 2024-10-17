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

const ConcreteRc_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
    nextDisabled && setNextDisabled(false);
    const { results: concreteRc_results, step2Data, generalData } = useConcreteRcStore();
  
    const data = {
      // container "Resultados"
      container_other_data: [],
    };
  
    if (concreteRc_results) {
      data.container_other_data.push(
        { label: t('concreteRc-concrete.total-retained'), value: concreteRc_results.total_retained, unity: 'g' },
        { label: t('concreteRc-concrete.nominal-size'), value: concreteRc_results.nominal_size, unity: 'mm' },
        { label: t('concreteRc-concrete.nominal-diameter'), value: concreteRc_results.nominal_diameter, unity: 'mm' },
        { label: t('concreteRc-concrete.fineness-module'), value: concreteRc_results.fineness_module, unity: '%' },
        { label: t('concreteRc-concrete.cc'), value: concreteRc_results.cc },
        { label: t('concreteRc-concrete.cnu'), value: concreteRc_results.cnu },
        { label: t('concreteRc-concrete.error'), value: concreteRc_results.error, unity: '%' }
      );
    }
  
    // criando o objeto que será passado para o componente ExperimentResume
    const experimentResumeData: ExperimentResumeData = {
      experimentName: generalData.name,
      materials: [{ name: generalData.material.name, type: generalData.material.type }],
    };
  
    const graph_data = [
      [t('concreteRc-concrete.passant'), t('concreteRc-concrete.diameter')],
      ...concreteRc_results.graph_data,
    ];
  
    const rows = [];
  
    step2Data.table_data.map((value, index) => {
      rows.push({
        sieve: value.sieve,
        passant_porcentage: value.passant,
        passant: concreteRc_results.passant[index],
        retained_porcentage: concreteRc_results.retained_porcentage[index],
        retained: value.retained,
        accumulated_retained: concreteRc_results.accumulated_retained[index],
      });
    });
  
    const columns: GridColDef[] = [
      {
        field: 'sieve',
        headerName: t('concreteRc-concrete.sieves'),
        valueFormatter: ({ value }) => `${value}`,
      },
      {
        field: 'passant_porcentage',
        headerName: t('concreteRc-concrete.passant') + ' (%)',
        valueFormatter: ({ value }) => `${value}`,
      },
      {
        field: 'passant',
        headerName: t('concreteRc-concrete.passant') + ' (g)',
        valueFormatter: ({ value }) => `${value}`,
      },
      {
        field: 'retained_porcentage',
        headerName: t('concreteRc-concrete.retained') + ' (%)',
        valueFormatter: ({ value }) => `${value}`,
      },
      {
        field: 'retained',
        headerName: t('concreteRc-concrete.retained') + ' (g)',
        valueFormatter: ({ value }) => `${value}`,
      },
      {
        field: 'accumulated_retained',
        headerName: t('concreteRc-concrete.accumulated-retained') + ' (%)',
        valueFormatter: ({ value }) => `${value}`,
      },
    ];
  
    return (
      <>
        <ExperimentResume data={experimentResumeData} />
        <FlexColumnBorder title={t('results')} open={true}>
          <ResultSubTitle title={t('concrete.essays.concreteRc')} sx={{ margin: '.65rem' }} />
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
              title: t('concreteRc-concrete.concreteRc'),
              backgroundColor: 'transparent',
              pointSize: '2',
              hAxis: {
                title: `${t('concreteRc-concrete.sieve-openness') + ' (mm)'}`,
                type: 'number',
                scaleType: 'log',
              },
              vAxis: {
                title: `${t('concreteRc-concrete.passant') + ' (%)'}`,
                minValue: '0',
                maxValue: '105',
              },
              legend: 'none',
            }}
          />
          {/* <ConcreteRc_resultsTable rows={rows} columns={columns} /> */}
        </FlexColumnBorder>
      </>
    );
  };
  
  export default ConcreteRc_Results;

function useConcreteRcStore(): { results: any; step2Data: any; generalData: any; } {
    throw new Error("Function not implemented.");
}
  