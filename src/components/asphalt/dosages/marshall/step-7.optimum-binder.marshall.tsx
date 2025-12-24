import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import MiniGraphics from './graphs/miniGraph';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import GraficoPage7N from './graphs/page-7-graph';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const Marshall_Step7_OptimumBinder = ({
  nextDisabled,
  setNextDisabled,
  marshall,
}: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    generalData,
    optimumBinderContentData: data,
    binderTrialData,
    volumetricParametersData,
    maximumMixtureDensityData,
    materialSelectionData,
    granulometryCompositionData,
    setData,
  } = useMarshallStore();

    console.log('🔍 STEP 7 - materialSelectionData:', materialSelectionData);
  console.log('🔍 STEP 7 - binder value:', materialSelectionData?.binder);
  console.log('🔍 STEP 7 - binder type:', typeof materialSelectionData?.binder);
  console.log('🔍 STEP 7 - binder is null?', materialSelectionData?.binder === null);
  console.log('🔍 STEP 7 - binder is undefined?', materialSelectionData?.binder === undefined);
  console.log('🔍 STEP 7 - binder string:', String(materialSelectionData?.binder));
  
  console.log('🔍 STEP 7 - maximumMixtureDensityData.method:', maximumMixtureDensityData?.method);
  console.log('🔍 STEP 7 - is GMM?', maximumMixtureDensityData?.method === 'GMM');
  
  console.log('🔍 STEP 7 - data.optimumBinder:', data?.optimumBinder);
  console.log('🔍 STEP 7 - confirmedPercentsOfDosage:', data?.optimumBinder?.confirmedPercentsOfDosage);
  console.log('🔍 STEP 7 - confirmedPercentsOfDosage length:', data?.optimumBinder?.confirmedPercentsOfDosage?.length);


  console.log('🔍 maximumMixtureDensityData completo:', maximumMixtureDensityData);
