import {EssayPageProps} from "@/components/templates/essay";
import useGranulometryStore from "@/stores/soils/granulometry/granulometry.store";
import ExperimentResume, {ExperimentResumeData} from "@/components/molecules/boxes/experiment-resume";
import {t} from "i18next";
import ResultSubTitle from "@/components/atoms/titles/result-sub-title";
import Result_Card from "@/components/atoms/containers/result-card";
import FlexColumnBorder from "@/components/atoms/containers/flex-column-with-border";
import Loading from "@/components/molecules/loading";
import Chart from "react-google-charts";
import {Box} from "@mui/material";

const Granulometry_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
    nextDisabled && setNextDisabled (false);
    const { results: granulometry_results, generalData } = useGranulometryStore();

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
            { label: t('granulometry.cc'), value: granulometry_results.cc, unity: '' },
            { label: t('granulometry.cnu'), value: granulometry_results.cnu, unity: '' },
            { label: t('granulometry.error'), value: granulometry_results.error, unity: '%' },
        );
    }

    // criando o objeto que será passado para o componente ExperimentResume
    const experimentResumeData: ExperimentResumeData = {
        experimentName: generalData.name,
        materials: [{ name: generalData.sample.name, type: generalData.sample.type }],
    }

    const graph_data = [[t('granulometry.passant'), t('granulometry.diameter')], ...granulometry_results.graph_data];

    return (
        <>
            <ExperimentResume data={experimentResumeData} />
            <FlexColumnBorder title={t('results')} open={true}>
                <ResultSubTitle
                    title={t('soils.essays.granulometry')}
                    sx={{ margin: '.65rem' }}
                />
                <Box
                    sx={{
                        width: '80%',
                        display: 'flex',
                        gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
                        gap: '10px',
                        mt: '20px',
                    }}>
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
                        hAxis: {
                            title: `${t('granulometry.sieve-openness') + ' (mm)'}`,
                        },
                        vAxis: {
                            title: `${t('granulometry.passant-porcentage') + ' (%)'}`,
                        },
                        explorer: {
                            actions: ['dragToZoom', 'rightClickToReset'],
                            axis: 'vertical',
                        },
                        legend: 'none',
                    }}
                />

            </FlexColumnBorder>
        </>
            );
}

export default Granulometry_Results;