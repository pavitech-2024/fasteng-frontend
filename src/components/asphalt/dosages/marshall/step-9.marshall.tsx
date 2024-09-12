import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import { EssayPageProps } from '@/components/templates/essay';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';

const Marshall_Step9 = ({ nextDisabled, setNextDisabled }: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const { materialSelectionData, optimumBinderContentData, confirmationCompressionData: data } = useMarshallStore();

  const material_1 = materialSelectionData?.aggregates[0].name;
  const material_2 = materialSelectionData?.aggregates[1].name;

  // const optimumContentCols: GridColDef[] = [
  //   {
  //     field: 'optimumBinder',
  //     width: 250,
  //     headerName: 'Teor ótimo de ligante asfáltico',
  //     valueFormatter: ({ value }) => `${value}`,
  //   },
  //   {
  //     field: 'material_1',
  //     width: 250,
  //     headerName: `${material_1}`,
  //     valueFormatter: ({ value }) => `${value}`,
  //   },
  //   {
  //     field: 'material_2',
  //     width: 250,
  //     headerName: `${material_2}`,
  //     valueFormatter: ({ value }) => `${value}`,
  //   },
  // ];

  const getOptimunContentCols = () => {
    const newCols: GridColDef[] = [];
    materialSelectionData.aggregates.forEach((material) => {
      const col: GridColDef = {
        field: `${material._id}`,
        width: 250,
        headerName: `${material.name}`,
        valueFormatter: ({ value }) => `${value}`
      }
      newCols.push(col)
    })
    newCols.push({
      field: `${materialSelectionData.binder}`,
      width: 250,
      headerName: `${materialSelectionData.binder}`,
      valueFormatter: ({ value }) => `${value}`
    })

    return newCols
  } 

  const optimumContentCols: GridColDef[] = getOptimunContentCols(); 
  const optimumContentRows = [];
  



  // const optimumContentRows = [
  //   {
  //     id: 0,
  //     optimumBinder: optimumBinderContentData?.optimumBinder?.optimumContent.toFixed(2),
  //     material_1: optimumBinderContentData?.optimumBinder?.confirmedPercentsOfDosage[0].toFixed(2),
  //     material_2: optimumBinderContentData?.optimumBinder?.confirmedPercentsOfDosage[1].toFixed(2),
  //   },
  // ];

  const optimumContentGroup: GridColumnGroupingModel = [
    {
      groupId: 'optimumContent',
      headerName: 'Proporção final dos materiais',
      children: [{ field: 'optimumContent' }, { field: 'material_1' }, { field: 'material_2' }],
    },
  ];

  const quantitativeCols: GridColDef[] = [
    {
      field: 'binder',
      width: 250,
      headerName: 'Teor ótimo de ligante asfáltico',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'material_1',
      width: 250,
      headerName: `${material_1} (m³)`,
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'material_2',
      width: 250,
      headerName: `${material_2} (m³)`,
      valueFormatter: ({ value }) => `${value}`,
    },
  ];



  const quantitativeRows = [
    {
      id: 0,
      binder: data?.confirmedVolumetricParameters?.quantitative[0].toFixed(2),
      material_1: data?.confirmedVolumetricParameters?.quantitative[1].toFixed(2),
      material_2: data?.confirmedVolumetricParameters?.quantitative[2].toFixed(2),
    },
  ];

  const quantitativeGroup: GridColumnGroupingModel = [
    {
      groupId: 'quantitative',
      headerName: 'Quantitativo para 1 metro cúbico de massa asfáltica',
      children: [{ field: 'optimumContent' }, { field: 'material_1' }, { field: 'material_2' }],
    },
  ];

  const volumetricParamsCols: GridColDef[] = [
    {
      field: 'param',
      headerName: 'Parametro',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'unity',
      headerName: 'Unidade',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'bearingLayer',
      headerName: 'Camada de rolamento',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'bondingLayer',
      headerName: 'Camada de ligação',
      valueFormatter: ({ value }) => `${value}`,
    },
  ];

  const volumetricParamsRows = [
    {
      id: 0,
      param: 'Estabilidade',
      unity: 'Kgf',
      bearingLayer: '≥500',
      bondingLayer: '≥500',
    },
    {
      id: 1,
      param: 'Relação betume  / vazios',
      unity: '%',
      bearingLayer: '75 - 82',
      bondingLayer: '65 - 72',
    },
    {
      id: 2,
      param: 'Vazios na mistura',
      unity: '%',
      bearingLayer: '3 - 5',
      bondingLayer: '4 - 6',
    },
    {
      id: 3,
      param: 'Resistência à tração por compressão diametral (25 °C)',
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

  const mineralAggregateVoidsGroup = [
    {
      groupId: 'mineralAggregateVoids',
      headerName: 'Vazios do agregado mineral (%)',
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
          gap: '10px',
        }}
      >
        <DataGrid
          key={'optimumContent'}
          columns={optimumContentCols}
          rows={optimumContentRows}
          columnGroupingModel={optimumContentGroup}
          experimentalFeatures={{ columnGrouping: true }}
          density="comfortable"
          disableColumnMenu
          disableColumnSelector
          hideFooter
          sx={{ width: 'fit-content', marginX: 'auto' }}
        />

        <DataGrid
          key={'quantitative'}
          columns={quantitativeCols}
          rows={quantitativeRows}
          columnGroupingModel={quantitativeGroup}
          experimentalFeatures={{ columnGrouping: true }}
          density="comfortable"
          disableColumnMenu
          disableColumnSelector
          hideFooter
          sx={{ width: 'fit-content', marginX: 'auto' }}
        />

        <FlexColumnBorder>
          <ResultSubTitle
            title={'Parametros volumétricos e mecanicos da mistura no teor ótimo de ligante asfáltico'}
            sx={{ margin: '.65rem' }}
          />
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
              label={'Teor ótimo de ligante asfáltico'}
              value={optimumBinderContentData.optimumBinder.optimumContent.toFixed(2).toString()}
              unity={'%'}
            />
          )}

          {data?.confirmedSpecificGravity?.type === 'DMT' && (
            <Result_Card
              label={'Densidade máximo teórica (DMT)'}
              value={data?.confirmedSpecificGravity?.result.toFixed(2).toString()}
              unity={'g/cm³'}
            />
          )}

          {data?.confirmedVolumetricParameters?.values?.apparentBulkSpecificGravity && (
            <Result_Card
              label={'Massa específica aparente (Gmb)'}
              value={data?.confirmedVolumetricParameters?.values?.apparentBulkSpecificGravity.toFixed(2).toString()}
              unity={'g/cm³'}
            />
          )}

          {data?.confirmedVolumetricParameters?.values?.aggregateVolumeVoids && (
            <Result_Card
              label={'Volume de vazios (Vv)'}
              value={(data?.confirmedVolumetricParameters?.values?.aggregateVolumeVoids * 100).toFixed(2)}
              unity={'%'}
            />
          )}

          {data?.confirmedVolumetricParameters?.values?.voidsFilledAsphalt && (
            <Result_Card
              label={'Vazios do agregado mineral (VAM)'}
              value={data?.confirmedVolumetricParameters?.values?.voidsFilledAsphalt.toFixed(2).toString()}
              unity={'%'}
            />
          )}

          {data?.confirmedVolumetricParameters?.values?.ratioBitumenVoid && (
            <Result_Card
              label={'Relação betume-vazios (RBV)'}
              value={(data?.confirmedVolumetricParameters?.values?.ratioBitumenVoid * 100).toFixed(2)}
              unity={'%'}
            />
          )}

          {data?.confirmedVolumetricParameters?.values?.stability && (
            <Result_Card
              label={'Estabilidade Marshall'}
              value={data?.confirmedVolumetricParameters?.values?.stability.toFixed(2).toString()}
              unity={'N'}
            />
          )}

          {data?.confirmedVolumetricParameters?.values?.fluency && (
            <Result_Card
              label={'Fluencia'}
              value={data?.confirmedVolumetricParameters?.values?.fluency.toFixed(2).toString()}
              unity={'mm'}
            />
          )}

          {data?.confirmedVolumetricParameters?.values?.indirectTensileStrength && (
            <Result_Card
              label={'Resistência à tração por compressão diametral'}
              value={data?.confirmedVolumetricParameters?.values?.indirectTensileStrength.toFixed(2).toString()}
              unity={'MPa'}
            />
          )}
        </Box>

        <DataGrid
          rows={volumetricParamsRows}
          columns={volumetricParamsCols}
          density="comfortable"
          disableColumnMenu
          disableColumnSelector
          hideFooter
        />

        <DataGrid
          rows={mineralAggregateVoidsRows}
          columns={mineralAggregateVoidsCols}
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
