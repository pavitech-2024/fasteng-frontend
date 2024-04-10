import { t } from 'i18next';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import Api from '@/api';
import { UnitMassIcon } from '@/assets';
import {
  BinderAsphaltConcreteActions,
  BinderAsphaltConcreteData,
} from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';

type DataIndex = keyof BinderAsphaltConcreteData;

// Function that replaces all empty inputs for '-';
function replaceNullValues<T extends DataIndex>(data: BinderAsphaltConcreteData[T]): BinderAsphaltConcreteData[T] {
  const newData: BinderAsphaltConcreteData[T] = { ...data };

  for (const key in newData) {
    if (newData[key] === null || newData[key] === undefined) {
      newData[key] = '-' as any;
    }
  }
  return newData;
}

class BINDER_ASPHALT_CONCRETE_SERVICE implements IEssayService {
  info = {
    key: 'binderAsphaltConcrete',
    icon: UnitMassIcon,
    title: t('pm.binder-asphalt-concrete-register'),
    path: '/promedina/binder-asphalt-concrete',
    steps: 4,
    backend_path: 'promedina/binder-asphalt-concrete/binder-asphalt-concrete-samples',
    standard: {
      name: '',
      link: '',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'generalData' },
      { step: 1, description: t('pm.pavement.specific.data'), path: 'step2' },
      { step: 2, description: t('pm.pavement.specific.data'), path: 'step3' },
      { step: 3, description: t('pm.pavement.specific.data'), path: 'step4' },
    ],
  };

  store_actions: BinderAsphaltConcreteActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          true;
          await this.submitGeneralData(data as BinderAsphaltConcreteData['generalData']);
          break;
        case 1:
          true;
          await this.submitStep2Data(data as BinderAsphaltConcreteData['step2Data']);
          break;
        case 2:
          true;
          await this.submitStep3Data(data as BinderAsphaltConcreteData['step3Data']);
          break;
        case 3:
          true;
          await this.submitStep4Data(data as BinderAsphaltConcreteData['step4Data']);
          await this.saveEssay(data as BinderAsphaltConcreteData);
          break;
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };

  submitGeneralData = async (generalData: BinderAsphaltConcreteData['generalData']): Promise<void> => {
    const newData = replaceNullValues(generalData);

    this.store_actions.setData({ step: 0, value: newData });
  };

  submitStep2Data = async (step2Data: BinderAsphaltConcreteData['step2Data']): Promise<void> => {
    const newData = replaceNullValues(step2Data);

    this.store_actions.setData({ step: 1, value: newData });
  };

  submitStep3Data = async (step3Data: BinderAsphaltConcreteData['step3Data']): Promise<void> => {
    const newData = replaceNullValues(step3Data);

    this.store_actions.setData({ step: 2, value: newData });
  };

  submitStep4Data = async (step4Data: BinderAsphaltConcreteData['step4Data']): Promise<void> => {
    const newData = replaceNullValues(step4Data);

    this.store_actions.setData({ step: 3, value: newData });
  };

  // save essay
  saveEssay = async (store: BinderAsphaltConcreteData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/save`, {
        generalData: store.generalData,
        step2Data: store.step2Data,
        step3Data: store.step3Data,
        step4Data: store.step4Data,
      });

      const { success, error } = response.data;

      if (!success) {
        if (error && error.name === 'SampleCreationError') {
          throw new Error(t('pm.binder-asphalt-concrete-register.already-exists-error'));
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

export default BINDER_ASPHALT_CONCRETE_SERVICE;