import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { t } from 'i18next';

const SampleDataVisualization = () => {
  return (
    <>
      <FlexColumnBorder title={t('pm.generalData')} open={true} theme={'#07B811'}>
        <span>Dados gerais da amostra</span>
      </FlexColumnBorder>
      <FlexColumnBorder title={t('pm.dataSheet')} open={true} theme={'#07B811'}>
        <span>Ficha técnica</span>
      </FlexColumnBorder>
    </>
  );
};

export default SampleDataVisualization;
