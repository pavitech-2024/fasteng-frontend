import { EssayPageProps } from '@/components/templates/essay';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import { t } from 'i18next';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import Result_Card from '@/components/atoms/containers/result-card';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { Box } from '@mui/material';
import useAngularityStore, { row_results } from '@/stores/asphalt/angularity/angularity.store';
import { GridColDef } from '@mui/x-data-grid';
import Angularity_resultsTable from './tables/results-table.angularity';
import StepDescription from '@/components/atoms/titles/step-description';

const Angularity_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
    nextDisabled && setNextDisabled(false);
    const { results: angularity_results, generalData } = useAngularityStore();

    const data = {
        // container "Resultados"
        container_other_data: [],
    };

    if (angularity_results) {
        data.container_other_data.push(
            { label: t('angularity.average_angularity'), value: angularity_results.averageOfAll, unity: '%', }
        );
    }

    // criando o objeto que será passado para o componente ExperimentResume
    const experimentResumeData: ExperimentResumeData = {
        experimentName: generalData.name,
        materials: [{ name: generalData.material.name, type: generalData.material.type }],
    };

    const rows: row_results[] = [];

    angularity_results.angularities.map((value) => {
        const { label, angularity } = value
        rows.push({
            label,
            angularity,
        });
    });

    const columns: GridColDef[] = [
        {
            field: 'label',
            headerName: '',
            valueFormatter: ({ value }) => `${value}`,
        },
        {
            field: 'angularity',
            headerName: t('angularity.angularity') + ' (%)',
            valueFormatter: ({ value }) => `${value}`,
        },
    ];

    return (
        <>
            <ExperimentResume data={experimentResumeData} />
            <FlexColumnBorder title={t('results')} open={true}>
                <ResultSubTitle title={t('asphalt.essays.angularity')} sx={{ margin: '.65rem' }} />
                {angularity_results.alerts.map((item, index) => (
                    <StepDescription key={`alert-${index}`} text={item} warning />    
                ))}
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' },
                        gap: '10px',
                        mt: '20px',
                    }}
                >
                    {data.container_other_data.map((item, index) => (
                        <Result_Card key={index} label={item.label} value={item.value} unity={item.unity} />
                    ))}
                </Box>
                <Angularity_resultsTable rows={rows} columns={columns} />
            </FlexColumnBorder>
        </>
    );
};

export default Angularity_Results;
