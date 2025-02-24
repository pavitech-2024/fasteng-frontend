import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card, {
  Result_CardContainer,
  Result_Container_NoChildren,
} from '@/components/atoms/containers/result-card';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import Loading from '@/components/molecules/loading';
import { EssaysData } from '@/pages/soils/samples/sample/[id]';
import { t } from 'i18next';
import Chart from 'react-google-charts';

export interface ICompressionSampleView {
  compressionData: EssaysData['compressionData'];
}

const CompressionSampleView = ({ compressionData }: ICompressionSampleView) => {
  // Segundo e terceiro bloco com resultados
  const data = {
    container_hygroscopicHumidity: [
      {
        label: 'Peso do solo seco',
        value: Number(compressionData?.results.netWeightDrySoil[0]).toFixed(2) ?? 'N/A',
        unity: 'g',
      },
      {
        label: 'Umidade Higroscópica',
        value: Number(compressionData?.results.hygroscopicMoisture).toFixed(2) ?? 'N/A',
        unity: '%',
      },
    ],
  };

  // Adicionar objetos com a label 'Peso da água' para cada valor em waterWeight
  compressionData?.results.waterWeight.forEach((weight) => {
    data.container_hygroscopicHumidity.push({
      label: 'Peso da água',
      value: Number(weight).toFixed(2),
      unity: 'g',
    });
  });

  const wetSoilWeights = compressionData?.results.wetSoilWeights.map((value, index) => (
    <Result_Card key={index} label={'Peso do solo úmido'} value={String(Number(value).toFixed(2))} unity={'g'} />
  ));

  const wetSoilDensitys = compressionData?.results.wetSoilDensitys.map((value, index) => (
    <Result_Card
      key={index}
      label={'Densidade do solo seco'}
      value={String(Number(value).toFixed(2))}
      unity={'g/cm³'}
    />
  ));
  const netWeightsDrySoil = compressionData?.results.netWeightsDrySoil.map((value, index) => (
    <Result_Card key={index} label={'Peso do solo seco'} value={String(Number(value).toFixed(2))} unity={'g'} />
  ));
  const moistures = compressionData?.results.moistures.map((value, index) => (
    <Result_Card key={index} label={'Umidade média'} value={String(Number(value).toFixed(2))} unity={'%'} />
  ));
  const drySoilDensitys = compressionData?.results.drySoilDensitys.map((value, index) => (
    <Result_Card key={index} label={'Densidade do solo seco'} value={String(Number(value).toFixed(2))} unity={'%'} />
  ));

  const graphData = [
    [`${t('compression.drySoilDensitys')} g/cm³`, `${t('compression.moistures')} %`],
    ...compressionData.results.graph,
  ];

  return (
    <FlexColumnBorder title={t('results')} open={true}>
      <Result_CardContainer hideBorder title={t('compression.hygroscopicHumidity')}>
        {data.container_hygroscopicHumidity.map((item, index) => (
          <Result_Card key={index} label={item.label} value={String(item.value)} unity={item.unity} />
        ))}
      </Result_CardContainer>
      <Result_CardContainer hideBorder title={t('compression.waterWeights')}>
        {data.container_hygroscopicHumidity.map((item, index) => {
          if (item.label === 'Peso da água') {
            return <Result_Card key={index} label={item.label} value={String(item.value)} unity={item.unity} />;
          }
          return null;
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
  );
};

export default CompressionSampleView;
