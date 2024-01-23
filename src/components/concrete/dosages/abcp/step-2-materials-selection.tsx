import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import { ConcreteMaterial } from '@/interfaces/concrete';
import ABCP_SERVICE from '@/services/concrete/dosages/abcp/abcp.service';
import useABCPStore, { ABCPData } from '@/stores/concrete/abcp/abcp.store';
import { Box, TextField } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import MaterialSelectionTable from './tables/material-selection-table';
import { GridColDef } from '@mui/x-data-grid';

const ABCP_MaterialsSelection = ({ nextDisabled, setNextDisabled, abcp }: EssayPageProps & { abcp: ABCP_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [materials, setMaterials] = useState<ConcreteMaterial[]>([]);
  const { materialSelectionData } = useABCPStore();
  const [searchValue, setSearchValue] = useState<string>('');

  const { user } = useAuth();

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const materials = await abcp.getMaterialsByUserId(user._id);
          setMaterials(materials);
          setLoading(false);
        } catch (error) {
          setMaterials([]);
          setLoading(false);
          throw error;
        }
      },
      {
        pending: t('loading.materials.pending'),
        success: t('loading.materials.success'),
        error: t('loading.materials.error'),
      }
    );
  }, []);

  // const aggregateRows = materials.map(({ _id, name, type }) => ({
  //   _id,
  //   name,
  //   type,
  //   inputComponent: <TextField label="Seu Rótulo" variant="outlined" />,
  // }))
  // .filter(({ type }) => {
  //   return type === 'coarseAggregate' || type === 'fineAggregate';
  // });

  const handleInputSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
  }

  const filteredMaterials = materials
    .filter(({ name, type }) => name.includes(searchValue) || type.includes(searchValue))

  const aggregateRows = [
    {
      inputComponent: <TextField label="Pesquisar" variant="standard" onChange={handleInputSearch}/>,
    },
    ...filteredMaterials.map(({ _id, name, type }) => ({
      _id,
      name,
      type,
    })).filter(({ type }) => type === 'coarseAggregate' || type === 'fineAggregate'),
  ];

  const aggregateColumns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('name'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'type',
      headerName: t('type'),
      valueFormatter: ({ value }) => t(`concrete.materials.${value}`),
    },
  ];

  const binderRows = materials
    .map(({ _id, name, type, description }) => {
      const { resistance } = description;
      return {
        _id,
        name,
        type,
        resistance,
      };
    })
    .filter(({ type }) => {
      return type === 'cement';
    });

  const binderColumns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('name'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'type',
      headerName: t('type'),
      valueFormatter: ({ value }) => t(`concrete.materials.${value}`),
    },
    {
      field: 'resistance',
      headerName: t('resistance'),
      valueFormatter: ({ value }) => `${value}`,
    },
  ];

  useEffect(() => {
    if (!Object.values(materialSelectionData).some((data) => data === null)) {
      setNextDisabled(false);
    }
  }, [materialSelectionData]);

  function hasNullValue(obj: any): boolean {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] === null || obj[key] === undefined) {
          return true;
        }
        if (typeof obj[key] === 'object' && hasNullValue(obj[key])) {
          return true;
        }
      }
    }
    return false;
  }

  const hasNull = hasNullValue(materialSelectionData);
  setNextDisabled(hasNull);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: '10px',
          }}
        >
          <MaterialSelectionTable
            rows={aggregateRows}
            columns={aggregateColumns}
            header={t('concrete.materials.aggregates')}
          />
          <MaterialSelectionTable rows={binderRows} columns={binderColumns} header={t('concrete.materials.binders')} />
        </Box>
      )}
    </>
  );
};

export default ABCP_MaterialsSelection;
