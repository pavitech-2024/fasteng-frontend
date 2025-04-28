import { EssayPageProps } from '@/components/templates/essay';
import { Box, Typography } from '@mui/material';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import CreateMaterialDosageTable from './tables/createMaterialDosageTable';
import AsphaltGranulometry_step2Table from '../../essays/granulometry/tables/step2-table.granulometry';
import { useEffect, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';

const Superpave_Step2 = ({ setNextDisabled, nextDisabled }: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const data = useSuperpaveStore((state) => state.granulometryEssayData);

  const setData = useSuperpaveStore((state) => state.setData);

  const rows = data.granulometrys.map((granul) => ({ ...granul }));

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

        const { sieve_label, material } = row;

        const rowIndex = data.materials.findIndex((mat) => mat._id === material?._id);

        const sieve_index = rows[rowIndex]?.table_data.findIndex((r) => r.sieve_label === sieve_label);

        return (
          <InputEndAdornment
            fullWidth
            adornment="%"
            type="number"
            inputProps={{ min: 0 }}
            value={rows[rowIndex]?.table_data[sieve_index]?.passant}
            required
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...rows];

              const mass = data.granulometrys[rowIndex]?.material_mass;
              const validMass = isNaN(mass) ? 0 : mass;
              const input_passant = isNaN(Number(e.target.value)) ? 0 : Number(e.target.value);

              // Garante que o input nunca seja maior que o passante anterior (ou 100 na primeira linha)
              let current_passant = input_passant;
              if (sieve_index > 0) {
                const previous_passant = newRows[rowIndex].table_data[sieve_index - 1]?.passant ?? 100;
                if (current_passant > previous_passant) {
                  current_passant = previous_passant;
                }
              } else {
                if (current_passant > 100) current_passant = 100;
              }

              // Atualiza a linha atual
              const peneiras_anteriores = newRows[rowIndex].table_data.slice(0, sieve_index);
              const accumulative_retained = peneiras_anteriores.reduce((acc, peneira) => {
                return acc + (peneira.retained || 0);
              }, 0);

              const current_retained =
                Math.round(
                  100 * (validMass !== 0 ? ((100 - current_passant) / 100) * validMass - accumulative_retained : 0)
                ) / 100;

              if (newRows[rowIndex]) {
                newRows[rowIndex].table_data[sieve_index].passant = current_passant;
                newRows[rowIndex].table_data[sieve_index].retained = current_retained;
              }

              // Atualiza as próximas linhas
              for (let i = sieve_index + 1; i < newRows[rowIndex].table_data.length; i++) {
                const peneiras_anteriores = newRows[rowIndex].table_data.slice(0, i);
                const accumulative_retained = peneiras_anteriores.reduce((acc, peneira) => {
                  return acc + (peneira.retained || 0);
                }, 0);

                const retained =
                  Math.round(
                    100 * (validMass !== 0 ? ((100 - current_passant) / 100) * validMass - accumulative_retained : 0)
                  ) / 100;

                const passant =
                  Math.round(100 * (validMass !== 0 ? (100 * (validMass - accumulative_retained)) / validMass : 0)) /
                  100;

                newRows[rowIndex].table_data[i].passant = passant > current_passant ? current_passant : passant;
                newRows[rowIndex].table_data[i].retained = retained;
              }

              // Atualiza o valor de fundo (bottom)
              const bottomValue = newRows[rowIndex].table_data.reduce((acc, peneira) => {
                return acc + peneira.retained;
              }, 0);

              const bottom = Math.round(100 * (validMass !== 0 ? validMass - bottomValue : 0)) / 100;
              newRows[rowIndex].bottom = bottom;

              setData({ step: 1, key: 'granulometrys', value: newRows });
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
        const { sieve_label, material } = row;
        const rowIndex = data.materials.findIndex((mat) => mat._id === material?._id);
        const sieve_index = rows[rowIndex]?.table_data.findIndex((r) => r.sieve_label === sieve_label);

        return (
          <InputEndAdornment
            fullWidth
            adornment="g"
            type="number"
            inputProps={{ min: 0 }}
            // value={rows[rowIndex]?.table_data[sieve_index]?.retained}
            value={
              isNaN(rows[rowIndex]?.table_data[sieve_index]?.retained)
                ? 'erro'
                : rows[rowIndex]?.table_data[sieve_index]?.retained
            }
            required
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...rows];
              const mass = data.granulometrys[rowIndex].material_mass;
              const current_retained = Number(e.target.value);

              const currentRows = sieve_index > 0 ? newRows.slice(0, sieve_index) : [];
              const initial_retained = current_retained;
              const current_accumulative_retained = currentRows.reduce(
                (accumulator: number, current_value) => accumulator + current_value[sieve_index].retained,
                initial_retained
              );

              const current_passant =
                Math.round(100 * (mass !== 0 ? (100 * (mass - current_accumulative_retained)) / mass : 0)) / 100;
              newRows[rowIndex].table_data[sieve_index].retained = current_retained;
              newRows[rowIndex].table_data[sieve_index].passant = current_passant;
              setData({ step: 1, key: 'retained', value: newRows });
              setData({ step: 1, key: 'passant', value: newRows });

              const nextRows = sieve_index > 0 ? newRows.slice(sieve_index) : [...rows];

              const new_current_accumulative_retained = current_accumulative_retained - current_retained;

              nextRows.map(function (item, index) {
                const row = item;

                if (index > 0) {
                  const currentRows = nextRows.slice(0, index + 1);

                  const initial_retained = new_current_accumulative_retained;
                  const accumulative_retained = currentRows.reduce(
                    (accumulator: number, current_value) => accumulator + current_value[sieve_index].retained,
                    initial_retained
                  );

                  const passant =
                    Math.round(100 * (mass !== 0 ? (100 * (mass - accumulative_retained)) / mass : 0)) / 100;

                  newRows.map((e) => {
                    if (e[sieve_index].sieve_label === row[rowIndex].table_data[sieve_index].sieve_label) {
                      e[sieve_index].passant = passant;
                      e[sieve_index].retained = accumulative_retained;
                    }
                  });
                }
              });

              setData({ step: 1, key: 'table_data', value: newRows });
            }}
          />
        );
      },
    },
  ];

  useEffect(() => {
    const hasCoarseAggregate = data.materials.some((material) => material.type === 'coarseAggregate');
    const hasFineAggregate = data.materials.some((material) => material.type === 'fineAggregate');
    const hasFiller = data.materials.some((material) => material.type === 'filler');
    const hasBinder = data.materials.some((material) => material.type === 'asphaltBinder' || 'CAP');

    if (hasCoarseAggregate && hasFineAggregate && hasFiller && hasBinder) {
      setNextDisabled(false);
    }
  },[data.materials])

  return (
    <Box>
      <CreateMaterialDosageTable />

      {rows.length > 0 &&
        data.materials.length > 0 &&
        rows.map((row, idx) => (
          <Box sx={{ marginY: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Typography variant="h5">
              {data.materials[idx].name} | {data.materials[idx].type}
            </Typography>
            <Box sx={{ display: 'flex', gap: '5rem' }}>
              <InputEndAdornment
                label={t('granulometry-asphalt.material_mass')}
                value={row.material_mass}
                onChange={(e) => {
                  if (e.target.value === null) return;

                  const mass = Number(e.target.value);
                  console.log('🚀 ~ mass:', mass);

                  if (rows === null) return;

                  const newRows = rows.map((item, index) => {
                    const row = { ...item };

                    if (index === idx) {
                      row.material_mass = mass; // atualiza o material_mass na linha certa
                    }

                    const currentRows = index > 0 ? rows.slice(0, index) : [];
                    const initial_retained = 0;
                    const acumulative_retained = currentRows.reduce(
                      (accumulator: number, current_value) => accumulator + (current_value[idx].retained || 0),
                      initial_retained
                    );

                    if (row.table_data[idx]) {
                      row.table_data[idx].retained =
                        Math.round(
                          100 *
                            (mass !== 0 ? ((100 - row.table_data[idx].passant) / 100) * mass - acumulative_retained : 0)
                        ) / 100;
                    }

                    return row;
                  });

                  // Agora calcula o bottom depois de atualizar os dados
                  const totalRetained = newRows[idx].table_data.reduce((sum, row) => sum + row.retained, 0);
                  const remaining = newRows[idx].material_mass - totalRetained;

                  newRows[idx].bottom = remaining; // atualiza o bottom na linha correta

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
                onChange={(e) => setData({ step: 1, key: 'bottom', value: Number(e.target.value) })}
                adornment={'g'}
                type="number"
                inputProps={{ min: 0 }}
                readOnly={true}
                focused
              />
            </Box>

            <AsphaltGranulometry_step2Table
              rows={row.table_data.map((row) => ({ ...row, material: rows[idx].material }))}
              columns={columns}
            />
          </Box>
        ))}
    </Box>
  );
};

export default Superpave_Step2;
