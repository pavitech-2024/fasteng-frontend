import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card, { Result_CardContainer } from '@/components/atoms/containers/result-card';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import { EssaysData } from '@/pages/soils/samples/sample/[id]';
import { Typography } from '@mui/material';
import { t } from 'i18next';
import showDefinition from '../essays/sucs/classification.sucs';

export interface ISucsSampleView {
  sucsData: EssaysData['sucsData'];
}

const SucsSampleView = ({ sucsData }: ISucsSampleView) => {

  const data = {
    // container "Resultados"
    container_other_data: [],
  };

  if (sucsData) {
    data.container_other_data.push(
      { label: 'CC', value: sucsData.results.cc, unity: '' },
      { label: 'CNU', value: sucsData.results.cnu, unity: '' },
      { label: 'IP', value: sucsData.results.ip, unity: '%' }
    );
  }

  return (
    <FlexColumnBorder title={t('results')} open={true}>
      <ResultSubTitle title={t('sucs.classification') + ': ' + sucsData.results.classification} sx={{ margin: '.65rem' }} />
      <Typography
        variant="body1"
        sx={{ margin: '.65rem', mb: '2rem', fontWeight: '500', textAlign: 'justify', lineHeight: '1.2rem' }}
      >
        {showDefinition(sucsData.results.classification)}
      </Typography>
      <Result_CardContainer hideBorder title={t('sucs.other-data')} mt="none">
        {data.container_other_data.map((item, index) => (
          <Result_Card key={index} label={item.label} value={item.value} unity={item.unity} />
        ))}
      </Result_CardContainer>
    </FlexColumnBorder>
  );
};

export default SucsSampleView;
