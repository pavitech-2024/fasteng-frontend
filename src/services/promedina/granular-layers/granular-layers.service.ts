import Api from '@/api';
import { UnitMassIcon } from '@/assets';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { GranularLayersActions, GranularLayersData } from '@/stores/promedina/granular-layers/granular-layers.store';
import { t } from 'i18next';

class GRANULARLAYERS_SERVICE implements IEssayService {
  info = {
    key: 'granularLayers',
    icon: UnitMassIcon,
    title: t('pm.granular-layers-register'),
    path: '/promedina/granular-layers',
    steps: 3,
    backend_path: 'promedina/granular-layers/granular-layers-samples',
    standard: {
      name: '',
      link: '',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'generalData' },
      { step: 1, description: t('pm.pavement.specific.data'), path: 'step2' },
      { step: 2, description: t('pm.pavement.specific.data'), path: 'step3' },
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
    console.log('🚀 ~ GRANULARLAYERS_SERVICE ~ submitGeneralData= ~ generalData:', generalData);
  };

  submitStep2Data = async (step2Data: GranularLayersData['step2Data']): Promise<void> => {
    console.log('🚀 ~ GRANULARLAYERS_SERVICE ~ submitStep2Data= ~ step2Data:', step2Data);
  };

  submitStep3Data = async (step3Data: GranularLayersData['step3Data']): Promise<void> => {
    console.log('🚀 ~ GRANULARLAYERS_SERVICE ~ submitStep3Data= ~ step3Data:', step3Data);
  };

  // save essay
  saveSample = async (store: GranularLayersData): Promise<void> => {
    const replaceNullValues = (data: GranularLayersData): GranularLayersData => {
      const newData = { ...data };

      // Função para percorrer recursivamente todas as propriedades do objeto
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
    console.log(updatedData);

    const { generalData, step2Data, step3Data } = updatedData;

    try {
      const response = await Api.post(`${this.info.backend_path}/save`, {
        generalData,
        step2Data,
        step3Data,
      });

      const { success, error } = response.data;

      if (!success) {
        if (error && error.name === 'SampleCreationError') {
          throw new Error(t('pm.register.already-exists-error'));
        }
      }
    } catch (error) {
      if (error.response?.status === 413) {
        throw new Error(t('pm.register.payload-too-large-error'));
      }

      throw error;
    }
  };
}
export default GRANULARLAYERS_SERVICE;
