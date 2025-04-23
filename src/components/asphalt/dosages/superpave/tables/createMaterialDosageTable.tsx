import { AddIcon, DeleteIcon, EditIcon } from '@/assets';
import CreateEditMaterialModal from '@/components/templates/modals/createEditAsphaltMaterial';
import useAuth from '@/contexts/auth';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';

const CreateMaterialDosageTable = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [materials, setMaterials] = useState<AsphaltMaterial[]>([]);
  console.log("🚀 ~ CreateMaterialDosageTable ~ materials:", materials)
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [createdMaterialId, setCreatedMaterialId] = useState<string[]>([]);

  const { user } = useAuth();

  const handleEditMaterial = () => {};

  const handleDeleteMaterial = () => {};

  const addNewMaterial = () => {
    setLoading(true);
    materialsService
      .getMaterialsById(createdMaterialId)
      .then((response) => {
        setMaterials(response.data);
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
    { field: 'nature', headerName: 'Natureza do Agregado' },
    { field: 'date', headerName: 'Data de coleta' },
    { field: 'observations', headerName: 'Observações' },
    {
      field: 'actions',
      headerName: 'Ações',
      renderCell: () => {
        return (
          <Box>
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
        rows={[]}
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
