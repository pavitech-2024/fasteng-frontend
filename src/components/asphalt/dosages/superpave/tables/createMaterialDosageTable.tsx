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
import materialsService from '@/services/asphalt/asphalt-materials.service';
import RtfoMaterialView from '@/components/asphalt/material/rtfoMaterialView';

const CreateMaterialDosageTable = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { granulometryEssayData: data, setData } = useSuperpaveStore();

  const [minimumAggrPresent, setMinimumAggrPresent] = useState({
    fineAggr: false,
    coarseAggr: false,
    filler: false,
  });

  const [rows, setRows] = useState([]);

  const handleEditMaterial = () => {};

  const handleDeleteMaterial = async (id: string) => {
    console.log("🚀 ~ handleDeleteMaterial ~ id:", id)
    try {
      const prevData = {...data};
      console.log("🚀 ~ handleDeleteMaterial ~ prevData:", prevData)

      await materialsService.deleteMaterial(id);
      const updatedMaterials = prevData.materials.filter((material) => material._id !== id);
      const updatedGranulometrys = prevData.granulometrys.filter((gran) => gran.material._id !== id);
      
      setData({ step: 1, key: 'materials', value: updatedMaterials });
      setData({ step: 1, key: 'granulometrys', value: updatedGranulometrys });
    } catch (error) {
      console.error('Failed to delete material:', error);
    }
  };

  const addNewMaterial = (material: AsphaltMaterial) => {
    const newMaterial = {
      _id: material._id,
      createdAt: material.createdAt,
      userId: material.userId,
      description: {
        source: material.description.source,
        responsible: material.description.responsible,
        aggregateNature: material.description.aggregateNature,
        boughtDate: material.description.boughtDate,
        observation: material.description.observation,
      },
      name: material.name,
      type: material.type,
    };

    const newTableData = [];
    const newSieveSeries = [];

    AllSievesSuperpaveUpdatedAstm.map((s) => {
      newTableData.push({ sieve_label: s.label, sieve_value: s.value, passant: 100, retained: 0 });
      newSieveSeries.push({ label: s.label, value: s.value });
    });

    const newGranul = {
      material: material,
      material_mass: 0,
      table_data: newTableData,
      sieve_series: newSieveSeries,
      bottom: 0,
    };

    console.log('🚀 ~ addNewMaterial ~ newGranul:', newGranul);

    const prevMaterialsData = [...data.materials];
    prevMaterialsData.push(newMaterial);

    const prevGranulData = [...data.granulometrys];
    prevGranulData.push(newGranul);

    setData({ step: 1, key: 'materials', value: prevMaterialsData });
    setData({ step: 1, key: 'granulometrys', value: prevGranulData });
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
      renderCell: ({ row }) => {
        const index = row.id;
        const iconStyle = {
          width: '2rem',
          cursor: 'pointer',
          ':hover': {
            color: 'secondaryTons.green',
            transform: 'scale(1.2)',
            transition: 'transform 0.2s ease-in-out',
          },
        };
        return (
          <Box sx={{ display: 'flex' }}>
            <ScienceIcon sx={iconStyle} color="success" />
            <EditIcon
              sx={{
                width: '2rem',
                cursor: 'pointer',
                ':hover': {
                  color: 'orange',
                  transform: 'scale(1.2)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
              color="warning"
            />
            <DeleteIcon
              sx={{
                width: '2rem',
                cursor: 'pointer',
                ':hover': {
                  color: 'red',
                  transform: 'scale(1.2)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
              color="error"
              onClick={() => handleDeleteMaterial(index)}
            />
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    if (data.materials.length > 0) {
      const rows = data.materials.map((material) => ({
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

      const minimumCoarseAggrIsPresent = rows.some((row) => row.type === 'fineAggregate');
      const minimumFineAggrIsPresent = rows.some((row) => row.type === 'fineAggregate');
      const minimunFillerAggrIsPresent = rows.some((row) => row.type === 'filler');

      setMinimumAggrPresent({
        fineAggr: minimumFineAggrIsPresent,
        coarseAggr: minimumCoarseAggrIsPresent,
        filler: minimunFillerAggrIsPresent,
      });

      // addNewMaterial();
    }
  }, [data.materials]);

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

      {data.materials.length > 0 && (
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
        materials={data.materials}
        isEdit={false}
        createdMaterial={(material: AsphaltMaterial) => {
          const updatedMaterials = [...data.materials, material];
          setData({ step: 1, key: 'materials', value: updatedMaterials });

          // chama o addNewMaterial imediatamente após inserir
          setTimeout(() => {
            addNewMaterial(material); // <-- safe para evitar race conditions do React
          }, 0);
        }}
      />
    </Box>
  );
};

export default CreateMaterialDosageTable;
