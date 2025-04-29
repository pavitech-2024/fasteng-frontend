import { AddIcon, DeleteIcon, EditIcon } from '@/assets';
import CreateEditMaterialModal from '@/components/templates/modals/createEditAsphaltMaterial';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import { AllSievesSuperpaveUpdatedAstm } from '@/interfaces/common';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import materialsService from '@/services/asphalt/asphalt-materials.service';

interface ICreateMaterialDosageTable {
  onRowClick: (row: any) => void;
}

const CreateMaterialDosageTable = ({ onRowClick }: ICreateMaterialDosageTable) => {
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
    console.log('🚀 ~ handleDeleteMaterial ~ id:', id);
    try {
      const prevData = { ...data };
      console.log('🚀 ~ handleDeleteMaterial ~ prevData:', prevData);

      await materialsService.deleteMaterial(id);
      const updatedMaterials = prevData.materials.filter((material) => material._id !== id);
      const updatedGranulometrys = prevData.granulometrys.filter((gran) => gran.material._id !== id);
      
      if (prevData.viscosity.material._id === id) {
        setData({ step: 1, key: 'viscosity', value: null});
      }

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

    const prevMaterialsData = [...data.materials];

    if (material.type === 'asphaltBinder' || material.type === 'CAP') {
      // Verifica se já existe um material do mesmo tipo
      const existingIndex = prevMaterialsData.findIndex((m) => m.type === 'asphaltBinder' || m.type === 'CAP');

      if (existingIndex !== -1) {
        // Substitui o material existente
        prevMaterialsData[existingIndex] = newMaterial;
      } else {
        // Adiciona o novo material
        prevMaterialsData.push(newMaterial);
      }
    } else {
      // Apenas adiciona normalmente
      prevMaterialsData.push(newMaterial);
    }

    setData({ step: 1, key: 'materials', value: prevMaterialsData });

    if (material.type === 'coarseAggregate' || material.type === 'fineAggregate' || material.type === 'filler') {
      const newGranul = {
        material: material,
        material_mass: 0,
        table_data: newTableData,
        sieve_series: newSieveSeries,
        bottom: 0,
      };

      const prevGranulData = [...data.granulometrys];
      prevGranulData.push(newGranul);

      setData({ step: 1, key: 'granulometrys', value: prevGranulData });
    } else {
      const newBinder = {
        material: material,
        dataPoints: [
          {
            id: 0,
            temperature: 135,
            viscosity: null,
          },
          {
            id: 1,
            temperature: 150,
            viscosity: null,
          },
          {
            id: 2,
            temperature: 177,
            viscosity: null,
          },
        ],
      };

      setData({ step: 1, key: 'viscosity', value: newBinder });
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
    }
  }, [data.materials]);

  return (
    <Box>
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
          onRowClick={({ row }) => onRowClick(row)}
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
