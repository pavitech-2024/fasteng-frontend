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
    setData,
  } = useMarshallStore();

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          let newData;
          const graphics = await marshall.setOptimumBinderContentData(
            generalData,
            volumetricParametersData,
            binderTrialData,
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
  
  // const expectedParametersRows = [
  //   {
  //     id: 1,
  //     vv:,
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
          <GraficoPage7N data={points} />

          <DataGrid columns={expectedParametersColumns} rows={[]}/>

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
