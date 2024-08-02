import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Superpave_Step11 = ({
  nextDisabled,
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { confirmationCompressionData: data, setData } = useSuperpaveStore();

  const { user } = useAuth();

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const {
            data: resData,
            success,
            error,
          } = await superpave.calculateDosageEquation(data);

          if (success) {
            const newData = { ...data, ...resData };
            setData({
              step: 10,
              value: newData,
            });
          } else {
            console.error(`${error}`);
          }
        } catch (error) {
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

  nextDisabled && setNextDisabled(false);

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
        ></Box>
      )}
    </>
  );
};

export default Superpave_Step11;
