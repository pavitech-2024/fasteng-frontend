import { AddIcon, DeleteIcon, EditIcon } from '@/assets';
import CreateEditMaterialModal from '@/components/templates/modals/createEditAsphaltMaterial';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import { AllSievesSuperpaveUpdatedAstm } from '@/interfaces/common';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import { t } from 'i18next';
import DeleteMaterialModal from '@/components/templates/modals/deleteMaterialModal';

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
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [materialToEdit, setMaterialToEdit] = useState<AsphaltMaterial>();

  const handleDeleteMaterial = async (id: string) => {
    const prevData = { ...data };
    const updatedViscosity = null;
    const updatedGranulometrys = prevData.granulometrys.filter((gran) => gran.material._id !== id);
    const updatedMaterials = prevData?.materials.filter((material) => material._id !== id);
    try {
      const response = await materialsService.deleteMaterial(id);

      setData({ step: 1, key: 'materials', value: updatedMaterials });
      setData({ step: 1, key: 'granulometrys', value: updatedGranulometrys });
      if (prevData.viscosity?.material._id === id) {
        setData({ step: 1, key: 'viscosity', value: updatedViscosity });
      }
    } catch (error) {
      console.error('Failed to delete material:', error);
      if (prevData[0].materials.some((material) => material._id === id)) {
        setData({ step: 1, key: 'materials', value: updatedMaterials });
      }
      if (prevData.granulometrys.some((gran) => gran.material._id === id)) {
        setData({ step: 1, key: 'granulometrys', value: updatedGranulometrys });
      }
      if (prevData.viscosity?.material?._id === id) {
        setData({ step: 1, key: 'viscosity', value: updatedViscosity });
      }
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
            viscosity: 0,
          },
          {
            id: 1,
            temperature: 150,
            viscosity: 0,
          },
          {
            id: 2,
            temperature: 177,
            viscosity: 0,
          },
        ],
      };

      setData({ step: 1, key: 'viscosity', value: newBinder });
    }
  };

  const handleEditMaterial = async (materialId: string) => {
    try {
      const selectedMaterialToEdit = data.materials.find((material) => material._id === materialId);
      setMaterialToEdit(selectedMaterialToEdit);
      setIsEdit(true);
      setModalIsOpen (true);
    } catch (error) {
      console.error('Failed to get the selected material to edit:', error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: t('asphalt.materials.name') },
    { field: 'type', headerName: t('asphalt.materials.type') },
    { field: 'source', headerName: t('asphalt.materials.source') },
    { field: 'responsible', headerName: t('asphalt.materials.responsible') },
    { field: 'aggregateNature', headerName: t('asphalt.materials.aggregateNature') },
    { field: 'boughtDate', headerName: t('asphalt.materials.collectionDate') },
    {
      field: 'actions',
      headerName: 'Ações',
      renderCell: ({ row }) => {
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
              onClick={() => handleEditMaterial(row.id)}
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
              onClick={() => {
                setSelectedRow(row);
                setDeleteModalIsOpen(true);
              }}
            />
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    if (data.materials?.length > 0) {
      const rows = data.materials.map((material) => ({
        id: material._id,
        name: material.name,
        type: t('asphalt.materials.' + material.type),
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
      <DeleteMaterialModal
        isOpen={deleteModalIsOpen}
        setIsOpen={setDeleteModalIsOpen}
        rowToDelete={selectedRow}
        tableData={rows}
        deleteMaterial={async () => {
          await handleDeleteMaterial(selectedRow.id);
        }}
        searchBy={'name'}
      />
      <Button
        onClick={() => setModalIsOpen(true)}
        variant="contained"
        sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginY: '1rem' }}
      >
        <AddIcon /> Novo Material
      </Button>

      {data.materials?.length > 0 && (
        <DataGrid
          columns={columns.map((column) => ({ ...column, flex: 1, headerAlign: 'center', align: 'center' }))}
          rows={rows}
          hideFooter
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          onCellClick={(params) => {
            if (params.field !== 'actions') {
              onRowClick(params.row);
            }
          }}
        />
      )}

      <CreateEditMaterialModal
        openModal={modalIsOpen}
        updateMaterials={async () => {
          setModalIsOpen(false);
        }}
        updatedMaterial={(material: AsphaltMaterial) => {
          const prevData = [...data.materials];
          const index = prevData.findIndex((m) => m._id === material._id);
          prevData[index] = material;
          setData({ step: 1, key: 'materials', value: prevData });
        }}
        handleCloseModal={() => {
          console.log("handleCloseModal");
          setModalIsOpen(false);
          setIsEdit(false);
        }}
        materials={data.materials}
        isEdit={isEdit}
        materialToEdit={materialToEdit ? materialToEdit : undefined}
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
