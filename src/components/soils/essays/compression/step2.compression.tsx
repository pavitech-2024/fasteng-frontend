/* eslint-disable react-hooks/exhaustive-deps */
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useCompressionStore from '@/stores/soils/compression/compression.store';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button, Typography } from '@mui/material';
import { t } from 'i18next';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Compression_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { hygroscopicData: data, setData } = useCompressionStore();
  const rows = data.hygroscopicTable;
  const [errors, setErrors] = useState<{ [key: number]: string[] }>({});

  // 🔥 VALIDAÇÃO COMPLETA
  useEffect(() => {
    const newErrors: { [key: number]: string[] } = {};
    
    rows.forEach((row, index) => {
      const { capsuleTare, wetGrossWeightCapsule, dryGrossWeight } = row;
      const rowErrors: string[] = [];
      
      // Só valida se os campos estiverem preenchidos
      if (
        capsuleTare !== null && capsuleTare !== undefined &&
        wetGrossWeightCapsule !== null && wetGrossWeightCapsule !== undefined &&
        dryGrossWeight !== null && dryGrossWeight !== undefined
      ) {
        // Validação 1: Tara < Peso seco
        if (capsuleTare >= dryGrossWeight) {
          rowErrors.push(
            `Tara (${capsuleTare}g) ≥ Peso bruto seco (${dryGrossWeight}g) - A tara deve ser MENOR`
          );
        }
        
        // 🔥 Validação 2: Peso úmido >= Peso seco
        if (wetGrossWeightCapsule < dryGrossWeight) {
          rowErrors.push(
            `Peso bruto úmido (${wetGrossWeightCapsule}g) < Peso bruto seco (${dryGrossWeight}g) - O peso úmido deve ser MAIOR ou IGUAL`
          );
        }
        
        // 🔥 Validação 3: Peso úmido > Tara
        if (wetGrossWeightCapsule <= capsuleTare) {
          rowErrors.push(
            `Peso bruto úmido (${wetGrossWeightCapsule}g) ≤ Tara (${capsuleTare}g) - O peso úmido deve ser MAIOR que a tara`
          );
        }
      }
      
      if (rowErrors.length > 0) {
        newErrors[index] = rowErrors;
      }
    });
    
    setErrors(newErrors);
  }, [rows]);

  const handleErase = () => {
    try {
      if (rows.length > 1) {
        const newRows = [...rows];
        newRows.pop();
        setData({ step: 1, key: 'hygroscopicTable', value: newRows });
      } else throw t('compression.error.minValue');
    } catch (error) {
      toast.error(error as string);
    }
  };

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
    { label: t('compression.mold_number'), value: data.moldNumber, key: 'moldNumber', required: false },
    { label: t('compression.mold_volume'), value: data.moldVolume, key: 'moldVolume', required: true, adornment: 'cm³' },
    { label: t('compression.mold_weight'), value: data.moldWeight, key: 'moldWeight', required: true, adornment: 'g' },
    { label: t('compression.socket_weight'), value: data.socketWeight, key: 'socketWeight', required: false, adornment: 'g' },
    { label: t('compression.space_disc_thickness'), value: data.spaceDiscThickness, key: 'spaceDiscThickness', required: false, adornment: 'cm' },
    { label: t('compression.strokes_per_layer'), value: data.strokesPerLayer, key: 'strokesPerLayer', required: false },
    { label: t('compression.layers'), value: data.layers, key: 'layers', required: false },
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
              newRows[index].capsule = Number(e.target.value);
              setData({ step: 1, key: 'hygroscopicTable', value: newRows });
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
              setData({ step: 1, key: 'hygroscopicTable', value: newRows });
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
              setData({ step: 1, key: 'hygroscopicTable', value: newRows });
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
              setData({ step: 1, key: 'hygroscopicTable', value: newRows });
            }}
            adornment={''}
          />
        );
      },
    },
  ];

  const hasErrors = Object.keys(errors).length > 0;
  const allFieldsFilled = rows.every((row) => {
    const { capsule, wetGrossWeightCapsule, dryGrossWeight, capsuleTare } = row;
    return (
      capsule !== null && capsule !== undefined &&
      wetGrossWeightCapsule !== null && wetGrossWeightCapsule !== undefined &&
      dryGrossWeight !== null && dryGrossWeight !== undefined &&
      capsuleTare !== null && capsuleTare !== undefined
    );
  });

  useEffect(() => {
    if (allFieldsFilled && !hasErrors && data.moldVolume !== null && data.moldWeight !== null && nextDisabled) {
      setNextDisabled(false);
    } else if ((!allFieldsFilled || hasErrors || data.moldVolume === null || data.moldWeight === null) && !nextDisabled) {
      setNextDisabled(true);
    }
  }, [allFieldsFilled, hasErrors, data.moldVolume, data.moldWeight]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {hasErrors && (
        <Box 
          sx={{ 
            p: 2, 
            mb: 2, 
            bgcolor: '#fff3e0', 
            border: '1px solid #ff9800',
            borderRadius: 1 
          }}
        >
          <Typography variant="subtitle2" sx={{ color: '#e65100', mb: 1 }}>
            ⚠️
          </Typography>
          {Object.entries(errors).map(([index, rowErrors]) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#bf360c', fontWeight: 'bold' }}>
                Linha {Number(index) + 1}:
              </Typography>
              {rowErrors.map((error, i) => (
                <Typography key={i} variant="body2" sx={{ color: '#bf360c', ml: 2 }}>
                  • {error}
                </Typography>
              ))}
            </Box>
          ))}
          <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
            💡 <strong>Regras:</strong> Tara {'<'} Peso Seco {'≤'} Peso Úmido
          </Typography>
        </Box>
      )}

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