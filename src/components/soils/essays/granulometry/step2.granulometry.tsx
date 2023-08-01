import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useGranulometryStore from '@/stores/soils/granulometry/granulometry.store';
import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import Granulometry_step2Table from './tables/step2-table.granulometry';
import DropDown from '@/components/atoms/inputs/dropDown';
import { SieveSeries } from '../../../../interfaces/common/index';
import { getSieveSeries } from '@/utils/sieves';

const Granulometry_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step2Data: data, setData } = useGranulometryStore();

  const sievesSeries = [getSieveSeries(0), getSieveSeries(1), getSieveSeries(2), getSieveSeries(3)];

  if (data.sieve_series && data.table_data && data.table_data.length == 0) {
    const table_data = [];
    data.sieve_series.map((s) => {
      table_data.push({ sieve: s.label, passant: null, retained: null });
    });
    setData({ step: 1, key: 'table_data', value: table_data });
  }

  const rows = data.table_data;

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
        if (!rows) {
          return;
        }
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
              if (e.target.value === null) return;
              const newRows = [...rows];
              const passant = Number(e.target.value);
              const retained = data.sample_mass !== 0 ? ((100 - passant) / 100) * data.sample_mass : 0;
              newRows[sieve_index].passant = passant;
              newRows[sieve_index].retained = retained;
              setData({ step: 1, key: 'passant', value: newRows });
              setData({ step: 1, key: 'retained', value: newRows });
            }}
          />
        );
      },
    },
    {
      field: 'retained',
      headerName: t('granulometry.retained'),
      renderCell: ({ row }) => {
        if (!rows) {
          return;
        }
        const { sieve } = row;
        const sieve_index = rows.findIndex((r) => r.sieve === sieve);

        return (
          <InputEndAdornment
            fullWidth
            adornment="g"
            type="number"
            inputProps={{ min: 0 }}
            value={rows[sieve_index].retained}
            required
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...rows];
              const retained = Number(e.target.value);
              const passant = data.sample_mass !== 0 ? (100 * (data.sample_mass - retained)) / data.sample_mass : 0;
              newRows[sieve_index].retained = retained;
              newRows[sieve_index].passant = passant;
              setData({ step: 1, key: 'retained', value: newRows });
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
    data.table_data.every((row) => row.passant !== null && row.retained !== null)
  )
    setNextDisabled(false);

  return (
    <Box>
      <Box
        key={'top'}
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
          gap: '10px',
          mt: '20px',
        }}
      >
        <InputEndAdornment
          label={t('granulometry.sample_mass')}
          value={data.sample_mass}
          onChange={(e) => setData({ step: 1, key: 'sample_mass', value: Number(e.target.value) })}
          adornment={'g'}
          type="number"
          inputProps={{ min: 0 }}
          required
        />

        <DropDown
          key={'sieve_series'}
          variant="standard"
          label={t('granulometry.choose-series')}
          options={sievesSeries.map((sieveSeries: SieveSeries) => {
            return { label: sieveSeries.label, value: sieveSeries.sieves };
          })}
          callback={(value) => {
            setData({ step: 1, key: 'sieve_series', value });
            setData({ step: 1, key: 'table_data', value: [] });
          }}
          size="medium"
          required
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
            onChange={(e) => setData({ step: 1, key: 'bottom', value: Number(e.target.value) })}
            adornment={'g'}
            type="number"
            inputProps={{ min: 0 }}
            required
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Granulometry_Step2;
