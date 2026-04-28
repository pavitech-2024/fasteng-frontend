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
      { step: 0, description: t('pm.general.data'), path: 'generalData' },
      { step: 1, description: t('pm.pavement.specific.data'), path: 'step3' },
      { step: 2, description: t('pm.pavement.specific.data'), path: 'step4' },
      { step: 3, description: t('pm.pavement.specific.data'), path: 'step5' },
      { step: 4, description: t('pm.register.resume'), path: 'resume' },
    ],
  };

  store_actions: BinderAsphaltConcreteActions;
  userId: string;

  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as BinderAsphaltConcreteData['generalData']);
          break;
        case 1:
          await this.submitStep3Data(data as BinderAsphaltConcreteData['step3Data']);
          break;
        case 2:
          await this.submitStep4Data(data as BinderAsphaltConcreteData['step4Data']);
          break;
        case 3:
          await this.submitStep5Data(data as BinderAsphaltConcreteData['step5Data']);
          break;
        case 4:
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
    this.store_actions.setData({ step: 0, key: 'generalData', value: generalData });
  };

  submitStep3Data = async (step3Data: BinderAsphaltConcreteData['step3Data']): Promise<void> => {
    this.store_actions.setData({ step: 2, key: 'step3Data', value: step3Data });
  };

  submitStep4Data = async (step4Data: BinderAsphaltConcreteData['step4Data']): Promise<void> => {
    this.store_actions.setData({ step: 3, key: 'step4Data', value: step4Data });
  };

  submitStep5Data = async (step5Data: BinderAsphaltConcreteData['step5Data']): Promise<void> => {
    this.store_actions.setData({ step: 4, key: 'step5Data', value: step5Data });
  };

  saveSample = async (store: BinderAsphaltConcreteData): Promise<void> => {
    const { _id } = store;
    
    const correctIdentification = 
      store.generalData?.identification || 
      store.generalData?.name;
    
    if (!correctIdentification || correctIdentification === '-' || correctIdentification === '---' || correctIdentification === 'null' || correctIdentification === '') {
      throw new Error('❌ Por favor, preencha a IDENTIFICAÇÃO no primeiro passo! O campo "INSTITUIÇÃO + NÚMERO DO TRECHO + TIPO DE EXECUÇÃO + ANO DE IMPLANTAÇÃO" é obrigatório.');
    }
    
    const fixedStore = {
      ...store,
      generalData: {
        ...store.generalData,
        identification: correctIdentification,
        name: correctIdentification,
      }
    };
    
    const replaceNullValues = (data: BinderAsphaltConcreteData): BinderAsphaltConcreteData => {
      const newData = JSON.parse(JSON.stringify(data));
      
      const recursiveReplaceNull = (obj: Record<string, any>) => {
        for (const key in obj) {
          if (key === '_id') continue;
          
          if (key === 'identification' || key === 'name') {
            if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
              obj[key] = correctIdentification;
            }
            continue;
          }
          
          if (obj[key] === null || obj[key] === undefined) {
            obj[key] = '-';
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            recursiveReplaceNull(obj[key]);
          }
        }
      };
      
      recursiveReplaceNull(newData);
      return newData;
    };
    
    const updatedData = replaceNullValues(fixedStore);
    updatedData._id = _id;
    
    const { generalData, step3Data, step4Data, step5Data } = updatedData;
    
    try {
      let response;
      
      if (!_id || _id === '---' || _id === '-') {
        const { _id, ...storeWithoutId } = fixedStore;
        response = await samplesService.saveSample({ 
          ...storeWithoutId, 
          generalData, 
          step3Data, 
          step4Data,
          step5Data 
        });
      } else {
        response = await samplesService.updateSample(_id, { 
          ...fixedStore, 
          generalData, 
          step3Data, 
          step4Data,
          step5Data 
        });
      }
      
      const responseData = response.data;
      
      if (responseData && responseData._id) {
        this.store_actions.setData({ step: 0, key: '_id', value: responseData._id });
        return;
      }
      
      if (responseData.success === false) {
        throw new Error(responseData.error?.message || 'Erro ao salvar');
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