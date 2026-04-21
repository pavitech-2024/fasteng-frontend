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
  handleNext = async (step: number, data: unknown): Promise<void> => {
  try {
    switch (step) {
      case 0:
        await this.submitGeneralData(data as BinderAsphaltConcreteData['generalData']);
        break;
      case 1:
        await this.submitStep2Data(data as BinderAsphaltConcreteData['step2Data']);
        break;
      case 2:
        await this.submitStep3Data(data as BinderAsphaltConcreteData['step3Data']);
        break;
      case 3:
        await this.submitStep4Data(data as BinderAsphaltConcreteData['step4Data']);
        break;
      case 4:
        // 🔥 SALVA E NÃO LANÇA ERRO
        await this.saveSample(data as BinderAsphaltConcreteData);
        break;
      default:
        throw t('errors.invalid-step');
    }
  } catch (error) {
    console.error('Erro no handleNext:', error);
    throw error;
  }
};

  submitGeneralData = async (generalData: BinderAsphaltConcreteData['generalData']): Promise<void> => {
    // Apenas atualiza o store, não salva no backend
    this.store_actions.setData({ step: 0, key: 'generalData', value: generalData });
  };

  submitStep2Data = async (step2Data: BinderAsphaltConcreteData['step2Data']): Promise<void> => {
    this.store_actions.setData({ step: 1, key: 'step2Data', value: step2Data });
  };

  submitStep3Data = async (step3Data: BinderAsphaltConcreteData['step3Data']): Promise<void> => {
    this.store_actions.setData({ step: 2, key: 'step3Data', value: step3Data });
  };

  submitStep4Data = async (step4Data: BinderAsphaltConcreteData['step4Data']): Promise<void> => {
    this.store_actions.setData({ step: 3, key: 'step4Data', value: step4Data });
  };

  // save essay
 saveSample = async (store: BinderAsphaltConcreteData): Promise<void> => {
  const { _id } = store;
  
  // Garante que generalData.name tenha o valor da identificação
  const fixedStore = {
    ...store,
    generalData: {
      ...store.generalData,
      name: store.step2Data?.identification || store.generalData?.name || `Amostra_${Date.now()}`
    }
  };
  
  console.log('=== SAVE SAMPLE ===');
  console.log('ID:', _id);
  console.log('Identification:', fixedStore.step2Data?.identification);
  console.log('Name:', fixedStore.generalData?.name);

  const replaceNullValues = (data: BinderAsphaltConcreteData): BinderAsphaltConcreteData => {
    const newData = { ...data };
    const recursiveReplaceNull = (obj: Record<string, any>) => {
      for (const key in obj) {
        if (key === '_id') continue;
        
        if (obj[key] === null) {
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
  
  const { generalData, step2Data, step3Data, step4Data, step5Data } = updatedData;

  try {
    let response;
    let savedId = _id;

    if (!_id || _id === '---' || _id === '-') {
      console.log('CRIANDO nova amostra');
      const { _id, ...storeWithoutId } = fixedStore;
      response = await samplesService.saveSample({ 
        ...storeWithoutId, 
        generalData, 
        step2Data, 
        step3Data, 
        step4Data,
        step5Data 
      });
    } else {
      console.log('ATUALIZANDO amostra existente:', _id);
      response = await samplesService.updateSample(_id, { 
        ...fixedStore, 
        generalData, 
        step2Data, 
        step3Data, 
        step4Data,
        step5Data 
      });
    }

    console.log('Resposta do backend:', response.data);

    // 🔥 CORREÇÃO: Verifica se a resposta tem _id (criado/atualizado com sucesso)
    const responseData = response.data;
    
    // Se a resposta tem _id, significa que salvou com sucesso
    if (responseData && responseData._id) {
      console.log('✅ Salvo com sucesso! ID:', responseData._id);
      
      // Atualiza o store com o _id retornado
      this.store_actions.setData({ step: 0, key: '_id', value: responseData._id });
      
      // Sucesso! Não lança erro
      return;
    }
    
    // Se tem success: false, é erro
    if (responseData.success === false) {
      console.log('Erro do backend:', responseData.error);
      throw new Error(responseData.error?.message || 'Erro ao salvar');
    }
    
    // Se chegou aqui e não tem _id nem success, algo está errado
    if (!responseData._id && responseData.success !== false) {
      console.warn('Resposta inesperada do backend:', responseData);
      // Se criou mas veio sem _id, tenta pegar de outro lugar
      if (responseData.data?._id) {
        this.store_actions.setData({ step: 0, key: '_id', value: responseData.data._id });
        return;
      }
      throw new Error('Resposta inválida do servidor');
    }
    
  } catch (error) {
    console.error('Erro no saveSample:', error);
    
    if (error.response?.status === 413) {
      throw new Error(t('pm.register.payload-too-large-error'));
    }
    
    throw error;
  }
};
}

export default BINDER_ASPHALT_CONCRETE_SERVICE;