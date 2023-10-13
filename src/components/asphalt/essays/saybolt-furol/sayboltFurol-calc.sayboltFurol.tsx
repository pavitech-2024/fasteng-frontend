import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import { EssayPageProps } from '@/components/templates/essay';
import useSayboltFurolStore from '@/stores/asphalt/sayboltFurol/sayboltFurol.store';
import { Box, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import { toast } from 'react-toastify';

const SayboltFurol_Calc = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { sayboltFurolCalc: data, setData } = useSayboltFurolStore();
  const rows = data.dataPoints;

  // Remover mais uma linha de determinado valor
  const handleErase = () => {
    try {
      if (rows.length > 1) {
        // O mínimo é um valor de cada
        const newRows = [...rows];
        newRows.pop();
        setData({ step: 1, key: 'dataPoints', value: newRows });
      } else throw t('saybolt-furol.error.minValue');
    } catch (error) {
      toast.error(error);
    }
  };

  // Adicionar mais uma linha de determinado valor
  const handleAdd = () => {
    const newRows = [...rows];
    newRows.push({
      id: rows.length,
      temperature: null,
      viscosity: null,
    });
    setData({ step: 1, key: 'dataPoints', value: newRows });
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
      field: 'temperature',
      headerName: t('saybolt-furol.temperature'),
      renderCell: ({ row }) => {
        const { id } = row;
        const index = rows.findIndex((r) => r.id === id);

        return (
          <InputEndAdornment
            fullWidth
            type="number"
            inputProps={{ min: 0 }}
            value={row.temperature}
            onChange={(e) => {
              const newRows = [...rows];
              if (index !== -1) {
                rows[index].temperature = Number(e.target.value);
                setData({ step: 1, key: 'temperature', value: newRows });
              } else {
                console.log('error', id);
              }
            }}
            adornment={'°C'}
          />
        );
      },
    },
    {
      field: 'viscosity',
      headerName: t('saybolt-furol.viscosity'),
      renderCell: ({ row }) => {
        const { id } = row;
        const index = rows.findIndex((r) => r.id === id);

        return (
          <InputEndAdornment
            fullWidth
            label={t('saybolt-furol.viscosity')}
            type="number"
            inputProps={{ min: 0 }}
            value={row.viscosity}
            onChange={(e) => {
              const newRows = [...rows];
              newRows[index].viscosity = Number(e.target.value);
              setData({ step: 1, key: 'viscosity', value: newRows });
            }}
            adornment={'SSF'}
          />
        );
      },
    },
  ];

  if (nextDisabled) {
    const hasNullValues = rows.some((row) => Object.values(row).some((value) => value === null));
    if (!hasNullValues) setNextDisabled(false);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <ResultSubTitle title={t('saybolt-furol.calc')} sx={{ margin: '.65rem' }} />

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

export default SayboltFurol_Calc;
