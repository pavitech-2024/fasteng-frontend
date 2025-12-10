/* eslint-disable react-hooks/exhaustive-deps */
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useCompressionStore from '@/stores/soils/compression/compression.store';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import { t } from 'i18next';
import { toast } from 'react-toastify';

const Compression_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { hygroscopicData: data, setData } = useCompressionStore();
  const rows = data.hygroscopicTable;

  // Remover mais uma linha de determinado valor
  const handleErase = () => {
    try {
      if (rows.length > 1) {
        // O mínimo é um valor de cada
        const newRows = [...rows];
        newRows.pop();
        setData({ step: 1, key: 'hygroscopicTable', value: newRows });
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
      capsule: null,
      wetGrossWeightCapsule: null,
      dryGrossWeight: null,
      capsuleTare: null,
    });
    setData({ step: 1, key: 'hygroscopicTable', value: newRows });
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
      required: false,
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
      required: false,
      adornment: 'g',
    },
    {
      label: t('compression.space_disc_thickness'),
      value: data.spaceDiscThickness,
      key: 'spaceDiscThickness',
      required: false,
      adornment: 'cm',
    },
    {
      label: t('compression.strokes_per_layer'),
      value: data.strokesPerLayer,
      key: 'strokesPerLayer',
      required: false,
    },
    {
      label: t('compression.layers'),
      value: data.layers,
      key: 'layers',
      required: false,
    },
  ];

  const columns: GridColDef[] = [
    {
      field: 'capsule',
      headerName: t('compression.capsules_number'),
      renderCell: ({ row }) => {
        const { id } = row;
        const index = rows.findIndex((r) => r.id === id);

        return (
          <InputEndAdornment
            fullWidth
            label={t('compression.capsules_number')}
            type="number"
            inputProps={{ min: 0 }}
            value={row.capsule}
            onChange={(e) => {
              const newRows = [...rows];
              rows[index].capsule = Number(e.target.value);
              setData({ step: 1, key: 'capsule', value: newRows });
            }}
            adornment={''}
          />
        );
      },
    },
    {
      field: 'wetGrossWeightCapsule',
      headerName: t('compression.wet_gross_weights_capsule'),
      renderCell: ({ row }) => {
        const { id } = row;
        const index = rows.findIndex((r) => r.id === id);

        return (
          <InputEndAdornment
            fullWidth
            label={t('compression.wet_gross_weights_capsule')}
            type="number"
            inputProps={{ min: 0 }}
            value={row.wetGrossWeightCapsule}
            onChange={(e) => {
              const newRows = [...rows];
              newRows[index].wetGrossWeightCapsule = Number(e.target.value);
              setData({ step: 1, key: 'wetGrossWeightCapsule', value: newRows });
            }}
            adornment={''}
          />
        );
      },
    },
    {
      field: 'dryGrossWeight',
      headerName: t('compression.dry_gross_weights'),
      renderCell: ({ row }) => {
        const { id } = row;
        const index = rows.findIndex((r) => r.id === id);

        return (
          <InputEndAdornment
            fullWidth
            label={t('compression.dry_gross_weights')}
            type="number"
            inputProps={{ min: 0 }}
            value={row.dryGrossWeight}
            onChange={(e) => {
              const newRows = [...rows];
              newRows[index].dryGrossWeight = Number(e.target.value);
              setData({ step: 1, key: 'dryGrossWeight', value: newRows });
            }}
            adornment={''}
          />
        );
      },
    },
    {
      field: 'capsuleTare',
      headerName: t('compression.capsules_weights'),
      renderCell: ({ row }) => {
        const { id } = row;
        const index = rows.findIndex((r) => r.id === id);

        return (
          <InputEndAdornment
            fullWidth
            label={t('compression.capsules_weights')}
            type="number"
            inputProps={{ min: 0 }}
            value={row.capsuleTare}
            onChange={(e) => {
              const newRows = [...rows];
              newRows[index].capsuleTare = Number(e.target.value);
              setData({ step: 1, key: 'capsuleTare', value: newRows });
            }}
            adornment={''}
          />
        );
      },
    },
  ];

  if (nextDisabled) {
    // verifica se todos os campos da tabela estão preenchidos
    rows.every((row) => {
      const { capsule, wetGrossWeightCapsule, dryGrossWeight, capsuleTare } = row;
      return capsule && wetGrossWeightCapsule && dryGrossWeight && capsuleTare >= 0;
    }) &&
      data.moldVolume !== null &&
      data.moldWeight !== null &&
      // verificar se precisa de mais validações antes de deixar ir para o próximo step
      setNextDisabled(false);
  }

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
