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
import { useEffect } from 'react';

const Compression_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { results: compressionResults, compressionGeneralData } = useCompressionStore();

  //Primeiro bloco com as informações gerais do ensaio
  const experimentResumeData: ExperimentResumeData = {
    experimentName: compressionGeneralData.name,
    materials: [{ name: compressionGeneralData.sample.name, type: compressionGeneralData.sample.type }],
  };

  // Segundo e terceiro bloco com resultados
  const data = {
    container_hygroscopicHumidity: [
      {
        label: 'Peso do solo seco',
        value: compressionResults?.netWeightDrySoil ?? 'N/A',
        unity: '(g)',
      },
      {
        label: 'Peso da água',
        value: compressionResults?.waterWeight ?? 'N/A',
        unity: '(g)',
      },
      {
        label: 'Umidade Higroscópica',
        value: compressionResults?.hygroscopicMoisture ?? 'N/A',
        unity: '(%)',
      },
    ],
    container_humidityDetermination: [
      {
        label: 'Peso do solo úmido', // ARRAY
        value: compressionResults?.wetSoilWeights ?? 'N/A',
        unity: '(%)',
      },
      {
        label: 'Densidade do solo úmido', // ARRAY
        value: compressionResults?.wetSoilDensitys ?? 'N/A',
        unity: '(g/cm³)',
      },
      {
        label: 'Peso do solo seco',
        value: compressionResults?.netWeightsDrySoil ?? 'N/A',
        unity: '(g)',
      },
      {
        label: 'Umidade média', // ARRAY
        value: compressionResults?.moistures ?? 'N/A',
        unity: '(%)',
      },
      {
        label: 'Densidade do solo seco', // ARRAY
        value: compressionResults?.drySoilDensitys ?? 'N/A',
        unity: '(%)',
      },
    ],
  };

  //data.container_hygroscopicHumidity.map((item) => (item.value = item.value.toFixed(2)));
  //data.container_humidityDetermination.map((item) => (item.value = item.value.toFixed(2)));

  const graphData = [
    [`${t('compression.drySoilDensitys')} g/cm³`, `${t('compression.moistures')} %`],
    ...compressionResults.graph,
  ];

  useEffect(() => console.log(compressionResults), [compressionResults]);

  return (
    <>
      <ExperimentResume data={experimentResumeData} />
      <FlexColumnBorder title={t('results')} open={true}>
        <Result_CardContainer hideBorder title={t('compression.hygroscopicHumidity')}>
          {data.container_hygroscopicHumidity.map((item, index) => (
            <Result_Card key={index} label={item.label} value={String(item.value)} unity={item.unity} />
          ))}
        </Result_CardContainer>
        <Result_CardContainer hideBorder title={t('compression.humidityDetermination')}>
          {data.container_humidityDetermination.map((item, index) => (
            <Result_Card key={index} label={item.label} value={String(item.value)} unity={item.unity} />
          ))}
        </Result_CardContainer>
        <ResultSubTitle title={t('compression.graph')} sx={{ margin: '.65rem' }} />
        <Chart
          chartType="LineChart"
          width={'100%'}
          height={'400px'}
          loader={<Loading />}
          data={graphData}
          options={{
            backgroundColor: 'transparent',
            hAxis: {
              title: `${t('compression.moisture')} (%)`, // Umidade (%)
            },
            vAxis: {
              title: `${t('compression.drySoilDensitys')} (g/cm³)`, // Densidade do solo seco - g/cm³
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
