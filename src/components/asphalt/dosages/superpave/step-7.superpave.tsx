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

const Superpave_Step7 = ({
  nextDisabled,
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { 
    setData, 
    generalData, 
    materialSelectionData, 
    granulometryCompositionData, 
    firstCurvePercentageData, 
    firstCompressionData,
    chosenCurvePercentagesData: data
  } = useSuperpaveStore();

  const [vv, setVv] = useState();

  useEffect(() => {
    if (data.listOfPlis.length > 0) {
      const curve = firstCurvePercentageData.selectedCurve;
      if (curve === 'lower') {
        setVv(firstCurvePercentageData.table2.table2Lower.porcentageVv)
      } else if (curve === 'average') {
        setVv(firstCurvePercentageData.table2.table2Average.porcentageVv)
      } else if (curve === 'higher') {
        setVv(firstCurvePercentageData.table2.table2Higher.porcentageVv)
      }
    }
  },[data])

  const { user } = useAuth();

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const {
            data: resData,
            success,
            error,
          } = await superpave.getChosenCurvePercentages(
            generalData,
            granulometryCompositionData,
            firstCurvePercentageData
          );

          if (success) {
            setData({
              step: 6,
              value: resData,
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

  const extimatedBinderMaterialsPercentsGroupings: GridColumnGroupingModel = [
    {
      groupId: 'extimatedBinderMaterialsPercents',
      headerName: `Porcentagem dos materiais a partir do teor de ligante estimado para Vv = ${vv} %`,
      children: [
        { field: 'binder' },
        { field: 'material_1' },
        { field: 'material_2' },
        { field: 'material_3' },
        { field: 'material_4' },
      ],
      headerAlign: 'center',
    },
  ];

  const extimatedBinderMaterialsPercentsRows = data.porcentageAggregate.map((e, i) => ({
      id: i,
      binder: data.listOfPlis[i].toFixed(2),
      material_1: data.porcentageAggregate[0][i].toFixed(2),
      material_2: data.porcentageAggregate[1][i].toFixed(2),
      material_3: data.porcentageAggregate[2][i].toFixed(2),
      material_4: data.porcentageAggregate[3][i].toFixed(2),
  }))

  const extimatedBinderMaterialsPercentsCols = [
    {
      field: 'binder',
      headerName: 'Teor de ligante (%)',
      valueFormatter: ({ value }) => `${value}`,
      width: 160,
    },
    {
      field: 'material_1',
      headerName: `${materialSelectionData.aggregates[0].name} (%)`,
      valueFormatter: ({ value }) => `${value}`,
      width: 160,
    },
    {
      field: 'material_2',
      headerName: `${materialSelectionData.aggregates[1].name} (%)`,
      valueFormatter: ({ value }) => `${value}`,
      width: 160,
    },
    {
      field: 'material_3',
      headerName: `${materialSelectionData.aggregates[2].name} (%)`,
      valueFormatter: ({ value }) => `${value}`,
      width: 160,
    },
    {
      field: 'material_4',
      headerName: `${materialSelectionData.aggregates[3].name} (%)`,
      valueFormatter: ({ value }) => `${value}`,
      width: 160,
    },
  ];

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
            columnGroupingModel={extimatedBinderMaterialsPercentsGroupings}
            columns={extimatedBinderMaterialsPercentsCols}
            rows={extimatedBinderMaterialsPercentsRows}
          />
        </Box>
      )}
    </>
  );
};

export default Superpave_Step7;
