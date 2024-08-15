import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Superpave_Step11 = ({
  nextDisabled,
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    confirmationCompressionData,
    granulometryCompositionData,
    initialBinderData,
    firstCurvePercentagesData,
    secondCompressionPercentagesData,
    dosageResume: data,
    setData,
  } = useSuperpaveStore();

  const { user } = useAuth();

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const response = await superpave.calculateDosageEquation(
            granulometryCompositionData,
            initialBinderData,
            firstCurvePercentagesData,
            secondCompressionPercentagesData,
            confirmationCompressionData
          );
          console.log("🚀 ~ response:", response)

          const newData = { ...data, ...response };
          console.log("🚀 ~ newData:", newData)
          setData({
            step: 10,
            value: newData,
          });
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

  // const finalProportionsCols: GridColDef[] = [
  //   {
  //     field: 'optimumBinder',
  //     headerName: "Teor ótimo de ligante asfáltico",
  //     valueFormatter: ({ value }) => `${value}`,
  //   },
  //   {
  //     field: 'optimumBinder',
  //     headerName: "Teor ótimo de ligante asfáltico",
  //     valueFormatter: ({ value }) => `${value}`,
  //   },
  // ]

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
        >
          <Typography>Proporção final dos materiais</Typography>

          {/* <DataGrid
            hideFooter
            disableColumnMenu
            disableColumnFilter
            experimentalFeatures={{ columnGrouping: true }}
            columns={finalProportionsCols}
            rows={finalProportionsRows}
          /> */}
        </Box>
      )}
    </>
  );
};

export default Superpave_Step11;
