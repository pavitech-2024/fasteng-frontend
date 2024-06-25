import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box } from '@mui/material';
import { DataGrid, GridColumnGroupingModel } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Superpave_Step6 = ({
  nextDisabled,
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {

  const [loading, setLoading] = useState<boolean>(false);
  const { 
    granulometryCompositionData,
    initialBinderData,
    generalData,
    firstCurvePercentageData: data,
    firstCompressionData,
    setData
  } = useSuperpaveStore();

  const { user } = useAuth();

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const { data: resData, success, error } = await superpave.getStepFirstCurvePercentages(
            generalData,
            granulometryCompositionData,
            initialBinderData,
            firstCompressionData
          );

          console.log("🚀 ~ resData:", resData)
          console.log("🚀 ~ error:", error)


          // if (success) {
          //   let prevData = { ...data };
          //   prevData = {
          //     ...prevData,
          //     materials: newMaterials,
          //   };

          //   setData({
          //     step: 3,
          //     value: prevData,
          //   });
          // } else {
          //   console.error(`${error}`);
          // }
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

  const paramsCols = [
    {
      field: 'gmmInitialN',
      headerName: '%Gmm Ninicial (%)',
      valueFormatter: ({ value }) => `${value}`,
      width: 200,
    },
    {
      field: 'gmmNProj',
      headerName: '%Gmm Nproj (%)',
      valueFormatter: ({ value }) => `${value}`,
      width: 200,
    },
    {
      field: 'gmmNMax',
      headerName: '%Gmm Nmax (%)',
      valueFormatter: ({ value }) => `${value}`,
      width: 200,
    },
    {
      field: 'vam',
      headerName: 'VAM (%)',
      valueFormatter: ({ value }) => `${value}`,
      width: 200,
    },
    {
      field: 'p/a',
      headerName: 'P/A (%)',
      valueFormatter: ({ value }) => `${value}`,
      width: 200,
    },
  ];

  const paramsGroupings: GridColumnGroupingModel = [
    {
      groupId: 'params',
      headerName: `Parâmterospara o nível de tráfego ${generalData.trafficVolume} e tamanho nominal máximo ${0}`,
      children: [{ field: 'gmmInitialN' }, { field: 'gmmNProj' }, { field: 'gmmNMax' }, { field: 'vam' }, { field: 'p/a' }],
      headerAlign: 'center',
    },
  ];

  
  // const paramsRows = [
  //   {
  //     id: 0,
  //     initialN: data.turnNumber.initialN ? data.turnNumber.initialN : '',
  //     maxN: data.turnNumber.maxN,
  //     projectN: data.turnNumber.projectN,
  //     tex: data.turnNumber.tex !== '' ? data.turnNumber.tex : generalData.trafficVolume,
  //   },
  // ];

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
          <DataGrid
            hideFooter
            disableColumnMenu
            disableColumnFilter
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={paramsGroupings}
            columns={paramsCols}
            rows={[]}
          />
        </Box>
      )}
    </>
  );
};

export default Superpave_Step6;
