/* eslint-disable @typescript-eslint/no-unused-vars */
import { EssayPageProps } from '@/components/templates/essay';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import useCompressionStore from '@/stores/soils/compression/compression.store';
import Loading from '@/components/molecules/loading';
import Chart from 'react-google-charts';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import Result_Card, {
  Result_CardContainer,
  Result_Container_NoChildren,
} from '@/components/atoms/containers/result-card';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { t } from 'i18next';
import { useEffect } from 'react';

const Compression_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { results: compressionResults, compressionGeneralData } = useCompressionStore();
  console.log("🚀 ~ file: results.compression.tsx:21 ~ compressionResults:", compressionResults)

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
        value: Number(compressionResults?.netWeightDrySoil[0]).toFixed(2) ?? 'N/A',
        unity: 'g',
      },
      {
        label: 'Umidade Higroscópica',
        value: Number(compressionResults?.hygroscopicMoisture).toFixed(2) ?? 'N/A',
        unity: '%',
      },
    ],
  };

  // Adicionar objetos com a label 'Peso da água' para cada valor em waterWeight
  compressionResults?.waterWeight.forEach((weight) => {
    data.container_hygroscopicHumidity.push({
      label: 'Peso da água',
      value: Number(weight).toFixed(2),
      unity: 'g',
    });
  });

  const wetSoilWeights = compressionResults?.wetSoilWeights.map((value, index) => (
    <Result_Card key={index} label={'Peso do solo úmido'} value={String(Number(value).toFixed(2))} unity={'g'} />
  ));

  const wetSoilDensitys = compressionResults?.wetSoilDensitys.map((value, index) => (
    <Result_Card
      key={index}
      label={'Densidade do solo seco'}
      value={String(Number(value).toFixed(2))}
      unity={'g/cm³'}
    />
  ));
  const netWeightsDrySoil = compressionResults?.netWeightsDrySoil.map((value, index) => (
    <Result_Card key={index} label={'Peso do solo seco'} value={String(Number(value).toFixed(2))} unity={'g'} />
  ));
  const moistures = compressionResults?.moistures.map((value, index) => (
    <Result_Card key={index} label={'Umidade média'} value={String(Number(value).toFixed(2))} unity={'%'} />
  ));
  const drySoilDensitys = compressionResults?.drySoilDensitys.map((value, index) => (
    <Result_Card key={index} label={'Densidade do solo seco'} value={String(Number(value).toFixed(2))} unity={'%'} />
  ));

  useEffect(
    () => console.log(compressionResults?.drySoilDensitys.map((item) => Number(item).toFixed(2))),
    [compressionResults?.drySoilDensitys]
  );

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
        <Result_CardContainer hideBorder title={t('compression.waterWeights')}>
          {data.container_hygroscopicHumidity.map((item, index) => {
            if (item.label === 'Peso da água') {
              return (
                <Result_Card key={index} label={item.label} value={String(item.value)} unity={item.unity} />
              );
            }
            return null; // Retornar null para os itens que não têm a label 'Peso da água'
          })}
        </Result_CardContainer>
        <Result_Container_NoChildren hideBorder title={t('compression.humidityDetermination')} />
        <Result_CardContainer hideBorder title={t('compression.wetSoilWeights')}>
          {wetSoilWeights}
        </Result_CardContainer>
        <Result_CardContainer hideBorder title={t('compression.wetSoilDensitys')}>
          {wetSoilDensitys}
        </Result_CardContainer>
        <Result_CardContainer hideBorder title={t('compression.netWeightsDrySoil')}>
          {netWeightsDrySoil}
        </Result_CardContainer>
        <Result_CardContainer hideBorder title={t('compression.hd.moistures')}>
          {moistures}
        </Result_CardContainer>
        <Result_CardContainer hideBorder title={t('compression.hd.drySoilDensitys')}>
          {drySoilDensitys}
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
              title: `${t('compression.moisture')} %`, // Umidade %
            },
            vAxis: {
              title: `${t('compression.drySoilDensitys')} (g/cm³)`, // Densidade do solo seco - g/cm³
              maxValue: '1.5',
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
