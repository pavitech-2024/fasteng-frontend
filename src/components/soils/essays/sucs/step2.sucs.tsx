import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useSucsStore from '@/stores/soils/sucs/sucs.store';
import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import Sucs_step2Table from './tables/step2-table.sucs';

const SUCS_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { generalData, step2Data: data, setData } = useSucsStore();

  data.organic_matter = generalData.sample.type == 'organicSoil';

  const inputs = [
    {
      label: 'LL',
      value: data.ll_porcentage,
      key: 'll_porcentage',
      required: true,
      adornment: '%',
    },
    {
      label: 'LP',
      value: data.lp_porcentage,
      key: 'lp_porcentage',
      required: true,
      adornment: '%',
    },
  ];

  const rows = data.sieves;

  const columns: GridColDef[] = [
    {
      field: 'sieve',
      headerName: t('sucs.sieves'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'passant',
      headerName: t('sucs.passant'),
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
    data.ll_porcentage != null &&
    data.lp_porcentage != null &&
    data.sieves.every((row) => row.passant !== null)
  )
    setNextDisabled(false);

  return (
    <Box>
      <Sucs_step2Table rows={rows} columns={columns} />
      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
          gap: '10px',
          mt: '20px',
        }}
      >
        {inputs.map((input) => (
          <Box key={input.key}>
            <InputEndAdornment
              label={input.label}
              value={input.value}
              required={input.required}
              onChange={(e) => setData({ step: 1, key: input.key, value: Number(e.target.value) })}
              adornment={input.adornment}
              type="number"
              inputProps={{ min: 0 }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SUCS_Step2;
