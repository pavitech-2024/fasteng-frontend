/* eslint-disable @typescript-eslint/no-unused-vars */
import { EssayPageProps } from '@/components/templates/essay';
import Compression_GeneralData from './general-data.compression';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import useCompressionStore from '@/stores/soils/compression/compression.store';
import useAuth from '@/contexts/auth';
import Loading from '@/components/molecules/loading';
import Chart from 'react-google-charts';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import Result_Card, { Result_CardContainer } from '@/components/atoms/containers/result-card';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { t } from 'i18next';

const Compression_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { results: compressionResults, compressionGeneralData } = useCompressionStore();
  // não sei se vai ser utilizado isso:
  // const { user } = useAuth();
  // const {
  //   preferences: { decimal: user_decimal },
  // } = user;

  //Primeiro bloco com as informações gerais do ensaio
  const experimentResumeData: ExperimentResumeData = {
    experimentName: Compression_GeneralData.name,
    materials: [{ name: compressionGeneralData.sample.name, type: compressionGeneralData.sample.type }],
  };

  const data = {
    container_hygroscopicHumidity: [
      {
        label: 'Peso do solo seco',
        value: String(compressionResults.hygroscopicHumidity.netWeightDrySoil),
        unity: '(g)',
      },
      {
        label: 'Peso da água',
        value: String(compressionResults.hygroscopicHumidity.waterWeight),
        unity: '(g)',
      },
      {
        label: 'Umidade Higroscópica',
        value: String(compressionResults.hygroscopicHumidity.hygroscopicMoisture),
        unity: '(%)',
      },
    ],
    container_humidityDetermination: [
      {
        label: 'Peso do solo úmido',
        value: String(compressionResults.humidityDetermination.wetSoilWeights),
        unity: '(%)',
      },
      {
        label: 'Densidade do solo úmido',
        value: String(compressionResults.humidityDetermination.wetSoilDensitys),
        unity: '(g/cm³)',
      },
      {
        label: 'Peso do solo seco',
        value: String(compressionResults.humidityDetermination.netWeightsDrySoil),
        unity: '(g)',
      },
      {
        label: 'Umidade média',
        value: String(compressionResults.humidityDetermination.moistures),
        unity: '(%)',
      },
      {
        label: 'Densidade do solo seco',
        value: String(compressionResults.humidityDetermination.drySoilDensitys),
        unity: '(%)',
      },
    ],
  };

  // const data = {
  //   // Humidade Higroscópica
  //   netWeightDrySoil: null, // Peso do solo seco (g)
  //   waterWeight: null, // Peso da água (g)
  //   hygroscopicMoisture: null, // Umidade Higroscópica (%)
  //   // Determinação da Umidade
  //   wetSoilWeights: null, // Peso do solo úmido (g)
  //   wetSoilDensitys: null, // Densidade do solo úmido (g/cm³)
  //   netWeightsDrySoil: null, // Peso do solo seco (g)
  //   moistures: null, // Umidade média (%)
  //   drySoilDensitys: null, // Densidade do solo seco (%)
  //   // Gráfico
  //   optimumDensity: null, // Peso específico máximo seco (g/cm³)
  //   optimumMoisture: null, // Umidade ótima (%)
  // };

  return (
    <>
      <ExperimentResume data={experimentResumeData} />
      <FlexColumnBorder title={t('results')} open={true}>
        {data.container_hygroscopicHumidity.map((item) => (
          <Result_CardContainer
            hideBorder
            key={item.value}
            mt={item && 'none'}
            title={t('compression.hygroscopicHumidity')}
          >
            <Result_Card key={item.value} label={item.label} value={item.value} unity={item.unity} />
          </Result_CardContainer>
        ))}
        {data.container_humidityDetermination.map((item) => (
          <Result_CardContainer
            hideBorder
            key={item.value}
            mt={item && 'none'}
            title={t('compression.humidityDetermination')}
          >
            <Result_Card key={item.value} label={item.label} value={item.value} unity={item.unity} />
          </Result_CardContainer>
        ))}

        <ResultSubTitle title={t('compression.graph')} sx={{ margin: '.65rem' }} />
        <Chart
          chartType="LineChart"
          width={'100%'}
          height={'400px'}
          loader={<Loading />}
          data={''}
          options={{
            backgroundColor: 'transparent',
            hAxis: {
              title: t('compression.moisture'), // Umidade (%)
            },
            vAxis: {
              title: t('compression.drySoilDensitys'), // Densidade do solo seco - g/cm³
            },
            explorer: {
              actions: ['dragToZoom', 'rightClickToReset'],
              axis: 'vertical',
            },
            legend: 'none',
            trendlines: {
              0: {
                type: 'polynomial',
                degree: 4,
                visibleInLegend: true,
                labelInLegend: 'curva',
              },
            },
          }}
        />
      </FlexColumnBorder>
    </>
  );
};

export default Compression_Results;
