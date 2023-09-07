import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import React from 'react';
import { getSieveName } from '../../../../utils/sieves';
import useHrbStore from '../../../../stores/soils/hrb/hrb.store';
import InputEndAdornment from '../../../atoms/inputs/input-endAdornment';
import { EssayPageProps } from '../../../templates/essay';
import Hrb_step2Table from './tables/step2-table.hrb';

const HBR_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { setData, step2Data: data } = useHrbStore();

  const rows = data.tableData;

  const columns: GridColDef[] = [
    {
      field: 'sieve',
      headerName: t('hrb.sieves'),
      valueFormatter: (cell) => getSieveName(cell.value as unknown as number),
    },
    {
      field: 'percent_passant',
      headerName: t('hrb.percent_passant') + ' (%)',
      renderCell: ({ row }) => {
        const { sieve } = row;
        const sieves_index = rows.findIndex((r) => r.sieve === sieve);

        return (
          <InputEndAdornment
            fullWidth
            adornment="%"
            type="number"
            label={`${t('hrb.percent_passant_for')} ${getSieveName(sieve)}`}
            inputProps={{ min: 0, max: 100 }}
            value={rows[sieves_index].percent_passant}
            onChange={(e) => {
              const newRows = [...rows];
              newRows[sieves_index].percent_passant = Number(e.target.value);
              setData({ step: 1, key: 'tableData', value: newRows });
            }}
          />
        );
      },
    },
  ];

  if (
    data.tableData.every((row) => row.percent_passant !== null) &&
    data.liquidity_limit !== null &&
    data.plasticity_limit !== null &&
    nextDisabled
  )
    setNextDisabled(false);

  return (
    <Box>
      <Hrb_step2Table rows={rows} columns={columns} />
      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
          gap: '10px',
          mt: '20px',
        }}
      >
        <InputEndAdornment
          value={data.liquidity_limit}
          fullWidth
          adornment="%"
          type="number"
          label={`${t('hrb.liquidity_limit')} (%)`}
          inputProps={{ min: 0, max: 100 }}
          onChange={(e) => setData({ step: 1, key: 'liquidity_limit', value: Number(e.target.value) })}
        />
        <InputEndAdornment
          value={data.plasticity_limit}
          onChange={(e) => setData({ step: 1, key: 'plasticity_limit', value: Number(e.target.value) })}
          fullWidth
          adornment="%"
          type="number"
          label={`${t('hrb.plasticity_limit')} (%)`}
          inputProps={{ min: 0, max: 100 }}
        />
      </Box>
    </Box>
  );
};

export default HBR_Step2;
