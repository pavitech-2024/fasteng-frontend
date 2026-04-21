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
    steps: 6,
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
      { step: 4, description: t('pm.pavement.specific.data'), path: 'step5' },
      { step: 5, description: t('pm.pavement.resume'), path: 'resume' },
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
          await this.submitStep2Data(data as BinderAsphaltConcreteData['step2Data']);
          break;
        case 2:
          await this.submitStep3Data(data as BinderAsphaltConcreteData['step3Data']);
          break;
        case 3:
          await this.submitStep4Data(data as BinderAsphaltConcreteData['step4Data']);
          break;
        case 4:
          await this.submitStep5Data(data as BinderAsphaltConcreteData['step5Data']);
          break;
        case 5:
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

  submitStep2Data = async (step2Data: BinderAsphaltConcreteData['step2Data']): Promise<void> => {
    this.store_actions.setData({ step: 1, key: 'step2Data', value: step2Data });
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
    
    // 🔥 PRIORIDADE 1: generalData.identification (do step1)
    // 🔥 PRIORIDADE 2: step2Data.identification
    // 🔥 PRIORIDADE 3: generalData.name
    const correctIdentification = 
      store.generalData?.identification || 
      store.step2Data?.identification || 
      store.generalData?.name;
    
    console.log('=== SAVE SAMPLE ===');
    console.log('ID:', _id);
    console.log('✅ Identificação encontrada:', correctIdentification);
    
    // 🔥 VALIDAÇÃO OBRIGATÓRIA
    if (!correctIdentification || correctIdentification === '-' || correctIdentification === '---' || correctIdentification === 'null' || correctIdentification === '') {
      throw new Error('❌ Por favor, preencha a IDENTIFICAÇÃO no primeiro passo! O campo "INSTITUIÇÃO + NÚMERO DO TRECHO + TIPO DE EXECUÇÃO + ANO DE IMPLANTAÇÃO" é obrigatório.');
    }
    
    // 🔥 FORÇA o valor correto em TODOS os lugares
    const fixedStore = {
      ...store,
      generalData: {
        ...store.generalData,
        identification: correctIdentification,
        name: correctIdentification,
      },
      step2Data: {
        ...store.step2Data,
        identification: correctIdentification,
      }
    };
    
    console.log('📝 Dados fixados:', {
      generalData_name: fixedStore.generalData?.name,
      generalData_identification: fixedStore.generalData?.identification,
      step2Data_identification: fixedStore.step2Data?.identification
    });
    
    // 🔥 Substitui null por '-', mas NUNCA nos campos de identificação
    const replaceNullValues = (data: BinderAsphaltConcreteData): BinderAsphaltConcreteData => {
      const newData = JSON.parse(JSON.stringify(data));
      
      const recursiveReplaceNull = (obj: Record<string, any>) => {
        for (const key in obj) {
          if (key === '_id') continue;
          
          // 🔥 PULA campos de identificação - eles NUNCA devem virar "-"
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
    
    const { generalData, step2Data, step3Data, step4Data, step5Data } = updatedData;
    
    console.log('🚀 Enviando para o backend:', {
      generalData_name: generalData?.name,
      step2Data_identification: step2Data?.identification
    });
    
    try {
      let response;
      
      if (!_id || _id === '---' || _id === '-') {
        console.log('📦 CRIANDO nova amostra com nome:', generalData?.name);
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
        console.log('✏️ ATUALIZANDO amostra existente:', _id);
        response = await samplesService.updateSample(_id, { 
          ...fixedStore, 
          generalData, 
          step2Data, 
          step3Data, 
          step4Data,
          step5Data 
        });
      }
      
      console.log('📨 Resposta do backend:', response.data);
      
      const responseData = response.data;
      
      if (responseData && responseData._id) {
        console.log('✅ Salvo com sucesso! ID:', responseData._id);
        this.store_actions.setData({ step: 0, key: '_id', value: responseData._id });
        return;
      }
      
      if (responseData.success === false) {
        console.log('❌ Erro do backend:', responseData.error);
        throw new Error(responseData.error?.message || 'Erro ao salvar');
      }
      
      if (!responseData._id && responseData.success !== false) {
        console.warn('⚠️ Resposta inesperada do backend:', responseData);
        if (responseData.data?._id) {
          this.store_actions.setData({ step: 0, key: '_id', value: responseData.data._id });
          return;
        }
        throw new Error('Resposta inválida do servidor');
      }
      
    } catch (error) {
      console.error('💥 Erro no saveSample:', error);
      
      if (error.response?.status === 413) {
        throw new Error(t('pm.register.payload-too-large-error'));
      }
      
      throw error;
    }
  };
}

export default BINDER_ASPHALT_CONCRETE_SERVICE;