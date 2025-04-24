import { AddIcon, DeleteIcon, EditIcon } from '@/assets';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import CreateEditMaterialModal from '@/components/templates/modals/createEditAsphaltMaterial';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import { AllSievesSuperpaveUpdatedAstm } from '@/interfaces/common';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import ScienceIcon from '@mui/icons-material/Science';

const CreateMaterialDosageTable = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [materials, setMaterials] = useState<AsphaltMaterial[]>([]);
  console.log('🚀 ~ CreateMaterialDosageTable ~ materials:', materials);
  const [minimumAggrPresent, setMinimumAggrPresent] = useState(false);
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
      setMaterials([...materials, newMaterial]);
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
            <ScienceIcon sx={{ width: '2rem', cursor: 'pointer' }} color='success'/>
            <EditIcon sx={{ width: '2rem', cursor: 'pointer' }} color='warning'/>
            <DeleteIcon sx={{ width: '2rem', cursor: 'pointer' }} color="error" />
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
