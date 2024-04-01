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
            binderTrialData
          );

          newData = {
            ...data,
            graphics: graphics.optimumBinder,
            optimumBinder: graphics.dosageGraph
          };

          if (graphics) {
            try {
              const expectedParameters = await marshall.setOptimumBinderExpectedParameters(
                maximumMixtureDensityData,
                binderTrialData,
                data
              )

              newData = {
                ...newData,
                expectedParameters
              }

              setData({ step: 6, value: newData });
              setLoading(false);
            } catch (error) {
              setLoading(false);
              throw error
            }
          } else {
            console.error(`Não deu certo!`)
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

          <GraficoPage7N data={data?.optimumBinder?.pointsOfCurveDosage}/>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px'
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
          </Box>
        </Box>
      )}
    </>
  );
};

export default Marshall_Step7;
