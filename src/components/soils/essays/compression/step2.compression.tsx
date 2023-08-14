import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useCompressionStore, { hygTable } from '@/stores/soils/compression/compression.store';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import { t } from 'i18next';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const Compression_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { hygroscopicData: data, setData } = useCompressionStore();
  const rows = data.hygroscopicTable as hygTable[];

  // Remover mais uma linha de determinado valor
  const handleErase = () => {
    try {
      if (rows.length > 1) {
        // O mínimo é um valor de cada
        const newRows = [...rows];
        newRows.pop();
        setData({ step: 2, value: newRows });
      } else throw t('compression.error.minValue');
    } catch (error) {
      toast.error(error);
    }
  };

  // Adicionar mais uma linha de determinado valor
  const handleAdd = () => {
    const newRows = [...rows];
    newRows.push({
      id: rows.length,
      capsulesNumberHyg: null,
      wetGrossWeightsCapsuleHyg: null,
      dryGrossWeightsHyg: null,
      capsulesWeightsHyg: null,
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

  const inputs = [
    {
      label: t('compression.mold_number'),
      value: data.moldNumber,
      key: 'moldNumber',
      required: true,
    },
    {
      label: t('compression.mold_volume'),
      value: data.moldVolume,
      key: 'moldVolume',
      required: true,
      adornment: 'cm³',
    },
    {
      label: t('compression.mold_weight'),
      value: data.moldWeight,
      key: 'moldWeight',
      required: true,
      adornment: 'g',
    },
    {
      label: t('compression.socket_weight'),
      value: data.socketWeight,
      key: 'socketWeight',
      required: true,
      adornment: 'g',
    },
    {
      label: t('compression.space_disc_thickness'),
      value: data.spaceDiscThickness,
      key: 'spaceDiscThickness',
      required: true,
      adornment: 'cm',
    },
    {
      label: t('compression.strokes_per_layer'),
      value: data.strokesPerLayer,
      key: 'strokesPerLayer',
      required: true,
    },
    {
      label: t('compression.layers'),
      value: data.layers,
      key: 'layers',
      required: true,
    },
  ];

  const columns: GridColDef[] = [
    {
      field: 'capsulesNumberHyg',
      headerName: t('compression.capsules_number'),
      renderCell: ({ row }) => (
        <InputEndAdornment
          fullWidth
          label={t('compression.capsules_number')}
          type="number"
          inputProps={{ min: 0 }}
          value={row.capsulesNumberHyg}
          onChange={(e) => {
            const newRows = [...rows];
            const index = rows.findIndex((r) => r.id === row.id);
            newRows[index].capsulesNumberHyg = Number(e.target.value);
            setData({ step: 2, value: newRows });
          }}
          adornment={''}
        />
      ),
    },
    {
      field: 'wetGrossWeightsCapsuleHyg',
      headerName: t('compression.wet_gross_weights_capsule'),
      renderCell: ({ row }) => (
        <InputEndAdornment
          fullWidth
          label={t('compression.wet_gross_weights_capsule')}
          type="number"
          inputProps={{ min: 0 }}
          value={row.wetGrossWeightsCapsuleHyg}
          onChange={(e) => {
            const newRows = [...rows];
            const index = rows.findIndex((r) => r.id === row.id);
            newRows[index].wetGrossWeightsCapsuleHyg = Number(e.target.value);
            setData({ step: 2, value: newRows });
          }}
          adornment={''}
        />
      ),
    },
    {
      field: 'dryGrossWeightsHyg',
      headerName: t('compression.dry_gross_weights'),
      renderCell: ({ row }) => (
        <InputEndAdornment
          fullWidth
          label={t('compression.dry_gross_weights')}
          type="number"
          inputProps={{ min: 0 }}
          value={row.dryGrossWeightsHyg}
          onChange={(e) => {
            const newRows = [...rows];
            const index = rows.findIndex((r) => r.id === row.id);
            newRows[index].dryGrossWeightsHyg = Number(e.target.value);
            setData({ step: 2, value: newRows });
          }}
          adornment={''}
        />
      ),
    },
    {
      field: 'capsulesWeightsHyg',
      headerName: t('compression.capsules_weights'),
      renderCell: ({ row }) => (
        <InputEndAdornment
          fullWidth
          label={t('compression.capsules_weights')}
          type="number"
          inputProps={{ min: 0 }}
          value={row.capsulesWeightsHyg}
          onChange={(e) => {
            const newRows = [...rows];
            const index = rows.findIndex((r) => r.id === row.id);
            newRows[index].capsulesWeightsHyg = Number(e.target.value);
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
      const { capsulesNumberHyg, wetGrossWeightsCapsuleHyg, dryGrossWeightsHyg, capsulesWeightsHyg } = row;
      return capsulesNumberHyg && wetGrossWeightsCapsuleHyg && dryGrossWeightsHyg && capsulesWeightsHyg >= 0;
    }) &&
      data !== null &&
      // verificar se precisa de mais validações antes de deixar ir para o próximo step
      setNextDisabled(false);
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
      >
        {inputs.map((input) => (
          <Box key={input.key}>
            <InputEndAdornment
              fullWidth
              label={input.label}
              value={input.value}
              required={input.required}
              onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
              adornment={input.adornment}
              type="number"
              inputProps={{ min: 0 }}
            />
          </Box>
        ))}
      </Box>
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

export default Compression_Step2;
