import useCbrStore from '@/stores/soils/cbr/cbr.store';
import useAuth from '@/contexts/auth';
import Result_Card, { Result_CardContainer } from '../../../atoms/containers/result-card';
import { t } from 'i18next';
import FlexColumnBorder from '../../../atoms/containers/flex-column-with-border';
import ExperimentResume, { ExperimentResumeData } from '../../../molecules/boxes/experiment-resume';
import Chart from 'react-google-charts';
import Loading from '../../../molecules/loading';
import { EssayPageProps } from '../../../templates/essay';

const CBR_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  const { results: cbr_results, generalData } = useCbrStore();
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

  if (cbr_results) {
    // data container 1
    data.container_results.push({ label: t('cbr.free_expansion'), value: cbr_results.free_expansion, unity: 'mm' });
    [2, 4, 6, 8, 10].map((item) => {
      if (cbr_results.cbrs[item] !== null)
        data.container_results.push({ label: t(`cbr.cbr_${item}_minutes`), value: cbr_results.cbrs[item], unity: '%' });
    });
    data.container_results.push({ label: 'CBR', value: cbr_results.cbr, unity: '%' });

    // data container 2
    cbr_results.measured_pressure.map((item, index) => {
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

  // criando o objeto que será passado para o componente ExperimentResume
  const experimentResumeData: ExperimentResumeData = {
    experimentName: generalData.name,
    materials: [{ name: generalData.sample.name, type: generalData.sample.type }],
  };

  const graphData = [[t('cbr.penetration'), `${t('cbr.pressure')} kg/cm²`], ...cbr_results.cbr_graph];

  return (
    <>
      <ExperimentResume data={experimentResumeData} />
      <FlexColumnBorder title={t('results')} open={true}>
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
        <Chart
          chartType="LineChart"
          width={'100%'}
          height={'400px'}
          loader={<Loading />}
          data={graphData}
          options={{
            title: t('cbr.graph'),
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
    </>
  );
};

export default CBR_Results;