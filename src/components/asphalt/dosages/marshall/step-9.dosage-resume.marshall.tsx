import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import GenerateMarshallDosagePDF from '@/components/generatePDF/dosages/asphalt/marshall/generatePDFMarshall';
import { EssayPageProps } from '@/components/templates/essay';
import Graph from '@/services/asphalt/dosages/marshall/graph/marshal-granulometry-graph';
import marshallDosageService from '@/services/asphalt/dosages/marshall/marshall.consult.service';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';
import { Box } from '@mui/material';
import { DataGrid, GridAlignment, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export type RowsObj = {
  id: number;
  [key: string]: number;
  optimumBinder: number;
};

const Marshall_Step9_ResumeDosage = ({
  nextDisabled,
  setNextDisabled,
  marshall,
}: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const {
    generalData,
    materialSelectionData,
    granulometryCompositionData,
    optimumBinderContentData,
    maximumMixtureDensityData,
    confirmationCompressionData: data,
    setData,
  } = useMarshallStore();

  const [dosage, setDosage] = useState(null);
  const store = JSON.parse(sessionStorage.getItem('asphalt-marshall-store'));
  const dosageId = store.state._id;

  const [optimumContentRows, setOptimumContentRows] = useState([]);
  const [optimumContentCols, setOptimumContentCols] = useState([]);
  const [optimumContentGroupings, setOptimumContentGroupings] = useState<GridColumnGroupingModel>([]);

  const [quantitativeRows, setQuantitativeRows] = useState([]);
  const [quantitativeCols, setQuantitativeCols] = useState([]);
  const [quantitativeGroupings, setQuantitativeGroupings] = useState<GridColumnGroupingModel>([]);

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          let newData = {};

          const foundDosage = await marshallDosageService.getMarshallDosage(dosageId);
          setDosage(foundDosage.data.dosage);

          const response = await marshall.confirmVolumetricParameters(
            maximumMixtureDensityData,
            optimumBinderContentData,
            data
          );

          newData = {
            ...data,
            ...response,
          };

          setData({ step: 8, value: newData });
        } catch (error) {
          throw error;
        }
      },
      {
        pending: t('loading.dosage.pending'),
        success: t('loading.dosage.success'),
        error: t('loading.dosage.error'),
      }
    );
  }, []);

  useEffect(() => {
    createOptimumContentRows();
    createOptimumContentColumns();
    createOptimumContentGroupings();

    getQuantitativeCols();
    getQuantitativeRows();
    getQuantitativeGroupings();
  }, []);

  const granulometricCompTableColumns: GridColDef[] = [
    {
      field: 'sieve_label',
      headerName: t('granulometry-asphalt.sieves'),
    },
    {
      field: 'projections',
      headerName: t('asphalt.dosages.marshall.projections'),
    },
    {
      field: 'lowerBand',
      headerName: t('asphalt.dosages.marshall.inferiorBand'),
    },
    {
      field: 'higherBand',
      headerName: t('asphalt.dosages.marshall.superiorBand'),
    },
  ];

  const granulometricCompTableRows = granulometryCompositionData.projections.map((row, i) => {
    let lowerBandValue = null;
    let higherBandValue = null;
    if (granulometryCompositionData.bands.lowerBand[i]) {
      lowerBandValue = granulometryCompositionData.bands.lowerBand[i].toFixed(2);
    }
    if (granulometryCompositionData.bands.higherBand[i]) {
      higherBandValue = granulometryCompositionData.bands.higherBand[i].toFixed(2);
    }
    return {
      id: i,
      sieve_label: row.label,
      projections: row.value,
      lowerBand: lowerBandValue,
      higherBand: higherBandValue,
    };
  });

  const granulometricCompTableGroupings: GridColumnGroupingModel = [
    {
      groupId: 'granulometry',
      headerAlign: 'center' as GridAlignment,
      headerName:
        t('asphalt.dosages.marshall.specification') +
        ` (${t('asphalt.dosages.marshall.band')} ${generalData.dnitBand})`,
      children: [{ field: 'lowerBand' }, { field: 'higherBand' }],
    },
  ];

  const sections = [
    'general-results',
    'asphalt-mass-quantitative',
    'volumetric-mechanic-params',
    'volumetric-params',
    'mineral-aggregate-voids',
  ];

  const createOptimumContentColumns = () => {
    const columns: GridColDef[] = [
      {
        field: 'optimumBinder',
        width: 250,
        headerName: t('asphalt.dosages.optimum-binder'),
        valueFormatter: ({ value }) => value?.toFixed(2),
      },
    ];

    materialSelectionData.aggregates.forEach((material) => {
      const column: GridColDef = {
        field: material._id,
        width: 250,
        headerName: material.name,
        valueFormatter: ({ value }) => value?.toFixed(2),
      };
      columns.push(column);
    });

    setOptimumContentCols(columns);
  };

  const createOptimumContentRows = () => {
    let rowsObj: RowsObj = {
      id: 0,
      optimumBinder: Number(optimumBinderContentData?.optimumBinder?.optimumContent?.toFixed(2)),
    };

    materialSelectionData.aggregates.forEach((material, idx) => {
      rowsObj = {
        ...rowsObj,
        [material._id]: Number(optimumBinderContentData?.optimumBinder?.confirmedPercentsOfDosage[idx]?.toFixed(2)),
      };
    });

    setOptimumContentRows([rowsObj]);
  };

  const createOptimumContentGroupings = () => {
    const groupings: GridColumnGroupingModel = [
      {
        groupId: 'optimumContent',
        headerName: t('asphalt.dosages.marshall.materials-final-proportions'),
        headerAlign: 'center',
        children: [{ field: 'optimumBinder' }],
      },
    ];

    materialSelectionData.aggregates.forEach((material) => {
      groupings[0].children.push({ field: material._id });
    });

    setOptimumContentGroupings(groupings);
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

    setQuantitativeCols(newCols);
  };

  const getQuantitativeRows = () => {
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

    setQuantitativeRows([rowsObj]);
  };

  const getQuantitativeGroupings = () => {
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

    setQuantitativeGroupings(quantitativeGroupArr);
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
      unity: `${data.confirmedVolumetricParameters.values.stability?.toFixed(2).toString()}` + ' Kgf',
      bearingLayer: '≥500',
      bondingLayer: '≥500',
    },
    {
      id: 1,
      param: t('asphalt.dosages.rbv'),
      unity: `${data.confirmedVolumetricParameters.values?.ratioBitumenVoid?.toFixed(2).toString()}` + ' (%)',
      bearingLayer: '75 - 82',
      bondingLayer: '65 - 72',
    },
    {
      id: 2,
      param: t('asphalt.dosages.mixture-voids'),
      unity: `${data.confirmedVolumetricParameters.values?.aggregateVolumeVoids?.toFixed(2).toString()}` + ' (%)',
      bearingLayer: '3 - 5',
      bondingLayer: '4 - 6',
    },
    {
      id: 3,
      param: `${t('asphalt.dosages.indirect-tensile-strength')}` + `(25 °C)`,
      unity: `${data.confirmedVolumetricParameters.values?.indirectTensileStrength?.toFixed(2).toString()}` + ' MPa',
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

  const volumetricMechanicParams = [
    {
      label: t('asphalt.dosages.optimum-binder'),
      value: optimumBinderContentData.optimumBinder.optimumContent?.toFixed(2).toString(),
      unity: '%',
    },
    {
      label: t('asphalt.dosages.dmt'),
      value: data?.confirmedSpecificGravity?.result?.toFixed(2).toString(),
      unity: 'g/cm³',
    },
    {
      label: t('asphalt.dosages.gmb'),
      value: data?.confirmedVolumetricParameters?.values?.apparentBulkSpecificGravity?.toFixed(2).toString(),
      unity: 'g/cm³',
    },
    {
      label: t('asphalt.dosages.vv'),
      value: (data?.confirmedVolumetricParameters?.values?.aggregateVolumeVoids * 100)?.toFixed(2),
      unity: '%',
    },
    {
      label: t('asphalt.dosages.vam'),
      value: data?.confirmedVolumetricParameters?.values?.voidsFilledAsphalt?.toFixed(2).toString(),
      unity: '%',
    },
    {
      label: t('asphalt.dosages.rbv') + ' (RBV)',
      value: (data?.confirmedVolumetricParameters?.values?.ratioBitumenVoid * 100)?.toFixed(2),
      unity: '%',
    },
    {
      label: t('asphalt.dosages.marshall.stability'),
      value: data?.confirmedVolumetricParameters?.values?.stability?.toFixed(2).toString(),
      unity: 'N',
    },
    {
      label: t('asphalt.dosages.marshall.fluency'),
      value: data?.confirmedVolumetricParameters?.values?.fluency?.toFixed(2).toString(),
      unity: 'mm',
    },
    {
      label: t('asphalt.dosages.indirect-tensile-strength'),
      value: data?.confirmedVolumetricParameters?.values?.indirectTensileStrength?.toFixed(2).toString(),
      unity: 'MPa',
    },
  ];

  nextDisabled && setNextDisabled(false);

  return (
    <>
      <FlexColumnBorder title={t('results')} open={true}>
        <GenerateMarshallDosagePDF dosage={dosage} />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: { mobile: '5px', notebook: '4rem' },
            marginY: '20px',
          }}
        >
          <Box id="general-results" sx={{ width: '100%', overflowX: 'auto' }}>
            <ResultSubTitle title={t('marshall.general-results')} sx={{ margin: '.65rem' }} />

            {optimumContentCols.length > 0 && optimumContentRows.length > 0 && optimumContentGroupings.length > 0 && (
              <DataGrid
                key={'optimumContent'}
                columns={optimumContentCols.map((col) => ({
                  ...col,
                  flex: 1,
                  headerAlign: 'center',
                  align: 'center',
                }))}
                rows={optimumContentRows}
                columnGroupingModel={optimumContentGroupings}
                experimentalFeatures={{ columnGrouping: true }}
                disableColumnMenu
                disableColumnSelector
                hideFooter
                sx={{
                  minWidth: '600px',
                }}
              />
            )}
          </Box>

          <Box id="asphalt-mass-quantitative" sx={{ width: '100%', overflowX: 'auto' }}>
            <ResultSubTitle
              title={t('asphalt.dosages.marshall.asphalt-mass-quantitative')}
              sx={{ marginX: '.65rem' }}
            />
            <DataGrid
              columns={quantitativeCols.map((col) => ({
                ...col,
                flex: 1,
                sortable: false,
                headerAlign: 'center',
                align: 'center',
              }))}
              rows={quantitativeRows}
              columnGroupingModel={quantitativeGroupings}
              experimentalFeatures={{ columnGrouping: true }}
              disableColumnMenu
              disableColumnSelector
              hideFooter
              sx={{
                minWidth: '600px',
              }}
            />
          </Box>

          <Box id="volumetric-mechanic-params">
            <ResultSubTitle
              title={t('asphalt.dosages.binder-volumetric-mechanic-params')}
              sx={{
                maxWidth: '103%',
                wordWrap: 'break-word',
                marginX: '.65rem',
              }}
            />

            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: { mobile: 'center', notebook: 'flex-start' },
                flexWrap: 'wrap',
                gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' },
                gap: '10px',
                mt: '20px',
              }}
            >
              {volumetricMechanicParams.map((item) => {
                if (item.value) {
                  return <Result_Card key={item.label} label={item.label} value={item.value} unity={item.unity} />;
                }
              })}
            </Box>
          </Box>

          <Box id="volumetric-params" sx={{ width: '100%', overflowX: 'auto' }}>
            <DataGrid
              rows={volumetricParamsRows}
              columns={volumetricParamsCols.map((col) => ({
                ...col,
                flex: 1,
                headerAlign: 'center',
                align: 'center',
                sortable: false,
              }))}
              disableColumnMenu
              disableColumnSelector
              hideFooter
              sx={{
                minWidth: '600px',
              }}
            />
          </Box>

          <Box id="mineral-aggregate-voids" sx={{ width: '100%', overflowX: 'auto' }}>
            <DataGrid
              rows={mineralAggregateVoidsRows}
              columns={mineralAggregateVoidsCols.map((column) => ({
                ...column,
                sortable: false,
                align: 'center',
                headerAlign: 'center',
                flex: 1,
              }))}
              columnGroupingModel={mineralAggregateVoidsGroup}
              experimentalFeatures={{ columnGrouping: true }}
              disableColumnMenu
              disableColumnSelector
              hideFooter
              sx={{
                minWidth: '100%',
              }}
            />
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title={t('asphalt.dosages.marshall.granulometric-composition')} open={true}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '4rem',
            marginY: '20px',
          }}
        >
          <Box
            id="granulometric-composition-table"
            sx={{ paddingX: { mobile: '0px', notebook: '6rem' }, width: '100%', overflowX: 'auto' }}
          >
            <DataGrid
              rows={granulometricCompTableRows}
              columns={granulometricCompTableColumns.map((col) => ({
                ...col,
                flex: 1,
                sortable: false,
                align: 'center',
                headerAlign: 'center',
              }))}
              columnGroupingModel={granulometricCompTableGroupings}
              experimentalFeatures={{ columnGrouping: true }}
              disableColumnMenu
              hideFooter
              sx={{
                minWidth: '500px',
              }}
            />
          </Box>

          <Box id="chart-div-granulometricCurve" sx={{ paddingX: { mobile: '0px', notebook: '6rem' } }}>
            {granulometryCompositionData?.graphData?.length > 1 && (
              <Graph data={granulometryCompositionData?.graphData} />
            )}
          </Box>
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default Marshall_Step9_ResumeDosage;
