import { AddIcon, DeleteIcon, EditIcon } from '@/assets';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import CreateEditMaterialModal from '@/components/templates/modals/createEditAsphaltMaterial';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import { AllSievesSuperpaveUpdatedAstm } from '@/interfaces/common';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useState } from 'react';

const CreateMaterialDosageTable = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [materials, setMaterials] = useState<AsphaltMaterial[]>([]);
  console.log("🚀 ~ CreateMaterialDosageTable ~ materials:", materials)
  const [ minimumAggrPresent, setMinimumAggrPresent] = useState(false);
  const { granulometryEssayData: data, setData } = useSuperpaveStore();

  const [rows, setRows] = useState([]);

  const handleEditMaterial = () => {};

  const handleDeleteMaterial = () => {};

  useEffect(() => {
    if (materials.length > 0) {
      const newDataTable = [];

      AllSievesSuperpaveUpdatedAstm.map((s) => {
        newDataTable.push({ sieve_label: s.label, sieve_value: s.value, passant: 100, retained: 0 });
      });

      setData({ step: 1, key: 'table_data', value: newDataTable });
    }
  }, [materials]);

  if (data.granulometrys?.length > 0) {
    const table_data = Array(data.granulometrys?.length).fill(null);
    data.granulometrys.map((s, index) => {
      table_data[index] = {
        material: materials[index],
        sieve_label: s[index].sieve_series.label,
        sieve_value: s[index].sieve_series.value,
        passant: 100,
        retained: 0,
      };
    });
    setData({ step: 1, key: 'table_data', value: table_data });
  }

  const granulometryTableRows = data.granulometrys?.map((granulometry) => granulometry.table_data);

  const granulometryTableColumns: GridColDef[] = [
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
        const rowIndex = rows.findIndex((r) => r.material._id === row.material._id);
        const { sieve_label } = row;
        const sieve_index = rows.findIndex((r) => r.sieve_label === sieve_label);

        return (
          <InputEndAdornment
            fullWidth
            adornment="%"
            type="number"
            inputProps={{ min: 0 }}
            value={rows[sieve_index]?.passant}
            required
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...rows];
              const mass = data.granulometrys[rowIndex].material_mass;
              const current_passant = Number(e.target.value);

              const currentRows = sieve_index > 0 ? newRows.slice(0, sieve_index) : [];
              const initial_retained = 0;
              const accumulative_retained = currentRows.reduce(
                (accumulator: number, current_value) => accumulator + current_value.retained,
                initial_retained
              );

              const current_retained =
                Math.round(100 * (mass !== 0 ? ((100 - current_passant) / 100) * mass - accumulative_retained : 0)) /
                100;

              newRows[sieve_index].passant = current_passant;
              newRows[sieve_index].retained = current_retained;
              setData({ step: 1, key: 'passant', value: newRows });
              setData({ step: 1, key: 'retained', value: newRows });

              const nextRows = sieve_index > 0 ? newRows.slice(sieve_index) : [...rows];

              const new_current_accumulative_retained = accumulative_retained;

              nextRows.map(function (item, index) {
                const row = item;

                if (index > 0) {
                  const currentRows = nextRows.slice(0, index + 1);

                  const initial_retained = new_current_accumulative_retained;
                  const accumulative_retained = currentRows.reduce(
                    (accumulator: number, current_value) => accumulator + current_value.retained,
                    initial_retained
                  );

                  const retained =
                    Math.round(100 * (mass !== 0 ? ((100 - row.passant) / 100) * mass - accumulative_retained : 0)) /
                    100;

                  const passant =
                    Math.round(100 * (mass !== 0 ? (100 * (mass - accumulative_retained)) / mass : 0)) / 100;

                  newRows.map((e) => {
                    if (e.sieve_label === row.sieve_label) {
                      e.passant = passant;
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
    {
      field: 'retained',
      headerName: t('granulometry-asphalt.retained'),
      renderCell: ({ row }) => {
        if (!rows) {
          return;
        }
        const rowIndex = rows.findIndex((r) => r.material._id === row.material._id);
        const { sieve_label } = row;
        const sieve_index = rows.findIndex((r) => r.sieve_label === sieve_label);

        return (
          <InputEndAdornment
            fullWidth
            adornment="g"
            type="number"
            inputProps={{ min: 0 }}
            value={rows[sieve_index]?.retained}
            required
            onChange={(e) => {
              if (e.target.value === null) return;
              const newRows = [...rows];
              const mass = data.granulometrys[rowIndex].material_mass;
              const current_retained = Number(e.target.value);

              const currentRows = sieve_index > 0 ? newRows.slice(0, sieve_index) : [];
              const initial_retained = current_retained;
              const current_accumulative_retained = currentRows.reduce(
                (accumulator: number, current_value) => accumulator + current_value.retained,
                initial_retained
              );

              const current_passant =
                Math.round(100 * (mass !== 0 ? (100 * (mass - current_accumulative_retained)) / mass : 0)) / 100;
              newRows[sieve_index].retained = current_retained;
              newRows[sieve_index].passant = current_passant;
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
                    (accumulator: number, current_value) => accumulator + current_value.retained,
                    initial_retained
                  );

                  const passant =
                    Math.round(100 * (mass !== 0 ? (100 * (mass - accumulative_retained)) / mass : 0)) / 100;

                  newRows.map((e) => {
                    if (e.sieve_label === row.sieve_label) {
                      e.passant = passant;
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

  const addNewMaterial = () => {
    if (materials.length === 0) {
      return;
    } else {

      const newMaterial = {
        _id: materials[materials.length - 1]._id,
        createdAt: materials[materials.length - 1].createdAt,
        userId: materials[materials.length - 1].userId,
        description: {
          source: materials[materials.length - 1].description.source,
          responsible: materials[materials.length - 1].description.responsible,
          aggregateNature: materials[materials.length - 1].description.aggregateNature,
          boughtDate: materials[materials.length - 1].description.boughtDate,
          observation: materials[materials.length - 1].description.observation,
        },
        name: materials[materials.length - 1].name,
        type: materials[materials.length - 1].type,
      };

      const prevData = [...data.materials];
      prevData.push(newMaterial);

      setData({ step: 1, value: prevData, key: 'materials' });
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nome' },
    { field: 'type', headerName: 'Tipo' },
    { field: 'source', headerName: 'Fonte' },
    { field: 'responsible', headerName: 'Responsável' },
    { field: 'aggregateNature', headerName: 'Natureza do Agregado' },
    { field: 'boughtDate', headerName: 'Data de coleta' },
    { field: 'observation', headerName: 'Observações' },
    {
      field: 'actions',
      headerName: 'Ações',
      renderCell: () => {
        return (
          <Box sx={{ display: 'flex' }}>
            <Button size="small" onClick={handleEditMaterial} sx={{ color: 'warning.main' }}>
              <EditIcon sx={{ width: '20px' }} />
            </Button>
            <Button size="small" onClick={handleDeleteMaterial} sx={{ color: 'error.main' }}>
              <DeleteIcon sx={{ width: '20px' }} color="error" />
            </Button>
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    if (materials.length > 0) {
      const rows = materials.map((material) => ({
        id: material._id,
        name: material.name,
        type: material.type,
        source: material.description.source,
        responsible: material.description.responsible,
        aggregateNature: material.description.aggregateNature,
        boughtDate: material.description.boughtDate,
        observation: material.description.observation,
      }));

      setRows(rows);

      const coarseAggregates = rows.filter((row) => row.type === 'coarseAggregate'); // Filtra os agregados graudos
      const minimumCoarseAggrIsPresent = coarseAggregates.length >= 2; // Verifica se há pelo menos dois agregados graudos
      const minimumFineAggrIsPresent = rows.some((row) => row.type === 'fineAggregate'); // Verifica se algum item possui o tipo "Aggregado Fine"

      if (minimumCoarseAggrIsPresent && minimumFineAggrIsPresent) {
        setMinimumAggrPresent(true);
      }
    }
  }, [materials]);

  return (
    <Box>
      <Typography variant="h6">AGREGADOS</Typography>
      <Button
        onClick={() => setModalIsOpen(true)}
        variant="contained"
        sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginY: '1rem' }}
        disabled={minimumAggrPresent}
      >
        <AddIcon /> Novo Material
      </Button>

      {materials.length > 0 && (
        <DataGrid
          columns={columns.map((column) => ({ ...column, flex: 1, headerAlign: 'center', align: 'center' }))}
          rows={rows}
          hideFooter
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
        />
      )}

      <CreateEditMaterialModal
        openModal={modalIsOpen}
        handleCloseModal={() => setModalIsOpen(false)}
        updateMaterials={addNewMaterial}
        materials={materials}
        isEdit={false}
        createdMaterial={(material: AsphaltMaterial) => setMaterials([...materials, material])}
      />
    </Box>
  );
};

export default CreateMaterialDosageTable;
