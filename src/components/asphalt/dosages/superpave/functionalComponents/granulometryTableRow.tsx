import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import AsphaltGranulometry_step2Table from '@/components/asphalt/essays/granulometry/tables/step2-table.granulometry';

const GranulometryRow = ({
  idx,
  row,
  aggregatesRows,
  data,
  materialMassInputs,
  setMaterialMassInputs,
  setData,
  myRef,
  t,
  aggregatesColumns,
}) => {
  const tableRows = useMemo(() => {
    return (
      aggregatesRows[idx]?.table_data.map((row) => ({
        ...row,
        material: aggregatesRows[idx].material,
      })) ?? []
    );
  }, [aggregatesRows, idx]);

  return (
    <Box
      key={idx}
      sx={{ marginY: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
      ref={(el) => {
        if (el) myRef.current[row.material.name] = el;
      }}
    >
      <Typography variant="h5">
        {data.materials[idx].name} | {data.materials[idx].type}
      </Typography>

      <Box sx={{ display: 'flex', gap: '5rem' }}>
        <InputEndAdornment
          label={t('granulometry-asphalt.material_mass')}
          value={materialMassInputs[idx]}
          onChange={(e) => {
            if (e.target.value === null) return;
            const mass = Number(e.target.value);

            setMaterialMassInputs((prev) => {
              const updated = [...prev];
              updated[idx] = mass;
              return updated;
            });

            if (aggregatesRows === null) return;

            const newRows = aggregatesRows.map((item, index) => {
              const row = { ...item };
              const currentMass =
                index === idx ? mass : materialMassInputs[index] || item.material_mass;

              if (index === idx) {
                row.material_mass = mass;
              }

              const currentRows = index > 0 ? aggregatesRows.slice(0, index) : [];
              const acumulative_retained = currentRows.reduce(
                (accumulator: number, current_value) =>
                  accumulator + (current_value[idx]?.table_data.retained || 0),
                0
              );

              if (row.table_data[idx]) {
                row.table_data[idx].retained =
                  Math.round(
                    100 *
                      (currentMass !== 0
                        ? ((100 - row.table_data[idx].passant) / 100) * currentMass -
                          acumulative_retained
                        : 0)
                  ) / 100;
              }

              return row;
            });

            const totalRetained = newRows[idx].table_data.reduce(
              (sum, row) => sum + row.retained,
              0
            );
            const remaining = newRows[idx].material_mass - totalRetained;

            newRows[idx].bottom = remaining;

            setData({ step: 1, key: 'granulometrys', value: newRows });
          }}
          adornment={'g'}
          type="number"
          inputProps={{ min: 0 }}
          required
        />

        <InputEndAdornment
          label={t('granulometry-asphalt.bottom')}
          variant={'filled'}
          key="bottom"
          value={data.granulometrys[idx].bottom}
          onChange={(e) =>
            setData({ step: 1, key: 'bottom', value: Number(e.target.value) })
          }
          adornment={'g'}
          type="number"
          inputProps={{ min: 0 }}
          readOnly={true}
          focused
        />
      </Box>

      <AsphaltGranulometry_step2Table
        rows={tableRows}
        columns={aggregatesColumns}
      />
    </Box>
  );
};

export default GranulometryRow;
