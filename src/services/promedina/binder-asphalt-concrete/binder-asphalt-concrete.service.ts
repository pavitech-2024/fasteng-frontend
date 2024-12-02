import { t } from 'i18next';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import Api from '@/api';
import { UnitMassIcon } from '@/assets';
import {
  BinderAsphaltConcreteActions,
  BinderAsphaltConcreteData,
} from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';
import samplesService from './binder-asphalt-concrete-view.service';

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
    console.log('🚀 ~ BINDER_ASPHALT_CONCRETE_SERVICE ~ submitGeneralData= ~ generalData:', generalData);
  };

  submitStep2Data = async (step2Data: BinderAsphaltConcreteData['step2Data']): Promise<void> => {
    console.log('🚀 ~ BINDER_ASPHALT_CONCRETE_SERVICE ~ submitStep2Data= ~ step2Data:', step2Data);
  };

  submitStep3Data = async (step3Data: BinderAsphaltConcreteData['step3Data']): Promise<void> => {
    console.log('🚀 ~ BINDER_ASPHALT_CONCRETE_SERVICE ~ submitStep3Data= ~ step3Data:', step3Data);
  };

  submitStep4Data = async (step4Data: BinderAsphaltConcreteData['step4Data']): Promise<void> => {
    console.log('🚀 ~ BINDER_ASPHALT_CONCRETE_SERVICE ~ submitStep4Data= ~ step4Data:', step4Data);
  };

  // save essay
  saveEssay = async (store: BinderAsphaltConcreteData): Promise<void> => {
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

      if (!_id) {
        response = await samplesService.saveSample({ ...store, generalData, step2Data, step3Data });
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
