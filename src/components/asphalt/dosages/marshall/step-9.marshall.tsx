import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import { useState } from 'react';

const Marshall_Step9 = ({
  nextDisabled,
  setNextDisabled,
  marshall,
}: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { materialSelectionData, optimumBinderContentData, confirmationCompressionData: data } = useMarshallStore();

  const { user } = useAuth();

  const material_1 = materialSelectionData?.aggregates[0].name;
  const material_2 = materialSelectionData?.aggregates[1].name;

  const optimumContentCols: GridColDef[] = [
    {
      field: 'optimumBinder',
      headerName: 'Teor ótimo de ligante asfáltico',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'material_1',
      headerName: `${material_1}`,
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'material_2',
      headerName: `${material_2}`,
      valueFormatter: ({ value }) => `${value}`,
    },
  ];

  const optimumContentRows = [
    {
      id: 0,
      optimumBinder: optimumBinderContentData?.optimumBinder?.optimumContent.toFixed(2),
      material_1: optimumBinderContentData?.optimumBinder?.confirmedPercentsOfDosage[0].toFixed(2),
      material_2: optimumBinderContentData?.optimumBinder?.confirmedPercentsOfDosage[1].toFixed(2),
    },
  ];

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
      headerName: 'Teor ótimo de ligante asfáltico',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'material_1',
      headerName: `${material_1} (m³)`,
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'material_2',
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
      field: 'volumetricParams',
      headerName: 'Parametros volumétricos e mecanicos da mistura no teor ótimo de ligante asfáltico',
      valueFormatter: ({ value }) => `${value}`,
    },
  ];

  const volumetricParamsRows = [
    {
      id: 0,
      binder: data?.confirmedVolumetricParameters?.quantitative[0].toFixed(2),
      material_1: data?.confirmedVolumetricParameters?.quantitative[1].toFixed(2),
      material_2: data?.confirmedVolumetricParameters?.quantitative[2].toFixed(2),
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
            key={'optimumContent'}
            columns={optimumContentCols}
            rows={optimumContentRows}
            columnGroupingModel={optimumContentGroup}
            experimentalFeatures={{ columnGrouping: true }}
            density="comfortable"
            disableColumnMenu
            disableColumnSelector
            hideFooter
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
          </Box>
        </Box>
      )}
    </>
  );
};

export default Marshall_Step9;
