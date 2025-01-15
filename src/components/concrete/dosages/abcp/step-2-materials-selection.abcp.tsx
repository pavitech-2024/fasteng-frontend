import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import { ConcreteMaterial } from '@/interfaces/concrete';
import ABCP_SERVICE from '@/services/concrete/dosages/abcp/abcp.service';
import useABCPStore from '@/stores/concrete/abcp/abcp.store';
import { Box } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { GridColDef } from '@mui/x-data-grid';
import Step2Table from './tables/material-selection-table';

const ABCP_MaterialsSelection = ({ 
  nextDisabled,
  setNextDisabled, 
  abcp 
}: EssayPageProps & { abcp: ABCP_SERVICE }) => {
  const { materialSelectionData } = useABCPStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [materials, setMaterials] = useState<ConcreteMaterial[]>([]);
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

  const aggregateRows = materials
    .map(({ _id, name, type }) => ({
      _id,
      name,
      type,
    }))
    .filter(({ type }) => {
      return type === 'fineAggregate' || type === 'coarseAggregate';
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
      valueFormatter: ({ value }) => t(`concrete.materials.${value}`),
    },
  ];

  const cementRows = materials
    .map(({ _id, name, type, description }) => {
      const { resistance } = description;
      return {
        _id,
        name,
        type,
        resistance
      };
    })
    .filter (({ type }) => {
      return type === 'cement';
    });

  const cementColumns: GridColDef[] = [
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

  materialSelectionData.cement && materialSelectionData.aggregates.length > 0 && nextDisabled && setNextDisabled(false);

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
          <Step2Table
            rows={aggregateRows}
            columns={aggregateColumns}
            abcp={new ABCP_SERVICE()}
          />

          <Step2Table
            rows={cementRows}
            columns={cementColumns}
            abcp={new ABCP_SERVICE()}
          />
        </Box>
      )}
    </>
  );
};

export default ABCP_MaterialsSelection;
