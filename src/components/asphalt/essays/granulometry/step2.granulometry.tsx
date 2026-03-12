import DropDown from '@/components/atoms/inputs/dropDown';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import { Sieve, SieveSeries } from '@/interfaces/common';
import useAsphaltGranulometryStore from '@/stores/asphalt/granulometry/asphalt-granulometry.store';
import { getSieveSeries } from '@/utils/sieves';
import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import AsphaltGranulometry_step2Table from './tables/step2-table.granulometry';
import { useEffect, useState } from 'react';
import GranulometryCustomSeriesModal from '@/components/atoms/modals/GranulometryCustomSeriesModal';

const AsphaltGranulometry_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step2Data: data, setData } = useAsphaltGranulometryStore();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [dropdownDefaultValue, setDropdownDefaultValue] = useState({ label: '', value: [] });

  useEffect(() => {
    if (data.material_mass != null && data.table_data?.length > 0) {
      const totalRetained = data.table_data.reduce((sum, row) => sum + row.retained, 0);
      const remaining = data.material_mass - totalRetained;

      const arredondado = Math.round((remaining + Number.EPSILON) * 100) / 100;

      setData({ step: 1, key: 'bottom', value: arredondado });
    }
  }, [data.material_mass, data.table_data]);

  const sievesSeries = [
    getSieveSeries(0),
    getSieveSeries(1),
    getSieveSeries(2),
    getSieveSeries(3),
    getSieveSeries(4),
    getSieveSeries(6),
  ];

  if (data.sieve_series && data.table_data && data.table_data.length == 0) {
    const table_data = [];
    data.sieve_series.map((s) => {
      table_data.push({ sieve_label: s.label, sieve_value: s.value, passant: 100, retained: 0 });
    });
    setData({ step: 1, key: 'table_data', value: table_data });
  }

  const rows = data.table_data;

  const columns: GridColDef[] = [
    {
      field: 'sieve_label',
      headerName: t('granulometry-asphalt.sieves'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'passant',
      headerName: t('granulometry-asphalt.passant'),
      renderCell: ({ row }) => {
        if (!rows) {
          return;
        }
        const { sieve_label } = row;
        const sieve_index = rows.findIndex((r) => r.sieve_label === sieve_label);

        return (
          <InputEndAdornment
            fullWidth
            adornment="%"
            type="number"
            inputProps={{ min: 0, max: 100, step: 0.01 }}
            value={rows[sieve_index]?.passant}
            required
            onChange={(e) => {
              if (e.target.value === null || e.target.value === '') return;
              
              const newRows = [...rows];
              const mass = data.material_mass || 0;
              let current_passant = parseFloat(e.target.value);

              // Validar entrada
              if (isNaN(current_passant) || current_passant < 0) current_passant = 0;
              if (current_passant > 100) current_passant = 100;

              // Passante não pode ser maior que o da peneira anterior
              const previousPassant = sieve_index > 0 ? newRows[sieve_index - 1].passant : 100;
              if (current_passant > previousPassant) {
                current_passant = previousPassant;
              }

              // Calcular retido para ESTA peneira
              const previousRetainedSum = sieve_index > 0 ? 
                newRows.slice(0, sieve_index).reduce((sum, r) => sum + r.retained, 0) : 0;
              
              // Retido = massa * (passante_anterior - passante_atual) / 100
              const current_retained = mass * (previousPassant - current_passant) / 100;
              
              // Arredondar para 2 casas decimais
              const roundedRetained = Math.round(current_retained * 100) / 100;

              // Atualizar esta linha
              newRows[sieve_index].passant = current_passant;
              newRows[sieve_index].retained = Math.max(0, roundedRetained);

              // Recalcular peneiras seguintes
              let accumulatedRetained = previousRetainedSum + newRows[sieve_index].retained;
              
              for (let i = sieve_index + 1; i < newRows.length; i++) {
                // Se o passante atual for maior que o anterior, ajustar
                if (newRows[i].passant > newRows[i - 1].passant) {
                  newRows[i].passant = newRows[i - 1].passant;
                }
                
                // Calcular retido baseado na diferença de passantes
                const retained_i = mass * (newRows[i - 1].passant - newRows[i].passant) / 100;
                newRows[i].retained = Math.max(0, Math.round(retained_i * 100) / 100);
                accumulatedRetained += newRows[i].retained;
              }

              // Calcular fundo
              const bottom = mass - accumulatedRetained;
              const roundedBottom = Math.round(bottom * 100) / 100;

              setData({ step: 1, key: 'table_data', value: newRows });
              setData({ step: 1, key: 'bottom', value: roundedBottom });
            }}
          />
        );
      },
    },
    {
      field: 'retained',
      headerName: t('granulometry-asphalt.retained'),
      renderCell: ({ row }) => {
        if (!rows) {
          return;
        }
        const { sieve_label } = row;
        const sieve_index = rows.findIndex((r) => r.sieve_label === sieve_label);

        return (
          <InputEndAdornment
            fullWidth
            adornment="g"
            type="number"
            inputProps={{ min: 0, step: 0.01 }}
            value={rows[sieve_index]?.retained}
            required
            onChange={(e) => {
              if (e.target.value === null || e.target.value === '') return;
              
              const newRows = [...rows];
              const mass = data.material_mass || 0;
              let current_retained = parseFloat(e.target.value);

              // Validar entrada
              if (isNaN(current_retained) || current_retained < 0) current_retained = 0;
              
              // Não pode exceder a massa restante
              const previousRetainedSum = sieve_index > 0 ? 
                newRows.slice(0, sieve_index).reduce((sum, r) => sum + r.retained, 0) : 0;
              const maxAllowed = mass - previousRetainedSum;
              
              if (current_retained > maxAllowed) {
                current_retained = maxAllowed;
              }

              // Calcular passante para ESTA peneira
              const previousPassant = sieve_index > 0 ? newRows[sieve_index - 1].passant : 100;
              
              // Passante = 100 - (retido_acumulado * 100 / massa)
              const accumulatedRetained = previousRetainedSum + current_retained;
              const current_passant = mass > 0 ? 
                Math.round((100 * (mass - accumulatedRetained) / mass) * 100) / 100 : 0;
              
              // Garantir que passante não seja negativo
              const validPassant = Math.max(0, Math.min(100, current_passant));

              // Atualizar esta linha
              newRows[sieve_index].retained = Math.round(current_retained * 100) / 100;
              newRows[sieve_index].passant = validPassant;

              // Recalcular peneiras seguintes
              let currentAccumulated = accumulatedRetained;
              
              for (let i = sieve_index + 1; i < newRows.length; i++) {
                // Calcular passante baseado no retido acumulado
                const passant_i = mass > 0 ? 
                  Math.round((100 * (mass - currentAccumulated) / mass) * 100) / 100 : 0;
                
                // Se o passante calculado for maior que o anterior, ajustar
                if (passant_i > newRows[i - 1].passant) {
                  // Ajustar retido para manter consistência
                  const retained_i = mass * (newRows[i - 1].passant - passant_i) / 100;
                  newRows[i].retained = Math.max(0, Math.round(retained_i * 100) / 100);
                  currentAccumulated += newRows[i].retained;
                  newRows[i].passant = newRows[i - 1].passant;
                } else {
                  // Manter o retido existente e recalcular passante
                  currentAccumulated += newRows[i].retained;
                  newRows[i].passant = Math.max(0, Math.round(passant_i * 100) / 100);
                }
              }

              // Calcular fundo
              const totalRetained = newRows.reduce((sum, r) => sum + r.retained, 0);
              const bottom = mass - totalRetained;
              const roundedBottom = Math.round(bottom * 100) / 100;

              setData({ step: 1, key: 'table_data', value: newRows });
              setData({ step: 1, key: 'bottom', value: roundedBottom });
            }}
          />
        );
      },
    },
  ];

  const handleDropdownDefaultValue = (isCustomSieries?: boolean) => {
    let value: { label: string; value: Sieve[] } | undefined = {
      label: '',
      value: [],
    };

    if (!isCustomSieries) {
      sievesSeries.find((sieveSeries: SieveSeries) => sieveSeries.sieves === data.sieve_series)
        ? (value = {
            label: sievesSeries.find((sieveSeries: SieveSeries) => sieveSeries.sieves === data.sieve_series)!.label,
            value: sievesSeries.find((sieveSeries: SieveSeries) => sieveSeries.sieves === data.sieve_series)!.sieves,
          })
        : (value = {
            label: 'teste',
            value: [],
          });
    } else {
      value = {
        label: t('granulometry-asphalt.custom-series'),
        value: [],
      };
    }

    setDropdownDefaultValue(value);
  };

  const handleShowCustomSeries = (customSieveSeries: Sieve[]) => {
    if (customSieveSeries.length > 0) {
      setData({ step: 1, key: 'sieve_series', value: customSieveSeries });
      setData({ step: 1, key: 'table_data', value: [] });
    }
  };

  const handleSelectSeries = (value: Sieve[], index: number) => {
    if (index === sievesSeries.length - 1) {
      setModalIsOpen(true);
      setDropdownDefaultValue({ label: t('granulometry-asphalt.custom-series'), value: [] });
    } else {
      const selectedSeries = sievesSeries[index];
      setData({ step: 1, key: 'sieve_series', value: selectedSeries.sieves });
      setData({ step: 1, key: 'table_data', value: [] });
      setDropdownDefaultValue({ label: selectedSeries.label, value: selectedSeries.sieves });
    }
  };

  // Validar se pode avançar
  useEffect(() => {
    if (data.material_mass != null && 
        data.bottom != null && 
        data.table_data?.length > 0 &&
        data.table_data.every((row) => row.passant !== null && row.retained !== null)) {
      
      const totalRetained = data.table_data.reduce((sum, row) => sum + row.retained, 0);
      const calculatedBottom = data.material_mass - totalRetained;
      const bottomDifference = Math.abs(calculatedBottom - data.bottom);
      
      // Permitir avançar se os cálculos estão consistentes (com margem de erro pequena)
      const isValid = bottomDifference < 0.01;
      setNextDisabled(!isValid);
    } else {
      setNextDisabled(true);
    }
  }, [data.material_mass, data.bottom, data.table_data, setNextDisabled]);

  return (
    <Box>
      <Box
        key={'top'}
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
          gap: '10px',
          mt: '20px',
        }}
      >
        <InputEndAdornment
          label={t('granulometry-asphalt.material_mass')}
          value={data.material_mass}
          onChange={(e) => {
            if (e.target.value === null || e.target.value === '') return;
            
            const mass = parseFloat(e.target.value);
            if (isNaN(mass) || mass < 0) return;

            setData({ step: 1, key: 'material_mass', value: mass });

            if (!rows || rows.length === 0) return;

            const newRows = [...rows];
            let accumulatedRetained = 0;

            // Recalcular todos os retidos baseados nos passantes
            for (let i = 0; i < newRows.length; i++) {
              const previousPassant = i > 0 ? newRows[i - 1].passant : 100;
              const currentPassant = newRows[i].passant;
              
              // Calcular retido para esta peneira
              const retained = mass * (previousPassant - currentPassant) / 100;
              newRows[i].retained = Math.max(0, Math.round(retained * 100) / 100);
              accumulatedRetained += newRows[i].retained;
            }

            // Calcular fundo
            const bottom = mass - accumulatedRetained;
            const roundedBottom = Math.round(bottom * 100) / 100;

            setData({ step: 1, key: 'table_data', value: newRows });
            setData({ step: 1, key: 'bottom', value: roundedBottom });
          }}
          adornment={'g'}
          type="number"
          inputProps={{ min: 0, step: 0.01 }}
          required
        />

        <DropDown
          key={'sieve_series'}
          variant="standard"
          label={t('granulometry-asphalt.choose-series')}
          value={dropdownDefaultValue}
          options={sievesSeries.map((sieveSeries: SieveSeries) => {
            return { label: sieveSeries.label, value: sieveSeries.sieves };
          })}
          callback={(value: Sieve[], index?: number) => {
            if (index !== undefined) {
              handleSelectSeries(value, index);
            }
          }}
          size="medium"
          required
        />
      </Box>
      {rows?.length > 0 && columns?.length > 0 && <AsphaltGranulometry_step2Table rows={rows} columns={columns} />}
      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
          gap: '10px',
          mt: '20px',
        }}
      >
        <Box key={'bottom'}>
          <InputEndAdornment
            label={t('granulometry-asphalt.bottom')}
            variant={'filled'}
            key="bottom"
            value={data.bottom != null ? Number(data.bottom).toFixed(2) : ''}
            onChange={(e) => setData({ step: 1, key: 'bottom', value: Number(e.target.value) })}
            adornment={'g'}
            type="number"
            inputProps={{ min: 0 }}
            readOnly={true}
            focused
          />
        </Box>
      </Box>

      <GranulometryCustomSeriesModal
        setCloseModal={(isClosed: boolean) => setModalIsOpen(isClosed)}
        isOpen={modalIsOpen}
        customSieveSeries={(customSieveSeries) => {
          handleShowCustomSeries(customSieveSeries);
          handleDropdownDefaultValue(true);
        }}
      />
    </Box>
  );
};

export default AsphaltGranulometry_Step2;
