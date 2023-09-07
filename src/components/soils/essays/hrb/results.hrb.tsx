import React from 'react';
import { EssayPageProps } from '../../../templates/essay';
import useHrbStore from '@/stores/soils/hrb/hrb.store';
import useAuth from '@/contexts/auth';
import ExperimentResume from '../../../molecules/boxes/experiment-resume';
import FlexColumnBorder from '../../../atoms/containers/flex-column-with-border';
import { t } from 'i18next';
import Result_Card, { Result_CardContainer } from '../../../atoms/containers/result-card';
import ResultSubTitle from '../../../atoms/titles/result-sub-title';
import { Typography } from '@mui/material';
import { HRB_ReferenceTableCBR, HRB_ReferenceTableTRB } from './tables/hrb-reference-table.hrb';

const HRB_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);

  const { results: hrb_results, generalData, step2Data } = useHrbStore();
  const { user } = useAuth();

  // pegando a quantidade de casas decimais do usuário
  const {
    preferences: { decimal: user_decimal },
  } = user;

  const experimentResumeData = {
    experimentName: generalData.name,
    materials: [{ name: generalData.sample.name, type: generalData.sample.type }],
  };

  const data = {
    // container "Another Data"
    container_another_data: [],
  };

  if (hrb_results) {
    data.container_another_data.push(
      {
        label: t('hrb.liquidity_limit'),
        value: step2Data.liquidity_limit.toFixed(user_decimal),
        unity: '%',
      },
      {
        label: t('hrb.plasticity_limit'),
        value: step2Data.plasticity_limit.toFixed(user_decimal),
        unity: '%',
      },
      {
        label: t('hrb.plasticity_index'),
        value: hrb_results.plasticity_index.toFixed(user_decimal),
        unity: '%',
      },
      {
        label: t('hrb.group_index'),
        value: hrb_results.group_index,
        unity: '',
      }
    );
  }

  return (
    <>
      <ExperimentResume data={experimentResumeData} />
      <FlexColumnBorder title={t('results')} open={true}>
        <ResultSubTitle title={t('hrb.classification') + ': ' + hrb_results.classification} sx={{ margin: '.65rem' }} />
        <Typography
          variant="body1"
          sx={{ margin: '.65rem', mb: '2rem', fontWeight: '500', textAlign: 'justify', lineHeight: '1.2rem' }}
        >
          {t(`hrb.text-${hrb_results.classification}`)}
        </Typography>
        <Result_CardContainer hideBorder title={t('hrb.another-data')} mt="none">
          {data.container_another_data.map((item, index) => (
            <Result_Card key={index} label={item.label} value={item.value} unity={item.unity} />
          ))}
        </Result_CardContainer>
        <ResultSubTitle title={t('hrb.table-cbr')} sx={{ margin: '.65rem' }} />
        <HRB_ReferenceTableCBR classification={hrb_results.classification} sx={{ mt: '1.5rem', mb: '1.5rem' }} />
        <ResultSubTitle title={t('hrb.table-trb')} sx={{ margin: '.65rem' }} />
        <HRB_ReferenceTableTRB classification={hrb_results.classification} sx={{ mt: '3rem' }} />
      </FlexColumnBorder>
    </>
  );
};

export default HRB_Results;
