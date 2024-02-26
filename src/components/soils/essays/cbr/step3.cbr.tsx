import React from 'react';
import { EssayPageProps } from '../../../templates/essay';
import useCbrStore from '../../../../stores/soils/cbr/cbr.store';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import { t } from 'i18next';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import InputEndAdornment from '../../../atoms/inputs/input-endAdornment';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const CBR_Expansion = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { expansionData: rows, setData } = useCbrStore();

  const handleErase = () => {
    try {
      if (rows.length > 2) {
        const newRows = [...rows];
        newRows.pop();
        setData({ step: 2, value: newRows });
      } else throw t('cbr.error.minReads');
    } catch (error) {
      toast.error(error);
    }
  };

  const handleAdd = () => {
    const newRows = [...rows];
    newRows.push({ id: rows.length, date: null, time: null, deflectometer_read: null });
    setData({ step: 2, value: newRows });
    setNextDisabled(true);
  };

  const ExpansionToolbar = () => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem', flexWrap: 'wrap' }}>
        <Button sx={{ color: 'secondaryTons.red' }} onClick={handleErase}>
          {t('erase')}
        </Button>
        <Button sx={{ color: 'secondaryTons.green' }} onClick={handleAdd}>
          {t('add')}
        </Button>
      </Box>
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: t('cbr.date'),
      renderCell: ({ row }) => (
        <DatePicker
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
          }}
          value={dayjs(row.date)}
          onChange={(date) => {
            const newRows = [...rows];
            const index = rows.findIndex((r) => r.id === row.id);

            newRows[index].date = new Date(date.toString());

            setData({ step: 2, value: newRows });
          }}
        />
      ),
    },
    {
      field: 'time',
      headerName: t('cbr.time'),
      renderCell: ({ row }) => (
        <TimePicker
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
          }}
          value={dayjs(row.time)}
          onChange={(time) => {
            const newRows = [...rows];
            const index = rows.findIndex((r) => r.id === row.id);

            newRows[index].time = new Date(time.toString());

            setData({ step: 2, value: newRows });
          }}
        />
      ),
    },
    {
      field: 'deflectometer_read',
      headerName: t('cbr.deflectometer_read'),
      renderCell: ({ row }) => (
        <InputEndAdornment
          fullWidth
          adornment="mm"
          label={t('cbr.deflectometer_read')}
          type="number"
          inputProps={{ min: 0 }}
          value={row.deflectometer_read}
          onChange={(e) => {
            const newRows = [...rows];
            const index = rows.findIndex((r) => r.id === row.id);
            newRows[index].deflectometer_read = Number(e.target.value);
            setData({ step: 2, value: newRows });
          }}
        />
      ),
    },
  ];

  // verifica se todos os campos da tabela estão preenchidos, se sim, habilita o botao de next
  rows.every((row) => {
    const { date, time, deflectometer_read } = row;
    return date && time && deflectometer_read && deflectometer_read >= 0;
  }) &&
    nextDisabled &&
    setNextDisabled(false);

  return (
    <DataGrid
      sx={{ mt: '1rem', borderRadius: '10px' }}
      density="compact"
      showCellVerticalBorder
      showColumnVerticalBorder
      slots={{ footer: ExpansionToolbar }}
      rows={rows.map((row, index) => ({ ...row, id: index }))}
      columns={columns.map((column) => ({
        ...column,
        sortable: false,
        disableColumnMenu: true,
        align: 'center',
        headerAlign: 'center',
        minWidth: 200,
        flex: 1,
      }))}
    />
  );
};

export default CBR_Expansion;
