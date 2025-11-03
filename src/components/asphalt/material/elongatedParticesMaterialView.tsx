import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { Box } from '@mui/material';
import { t } from 'i18next';
import ElongatedParticles_results_Dimensions_Table from '../essays/elongatedParticles/tables/results-dimensions-table.elongatedParticles';
import { EssaysData } from '@/pages/asphalt/materials/material/types/material.types';
import { GridColDef } from '@mui/x-data-grid';

export interface IElongatedParticlesMaterialView {
  elongatedParticlesData: EssaysData['elongatedParticlesData'];
}

const ElongatedParticlesMaterialView = ({ elongatedParticlesData }: IElongatedParticlesMaterialView) => {
  let elongatedParticlesRows;

  if (elongatedParticlesData) {
    elongatedParticlesRows = elongatedParticlesData?.results.results_dimensions_table_data;
  }

  const elongatedParticlesColumns: GridColDef[] = [
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
    <FlexColumnBorder title={t('asphalt.essays.elongatedParticles')} open={true}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          gridTemplateColumns: { mobile: '1fr', notebook: '1fr' },
          gap: '10px',
          mt: '20px',
        }}
      >
        <ElongatedParticles_results_Dimensions_Table
          rows={elongatedParticlesRows}
          columns={elongatedParticlesColumns}
        />
      </Box>
    </FlexColumnBorder>
  );
};

export default ElongatedParticlesMaterialView;
