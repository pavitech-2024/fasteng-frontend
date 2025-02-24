import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card, {
  Result_CardContainer,
  Result_Container_NoChildren,
} from '@/components/atoms/containers/result-card';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useViscosityRotationalStore from '@/stores/asphalt/viscosityRotational/viscosityRotational.store';
import { t } from 'i18next';
import Chart from 'react-google-charts';

const ViscosityRotational_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { results: results, generalData } = useViscosityRotationalStore();

  const data = {
    compressionTemperature: {
      higher: results.compressionTemperatureRange.higher.toFixed(2).toString(),
      lower: results.compressionTemperatureRange.lower.toFixed(2).toString(),
      average: results.compressionTemperatureRange.average.toFixed(2).toString(),
    },
    machiningTemperature: {
      higher: results.machiningTemperatureRange.higher.toFixed(2).toString(),
      lower: results.machiningTemperatureRange.lower.toFixed(2).toString(),
      average: results.machiningTemperatureRange.average.toFixed(2).toString(),
    },
    curvePoints: results.curvePoints,
  };

  // criando o objeto que será passado para o componente ExperimentResume
  const experimentResumeData: ExperimentResumeData = {
    experimentName: generalData.name,
    materials: [{ name: generalData.material.name, type: generalData.material.type }],
  };

  return (
    <>
      <ExperimentResume data={experimentResumeData} />
      <FlexColumnBorder title={t('results')} open={true}>
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
        <Chart
          chartType="LineChart"
          width={'100%'}
          height={'400px'}
          loader={<Loading />}
          data={data.curvePoints}
          options={{
            backgroundColor: 'transparent',
            hAxis: {
              title: `${t('asphalt.essays.viscosityRotational.temperature')} C`, // Umidade %
            },
            vAxis: {
              title: `${t('asphalt.essays.viscosityRotational.viscosity')} (SSF)`, // Densidade do solo seco - g/cm³
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

export default ViscosityRotational_Results;
