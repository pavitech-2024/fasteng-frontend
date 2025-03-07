import { t } from 'i18next';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { UnitMassIcon } from '@/assets';
import {
  BinderAsphaltConcreteActions,
  BinderAsphaltConcreteData,
} from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';
import samplesService from './binder-asphalt-concrete-view.service';
import concreteBinderAsphaltImage from '../../../assets/pro-medina/concreteBinderAsphalt/concrete-binder-asphalt-image.png';

class BINDER_ASPHALT_CONCRETE_SERVICE implements IEssayService {
  info = {
    key: 'binderAsphaltConcrete',
    icon: concreteBinderAsphaltImage,
    title: t('pm.binder-asphalt-concrete-register'),
    path: '/promedina/binder-asphalt-concrete',
    steps: 5,
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
      { step: 4, description: t('pm.pavement.resume'), path: 'resume' },
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
          break;
        case 4:
          true;
          await this.saveSample(data as BinderAsphaltConcreteData);
          break;
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };

  submitGeneralData = async (generalData: BinderAsphaltConcreteData['generalData']): Promise<void> => {
    // const data = generalData;
    // for (const key in data) {
    //   if (data[key] === null) {
    //     data[key] = '---';
    //   }
    // }
    // this.store_actions.setData({ step: 0, key: 'generalData', value: data });
  };

  submitStep2Data = async (step2Data: BinderAsphaltConcreteData['step2Data']): Promise<void> => {
    // const data = step2Data;
    // for (const key in data) {
    //   if (data[key] === null) {
    //     data[key] = '---';
    //   }
    // }
    // this.store_actions.setData({ step: 1, key: 'step2Data', value: data });
  };

  submitStep3Data = async (step3Data: BinderAsphaltConcreteData['step3Data']): Promise<void> => {
    // const data = step3Data;
    // for (const key in data) {
    //   if (data[key] === null) {
    //     data[key] = '---';
    //   }
    // }
    // this.store_actions.setData({ step: 2, key: 'step3Data', value: data });
  };

  submitStep4Data = async (step4Data: BinderAsphaltConcreteData['step4Data']): Promise<void> => {
    // const data = step4Data;
    // for (const key in data) {
    //   if (data[key] === null) {
    //     data[key] = '---';
    //   }
    // }
    // this.store_actions.setData({ step: 3, key: 'step4Data', value: data });
  };

  // save essay
  saveSample = async (store: BinderAsphaltConcreteData): Promise<void> => {
    const { _id } = store;

    const replaceNullValues = (data: BinderAsphaltConcreteData): BinderAsphaltConcreteData => {
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

    const { generalData, step2Data, step3Data, step4Data } = updatedData;

    try {
      let response;

      if (!_id || _id === '---') {
        const { _id, ...storeWithoutId } = store;
        response = await samplesService.saveSample({ ...storeWithoutId, generalData, step2Data, step3Data, step4Data });
      } else {
        response = await samplesService.updateSample(_id, { ...store, generalData, step2Data, step3Data, step4Data });
      }

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
