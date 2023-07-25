import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useGranulometryStore from '@/stores/soils/granulometry/granulometry.store';
import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import Granulometry_step2Table from './tables/step2-table.granulometry';

const Granulometry_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step2Data: data, setData } = useGranulometryStore();

  const rows = data.passant_percentages;

  const columns: GridColDef[] = [
    {
      field: 'sieve',
      headerName: t('granulometry.sieves'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'passant',
      headerName: t('granulometry.passant'),
      renderCell: ({ row }) => {
        const { sieve } = row;
        const sieve_index = rows.findIndex((r) => r.sieve === sieve);

        return (
          <InputEndAdornment
            fullWidth
            adornment="%"
            type="number"
            inputProps={{ min: 0 }}
            value={rows[sieve_index].passant}
            required
            onChange={(e) => {
              const newRows = [...rows];
              newRows[sieve_index].passant = Number(e.target.value);
              setData({ step: 1, key: 'passant', value: newRows });
            }}
          />
        );
      },
    },
  ];

  if (
    nextDisabled &&
    data.sample_mass != null &&
    data.bottom != null &&
    data.passant_percentages.every((row) => row.passant !== null)
  )
    setNextDisabled(false);

  return (
    <Box>
      <Box key={'sample_mass'}>
        <InputEndAdornment
          label={t('granulometry.sample_mass')}
          value={data.sample_mass}
          required
          onChange={(e) => setData({ step: 1, key: 'sample_mass', value: Number(e.target.value) })}
          adornment={'g'}
          type="number"
          inputProps={{ min: 0 }}
        />
      </Box>
      <Granulometry_step2Table rows={rows} columns={columns} />
      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
          gap: '10px',
          mt: '20px',
        }}
      >
        <Box key={'bottom'}>
          <InputEndAdornment
            label={t('granulometry.bottom')}
            value={data.bottom}
            required
            onChange={(e) => setData({ step: 1, key: 'bottom', value: Number(e.target.value) })}
            adornment={'g'}
            type="number"
            inputProps={{ min: 0 }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Granulometry_Step2;