console.log('🔍 maxSpecificGravity:', maximumMixtureDensityData?.maxSpecificGravity);
console.log('🔍 maxSpecificGravity.method:', maximumMixtureDensityData?.maxSpecificGravity?.method);



  useEffect(() => {
    toast.promise(
      async () => {
        try {
          let newData;
          const graphics = await marshall.setOptimumBinderContentData(
            generalData,
            granulometryCompositionData,
            volumetricParametersData,
            binderTrialData
          );

          newData = {
            ...data,
            graphics: graphics.optimumBinder,
            optimumBinder: graphics.dosageGraph,
          };

          if (graphics) {
            try {
              const expectedParameters = await marshall.setOptimumBinderExpectedParameters(
                granulometryCompositionData,
                maximumMixtureDensityData,
                binderTrialData,
                data
              );

              newData = {
                ...newData,
                expectedParameters,
              };

              setData({ step: 6, value: newData });
              setLoading(false);
            } catch (error) {
              setLoading(false);
              throw error;
            }
          } else {
            console.error(`Não deu certo!`);
          }
        } catch (error) {
          setLoading(false);
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

useEffect(() => {
  // Corrige binder se for objeto (só GMM)
  if (materialSelectionData.binder && 
      typeof materialSelectionData.binder === 'object' &&
      maximumMixtureDensityData.method === 'GMM') {
    
    console.log('🔍 CORRIGINDO binder de objeto para string');
    
    const newBinder = (materialSelectionData.binder as any)._id || 
                      (materialSelectionData.binder as any).name || 
                      'binder';
    
    setData({
      step: 1,
      value: {
        ...materialSelectionData,
        binder: newBinder
      }
    });
  }
}, [materialSelectionData.binder, maximumMixtureDensityData.method]);

  // Preparando os dados points para o componente GraficoPage7N
  const points = data?.optimumBinder?.pointsOfCurveDosage;
  points?.unshift(['', '', '']);

  const expectedParametersColumns: GridColDef[] = [
    {
      field: 'vv',
      headerName: 'Vv (%)',
      valueFormatter: ({ value }) => `${value}`,
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'rbv',
      headerName: 'Rbv (%)',
      valueFormatter: ({ value }) => `${value}`,
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'vam',
      headerName: 'Vam (%)',
      valueFormatter: ({ value }) => `${value}`,
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'gmb',
      headerName: 'Gmb (g/cm³)',
      valueFormatter: ({ value }) => `${value}`,
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'dmt',
      headerName: 'DMT (g/cm³)',
      valueFormatter: ({ value }) => `${value}`,
      flex: 1,
      minWidth: 150,
    },
  ];

  const formatData = {
    vv:
      data?.expectedParameters?.expectedParameters.Vv !== undefined
        ? data.expectedParameters.expectedParameters.Vv * 100
        : undefined,
    vam:
      data?.expectedParameters?.expectedParameters.Vam !== undefined
        ? data.expectedParameters.expectedParameters.Vam * 100
        : undefined,
    rbv:
      data?.expectedParameters?.expectedParameters.RBV !== undefined
        ? data.expectedParameters.expectedParameters.RBV * 100
        : undefined,
  };

  // CORREÇÃO: Todos os .toFixed() protegidos com || 0
  const expectedParametersRows = [
    {
      id: 1,
      vv: (formatData.vv || 0).toFixed(2),
      rbv: (formatData.rbv || 0).toFixed(2),
      vam: (formatData.vam || 0).toFixed(2),
      gmb: (data?.expectedParameters?.expectedParameters.Gmb || 0).toFixed(2),
      dmt: (data?.expectedParameters?.expectedParameters.newMaxSpecificGravity || 0).toFixed(2),
    },
  ];

  const finalProportionCols = () => {
    const cols: GridColDef[] = [];

    materialSelectionData.aggregates.forEach((material) => {
      const materialCol = {
        field: `${material._id}`,
        headerName: `${material.name} (%)`,
        valueFormatter: ({ value }) => `${value}`,
        flex: 1,
        minWidth: 200,
      };
      cols.push(materialCol);
    });

    return cols;
  };

const finalProportionsRows = () => {
  console.log('🔍 FINAL PROPORTIONS - binder completo:', materialSelectionData.binder);
  
  let obj = { id: 1 };
  
  // VERIFICAÇÃO CORRIGIDA PARA GMM
  if (!data?.optimumBinder?.confirmedPercentsOfDosage || 
      data.optimumBinder.confirmedPercentsOfDosage.length === 0) {
    console.log('🔍 SEM confirmedPercentsOfDosage ou array vazio');
    return [obj];
  }

  // CORREÇÃO: Verifica se binder existe
  if (!materialSelectionData.binder) {
    console.log('🔍 binder é null/undefined');
    return [obj];
  }

  // CORREÇÃO: Se binder for objeto, extrai o ID
  let binderKey: string;
  const binder = materialSelectionData.binder;
  
  if (typeof binder === 'object' && binder !== null) {
    // É objeto - pega _id ou name
    const binderObj = binder as any;
    binderKey = binderObj._id || binderObj.name || 'binder';
    console.log('🔍 GMM - binder é objeto, usando chave:', binderKey);
  } else if (typeof binder === 'string') {
    // É string - usa direto
    binderKey = binder;
    console.log('🔍 DMT - binder é string, usando:', binderKey);
  } else {
    // Fallback
    binderKey = 'binder';
    console.log('🔍 Fallback - binder inválido, usando:', binderKey);
  }

  // Adiciona aggregates
  materialSelectionData.aggregates.forEach((agg, i) => {
    if (data.optimumBinder.confirmedPercentsOfDosage[i] !== undefined && agg?._id) {
      obj[agg._id] = (data.optimumBinder.confirmedPercentsOfDosage[i] || 0).toFixed(2);
    }
  });

  // Adiciona binder (último item)
  const lastIndex = data.optimumBinder.confirmedPercentsOfDosage.length - 1;
  if (lastIndex >= 0) {
    obj[binderKey] = (data.optimumBinder.confirmedPercentsOfDosage[lastIndex] || 0).toFixed(2);
  }

  console.log('🔍 OBJETO FINAL:', obj);
  return [obj];
};
  const percentsCols: GridColDef[] = [
    {
      field: 'binder',
      headerName: t('asphalt.dosages.marshall.binder-percentage'),
      valueFormatter: ({ value }) => `${value}`,
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'col1',
      headerName: `${volumetricParametersData?.volumetricParameters?.volumetricParameters[0]?.asphaltContent} (%)`,
      valueFormatter: ({ value }) => `${value}`,
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'col2',
      headerName: `${volumetricParametersData?.volumetricParameters?.volumetricParameters[1]?.asphaltContent} (%)`,
      valueFormatter: ({ value }) => `${value}`,
      flex: 1,
      minWidth: 200,
    },
  ];

  // CORREÇÃO: Todos os .toFixed() no percentRows protegidos
  const percentRows = [
    {
      id: 1,
      binder: 'Vv (%)',
      col1:
        volumetricParametersData?.volumetricParameters?.volumetricParameters[0]?.values.volumeVoids !== undefined
          ? ((volumetricParametersData.volumetricParameters.volumetricParameters[0]?.values.volumeVoids || 0) * 100).toFixed(2)
          : '0.00',
      col2:
        volumetricParametersData?.volumetricParameters?.volumetricParameters[1]?.values.volumeVoids !== undefined
          ? ((volumetricParametersData.volumetricParameters.volumetricParameters[1]?.values.volumeVoids || 0) * 100).toFixed(2)
          : '0.00',
    },
    {
      id: 2,
      binder: 'Gmb (g/cm³)',
      col1: (volumetricParametersData?.volumetricParameters?.volumetricParameters[0]?.values.apparentBulkSpecificGravity || 0).toFixed(2),
      col2: (volumetricParametersData?.volumetricParameters?.volumetricParameters[1]?.values.apparentBulkSpecificGravity || 0).toFixed(2),
    },
    {
      id: 3,
      binder: 'Vcb (%)',
      col1:
        volumetricParametersData?.volumetricParameters?.volumetricParameters[0]?.values.voidsFilledAsphalt !== undefined
          ? ((volumetricParametersData.volumetricParameters.volumetricParameters[0]?.values.voidsFilledAsphalt || 0) * 100).toFixed(2)
          : '0.00',
      col2:
        volumetricParametersData?.volumetricParameters?.volumetricParameters[1]?.values.voidsFilledAsphalt !== undefined
          ? ((volumetricParametersData.volumetricParameters.volumetricParameters[1]?.values.voidsFilledAsphalt || 0) * 100).toFixed(2)
          : '0.00',
    },
    {
      id: 4,
      binder: 'Vam (%)',
      col1:
        volumetricParametersData?.volumetricParameters?.volumetricParameters[0]?.values.aggregateVolumeVoids !== undefined
          ? ((volumetricParametersData.volumetricParameters.volumetricParameters[0]?.values.aggregateVolumeVoids || 0) * 100).toFixed(2)
          : '0.00',
      col2:
        volumetricParametersData?.volumetricParameters?.volumetricParameters[1]?.values.aggregateVolumeVoids !== undefined
          ? ((volumetricParametersData.volumetricParameters.volumetricParameters[1]?.values.aggregateVolumeVoids || 0) * 100).toFixed(2)
          : '0.00',
    },
    {
      id: 5,
      binder: 'Rbv (%)',
      col1:
        volumetricParametersData?.volumetricParameters?.volumetricParameters[0]?.values.ratioBitumenVoid !== undefined
          ? ((volumetricParametersData.volumetricParameters.volumetricParameters[0]?.values.ratioBitumenVoid || 0) * 100).toFixed(2)
          : '0.00',
      col2:
        volumetricParametersData?.volumetricParameters?.volumetricParameters[1]?.values.ratioBitumenVoid !== undefined
          ? ((volumetricParametersData.volumetricParameters.volumetricParameters[1]?.values.ratioBitumenVoid || 0) * 100).toFixed(2)
          : '0.00',
    },
    {
      id: 6,
      binder: t('asphalt.dosages.marshall.fluency') + ' (mm)',
      col1: (volumetricParametersData?.volumetricParameters?.volumetricParameters[0]?.values.fluency || 0).toFixed(2),
      col2: (volumetricParametersData?.volumetricParameters?.volumetricParameters[1]?.values.fluency || 0).toFixed(2),
    },
    {
      id: 7,
      binder: t('asphalt.dosages.stability') + '(N)',
      col1: (volumetricParametersData?.volumetricParameters?.volumetricParameters[0]?.values.stability || 0).toFixed(2),
      col2: (volumetricParametersData?.volumetricParameters?.volumetricParameters[1]?.values.stability || 0).toFixed(2),
    },
    {
      id: 8,
      binder: t('asphalt.dosages.indirect-tensile-strength') + '(MPa)',
      col1: (volumetricParametersData?.volumetricParameters?.volumetricParameters[0]?.values.diametricalCompressionStrength || 0).toFixed(2),
      col2: (volumetricParametersData?.volumetricParameters?.volumetricParameters[1]?.values.diametricalCompressionStrength || 0).toFixed(2),
    },
    {
      id: 9,
      binder: 'DMT (g/cm³)',
      col1: (volumetricParametersData?.volumetricParameters?.volumetricParameters[0]?.values.maxSpecificGravity || 0).toFixed(3),
      col2: (volumetricParametersData?.volumetricParameters?.volumetricParameters[1]?.values.maxSpecificGravity || 0).toFixed(3),
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
            gap: '20px',
            padding: '20px',
          }}
        >
          {points?.length > 0 && <GraficoPage7N data={points} />}

          {!Object.values(data?.expectedParameters?.expectedParameters).some((item) => item === null) && (
            <Box sx={{ width: '100%', overflow: 'auto' }}>
              <DataGrid
                columns={expectedParametersColumns}
                rows={expectedParametersRows}
                hideFooter
                disableColumnMenu
                autoHeight
                sx={{
                  '& .MuiDataGrid-cell': {
                    padding: '8px 16px',
                  },
                  minWidth: '800px',
                }}
              />
            </Box>
          )}

          <Box sx={{ width: '100%', overflow: 'auto' }}>
            <DataGrid
              columns={percentsCols}
              rows={percentRows}
              hideFooter
              disableColumnMenu
              autoHeight
              sx={{
                '& .MuiDataGrid-cell': {
                  padding: '8px 16px',
                },
                minWidth: '700px',
              }}
            />
          </Box>

          {data?.optimumBinder.optimumContent !== null && (
            <Box sx={{ width: '100%', overflow: 'auto' }}>
              <DataGrid
                columns={finalProportionCols()}
                rows={finalProportionsRows()}
                hideFooter
                disableColumnMenu
                autoHeight
                sx={{
                  '& .MuiDataGrid-cell': {
                    padding: '8px 16px',
                  },
                  minWidth: '600px',
                }}
              />
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '20px',
              marginTop: '20px',
            }}
          >
            {data.graphics?.gmb?.length > 0 && (
              <MiniGraphics data={data?.graphics?.gmb} type={'gmb'} nameEixoY={t('asphalt.dosages.gmb') + '(g/cm³)'} />
            )}

            {data.graphics?.sg?.length > 0 && (
              <MiniGraphics
                data={data?.graphics?.sg}
                type={maximumMixtureDensityData.maxSpecificGravity.method}
                nameEixoY={
                  maximumMixtureDensityData.maxSpecificGravity.method === 'DMT'
                    ? 'Massa específica máxima teórica (g/cm³)'
                    : 'Massa específica máxima medida (g/cm³)'
                }
              />
            )}

            {data.graphics?.vv?.length > 0 && (
              <MiniGraphics data={data?.graphics?.vv} type={'Vv'} nameEixoY={t('asphalt.dosages.vv') + '(%)'} />
            )}

            {data.graphics?.vam?.length > 0 && (
              <MiniGraphics data={data?.graphics?.vam} type={'Vam'} nameEixoY={t('asphalt.dosages.vam') + '(%)'} />
            )}

            {data.graphics?.stability?.length > 0 && (
              <MiniGraphics
                data={data?.graphics?.stability}
                type={'Estabilidade'}
                nameEixoY={t('asphalt.dosages.stability') + '(N)'}
              />
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default Marshall_Step7_OptimumBinder;