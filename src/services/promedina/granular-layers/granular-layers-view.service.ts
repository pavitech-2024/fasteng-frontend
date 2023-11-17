import { t } from 'i18next';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { GranularLayersActions, GranularLayersData } from '@/stores/promedina/granular-layers/granular-layers.store';
import { UnitMassIcon } from '@/assets';

class GRANULARLAYERSVIEW_SERVICE implements IEssayService {
  info = {
    key: 'granularLayersView',
    icon: UnitMassIcon,
    title: t('pm.granular-layers-view'),
    path: '/promedina/granular-layers-view',
    steps: 2,
    backend_path: '',
    standard: {
      name: '',
      link: '',
    },
    stepperData: [
      { step: 0, description: t('pm.sample.selection'), path: 'table' }, // Sample selection for data visualization
      { step: 1, description: t('pm.all.data.visualization'), path: 'allData' },
    ],
  };

  store_actions: GranularLayersActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleNext = async (step: number, _data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          true;
          //await this.submitGeneralData(data as GranularLayersData['generalData']);
          break;
        case 1:
          true;
          //await this.submitStep2Data(data as GranularLayersData['step2Data']);
          break;
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };

  submitGeneralData = async (generalData: GranularLayersData['generalData']): Promise<void> => {
    if (generalData) {
      true;
    }
  };

  submitStep2Data = async (step2Data: GranularLayersData['step2Data']): Promise<void> => {
    if (step2Data) {
      true;
    }
  };
}

export default GRANULARLAYERSVIEW_SERVICE;
