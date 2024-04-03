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
import useAuth from '@/contexts/auth';

const Marshall_Step7 = ({
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
    setData,
  } = useMarshallStore();

  const { user } = useAuth();

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          let newData;
          const graphics = await marshall.setOptimumBinderContentData(
            generalData,
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
        pending: t('loading.materials.pending'),
        success: t('loading.materials.success'),
        error: t('loading.materials.error'),
      }
    );
  }, []);

  // Preparando os dados points para o componente GraficoPage7N
  const points = data?.optimumBinder?.pointsOfCurveDosage;
  points.unshift(['', '', '']);

  const expectedParametersColumns: GridColDef[] = [
    {
      field: 'vv',
      headerName: 'Vv (%)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'rbv',
      headerName: 'Rbv (%)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'vam',
      headerName: 'Vam (%)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'gmb',
      headerName: 'Gmb (g/cm³)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'dmt',
      headerName: 'DMT (g/cm³)',
      valueFormatter: ({ value }) => `${value}`,
    },
  ];

  const expectedParametersRows = [
    {
      id: 1,
      vv: data?.expectedParameters?.expectedParameters.Vv?.toFixed(2),
      rbv: data?.expectedParameters?.expectedParameters.RBV?.toFixed(2),
      vam: data?.expectedParameters?.expectedParameters.Vam?.toFixed(2),
      gmb: data?.expectedParameters?.expectedParameters.Gmb?.toFixed(2),
      dmt: data?.expectedParameters?.expectedParameters.newMaxSpecificGravity?.toFixed(2),
    },
  ];

  const material_1 = materialSelectionData?.aggregates[0].name;
  const material_2 = materialSelectionData?.aggregates[1].name;
  const binder = materialSelectionData?.binder;

  const finalProportionCols: GridColDef[] = [
    {
      field: 'binder',
      headerName: `${binder} (%)`,
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'material_1',
      headerName: `${material_1} (%)`,
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'material_2',
      headerName: `${material_2} (%)`,
      valueFormatter: ({ value }) => `${value}`,
    },
  ];

  const finalProportionsRows = [
    {
      id: 1,
      binder: data?.optimumBinder.optimumContent?.toFixed(2),
      material_1: data?.optimumBinder.confirmedPercentsOfDosage[0]?.toFixed(2),
      material_2: data?.optimumBinder.confirmedPercentsOfDosage[1]?.toFixed(2),
    },
  ];

  const percentsCols: GridColDef[] = [
    {
      field: 'binder',
      headerName: `Porcentagem de ligante (%)`,
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'col1',
      headerName: `${volumetricParametersData?.volumetricParameters?.volumetricParameters[0].asphaltContent} (%)`,
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'col2',
      headerName: `${volumetricParametersData?.volumetricParameters?.volumetricParameters[1].asphaltContent} (%)`,
      valueFormatter: ({ value }) => `${value}`,
    },
  ];

  const percentRows = [
    {
      id: 1,
      binder: 'Vv (%)',
      col1: volumetricParametersData?.volumetricParameters?.volumetricParameters[0].values.volumeVoids.toFixed(2),
      col2: volumetricParametersData?.volumetricParameters?.volumetricParameters[1].values.volumeVoids.toFixed(2),
    },
    {
      id: 2,
      binder: 'Gmb (g/cm³)',
      col1: volumetricParametersData?.volumetricParameters?.volumetricParameters[0].values.apparentBulkSpecificGravity.toFixed(
        2
      ),
      col2: volumetricParametersData?.volumetricParameters?.volumetricParameters[1].values.apparentBulkSpecificGravity.toFixed(2),
    },
    {
      id: 3,
      binder: 'Vcb (%)',
      col1: volumetricParametersData?.volumetricParameters?.volumetricParameters[0].values.voidsFilledAsphalt.toFixed(
        2
      ),
      col2: volumetricParametersData?.volumetricParameters?.volumetricParameters[1].values.voidsFilledAsphalt.toFixed(2),
    },
    {
      id: 4,
      binder: 'Vam (%)',
      col1: volumetricParametersData?.volumetricParameters?.volumetricParameters[0].values.aggregateVolumeVoids.toFixed(
        2
      ),
      col2: volumetricParametersData?.volumetricParameters?.volumetricParameters[1].values.aggregateVolumeVoids.toFixed(2),
    },
    {
      id: 5,
      binder: 'Rbv (%)',
      col1: volumetricParametersData?.volumetricParameters?.volumetricParameters[0].values.ratioBitumenVoid.toFixed(2),
      col2: volumetricParametersData?.volumetricParameters?.volumetricParameters[1].values.ratioBitumenVoid.toFixed(2),
    },
    
    {
      id: 6,
      binder: 'Fluência (mm)',
      col1: volumetricParametersData?.volumetricParameters?.volumetricParameters[0].values.fluency.toFixed(2),
      col2: volumetricParametersData?.volumetricParameters?.volumetricParameters[1].values.fluency.toFixed(2),
    },
    {
      id: 7,
      binder: 'Estabilidade (N)',
      col1: volumetricParametersData?.volumetricParameters?.volumetricParameters[0].values.stability.toFixed(2),
      col2: volumetricParametersData?.volumetricParameters?.volumetricParameters[1].values.stability.toFixed(2),
    },
    {
      id: 7,
      binder: 'Resistência à tração por compressão diametral (MPa)',
      col1: volumetricParametersData?.volumetricParameters?.volumetricParameters[0].values.diametricalCompressionStrength.toFixed(
        2
      ),
      col2: volumetricParametersData?.volumetricParameters?.volumetricParameters[1].values.diametricalCompressionStrength.toFixed(2),
    },
    {
      id: 8,
      binder: 'DMT (g/cm³)',
      col1: volumetricParametersData?.volumetricParameters?.volumetricParameters[0].values.maxSpecificGravity.toFixed(
        2
      ),
      col2: volumetricParametersData?.volumetricParameters?.volumetricParameters[1].values.maxSpecificGravity.toFixed(2),
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
          <GraficoPage7N data={points} />

          {!Object.values(data?.expectedParameters?.expectedParameters).some((item) => item === null) && (
            <DataGrid columns={expectedParametersColumns} rows={expectedParametersRows} hideFooter disableColumnMenu />
          )}

          <DataGrid columns={percentsCols} rows={percentRows} hideFooter disableColumnMenu />

          {data?.optimumBinder.optimumContent !== null && (
            <DataGrid columns={finalProportionCols} rows={finalProportionsRows} hideFooter disableColumnMenu />
          )}

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <MiniGraphics data={data?.graphics?.gmb} type={'gmb'} nameEixoY={'Massa específica aparente (g/cm³)'} />

            <MiniGraphics
              data={data?.graphics?.sg}
              type={maximumMixtureDensityData.maxSpecificGravity.method}
              nameEixoY={
                maximumMixtureDensityData.maxSpecificGravity.method === 'DMT'
                  ? 'Massa específica máxima teórica (g/cm³)'
                  : 'Massa específica máxima medida (g/cm³)'
              }
            />

            <MiniGraphics data={data?.graphics?.vv} type={'Vv'} nameEixoY={'Volume de vazios (%)'} />

            <MiniGraphics data={data?.graphics?.rbv} type={'Rbv'} nameEixoY={'Relação betume/vazios (%)'} />

            <MiniGraphics data={data?.graphics?.stability} type={'Estabilidade'} nameEixoY={'Estabilidade (N)'} />
          </Box>
        </Box>
      )}
    </>
  );
};

export default Marshall_Step7;
