import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card, { Result_CardContainer } from '@/components/atoms/containers/result-card';
import ResultSubTitle from '@/components/atoms/titles/result-sub-title';
import { EssaysData } from '@/pages/soils/samples/sample/[id]';
import { Typography } from '@mui/material';
import { t } from 'i18next';
import { HRB_ReferenceTableCBR, HRB_ReferenceTableTRB } from '../essays/hrb/tables/hrb-reference-table.hrb';
import useAuth from '@/contexts/auth';

export interface IHrbSampleView {
  hrbData: EssaysData['hrbData'];
}

const HrbSampleView = ({ hrbData }: IHrbSampleView) => {

  const { user } = useAuth();

  // pegando a quantidade de casas decimais do usuário
  const {
    preferences: { decimal: user_decimal },
  } = user;

  const data = {
    // container "Another Data"
    container_another_data: [],
  };

  if (hrbData) {
    data.container_another_data.push(
      {
        label: t('hrb.liquidity_limit'),
        value: hrbData.step2Data.liquidity_limit.toFixed(user_decimal),
        unity: '%',
      },
      {
        label: t('hrb.plasticity_limit'),
        value: hrbData.step2Data.plasticity_limit.toFixed(user_decimal),
        unity: '%',
      },
      {
        label: t('hrb.plasticity_index'),
        value: hrbData.results.plasticity_index.toFixed(user_decimal),
        unity: '%',
      },
      {
        label: t('hrb.group_index'),
        value: hrbData.results.group_index,
        unity: '',
      }
    );
  }

  return (
    <FlexColumnBorder title={t('soils.essays.hrb')} open={true}>
      <ResultSubTitle title={t('hrb.classification') + ': ' + hrbData.results.classification} sx={{ margin: '.65rem' }} />
      <Typography
        variant="body1"
        sx={{ margin: '.65rem', mb: '2rem', fontWeight: '500', textAlign: 'justify', lineHeight: '1.2rem' }}
      >
        {t(`hrb.text-${hrbData.results.classification}`)}
      </Typography>
      <Result_CardContainer hideBorder title={t('hrb.another-data')} mt="none">
        {data.container_another_data.map((item, index) => (
          <Result_Card key={index} label={item.label} value={item.value} unity={item.unity} />
        ))}
      </Result_CardContainer>
      <ResultSubTitle title={t('hrb.table-cbr')} sx={{ margin: '.65rem' }} />
      <HRB_ReferenceTableCBR classification={hrbData.results.classification} sx={{ mt: '1.5rem', mb: '1.5rem' }} />
      <ResultSubTitle title={t('hrb.table-trb')} sx={{ margin: '.65rem' }} />
      <HRB_ReferenceTableTRB classification={hrbData.results.classification} sx={{ mt: '3rem' }} />
    </FlexColumnBorder>
  );
};

export default HrbSampleView;
