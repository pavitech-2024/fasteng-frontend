import { t } from 'i18next';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import Api from '@/api';
import {
  StabilizedLayersActions,
  StabilizedLayersData,
} from '@/stores/promedina/stabilized-layers/stabilized-layers.store';
import { UnitMassIcon } from '@/assets';

type DataIndex = keyof StabilizedLayersData;

// Function that replaces all empty inputs for '-';
// function replaceNullValues<T extends DataIndex>(data: StabilizedLayersData[T]): StabilizedLayersData[T] {
//   const newData: StabilizedLayersData[T] = { ...data };

//   for (const key in newData) {
//     if (newData[key] === null || newData[key] === undefined) {
//       newData[key] = '-' as any;
//     }
//   }
//   return newData;
// }

class STABILIZEDLAYERS_SERVICE implements IEssayService {
  info = {
    key: 'stabilized-layers',
    icon: UnitMassIcon,
    title: t('pm.stabilized-layers-register'),
    path: '/promedina/stabilized-layers',
    steps: 3,
    backend_path: 'promedina/stabilized-layers/stabilized-layers-samples',
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

  store_actions: StabilizedLayersActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as StabilizedLayersData['generalData']);
          break;
        case 1:
          await this.submitStep2Data(data as StabilizedLayersData['step2Data']);
          break;
        case 2:
          await this.submitStep3Data(data as StabilizedLayersData['step3Data']);
          await this.saveSample(data as StabilizedLayersData);
          break;
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };

  submitGeneralData = async (generalData: StabilizedLayersData['generalData']): Promise<void> => {
  };

  submitStep2Data = async (step2Data: StabilizedLayersData['step2Data']): Promise<void> => {
  };

  submitStep3Data = async (step3Data: StabilizedLayersData['step3Data']): Promise<void> => {
  };

  // save essay
  saveSample = async (store: StabilizedLayersData): Promise<void> => {
    const replaceNullValues = (data: StabilizedLayersData): StabilizedLayersData => {
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

export default STABILIZEDLAYERS_SERVICE;
