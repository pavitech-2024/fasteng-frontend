import { t } from 'i18next';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import Api from '@/api';
import { GranularLayersActions, GranularLayersData } from '@/stores/promedina/granular-layers/granular-layers.store';
import { UnitMassIcon } from '@/assets';

class GRANULARLAYERS_SERVICE implements IEssayService {
  info = {
    key: 'granularLayers',
    icon: UnitMassIcon,
    title: t('pm.granular-layers-register'),
    path: '/promedina/granular-layers',
    steps: 3,
    backend_path: '',
    standard: {
      name: '',
      link: ''
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'generalData' },
      { step: 1, description: t('pm.pavement.specific.data'), path: 'step2' },
      { step: 2, description: t('pm.pavement.specific.data'), path: 'step3' },
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
          //await this.submitGeneralData(data as GranularLayersData);
          break;
        // case 1:
        //   await this.submitStep2Data(data as CbrData['step2Data']);
        //   break;
        // case 2:
        //   await this.submitStep3Data(data as CbrData['step3Data']);
        //   await this.saveEssay(data as CbrData);
        //   break;
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };

  submitGeneralData = async (generalData: GranularLayersData['generalData']): Promise<void> => {
    try {
      const { name, zone, layer, cityState, observations } = generalData;

      if (!name) throw t('errors.empty-name');
      if (!zone) throw t('errors.empty-zone');
      if (!layer) throw t('errors.empty-layer');
      if (!cityState) throw t('errors.empty-cityState');


      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name, zone, layer, cityState, observations });

      const { success, error } = response.data;

      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };
  
  // save essay
  saveEssay = async (store: GranularLayersData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/save-essay`, {
        generalData: {
          ...store.generalData,
          userId: this.userId,
        },
        // step2Data: store.step2Data,
        // step3Data: store.step3Data
      });

      const { success, error } = response.data;

      console.log(error);

      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };
}

export default GRANULARLAYERS_SERVICE;
