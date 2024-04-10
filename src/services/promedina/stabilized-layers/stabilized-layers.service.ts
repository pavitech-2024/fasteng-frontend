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
function replaceNullValues<T extends DataIndex>(data: StabilizedLayersData[T]): StabilizedLayersData[T] {
  const newData: StabilizedLayersData[T] = { ...data };

  for (const key in newData) {
    if (newData[key] === null || newData[key] === undefined) {
      newData[key] = '-' as any;
    }
  }
  return newData;
}

class STABILIZEDLAYERS_SERVICE implements IEssayService {
  info = {
    key: 'stabilizedLayers',
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
    const newData = replaceNullValues(generalData);

    this.store_actions.setData({ step: 0, value: newData });
  };

  submitStep2Data = async (step2Data: StabilizedLayersData['step2Data']): Promise<void> => {
    const newData = replaceNullValues(step2Data);

    this.store_actions.setData({ step: 1, value: newData });
  };

  submitStep3Data = async (step3Data: StabilizedLayersData['step3Data']): Promise<void> => {
    const newData = replaceNullValues(step3Data);

    this.store_actions.setData({ step: 2, value: newData });
  };

  // save essay
  saveSample = async (store: StabilizedLayersData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/save`, {
        generalData: store.generalData,
        step2Data: store.step2Data,
        step3Data: store.step3Data,
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
