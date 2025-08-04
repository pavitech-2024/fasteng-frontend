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

const Superpave_Step8_ChosenCurvePercents = ({
  nextDisabled,
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    setData,
    generalData,
    granulometryCompositionData,
    firstCurvePercentagesData,
    granulometryEssayData,
    chosenCurvePercentagesData: data,
  } = useSuperpaveStore();

  const materials = granulometryEssayData.data?.materials?.filter((material) => material.type.includes('Aggregate') || material.type.includes('filler'));

  const [vv, setVv] = useState();
  const [extimatedBinderMaterialsPercentsRows, setExtimatedBinderMaterialsPercentsRows] = useState<any[]>([]);

  useEffect(() => {
    if (data.listOfPlis?.length > 0) {
      const curve = firstCurvePercentagesData.selectedCurve;
      if (curve === 'lower') {
        setVv(firstCurvePercentagesData.table2.table2Lower.porcentageVv);
      } else if (curve === 'average') {
        setVv(firstCurvePercentagesData.table2.table2Average.porcentageVv);
      } else if (curve === 'higher') {
        setVv(firstCurvePercentagesData.table2.table2Higher.porcentageVv);
      }
    }
  }, [data]);

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const { data, success } = await superpave.getChosenCurvePercentages(
            generalData,
            granulometryCompositionData,
            firstCurvePercentagesData
          );

          if (success) {
            setData({ step: 7, value: data });
          }
        } catch (error) {
          console.error(error);
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
      headerName: `${t('asphalt.dosages.superpave.estimated-percentages-binder-vv')} = ${vv} %`,
      children: [
        { field: 'binder' },
        ...materials.map((material, index) => ({
          field: `material_${material._id}_${index + 1}`,
        }))
      ],
      headerAlign: 'center',
    },
  ];

  const generateMaterialPercents = (e, i) => {
    const materialPercents = {};
    for (let j = 0; j < materials.length; j++) {
      materialPercents[`material_${materials[j]._id}_${j + 1}`] = e[i].toFixed(2);
    }
    return materialPercents;
  }

  useEffect(() => {
    if (data?.porcentageAggregate?.length > 1) {
      const rows = data?.porcentageAggregate?.map((e, i) => ({
        id: i,
        binder: data.listOfPlis[i]?.toFixed(2),
        ...generateMaterialPercents(e, i),
      }));
      setExtimatedBinderMaterialsPercentsRows(rows);
    }
  }, [data]);

  const generateMaterialsColumns = () => {
    const columns = [];
    for (let i = 0; i < materials.length; i++) {
      columns.push({
        field: `material_${materials[i]._id}_${i + 1}`,
        headerName: `${materials[i].name} (%)`,
        valueFormatter: ({ value }) => `${value}`,
        width: 180,
      });
    }
    return columns;
  };

  const extimatedBinderMaterialsPercentsCols = [
    {
      field: 'binder',
      headerName: t('asphalt.dosages.superpave.binder'),
      valueFormatter: ({ value }) => `${value}`,
      width: 180,
    },
    ...generateMaterialsColumns(),
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
          {data?.porcentageAggregate?.length > 1 && (
            <DataGrid
              hideFooter
              disableColumnMenu
              disableColumnFilter
              experimentalFeatures={{ columnGrouping: true }}
              columnGroupingModel={extimatedBinderMaterialsPercentsGroupings}
              columns={extimatedBinderMaterialsPercentsCols.map((column) => ({
                ...column,
                disableColumnMenu: true,
                sortable: false,
                align: 'center',
                headerAlign: 'center',
                minWidth: 100,
                flex: 1,
              }))}
              rows={extimatedBinderMaterialsPercentsRows}
            />
          )}
        </Box>
      )}
    </>
  );
};

export default Superpave_Step8_ChosenCurvePercents;
