import { EssayPageProps } from '@/components/templates/essay';
import { Box, Button, Typography } from '@mui/material';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import CreateMaterialDosageTable from './tables/createMaterialDosageTable';
import AsphaltGranulometry_step2Table from '../../essays/granulometry/tables/step2-table.granulometry';
import { useEffect, useRef } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { toast } from 'react-toastify';

const Superpave_Step2 = ({ setNextDisabled }: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const data = useSuperpaveStore((state) => state.granulometryEssayData);
  const setData = useSuperpaveStore((state) => state.setData);

  const myRef = useRef<any>({});

  const aggregatesRows = data.granulometrys
    .map((granul) => ({ ...granul }))
    .filter(
      ({ material }) => material.type !== 'asphaltBinder' && material.type !== 'CAP' && material.type !== 'other'
    );

  const binderRows = data.viscosity?.dataPoints;

  const aggregatesColumns: GridColDef[] = [
    {
      field: 'sieve_label',
      headerName: t('granulometry-asphalt.sieves'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'passant',
      headerName: t('granulometry-asphalt.passant'),
      renderCell: ({ row }) => {
        if (!aggregatesRows) {
          return;
        }

        const { sieve_label, material } = row;

        const rowIndex = data.materials.findIndex((mat) => mat._id === material?._id);

        const sieve_index = aggregatesRows[rowIndex]?.table_data.findIndex((r) => r.sieve_label === sieve_label);

        return (
          <InputEndAdornment
            fullWidth
            adornment="%"
            type="number"
            inputProps={{ min: 0 }}
            value={aggregatesRows[rowIndex]?.table_data[sieve_index]?.passant}
            required
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...aggregatesRows];

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
        if (!aggregatesRows) {
          return;
        }
        const { sieve_label, material } = row;
        const rowIndex = data.materials.findIndex((mat) => mat._id === material?._id);
        const sieve_index = aggregatesRows[rowIndex]?.table_data.findIndex((r) => r.sieve_label === sieve_label);

        return (
          <InputEndAdornment
            fullWidth
            adornment="g"
            type="number"
            inputProps={{ min: 0 }}
            // value={aggregatesRows[rowIndex]?.table_data[sieve_index]?.retained}
            value={
              isNaN(aggregatesRows[rowIndex]?.table_data[sieve_index]?.retained)
                ? 'erro'
                : aggregatesRows[rowIndex]?.table_data[sieve_index]?.retained
            }
            required
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...aggregatesRows];
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

              const nextRows = sieve_index > 0 ? newRows.slice(sieve_index) : [...aggregatesRows];

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

  const binderColumns: GridColDef[] = [
    {
      field: 'temperature',
      headerName: t('saybolt-furol.temperature'),
      renderCell: ({ row }) => {
        const { id } = row;
        const index = binderRows.findIndex((r) => r.id === id);

        return (
          <InputEndAdornment
            fullWidth
            type="number"
            value={row.temperature}
            onChange={(e) => {
              const newRows = [...binderRows];
              if (index !== -1) {
                newRows[index].temperature = Number(e.target.value);
                setData({ step: 1, key: 'viscosity', value: {...data.viscosity, dataPoints: newRows} });
              }
            }}
            adornment={'°C'}
          />
        );
      },
    },
    {
      field: 'viscosity',
      headerName: t('asphalt.essays.viscosityRotational.viscosity'),
      renderCell: ({ row }) => {
        const { id } = row;
        const index = binderRows.findIndex((r) => r.id === id);

        return (
          <InputEndAdornment
            fullWidth
            label={t('asphalt.essays.viscosityRotational.viscosity')}
            type="number"
            value={row.viscosity}
            onChange={(e) => {
              const newRows = [...binderRows];
              newRows[index].viscosity = Number(e.target.value);
              setData({ step: 1, key: 'viscosity', value: {...data.viscosity, dataPoints: newRows} });
            }}
            adornment={'Poise'}
          />
        );
      },
    },
  ];

  useEffect(() => {
    setNextDisabled(true);
    const hasCoarseAggregate = data.materials.some((material) => material.type === 'coarseAggregate');
    const hasFineAggregate = data.materials.some((material) => material.type === 'fineAggregate');
    // const hasFiller = data.materials.some((material) => material.type === 'filler');
    const hasBinder = data.materials.some((material) => material.type === 'asphaltBinder' || material.type === 'CAP');

    if (hasCoarseAggregate && hasFineAggregate && hasBinder) {
      setNextDisabled(false);
    }
  }, [data.materials]);

  const handleErase = () => {
    try {
      if (binderRows.length > 1) {
        const prevBinderRows = { ...data.viscosity };
        prevBinderRows.dataPoints.pop();
        setData({ step: 1, key: 'viscosity', value: prevBinderRows });
      } else throw t('saybolt-furol.error.minValue');
    } catch (error) {
      toast.error(error);
    }
  };

  const handleAdd = () => {
    const prevBinderRows = { ...data.viscosity };
    prevBinderRows.dataPoints.push({
      id: binderRows.length,
      temperature: null,
      viscosity: null,
    });
    setData({ step: 1, key: 'viscosity', value: prevBinderRows });
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

  const handleClickedMaterial = (row) => {
    const targetRef = myRef.current[row.name];
    if (targetRef) {
      targetRef.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box>
      <CreateMaterialDosageTable
        onRowClick={(row: any) => {
          handleClickedMaterial(row);
        }}
      />

      {aggregatesRows.length > 0 &&
        data.materials.length > 0 &&
        aggregatesRows.map((row, idx) => (
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
                value={row.material_mass}
                onChange={(e) => {
                  if (e.target.value === null) return;

                  const mass = Number(e.target.value);

                  if (aggregatesRows === null) return;

                  const newRows = aggregatesRows.map((item, index) => {
                    const row = { ...item };

                    if (index === idx) {
                      row.material_mass = mass; // atualiza o material_mass na linha certa
                    }

                    const currentRows = index > 0 ? aggregatesRows.slice(0, index) : [];
                    const initial_retained = 0;
                    const acumulative_retained = currentRows.reduce(
                      (accumulator: number, current_value) => accumulator + (current_value[idx]?.table_data.retained || 0),
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
              rows={row.table_data.map((row) => ({ ...row, material: aggregatesRows[idx].material }))}
              columns={aggregatesColumns}
            />
          </Box>
        ))}

      {data.viscosity?.dataPoints?.length > 0 && (
        <Box
          sx={{ marginY: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
          ref={(el) => {
            if (el) myRef.current[data.viscosity.material.name] = el;
          }}
        >
          <Typography variant="h5">
            {data.viscosity.material.name} | {data.viscosity.material.type}
          </Typography>
          <DataGrid
            sx={{ mt: '1rem', borderRadius: '10px' }}
            density="compact"
            showCellVerticalBorder
            showColumnVerticalBorder
            slots={{ footer: ExpansionToolbar }}
            rows={binderRows.map((row, index) => ({ ...row, id: index }))}
            columns={binderColumns.map((column) => ({
              ...column,
              sortable: false,
              disableColumnMenu: true,
              align: 'center',
              headerAlign: 'center',
              minWidth: 150,
              flex: 1,
            }))}
          />
        </Box>
      )}
    </Box>
  );
};

export default Superpave_Step2;
