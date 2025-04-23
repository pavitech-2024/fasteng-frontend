import { AddIcon, DeleteIcon, EditIcon } from '@/assets';
import CreateEditMaterialModal from '@/components/templates/modals/createEditAsphaltMaterial';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

const CreateMaterialDosageTable = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [materials, setMaterials] = useState<AsphaltMaterial[]>([]);
  console.log("🚀 ~ CreateMaterialDosageTable ~ materials:", materials)

  const [rows, setRows] = useState([]);
  console.log("🚀 ~ CreateMaterialDosageTable ~ rows:", rows)

  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [createdMaterialId, setCreatedMaterialId] = useState<string[]>([]);
  console.log("🚀 ~ CreateMaterialDosageTable ~ createdMaterialId:", createdMaterialId)

  const handleEditMaterial = () => {};

  const handleDeleteMaterial = () => {};

  const addNewMaterial = () => {
    setLoading(true);
    console.log("🚀 ~ addNewMaterial ~ createdMaterialId:", createdMaterialId)

    materialsService
      .getMaterials(createdMaterialId)
      .then((response) => {
        console.log("🚀 ~ .then ~ response.data:", response.data)
        setMaterials(response.data.materials);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load materials:', error);
      });
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Button onClick={handleEditMaterial}>
              <EditIcon /> Editar
            </Button>
            <Button onClick={handleDeleteMaterial}>
              <DeleteIcon /> Excluir
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
    }
  },[materials])

  return (
    <Box>
      <Typography variant="h6">AGREGADOS</Typography>
      <Button
        onClick={() => setModalIsOpen(true)}
        variant="contained"
        sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginY: '1rem' }}
      >
        <AddIcon /> Novo Material
      </Button>

      <DataGrid
        columns={columns.map((column) => ({ ...column, flex: 1, headerAlign: 'center', align: 'center' }))}
        rows={rows}
        hideFooter
      />

      <CreateEditMaterialModal
        openModal={modalIsOpen}
        handleCloseModal={() => setModalIsOpen(false)}
        updateMaterials={addNewMaterial}
        materials={materials}
        isEdit={isEdit}
        createdMaterialId={(id: string) => setCreatedMaterialId([...createdMaterialId, id])}
      />
    </Box>
  );
};

export default CreateMaterialDosageTable;
