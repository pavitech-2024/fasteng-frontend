import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card, {
  Result_CardContainer,
  Result_Container_NoChildren,
} from '@/components/atoms/containers/result-card';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import Loading from '@/components/molecules/loading';
import { EssaysData } from '@/pages/asphalt/materials/material/types/material.types';
import { t } from 'i18next';
import Chart from 'react-google-charts';

export interface IViscosityRotationalMaterialView {
  viscosityRotationalData: EssaysData['viscosityRotationalData'];
}

const ViscosityRotationalMaterialView = ({ viscosityRotationalData }: IViscosityRotationalMaterialView) => {
  const data = {
    compressionTemperature: {
      higher: viscosityRotationalData.results.compressionTemperatureRange.higher.toFixed(2).toString(),
      lower: viscosityRotationalData.results.compressionTemperatureRange.lower.toFixed(2).toString(),
      average: viscosityRotationalData.results.compressionTemperatureRange.average.toFixed(2).toString(),
    },
    machiningTemperature: {
      higher: viscosityRotationalData.results.machiningTemperatureRange.higher.toFixed(2).toString(),
      lower: viscosityRotationalData.results.machiningTemperatureRange.lower.toFixed(2).toString(),
      average: viscosityRotationalData.results.machiningTemperatureRange.average.toFixed(2).toString(),
    },
    curvePoints: viscosityRotationalData.results.curvePoints,
  };

  return (
    <FlexColumnBorder title={t('asphalt.essays.viscosityRotational')} open={true}>
      <Result_CardContainer hideBorder title={t('saybolt-furol.compression-temperature')}>
        <Result_Card label={t('saybolt-furol.higher')} value={data.compressionTemperature.higher} unity={'°C'} />
        <Result_Card label={t('saybolt-furol.average')} value={data.compressionTemperature.average} unity={'°C'} />
        <Result_Card label={t('saybolt-furol.lower')} value={data.compressionTemperature.lower} unity={'°C'} />
      </Result_CardContainer>
      <Result_Container_NoChildren hideBorder title={t('saybolt-furol.machining-temperature')} />
      <Result_CardContainer hideBorder>
        <Result_Card label={t('saybolt-furol.higher')} value={data.machiningTemperature.higher} unity={'°C'} />
        <Result_Card label={t('saybolt-furol.average')} value={data.machiningTemperature.average} unity={'°C'} />
        <Result_Card label={t('saybolt-furol.lower')} value={data.machiningTemperature.lower} unity={'°C'} />
      </Result_CardContainer>

      <ResultSubTitle title={t('asphalt.essays.viscosityRotational.graph')} sx={{ margin: '.65rem' }} />
      <div id="chart-div-viscosity">
        <Chart
          chartType="LineChart"
          width={'100%'}
          height={'400px'}
          loader={<Loading />}
          data={data.curvePoints}
          options={{
            backgroundColor: 'transparent',
            hAxis: {
              title: `${t('saybolt-furol.temperature')} C`, // Umidade %
            },
            vAxis: {
              title: `${t('saybolt-furol.viscosity')} (SSF)`, // Densidade do solo seco - g/cm³
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
      </div>
    </FlexColumnBorder>
  );
};

export default ViscosityRotationalMaterialView;
