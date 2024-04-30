import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card, { Result_CardContainer } from '@/components/atoms/containers/result-card';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import Loading from '@/components/molecules/loading';
import useAuth from '@/contexts/auth';
import { EssaysData } from '@/pages/soils/samples/sample/[id]';
import { t } from 'i18next';
import Chart from 'react-google-charts';

export interface ICbrSampleView {
  cbrData: EssaysData['cbrData'];
}

const CbrSampleView = ({ cbrData }: ICbrSampleView) => {
  const { user } = useAuth();

  // pegando a quantidade de casas decimais do usuário
  const {
    preferences: { decimal: user_decimal },
  } = user;
  //const userId = user?._id;

  const data = {
    // container "Resultados"
    container_results: [],
    // container "Pressões medidas"
    container_measured_pressure: [],
  };

  if (cbrData) {
    // data container 1
    data.container_results.push({ label: t('cbr.free_expansion'), value: cbrData.results.free_expansion, unity: 'mm' });
    [2, 4, 6, 8, 10].map((item) => {
      if (cbrData.results.cbrs[item] !== null)
        data.container_results.push({
          label: t(`cbr.cbr_${item}_minutes`),
          value: cbrData.results.cbrs[item],
          unity: '%',
        });
    });
    data.container_results.push({ label: 'CBR', value: cbrData.results.cbr, unity: '%' });

    // data container 2
    cbrData.results.measured_pressure.map((item, index) => {
      if (item !== 0)
        data.container_measured_pressure.push({
          label: `${index + 1} ° ${t('cbr.pressure')}`,
          value: item,
          unity: 'kg/cm²',
        });
    });
  }

  data.container_results.map((item) => (item.value = item.value.toFixed(user_decimal)));
  data.container_measured_pressure.map((item) => (item.value = item.value.toFixed(user_decimal)));

  const graphData = [[t('cbr.penetration'), `${t('cbr.pressure')} kg/cm²`], ...cbrData.results.cbr_graph];

  return (
    <FlexColumnBorder title={t('soils.essays.cbr')} open={true}>
      {[0, 1].map((item) => (
        <Result_CardContainer
          hideBorder
          key={item}
          mt={item === 0 && 'none'}
          title={item === 1 && t('cbr.measured_pressure')}
        >
          {item === 0
            ? data.container_results.map((item, index) => (
                <Result_Card key={index} label={item.label} value={item.value} unity={item.unity} />
              ))
            : data.container_measured_pressure.map((item, index) => (
                <Result_Card key={index} label={item.label} value={item.value} unity={item.unity} />
              ))}
        </Result_CardContainer>
      ))}
      <ResultSubTitle title={t('cbr.graph')} sx={{ margin: '.65rem' }} />
      <Chart
        chartType="LineChart"
        width={'100%'}
        height={'400px'}
        loader={<Loading />}
        data={graphData}
        options={{
          backgroundColor: 'transparent',
          hAxis: {
            title: t('cbr.penetration'),
          },
          vAxis: {
            title: `${t('cbr.pressure')} kg/cm²`,
          },
          explorer: {
            actions: ['dragToZoom', 'rightClickToReset'],
            axis: 'vertical',
          },
          legend: 'none',
        }}
      />
    </FlexColumnBorder>
  );
};

export default CbrSampleView;
