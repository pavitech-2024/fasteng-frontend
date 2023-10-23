import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useElongatedParticlesStore, { ElongatedParticlesDimensionsRow } from '@/stores/asphalt/elongatedParticles/elongatedParticles.store';
import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import ElongatedParticles_step2_Dimensions_Table from './tables/step2-dimensions-table.elongatedParticles';

const ElongatedParticles_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step2Data: data, setData } = useElongatedParticlesStore();

  if (data.dimensions_table_data && data.dimensions_table_data.length == 0) {
    const table_data: ElongatedParticlesDimensionsRow[] = [];

    table_data.push({
      ratio: '1:5',
      sample_mass: null,
      mass: null,
    });
    table_data.push({
      ratio: '1:3',
      sample_mass: null,
      mass: null,
    });
    table_data.push({
      ratio: '1:2',
      sample_mass: null,
      mass: null,
    });

    setData({ step: 1, key: 'dimensions_table_data', value: table_data });
  }

  const rows = data.dimensions_table_data;

  const columns: GridColDef[] = [
    {
      field: 'ratio',
      headerName: t('elongatedParticles.ratio'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'sample_mass',
      headerName: t('elongatedParticles.sample_mass'),
      renderCell: ({ row }) => {
        const { ratio } = row;
        const ratio_index = rows.findIndex((r) => r.ratio === ratio);

        return (
          <InputEndAdornment
            fullWidth
            adornment=""
            type="number"
            inputProps={{ min: 0 }}
            value={rows[ratio_index].sample_mass}
            onChange={(e) => {
              const newRows = [...rows];
              newRows[ratio_index].sample_mass = Number(e.target.value);
              setData({ step: 1, key: 'dimensions_table_data', value: newRows });
            }}
          />
        );
      },
    },
    {
      field: 'mass',
      headerName: t('elongatedParticles.mass'),
      renderCell: ({ row }) => {
        const { ratio } = row;
        const ratio_index = rows.findIndex((r) => r.ratio === ratio);

        return (
          <InputEndAdornment
            fullWidth
            adornment=""
            type="number"
            inputProps={{ min: 0 }}
            value={rows[ratio_index].mass}
            onChange={(e) => {
              const newRows = [...rows];
              newRows[ratio_index].mass = Number(e.target.value);
              setData({ step: 1, key: 'dimensions_table_data', value: newRows });
            }}
          />
        );
      },
    },
  ];

  if (nextDisabled && data.dimensions_table_data.every((row) => (
    row.sample_mass &&
    row.sample_mass >= 0 &&
    row.mass &&
    row.mass >= 0
  )))
    setNextDisabled(false);

  return (
    <Box>
      <Box
        key={'top'}
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { mobile: '1fr', notebook: '1fr' },
          gap: '10px',
          mt: '20px',
        }}
      >
        <ElongatedParticles_step2_Dimensions_Table rows={rows} columns={columns} />
      </Box>
    </Box>
  );
};

export default ElongatedParticles_Step2;
