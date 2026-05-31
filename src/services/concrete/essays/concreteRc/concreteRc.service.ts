import Api from '@/api';
import { ConcreteRcIcon } from '@/assets';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { ConcreteMaterial } from '@/interfaces/concrete';
import { ConcreteRcActions, ConcreteRcData } from '@/stores/concrete/concreteRc/concreteRc.store';
import { t } from 'i18next';

class CONCRETE_RC_SERVICE implements IEssayService {
  info = {
    key: 'concreteRc',
    icon: ConcreteRcIcon,
    title: t('concrete.essays.concreteRc'),
    path: '/concrete/essays/concreteRc',
    backend_path: 'concrete/essays/concreteRc',
    steps: 4,
    standard: {
      name: 'NBR 5739/2018',
      link: '',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('concreteRc.step2'), path: 'essay-data' },
      { step: 2, description: t('concreteRc.step3'), path: 'essay-data' },
      { step: 3, description: t('results'), path: 'results' },
    ],
  };

  store_actions: ConcreteRcActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as ConcreteRcData['generalData']);
          break;
        case 1:
          const { step2Data } = data as ConcreteRcData;
          await this.submitStep2Data(step2Data);
          await this.calculateStep2Data(step2Data);
          break;
        case 2:
          const fullData = data as ConcreteRcData;
          // 🔥 CORREÇÃO: Passa apenas o step3Data
          await this.submitStep3Data(fullData.step3Data);
          await this.calculateResults(fullData);
          break;
        case 3:
          await this.saveEssay(data as ConcreteRcData);
          break;
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };

  /** @generalData Methods for general-data (step === 0, page 1) */

  getmaterialsByUserId = async (userId: string): Promise<ConcreteMaterial[]> => {
    try {
      const response = await Api.get(`/concrete/materials/all/${userId}`);
      
      console.log('📦 Materiais ConcreteRc:', response.data);
      
      if (Array.isArray(response.data)) {
        return response.data;
      }
      if (response.data && response.data[0] && response.data[0].materials) {
        return response.data[0].materials;
      }
      return [];
    } catch (error) {
      console.error('❌ Erro ao buscar materiais:', error);
      throw error;
    }
  };

  getConcreteRcBymaterialId = async (material_id: string) => {
    try {
      const response = await Api.get(`${this.info.backend_path}/get/${material_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  submitGeneralData = async (generalData: ConcreteRcData['generalData']): Promise<void> => {
    try {
      const { name } = generalData;

      if (!name) throw t('errors.empty-name');

      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name });
      const { success, error } = response.data;

      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  /** @step2Data Methods for step2 (step === 1, page 2) */

  submitStep2Data = async (step2Data: ConcreteRcData['step2Data']): Promise<void> => {
    try {
      const { samples } = step2Data;

      if (!samples || samples.length === 0) {
        throw new Error('Nenhuma amostra encontrada');
      }

      samples.forEach((sample, index) => {
        const { diammeter1, diammeter2, height } = sample;
        
        if (!diammeter1 || !diammeter2 || !height) {
          throw new Error(`Amostra ${index + 1}: Dados incompletos`);
        }
        
        const avgDiameter = (diammeter1 + diammeter2) / 2;
        const diammeterHeightRatio = height / avgDiameter;
        
        if (diammeterHeightRatio >= 2.06) {
          throw (
            t(`errors.invalid-diammeter-height-ratio`) +
            ` ${index + 1}.` +
            ` d/h atual = ${diammeterHeightRatio.toFixed(2)}.`
          );
        }
      });
      
      console.log('✅ Step2Data válido');
    } catch (error) {
      throw error;
    }
  };

  calculateStep2Data = async (step2Data: ConcreteRcData['step2Data']): Promise<void> => {
    try {
      console.log('🔍 Calculando step2Data...');
    } catch (error) {
      throw error;
    }
  };

  /** @step3Data Methods for step3 (step === 2, page 3) */

  submitStep3Data = async (step3Data: ConcreteRcData['step3Data']): Promise<void> => {
    try {
      console.log('🔍 Validando step3Data:', step3Data);
      
      if (!step3Data.rupture) {
        throw new Error('Tipo de ruptura não selecionado');
      }
      
      if (!step3Data.rupture.type || !step3Data.rupture.src) {
        throw new Error('Tipo de ruptura incompleto');
      }
      
      if (!step3Data.graphImg) {
        throw new Error('Imagem do gráfico não carregada');
      }
      
      if (!step3Data.graphImg.name || !step3Data.graphImg.src) {
        throw new Error('Imagem do gráfico incompleta');
      }
      
      console.log('✅ Step3Data válido!');
      return;
    } catch (error) {
      console.error('❌ Erro no submitStep3Data:', error);
      throw error;
    }
  };

 calculateResults = async (store: ConcreteRcData): Promise<void> => {
  try {
    console.log('🔍 Calculando resultados...');
    console.log('📦 store.step2Data:', JSON.stringify(store.step2Data, null, 2));
    
    if (!store.step2Data || !store.step2Data.samples) {
      throw new Error('Dados do step2 incompletos');
    }
    
    if (!store.step3Data || !store.step3Data.rupture || !store.step3Data.graphImg) {
      throw new Error('Dados do step3 incompletos');
    }
    
    // 🔥 Formata os samples corretamente
    const formattedSamples = store.step2Data.samples.map((sample, index) => {
      console.log(`📊 Sample ${index}:`, sample);
      
      // Verifica se age existe e tem hours/minutes
      let ageInMinutes = 0;
      if (sample.age && typeof sample.age === 'object') {
        const hours = sample.age.hours || 0;
        const minutes = sample.age.minutes || 0;
        ageInMinutes = (hours * 60) + minutes;
      }
      
      // Verifica se tolerance existe e tem hours/minutes
      let toleranceInMinutes = 0;
      if (sample.tolerance && typeof sample.tolerance === 'object') {
        const hours = sample.tolerance.hours || 0;
        const minutes = sample.tolerance.minutes || 0;
        toleranceInMinutes = (hours * 60) + minutes;
      }
      
      return {
        id: sample.id,
        sampleName: sample.sampleName,
        diammeter1: sample.diammeter1,
        diammeter2: sample.diammeter2,
        height: sample.height,
        age: ageInMinutes,
        tolerance: toleranceInMinutes,
        maximumStrength: sample.maximumStrength,
        appliedCharge: sample.appliedCharge,
        supportDistance: sample.supportDistance
      };
    });

    // 🔥 CORREÇÃO: Envia como objeto com propriedade 'samples', não o array diretamente
    const payload = {
      generalData: store.generalData,
      step2Data: { samples: formattedSamples }, // 👈 Envolve em um objeto com 'samples'
      step3Data: store.step3Data,
    };

    console.log('📤 Enviando para API:', payload);

    const response = await Api.post(`${this.info.backend_path}/calculate-results`, payload);

    console.log('📥 Resposta da API:', response.data);

    const { success, error, result } = response.data;

    if (success === false) throw error.name;

    console.log('✅ Resultados calculados:', result);
    this.store_actions.setData({ step: 3, value: result });
  } catch (error) {
    console.error('❌ Erro no calculateResults:', error);
    throw error;
  }
};
  /** @Results Methods for Results page (step === 3, page 4) */

  saveEssay = async (store: ConcreteRcData): Promise<void> => {
    try {
      console.log('💾 Salvando ensaio...');
      
      const response = await Api.post(`${this.info.backend_path}/save-essay`, {
        generalData: {
          ...store.generalData,
          userId: this.userId,
        },
        step2Data: store.step2Data,
        step3Data: store.step3Data,
        results: store.results,
      });

      const { success, error } = response.data;

      if (success === false) throw error.name;
      
      console.log('✅ Ensaio salvo com sucesso!');
    } catch (error) {
      console.error('❌ Erro no saveEssay:', error);
      throw error;
    }
  };
}

export default CONCRETE_RC_SERVICE;