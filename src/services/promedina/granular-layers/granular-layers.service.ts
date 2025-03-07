import { UnitMassIcon } from '@/assets';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { GranularLayersActions, GranularLayersData } from '@/stores/promedina/granular-layers/granular-layers.store';
import { t } from 'i18next';
import samplesService from './granular-layers-view.service';
import granularLayersImage from '../../../assets/pro-medina/granularLayers/granular-layers-image.png';

class GRANULARLAYERS_SERVICE implements IEssayService {
  info = {
    key: 'granularLayers',
    icon: granularLayersImage,
    title: t('pm.granular-layers-register'),
    path: '/promedina/granular-layers',
    steps: 4,
    backend_path: 'promedina/granular-layers/granular-layers-samples',
    standard: {
      name: '',
      link: '',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'generalData' },
      { step: 1, description: t('pm.pavement.specific.data'), path: 'step2' },
      { step: 2, description: t('pm.pavement.specific.data'), path: 'step3' },
      { step: 3, description: t('pm.register.resume'), path: 'resume' },
    ],
  };

  store_actions: GranularLayersActions;
  userId: string;

  //   /** @handleNext Receives the step and data from the form and calls the respective method */
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as GranularLayersData['generalData']);
          break;
        case 1:
          await this.submitStep2Data(data as GranularLayersData['step2Data']);
          break;
        case 2:
          await this.submitStep3Data(data as GranularLayersData['step3Data']);
          break;
        case 3:
          await this.saveSample(data as GranularLayersData);
          break;
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };

  submitGeneralData = async (generalData: GranularLayersData['generalData']): Promise<void> => {
    // const data = generalData;
    // for (const key in data) {
    //   if (data[key] === null) {
    //     data[key] = '---';
    //   }
    // }
    // this.store_actions.setData({ step: 0, key: 'generalData', value: data });
  };

  submitStep2Data = async (step2Data: GranularLayersData['step2Data']): Promise<void> => {
    // const data = step2Data;
    // for (const key in data) {
    //   if (data[key] === null) {
    //     data[key] = '---';
    //   }
    // }
    // this.store_actions.setData({ step: 1, key: 'step2Data', value: data });
  };

  submitStep3Data = async (step3Data: GranularLayersData['step3Data']): Promise<void> => {
    // const data = step3Data;
    // for (const key in data) {
    //   if (data[key] === null) {
    //     data[key] = '---';
    //   }
    // }
    // this.store_actions.setData({ step: 2, key: 'step3Data', value: data });
  };

  // save essay
  saveSample = async (store: GranularLayersData): Promise<void> => {
    const { _id } = store;

    const replaceNullValues = (data: GranularLayersData): GranularLayersData => {
      const newData = { ...data };

      // Função para inserir '-' em todos os inputs que ficaram vazios;
      const recursiveReplaceNull = (obj: Record<string, any>) => {
        for (const key in obj) {
          if (obj[key] === null) {
            obj[key] = '-';
          } else if (typeof obj[key] === 'object') {
            recursiveReplaceNull(obj[key]);
          }
        }
      };

      recursiveReplaceNull(newData);
      return newData;
    };

    const updatedData = replaceNullValues(store);

    const { generalData, step2Data, step3Data } = updatedData;

    try {
      let response;

      if (!_id || _id === '---') {
        const { _id, ...storeWithoutId } = store;
        response = await samplesService.saveSample({ ...storeWithoutId, generalData, step2Data, step3Data });
      } else {
        response = await samplesService.updateSample(_id, { ...store, generalData, step2Data, step3Data });
      }

      const { success, error } = response.data;

      if (!success) {
        if (error && error.name === 'SampleCreationError') {
          throw new Error(t('pm.register.already-exists-error'));
        }
      }
    } catch (error) {
      console.log('🚀 ~ GRANULARLAYERS_SERVICE ~ saveSample= ~ error:', error);
      if (error.response?.status === 413) {
        throw new Error(t('pm.register.payload-too-large-error'));
      }

      throw error;
    }
  };
}
export default GRANULARLAYERS_SERVICE;
