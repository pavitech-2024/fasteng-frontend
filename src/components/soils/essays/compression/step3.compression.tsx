import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useCompressionStore from '@/stores/soils/compression/compression.store';
import { Box, Button } from '@mui/material';
import { t } from 'i18next';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { toast } from 'react-toastify';

const Compression_Step3 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { humidityDeterminationData: data, setData } = useCompressionStore();
  const rows = data.humidityTable;

  const handleErase = () => {
    try {
      if (rows.length > 1) {
        const newRows = [...rows];
        newRows.pop();
        setData({ step: 2, value: newRows });
      } else throw t('compression.error.minValue');
    } catch (error) {
      toast.error(error);
    }
  };

  const handleAdd = () => {
    const newRows = [...rows];
    newRows.push({
      id: rows.length,
      capsules: null,
      wetGrossWeightsCapsule: null,
      wetGrossWeights: null,
      dryGrossWeights: null,
      capsulesTare: null,
    });
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
      field: 'capsules',
      headerName: t('compression.capsules_number'),
      renderCell: ({ row }) => (
        <InputEndAdornment
          fullWidth
          label={t('compression.capsules_number')}
          type="number"
          inputProps={{ min: 0 }}
          value={row.capsules}
          onChange={(e) => {
            const newRows = [...rows];
            const index = rows.findIndex((r) => r.id === row.id);
            newRows[index].capsules = Number(e.target.value);
            setData({ step: 2, value: newRows });
          }}
          adornment={''}
        />
      ),
    },
    {
      field: 'wetGrossWeightsCapsule',
      headerName: t('compression.wet_gross_weights_capsule'),
      renderCell: ({ row }) => (
        <InputEndAdornment
          fullWidth
          label={t('compression.wet_gross_weights_capsule')}
          type="number"
          inputProps={{ min: 0 }}
          value={row.wetGrossWeightsCapsule}
          onChange={(e) => {
            const newRows = [...rows];
            const index = rows.findIndex((r) => r.id === row.id);
            newRows[index].wetGrossWeightsCapsule = Number(e.target.value);
            setData({ step: 2, value: newRows });
          }}
          adornment={''}
        />
      ),
    },
    {
      field: 'wetGrossWeights',
      headerName: t('compression.wet_weights_capsules'),
      renderCell: ({ row }) => (
        <InputEndAdornment
          fullWidth
          label={t('compression.wet_weights_capsules')}
          type="number"
          inputProps={{ min: 0 }}
          value={row.wetGrossWeights}
          onChange={(e) => {
            const newRows = [...rows];
            const index = rows.findIndex((r) => r.id === row.id);
            newRows[index].wetGrossWeights = Number(e.target.value);
            setData({ step: 2, value: newRows });
          }}
          adornment={''}
        />
      ),
    },
    {
      field: 'dryGrossWeights',
      headerName: t('compression.dry_weights_capsules'),
      renderCell: ({ row }) => (
        <InputEndAdornment
          fullWidth
          label={t('compression.dry_weights_capsules')}
          type="number"
          inputProps={{ min: 0 }}
          value={row.dryGrossWeights}
          onChange={(e) => {
            const newRows = [...rows];
            const index = rows.findIndex((r) => r.id === row.id);
            newRows[index].dryGrossWeights = Number(e.target.value);
            setData({ step: 2, value: newRows });
          }}
          adornment={''}
        />
      ),
    },
    {
      field: 'capsulesTare',
      headerName: t('compression.capsules_weights'),
      renderCell: ({ row }) => (
        <InputEndAdornment
          fullWidth
          label={t('compression.capsules_weights')}
          type="number"
          inputProps={{ min: 0 }}
          value={row.capsulesTare}
          onChange={(e) => {
            const newRows = [...rows];
            const index = rows.findIndex((r) => r.id === row.id);
            newRows[index].capsulesTare = Number(e.target.value);
            setData({ step: 2, value: newRows });
          }}
          adornment={''}
        />
      ),
    },
  ];

  if (nextDisabled) {
    // verifica se todos os campos da tabela estão preenchidos
    rows.every((row) => {
      const { capsules, wetGrossWeightsCapsule, wetGrossWeights, dryGrossWeights, capsulesTare } = row;
      return capsules && wetGrossWeightsCapsule && wetGrossWeights && dryGrossWeights && capsulesTare >= 0;
    }) &&
      // verificar se precisa de mais validações antes de deixar ir para o próximo step
      setNextDisabled(false);
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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

export default Compression_Step3;
