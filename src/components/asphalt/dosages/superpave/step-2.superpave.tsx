import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import MaterialSelectionTable from './tables/step-2-table';
import { GridColDef } from '@mui/x-data-grid';

const Superpave_Step2 = ({
  nextDisabled,
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [materials, setMaterials] = useState<AsphaltMaterial[]>([]);
  const { materialSelectionData: data, generalData } = useSuperpaveStore();

  const { user } = useAuth();

  /**
   * Fetches materials for the current user and updates the local state.
   * Displays toast notifications for loading, success, and error states.
   */
  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const materials = await superpave.getMaterialsByUserId(user._id);
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

  /**
   * Filters materials to include only aggregates such as coarseAggregate, fineAggregate, filler, or other.
   * @returns {Array} Array of aggregate materials with their id, name, and type.
   */
  const aggregateRows = materials
    .map(({ _id, name, type }) => ({
      _id,
      name,
      type,
    }))
    .filter(({ type }) => 
      type === 'coarseAggregate' || type === 'fineAggregate' || type === 'filler' || type === 'other'
    );

  /**
   * Defines the columns for displaying aggregate materials.
   * The columns include name and type, with translated headers and formatted values.
   */
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

  /**
   * Filters materials to include only binder materials such as CAP or asphaltBinder.
   * @returns {Array} Array of binder materials with their id, name, and type.
   */
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

  /**
   * Defines the columns for displaying binder materials.
   * The columns include name and type, with translated headers and formatted values.
   */
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

  /**
   * Disables the next button if the binder and aggregates are not selected.
   */
  data.binder && data.aggregates.length > 0 && nextDisabled && setNextDisabled(false);

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
            superpave={superpave}
          />
          <MaterialSelectionTable
            rows={binderRows}
            columns={binderColumns}
            header={t('asphalt.materials.binders')}
            superpave={superpave}
          />
        </Box>
      )}
    </>
  );
};

export default Superpave_Step2;
