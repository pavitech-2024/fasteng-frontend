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

interface ICreateMaterialDosageTable {
  onMaterialCreation: (materials: AsphaltMaterial[]) => void;
}

const CreateMaterialDosageTable = ({ onMaterialCreation }: ICreateMaterialDosageTable) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [materials, setMaterials] = useState<AsphaltMaterial[]>([]);
  const { granulometryEssayData: data, setData } = useSuperpaveStore();

  const [minimumAggrPresent, setMinimumAggrPresent] = useState({
    fineAggr: false,
    coarseAggr: false,
    filler: false
  })

  const [rows, setRows] = useState([]);

  const handleEditMaterial = () => {};

  const handleDeleteMaterial = async (id: string) => {
    try {
      await materialsService.deleteMaterial(id);
      const updatedMaterials = materials.filter((material) => material._id !== id);
      const updatedGranulometrys = data.granulometrys.filter((gran) => gran.material._id !== id);
      setMaterials(updatedMaterials);
      setData({step: 1, key: 'materials', value: updatedMaterials })
      setData({ step: 1, key: 'granulometrys', value: updatedGranulometrys })
    } catch (error) {
      console.error('Failed to delete material:', error);
    }
  };

  // useEffect(() => {
  //   if (materials.length > 0) {
  //     const newDataTable = [];

  //     AllSievesSuperpaveUpdatedAstm.map((s) => {
  //       newDataTable.push({ sieve_label: s.label, sieve_value: s.value, passant: 100, retained: 0 });
  //     });

  //     setData({ step: 1, key: 'table_data', value: newDataTable });
  //   }
  // }, [materials]);

  // if (data.granulometrys?.length > 0) {
  //   const table_data = Array(data.granulometrys?.length).fill(null);
  //   data.granulometrys.map((s, index) => {
  //     table_data[index] = {
  //       material: materials[index],
  //       sieve_label: s[index]?.sieve_series.label,
  //       sieve_value: s[index]?.sieve_series.value,
  //       passant: 100,
  //       retained: 0,
  //     };
  //   });
  //   setData({ step: 1, key: 'table_data', value: table_data });
  // }

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

      const newTableData = [];
      const newSieveSeries = [];

      AllSievesSuperpaveUpdatedAstm.map((s) => {
        newTableData.push({ sieve_label: s.label, sieve_value: s.value, passant: 100, retained: 0 });
        newSieveSeries.push({ sieve_label: s.label, sieve_value: s.value })
      });

      const newGranul = {
        material: materials[materials.length - 1],
        material_mass: 0,
        table_data: newTableData,
        sieve_series: newSieveSeries,
        bottom: 0,
      };

      const prevMaterialsData = [...data.materials];
      prevMaterialsData.push(newMaterial);

      const prevGranulData = [...data.granulometrys];
      prevGranulData.push(newGranul);

      setData({ step: 1, key: 'materials', value: prevMaterialsData });
      setData({ step: 1, key: 'granulometrys', value: prevGranulData });
    }
  };

  useEffect(() => {
    if (materials.length > 0) {
      onMaterialCreation(materials);
    }
  }, [materials]);

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

      const minimumCoarseAggrIsPresent = rows.some((row) => row.type === 'fineAggregate'); // Verifica se há pelo menos dois agregados graudos
      const minimumFineAggrIsPresent = rows.some((row) => row.type === 'fineAggregate'); // Verifica se algum item possui o tipo "Aggregado Fine"
      const minimunFillerAggrIsPresent = rows.some((row) => row.type === 'filler')

      setMinimumAggrPresent({
        fineAggr: minimumFineAggrIsPresent,
        coarseAggr: minimumCoarseAggrIsPresent,
        filler: minimunFillerAggrIsPresent
      })

      addNewMaterial();
    }
  }, [materials]);

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
        materials={materials}
        isEdit={false}
        createdMaterial={(material: AsphaltMaterial) => setMaterials([...materials, material])}
      />
    </Box>
  );
};

export default CreateMaterialDosageTable;
