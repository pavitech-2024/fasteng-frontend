import { EssayPageProps } from '@/components/templates/essay';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import { t } from 'i18next';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import useElongatedParticlesStore from '@/stores/asphalt/elongatedParticles/elongatedParticles.store';
import StepDescription from '@/components/atoms/titles/step-description';
import ElongatedParticles_results_Dimensions_Table from './tables/results-dimensions-table.elongatedParticles';

const ElongatedParticles_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { results: elongatedParticles_results, generalData } = useElongatedParticlesStore();

  // criando o objeto que será passado para o componente ExperimentResume
  const experimentResumeData: ExperimentResumeData = {
    experimentName: generalData.name,
    materials: [{ name: generalData.material.name, type: generalData.material.type }],
  };

  const rows = elongatedParticles_results.results_dimensions_table_data;

  const columns: GridColDef[] = [
    {
      field: 'ratio',
      headerName: t('elongatedParticles.ratio'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'particles_percentage',
      headerName: t('elongatedParticles.particles-percentage'),
      valueFormatter: ({ value }) => `${value}%`,
    },
  ];

  return (
    <>
      <ExperimentResume data={experimentResumeData} />
      <FlexColumnBorder title={t('results')} open={true}>
        <ResultSubTitle title={t('asphalt.essays.elongatedParticles')} sx={{ margin: '.65rem' }} />
        {elongatedParticles_results.alerts.map((item, index) => (
          <StepDescription key={`alert-${index}`} text={t(item)} warning />
        ))}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            gridTemplateColumns: { mobile: '1fr', notebook: '1fr' },
            gap: '10px',
            mt: '20px',
          }}
        >
          <ElongatedParticles_results_Dimensions_Table rows={rows} columns={columns} />
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default ElongatedParticles_Results;
