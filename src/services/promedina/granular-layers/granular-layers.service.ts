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
    steps: 3,
    backend_path: 'promedina/granular-layers/granular-layers-samples',
    standard: {
      name: '',
      link: '',
    },
    stepperData: [
      { step: 0, description: t('pm.general.data'), path: 'generalData' },
      { step: 1, description: t('pm.pavement.specific.data'), path: 'step2' },
      { step: 2, description: t('pm.register.resume'), path: 'resume' },
    ],
  };

  store_actions: GranularLayersActions;
  userId: string;

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
    // Dados salvos no store automaticamente
  };

  submitStep2Data = async (step2Data: GranularLayersData['step2Data']): Promise<void> => {
    // Dados salvos no store automaticamente
  };

  saveSample = async (store: GranularLayersData): Promise<void> => {
    const { _id } = store;

    const replaceNullValues = (data: GranularLayersData): GranularLayersData => {
      const newData = { ...data };

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

    const { generalData, step2Data } = updatedData;

    try {
      let response;

      if (!_id || _id === '---') {
        const { _id, ...storeWithoutId } = store;
        response = await samplesService.saveSample({ ...storeWithoutId, generalData, step2Data });
      } else {
        response = await samplesService.updateSample(_id, { ...store, generalData, step2Data });
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