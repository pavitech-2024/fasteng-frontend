import { t } from 'i18next';
import { IEssayService } from '../../../../interfaces/common/essay/essay-service.interface';
import { HrbIcon } from '@/assets';

class HRB_SERVICE implements IEssayService {
  info = {
    key: 'hrb',
    icon: HrbIcon,
    title: t('soils.essays.hrb'),
    path: '/soils/essays/hrb',
    steps: 3,
    backend_path: 'soils/essays/hrb',
    standard: {
      name: null,
      link: null,
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('hrb.essay-data'), path: 'essay-data' },
      { step: 2, description: t('results'), path: 'results' },
    ],
  };

  store_actions: unknown;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        default:
          console.log(data);
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };
}

export default HRB_SERVICE;
