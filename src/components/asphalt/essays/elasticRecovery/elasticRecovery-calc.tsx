/* eslint-disable react-hooks/exhaustive-deps */
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useElasticRecoveryStore from '@/stores/asphalt/elasticRecovery/elasticRecovery.store';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import { t } from 'i18next';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const ElasticRecovery_Calc = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { elasticRecoveryCalc: data, setData } = useElasticRecoveryStore();
  const rows = data.lengths;

  // Remover mais uma linha de determinado valor
  const handleErase = () => {
    try {
      if (rows.length > 1) {
        // O mínimo é um valor de cada
        const newRows = [...rows];
        newRows.pop();
        setData({ step: 1, key: 'lengths', value: newRows });
      } else throw t('elasticRecovery.error.minValue');
    } catch (error) {
      toast.error(error);
    }
  };

  // Adicionar mais uma linha de determinado valor
  const handleAdd = () => {
    const newRows = [...rows];
    newRows.push({
      id: rows.length,
      stretching_length: null,
      juxtaposition_length: null,
    });
    setData({ step: 1, key: 'lengths', value: newRows });
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
      field: 'stretching_length',
      headerName: t('elasticRecovery.stretching_length'),
      renderCell: ({ row }) => {
        const { id } = row;
        const index = rows.findIndex((r) => r.id === id);

        return (
          <InputEndAdornment
            fullWidth
            label={t('elasticRecovery.stretching_length')}
            type="number"
            inputProps={{ min: 0 }}
            value={row.stretching_length}
            onChange={(e) => {
              const newRows = [...rows];
              rows[index].stretching_length = Number(e.target.value);
              setData({ step: 1, key: 'stretching_length', value: newRows });
            }}
            adornment={'cm'}
          />
        );
      },
    },
    {
      field: 'juxtaposition_length',
      headerName: t('elasticRecovery.juxtaposition_length'),
      renderCell: ({ row }) => {
        const { id } = row;
        const index = rows.findIndex((r) => r.id === id);

        return (
          <InputEndAdornment
            fullWidth
            label={t('elasticRecovery.juxtaposition_length')}
            type="number"
            inputProps={{ min: 0 }}
            value={row.juxtaposition_length}
            onChange={(e) => {
              const newRows = [...rows];
              newRows[index].juxtaposition_length = Number(e.target.value);
              setData({ step: 1, key: 'juxtaposition_length', value: newRows });
            }}
            adornment={'cm'}
          />
        );
      },
    },
  ];

  if (nextDisabled) {
    // verifica se todos os campos da tabela estão preenchidos
    rows.every((row) => {
      const { stretching_length, juxtaposition_length } = row;
      return stretching_length && juxtaposition_length >= 0;
    }) && setNextDisabled(false);
  }

  useEffect(() => console.log(data, rows), [data, rows]);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          display: 'flex',
          gap: '15px',
          justifyContent: { mobile: 'center', notebook: 'center' },
          flexWrap: 'wrap',
        }}
      ></Box>
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
    </Box>
  );
};

export default ElasticRecovery_Calc;
