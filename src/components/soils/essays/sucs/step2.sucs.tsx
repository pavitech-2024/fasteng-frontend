import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useSucsStore from '@/stores/soils/sucs/sucs.store';
import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import Sucs_step2Table from './tables/step2-table.sucs';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Granulometry_SERVICE from '@/services/soils/essays/granulometry/granulometry.service';
import Loading from '@/components/molecules/loading';

const SUCS_Step2 = ({
  nextDisabled,
  setNextDisabled,
  granulometry_serv,
}: EssayPageProps & { granulometry_serv: Granulometry_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const { generalData, step2Data: data, setData } = useSucsStore();

  useEffect(() => {
    toast.promise(
      async () => {
        const _id = generalData.sample._id;
        const granulometry = await granulometry_serv.getGranulometryBySampleId(_id);

        setLoading(false);

        setData({ step: 1, key: 'cc', value: granulometry.results.cc });
        setData({ step: 1, key: 'cnu', value: granulometry.results.cnu });
      },
      {
        pending: t('loading.granulometry.pending'),
        success: t('loading.granulometry.success'),
        error: t('loading.granulometry.error'),
      }
    );
  }, []);

  data.organic_matter = generalData.sample.type == 'organicSoil';

  const inputs = [
    {
      label: 'LL',
      value: data.liquidity_limit,
      key: 'liquidity_limit',
      required: true,
      adornment: '%',
    },
    {
      label: 'LP',
      value: data.plasticity_limit,
      key: 'plasticity_limit',
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
    data.liquidity_limit != null &&
    data.plasticity_limit != null &&
    data.sieves.every((row) => row.passant !== null)
  )
    setNextDisabled(false);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
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
      )}
    </>
  );
};

export default SUCS_Step2;
