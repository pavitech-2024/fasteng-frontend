import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import { EssayPageProps } from '@/components/templates/essay';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type RowsObj = {
  id: number;
  [key: string]: number;
  optimumBinder: number;
};

const Marshall_Step9 = ({
  nextDisabled,
  setNextDisabled,
  marshall,
}: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const {
    materialSelectionData,
    optimumBinderContentData,
    maximumMixtureDensityData,
    confirmationCompressionData: data,
    setData,
  } = useMarshallStore();

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          let newData = {};
          const response = await marshall.confirmVolumetricParameters(
            maximumMixtureDensityData,
            optimumBinderContentData,
            data
          );

          newData = {
            ...data,
            ...response,
          };

          setData({ step: 7, value: newData });
        } catch (error) {
          throw error;
        }
      },
      {
        pending: t('loading.data.pending'),
        success: t('loading.data.success'),
        error: t('loading.data.error'),
      }
    );
  }, []);

  const getOptimunContentCols = () => {
    const newCols: GridColDef[] = [];

    const optimumBinderObj = {
      field: 'optimumBinder',
      width: 250,
      headerName: t('asphalt.dosages.optimum-binder'),
      valueFormatter: ({ value }) => `${value}`,
    };

    materialSelectionData.aggregates.forEach((material) => {
      const col: GridColDef = {
        field: `${material._id}`,
        width: 250,
        headerName: `${material.name}`,
        valueFormatter: ({ value }) => `${value}`,
      };
      newCols.push(col);
    });

    newCols.unshift(optimumBinderObj);

    return newCols;
  };

  const getOptimumContentRows = () => {
    let rowsObj: RowsObj = {
      id: 0,
      optimumBinder: Number(optimumBinderContentData?.optimumBinder?.optimumContent.toFixed(2)),
    };

    materialSelectionData.aggregates.forEach((material, idx) => {
      rowsObj = {
        ...rowsObj,
        [material._id]: Number(optimumBinderContentData?.optimumBinder?.confirmedPercentsOfDosage[idx].toFixed(2)),
      };
    });

    return [rowsObj];
  };

  const optimumContentGroup = () => {
    const optimumContentGroupArr: GridColumnGroupingModel = [
      {
        groupId: 'optimumContentGrouping',
        headerName: t('asphalt.dosages.marshall.materials-final-proportions'),
        headerAlign: 'center',
        children: [{ field: 'optimumBinder' }],
      },
    ];

    materialSelectionData.aggregates.forEach((material) => {
      optimumContentGroupArr[0].children.push({ field: `${material._id}` });
    });

    return optimumContentGroupArr;
  };

  const getQuantitativeCols = () => {
    const newCols: GridColDef[] = [];

    const binderObj = {
      field: 'binder',
      width: 250,
      headerName: t('asphalt.dosages.marshall.asphaltic-binder') + '(kg)',
      valueFormatter: ({ value }) => `${value}`,
    };

    materialSelectionData.aggregates.forEach((material) => {
      const col: GridColDef = {
        field: `${material._id}`,
        width: 250,
        headerName: `${material.name} (m³)`,
        valueFormatter: ({ value }) => `${value}`,
      };
      newCols.push(col);
    });

    newCols.unshift(binderObj);

    return newCols;
  };

  const quantitativeRows = () => {
    let rowsObj = {
      id: 0,
      binder: data?.confirmedVolumetricParameters?.quantitative[0].toFixed(2),
    };

    materialSelectionData.aggregates.forEach((material, idx) => {
      rowsObj = {
        ...rowsObj,
        [material._id]: data?.confirmedVolumetricParameters?.quantitative[idx].toFixed(2),
      };
    });

    return [rowsObj];
  };

  const quantitativeGroup = () => {
    const quantitativeGroupArr: GridColumnGroupingModel = [
      {
        groupId: 'quantitativeGrouping',
        headerName: t('asphalt.dosages.marshall.asphalt-mass-quantitative'),
        headerAlign: 'center',
        children: [{ field: 'binder' }],
      },
    ];

    materialSelectionData.aggregates.forEach((material) => {
      quantitativeGroupArr[0].children.push({ field: `${material._id}` });
    });

    return quantitativeGroupArr;
  };

  const volumetricParamsCols: GridColDef[] = [
    {
      field: 'param',
      headerName: t('asphalt.dosages.marshall.parameter'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'unity',
      headerName: t('asphalt.dosages.marshall.unity'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'bearingLayer',
      headerName: t('asphalt.dosages.marshall.bearing-layer'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'bondingLayer',
      headerName: t('asphalt.dosages.marshall.bonding-layer'),
      valueFormatter: ({ value }) => `${value}`,
    },
  ];

  const volumetricParamsRows = [
    {
      id: 0,
      param: t('asphalt.dosages.stability'),
      unity: 'Kgf',
      bearingLayer: '≥500',
      bondingLayer: '≥500',
    },
    {
      id: 1,
      param: t('asphalt.dosages.rbv'),
      unity: '%',
      bearingLayer: '75 - 82',
      bondingLayer: '65 - 72',
    },
    {
      id: 2,
      param: t('asphalt.dosages.mixture-voids'),
      unity: '%',
      bearingLayer: '3 - 5',
      bondingLayer: '4 - 6',
    },
    {
      id: 3,
      param: `${t('asphalt.dosages.indirect-tensile-strength')}` + `(25 °C)`,
      unity: 'MPa',
      bearingLayer: '≥ 0,65',
      bondingLayer: '≥ 0,65',
    },
  ];

  const mineralAggregateVoidsCols: GridColDef[] = [
    {
      field: 'tmn',
      headerName: 'TMN',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'vam',
      headerName: 'Vam (%)',
      valueFormatter: ({ value }) => `${value}`,
    },
  ];

  const mineralAggregateVoidsRows = [
    {
      id: 0,
      tmn: '9,5mm',
      vam: '≥ 18',
    },
    {
      id: 1,
      tmn: '12,5mm',
      vam: '≥ 16',
    },
    {
      id: 3,
      tmn: '19,1mm',
      vam: '≥ 15',
    },
  ];

  const mineralAggregateVoidsGroup: GridColumnGroupingModel = [
    {
      groupId: 'mineralAggregateVoids',
      headerName: t('asphalt.dosages.mineral-aggregate-voids'),
      headerAlign: 'center',
      children: [{ field: 'tmn' }, { field: 'vam' }],
    },
  ];

  nextDisabled && setNextDisabled(false);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '3rem',
        }}
      >
        <DataGrid
          key={'optimumContent'}
          columns={getOptimunContentCols()}
          rows={getOptimumContentRows()}
          columnGroupingModel={optimumContentGroup()}
          experimentalFeatures={{ columnGrouping: true }}
          density="comfortable"
          disableColumnMenu
          disableColumnSelector
          hideFooter
          sx={{ width: 'fit-content', marginX: 'auto' }}
        />

        <DataGrid
          key={'quantitative'}
          columns={getQuantitativeCols()}
          rows={quantitativeRows()}
          columnGroupingModel={quantitativeGroup()}
          experimentalFeatures={{ columnGrouping: true }}
          density="comfortable"
          disableColumnMenu
          disableColumnSelector
          hideFooter
          sx={{ width: 'fit-content', marginX: 'auto' }}
        />

        <FlexColumnBorder>
          <ResultSubTitle title={t('asphalt.dosages.binder-volumetric-mechanic-params')} sx={{ margin: '.65rem' }} />
        </FlexColumnBorder>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' },
            gap: '10px',
            mt: '20px',
          }}
        >
          {optimumBinderContentData.optimumBinder.optimumContent && (
            <Result_Card
              label={t('asphalt.dosages.optimum-binder')}
              value={optimumBinderContentData.optimumBinder.optimumContent.toFixed(2).toString()}
              unity={'%'}
            />
          )}

          {data?.confirmedSpecificGravity?.type === 'DMT' && (
            <Result_Card
              label={t('asphalt.dosages.dmt')}
              value={data?.confirmedSpecificGravity?.result.toFixed(2).toString()}
              unity={'g/cm³'}
            />
          )}

          {data?.confirmedVolumetricParameters?.values?.apparentBulkSpecificGravity && (
            <Result_Card
              label={t('asphalt.dosages.gmb')}
              value={data?.confirmedVolumetricParameters?.values?.apparentBulkSpecificGravity.toFixed(2).toString()}
              unity={'g/cm³'}
            />
          )}

          {data?.confirmedVolumetricParameters?.values?.aggregateVolumeVoids && (
            <Result_Card
              label={t('asphalt.dosages.vv')}
              value={(data?.confirmedVolumetricParameters?.values?.aggregateVolumeVoids * 100).toFixed(2)}
              unity={'%'}
            />
          )}

          {data?.confirmedVolumetricParameters?.values?.voidsFilledAsphalt && (
            <Result_Card
              label={t('asphalt.dosages.vam')}
              value={data?.confirmedVolumetricParameters?.values?.voidsFilledAsphalt.toFixed(2).toString()}
              unity={'%'}
            />
          )}

          {data?.confirmedVolumetricParameters?.values?.ratioBitumenVoid && (
            <Result_Card
              label={t('asphalt.dosages.rbv') + ' (RBV)'}
              value={(data?.confirmedVolumetricParameters?.values?.ratioBitumenVoid * 100).toFixed(2)}
              unity={'%'}
            />
          )}

          {data?.confirmedVolumetricParameters?.values?.stability && (
            <Result_Card
              label={t('asphalt.dosages.marshall-stability')}
              value={data?.confirmedVolumetricParameters?.values?.stability.toFixed(2).toString()}
              unity={'N'}
            />
          )}

          {data?.confirmedVolumetricParameters?.values?.fluency && (
            <Result_Card
              label={t('asphalt.dosages.fluency')}
              value={data?.confirmedVolumetricParameters?.values?.fluency.toFixed(2).toString()}
              unity={'mm'}
            />
          )}

          {data?.confirmedVolumetricParameters?.values?.indirectTensileStrength && (
            <Result_Card
              label={t('asphalt.dosages.indirect-tensile-strength')}
              value={data?.confirmedVolumetricParameters?.values?.indirectTensileStrength.toFixed(2).toString()}
              unity={'MPa'}
            />
          )}
        </Box>

        <DataGrid
          rows={volumetricParamsRows}
          columns={volumetricParamsCols.map((col) => ({
            ...col,
            flex: 1,
            headerAlign: 'center',
            align: 'center',
          }))}
          density="comfortable"
          disableColumnMenu
          disableColumnSelector
          hideFooter
        />

        <DataGrid
          rows={mineralAggregateVoidsRows}
          columns={mineralAggregateVoidsCols.map((col) => ({
            ...col,
            flex: 1,
            headerAlign: 'center',
            align: 'center',
          }))}
          columnGroupingModel={mineralAggregateVoidsGroup}
          experimentalFeatures={{ columnGrouping: true }}
          density="comfortable"
          disableColumnMenu
          disableColumnSelector
          hideFooter
        />
      </Box>
    </>
  );
};

export default Marshall_Step9;
