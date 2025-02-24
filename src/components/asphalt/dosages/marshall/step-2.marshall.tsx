import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';
import { Box } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import MaterialSelectionTable from './tables/step-2-table';
import { GridColDef } from '@mui/x-data-grid';

const Marshall_Step2 = ({
  nextDisabled,
  setNextDisabled,
  marshall,
}: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [materials, setMaterials] = useState<AsphaltMaterial[]>([]);
  const { materialSelectionData } = useMarshallStore();

  const { user } = useAuth();

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const materials = await marshall.getMaterialsByUserId(user._id);
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

  const aggregateRows = materials
    .map(({ _id, name, type }) => ({
      _id,
      name,
      type,
    }))
    .filter(({ type }) => {
      return type === 'coarseAggregate' || type === 'fineAggregate' || type === 'filler' || type === 'other';
    });

  const aggregateColumns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('name'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'type',
      headerName: t('type'),
      valueFormatter: ({ value }) => t(`asphalt.materials.${value}`),
    },
  ];

  const binderRows = materials
    .map(({ _id, name, type }) => {
      return {
        _id,
        name,
        type,
      };
    })
    .filter(({ type }) => {
      return type === 'CAP' || type === 'asphaltBinder';
    });

  const binderColumns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('asphalt.materials.name'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'type',
      headerName: t('asphalt.materials.type'),
      valueFormatter: ({ value }) => t(`asphalt.materials.${value}`),
    },
  ];

  materialSelectionData.binder && materialSelectionData.aggregates.length > 0 && nextDisabled && setNextDisabled(false);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <MaterialSelectionTable
            rows={aggregateRows}
            columns={aggregateColumns}
            header={t('asphalt.materials.aggregates')}
            marshall={marshall}
          />
          <MaterialSelectionTable
            rows={binderRows}
            columns={binderColumns}
            header={t('asphalt.materials.binders')}
            marshall={marshall}
          />
        </Box>
      )}
    </>
  );
};

export default Marshall_Step2;
