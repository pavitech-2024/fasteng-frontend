import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useCompressionStore from '@/stores/soils/compression/compression.store';
import { Box, Button, Typography } from '@mui/material';
import { t } from 'i18next';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

const Compression_Step3 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { humidityDeterminationData: data, setData } = useCompressionStore();
  const rows = data.humidityTable;
  const [errors, setErrors] = useState<{ [key: number]: string[] }>({});

  // 🔥 VALIDAÇÃO COMPLETA COM EXPLICAÇÕES
  useEffect(() => {
    const newErrors: { [key: number]: string[] } = {};
    
    rows.forEach((row, index) => {
      const { capsulesTare, wetGrossWeightsCapsule, wetGrossWeights, dryGrossWeightsCapsule } = row;
      const rowErrors: string[] = [];
      
      if (
        capsulesTare !== null && capsulesTare !== undefined &&
        wetGrossWeightsCapsule !== null && wetGrossWeightsCapsule !== undefined &&
        wetGrossWeights !== null && wetGrossWeights !== undefined &&
        dryGrossWeightsCapsule !== null && dryGrossWeightsCapsule !== undefined
      ) {
        
        // 🔥 VALIDAÇÃO 1: Peso Bruto Cápsula < Peso Bruto Úmido
        if (wetGrossWeightsCapsule >= wetGrossWeights) {
          rowErrors.push(
            `❌ ERRO: Peso bruto da cápsula (${wetGrossWeightsCapsule}g) é MAIOR ou IGUAL ao Peso bruto úmido (${wetGrossWeights}g). ` +
            `➡️ O Peso bruto úmido (cápsula + solo úmido) deve ser o MAIOR valor!`
          );
        }
        
        // 🔥 VALIDAÇÃO 2: Peso Bruto Cápsula >= Peso Seco Cápsula
        if (wetGrossWeightsCapsule < dryGrossWeightsCapsule) {
          rowErrors.push(
            `❌ ERRO: Peso bruto da cápsula (${wetGrossWeightsCapsule}g) é MENOR que o Peso seco da cápsula (${dryGrossWeightsCapsule}g). ` +
            `➡️ O Peso bruto da cápsula (cápsula + solo seco) deve ser MAIOR ou IGUAL ao Peso seco da cápsula!`
          );
        }
        
        // 🔥 VALIDAÇÃO 3: Peso Bruto Cápsula > Tara
        if (wetGrossWeightsCapsule <= capsulesTare) {
          rowErrors.push(
            `❌ ERRO: Peso bruto da cápsula (${wetGrossWeightsCapsule}g) é MENOR ou IGUAL à Tara (${capsulesTare}g). ` +
            `➡️ A Tara (peso da cápsula vazia) deve ser o MENOR valor!`
          );
        }
        
        // 🔥 VALIDAÇÃO 4: Tara < Peso Seco Cápsula
        if (capsulesTare >= dryGrossWeightsCapsule) {
          rowErrors.push(
            `❌ ERRO: Tara (${capsulesTare}g) é MAIOR ou IGUAL ao Peso seco da cápsula (${dryGrossWeightsCapsule}g). ` +
            `➡️ A Tara (cápsula vazia) deve ser MENOR que o Peso seco da cápsula!`
          );
        }
        
        // 🔥 VALIDAÇÃO 5: Peso Bruto Úmido > Tara
        if (wetGrossWeights <= capsulesTare) {
          rowErrors.push(
            `❌ ERRO: Peso bruto úmido (${wetGrossWeights}g) é MENOR ou IGUAL à Tara (${capsulesTare}g). ` +
            `➡️ O Peso bruto úmido (cápsula + solo úmido) deve ser MAIOR que a Tara!`
          );
        }
        
        // 🔥 VALIDAÇÃO 6: Peso Bruto Úmido > Peso Seco Cápsula
        if (wetGrossWeights < dryGrossWeightsCapsule) {
          rowErrors.push(
            `❌ ERRO: Peso bruto úmido (${wetGrossWeights}g) é MENOR que o Peso seco da cápsula (${dryGrossWeightsCapsule}g). ` +
            `➡️ O Peso bruto úmido (cápsula + solo úmido) deve ser MAIOR que o Peso seco da cápsula!`
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
        setData({ step: 2, key: 'humidityTable', value: newRows });
      } else throw t('compression.error.minValue');
    } catch (error) {
      toast.error(error as string);
    }
  };

  const handleAdd = () => {
    const newRows = [...rows];
    newRows.push({
      id: rows.length,
      capsules: null,
      wetGrossWeightsCapsule: null,
      wetGrossWeights: null,
      dryGrossWeightsCapsule: null,
      capsulesTare: null,
    });
    setData({ step: 2, key: 'humidityTable', value: newRows });
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
      renderCell: ({ row }) => {
        const { id } = row;
        const index = rows.findIndex((r) => r.id === id);

        return (
          <InputEndAdornment
            fullWidth
            label={t('compression.capsules_number')}
            type="number"
            inputProps={{ min: 0 }}
            value={row.capsules}
            onChange={(e) => {
              const newRows = [...rows];
              newRows[index].capsules = Number(e.target.value);
              setData({ step: 2, key: 'humidityTable', value: newRows });
            }}
            adornment={''}
          />
        );
      },
    },
    {
      field: 'wetGrossWeights',
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
            value={row.wetGrossWeights}
            onChange={(e) => {
              const newRows = [...rows];
              newRows[index].wetGrossWeights = Number(e.target.value);
              setData({ step: 2, key: 'humidityTable', value: newRows });
            }}
            adornment={''}
          />
        );
      },
    },
    {
      field: 'wetGrossWeightsCapsule',
      headerName: t('compression.wet_weights_capsules'),
      renderCell: ({ row }) => {
        const { id } = row;
        const index = rows.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            fullWidth
            label={t('compression.wet_weights_capsules')}
            type="number"
            inputProps={{ min: 0 }}
            value={row.wetGrossWeightsCapsule}
            onChange={(e) => {
              const newRows = [...rows];
              newRows[index].wetGrossWeightsCapsule = Number(e.target.value);
              setData({ step: 2, key: 'humidityTable', value: newRows });
            }}
            adornment={''}
          />
        );
      },
    },
    {
      field: 'dryGrossWeightsCapsule',
      headerName: t('compression.dry_weights_capsules'),
      renderCell: ({ row }) => {
        const { id } = row;
        const index = rows.findIndex((r) => r.id === id);
        return (
          <InputEndAdornment
            fullWidth
            label={t('compression.dry_weights_capsules')}
            type="number"
            inputProps={{ min: 0 }}
            value={row.dryGrossWeightsCapsule}
            onChange={(e) => {
              const newRows = [...rows];
              newRows[index].dryGrossWeightsCapsule = Number(e.target.value);
              setData({ step: 2, key: 'humidityTable', value: newRows });
            }}
            adornment={''}
          />
        );
      },
    },
    {
      field: 'capsulesTare',
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
            value={row.capsulesTare}
            onChange={(e) => {
              const newRows = [...rows];
              newRows[index].capsulesTare = Number(e.target.value);
              setData({ step: 2, key: 'humidityTable', value: newRows });
            }}
            adornment={''}
          />
        );
      },
    },
  ];

  // 🔥 VALIDAÇÕES PARA O BOTÃO
  const hasErrors = Object.keys(errors).length > 0;
  
  const allFieldsFilled = rows.every((row) => {
    const { capsules, wetGrossWeightsCapsule, wetGrossWeights, dryGrossWeightsCapsule, capsulesTare } = row;
    return (
      capsules !== null && capsules !== undefined &&
      wetGrossWeightsCapsule !== null && wetGrossWeightsCapsule !== undefined &&
      wetGrossWeights !== null && wetGrossWeights !== undefined &&
      dryGrossWeightsCapsule !== null && dryGrossWeightsCapsule !== undefined &&
      capsulesTare !== null && capsulesTare !== undefined
    );
  });

  // 🔥 LÓGICA BIDIRECIONAL
  useEffect(() => {
    if (allFieldsFilled && !hasErrors && nextDisabled) {
      setNextDisabled(false);
    } else if ((!allFieldsFilled || hasErrors) && !nextDisabled) {
      setNextDisabled(true);
    }
  }, [allFieldsFilled, hasErrors, nextDisabled, setNextDisabled]);

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
          <Typography variant="subtitle2" sx={{ color: '#e65100', mb: 1, fontWeight: 'bold' }}>
            ⚠️ ERROS DE VALIDAÇÃO ENCONTRADOS
          </Typography>
          
          {Object.entries(errors).map(([index, rowErrors]) => (
            <Box key={index} sx={{ mb: 2, p: 1, bgcolor: '#fff', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ color: '#bf360c', fontWeight: 'bold', mb: 1 }}>
                📌 Linha {Number(index) + 1}:
              </Typography>
              {rowErrors.map((error, i) => (
                <Typography key={i} variant="body2" sx={{ color: '#bf360c', ml: 2, mb: 0.5 }}>
                  {error}
                </Typography>
              ))}
            </Box>
          ))}
          
          <Box sx={{ mt: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: '#1565c0', fontWeight: 'bold', mb: 1 }}>
              💡 ORDEM CORRETA DOS VALORES (DO MENOR PARA O MAIOR):
            </Typography>
            <Typography variant="body2" sx={{ color: '#1565c0', mb: 1 }}>
              <strong>Tara (Peso da cápsula vazia)</strong> {'<'} 
              <strong> Peso Seco da Cápsula</strong> {'<'} 
              <strong> Peso Bruto da Cápsula (solo seco + cápsula)</strong> {'<'} 
              <strong> Peso Bruto Úmido (solo úmido + cápsula)</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: '#1565c0', mt: 1, fontStyle: 'italic' }}>
              📝 Exemplo correto: Tara=40 | Peso Seco=175 | Peso Bruto Cápsula=180 | Peso Bruto Úmido=200
            </Typography>
          </Box>
        </Box>
      )}

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