/* eslint-disable @typescript-eslint/no-unused-vars */
import { EssayPageProps } from '@/components/templates/essay';
import Compression_GeneralData from './general-data.compression';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import useCompressionStore from '@/stores/soils/compression/compression.store';
import useAuth from '@/contexts/auth';
import Loading from '@/components/molecules/loading';
import Chart from 'react-google-charts';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import { Result_CardContainer } from '@/components/atoms/containers/result-card';
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
  const experimentResumeData: ExperimentResumeData = {
    experimentName: Compression_GeneralData.name,
    materials: [{ name: compressionGeneralData.sample.name, type: compressionGeneralData.sample.type }],
  };
  return (
    <>
      <ExperimentResume data={experimentResumeData} />
      <FlexColumnBorder title={t('results')} open={true}>
        {[0, 1].map((item) => (
          <Result_CardContainer
            hideBorder
            key={item}
            mt={item === 0 && 'none'}
            title={item === 1 && t('compression.')}
          >
            
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
              title: t('compression.'),
            },
            vAxis: {
              title: t('compression.'),
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

export default Compression_Results;
