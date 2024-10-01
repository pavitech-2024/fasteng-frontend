import Api from '@/api';
import { RtcdIcon } from '@/assets';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { ConcreteMaterial } from '@/interfaces/concrete';
import { ConcreteRtActions, ConcreteRtData } from '@/stores/concrete/concreteRt/concreteRt.store';
import { t } from 'i18next';

class CONCRETE_RT_SERVICE implements IEssayService {
  info = {
    key: 'concreteRt-concrete',
    icon: RtcdIcon,
    title: t('concrete.essays.concreteRt'),
    path: '/concrete/essays/concreteRt',
    backend_path: 'concrete/essays/concreteRt',
    steps: 3,
    standard: {
      name: 'NBR 7217/1984',
      link: 'https://engenhariacivilfsp.files.wordpress.com/2015/03/nbr-7181.pdf',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('concrete.essays.concreteRt.step2Data'), path: 'essay-data' },
      { step: 2, description: t('concrete.essays.concreteRt.step3Data'), path: 'essay-data' },
      { step: 3, description: t('results'), path: 'results' },
    ],
  };

  store_actions: ConcreteRtActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    console.log("🚀 ~ CONCRETE_RT_SERVICE ~ handleNext= ~ data:", data)
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as ConcreteRtData['generalData']);
          break;
        case 1:
          await this.submitConcreteRtStep2Data(data as ConcreteRtData['step2Data']);
          break;
        case 2:
          const { step3Data } = data as ConcreteRtData;
          await this.submitConcreteRtStep3Data(step3Data);
          await this.calculateResults(data as ConcreteRtData);
          break;
        case 3:
          await this.saveEssay(data as ConcreteRtData);
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };

  /** @generalData Methods for general-data (step === 0, page 1) */

  // get all materials from user from backend
  getmaterialsByUserId = async (userId: string): Promise<ConcreteMaterial[]> => {
    try {
      // get all materials from user from backend
      const response = await Api.get(`concrete/materials/all/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // get essay from material _id
  getConcreteRtBymaterialId = async (material_id: string) => {
    try {
      const response = await Api.get(`${this.info.backend_path}/get/${material_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // send general data to backend to verify if there is already a ConcreteRt essay with same name for the material
  submitGeneralData = async (generalData: ConcreteRtData['generalData']): Promise<void> => {
    try {
      const { name, material } = generalData;

      // verify if name and material are not empty
      if (!name) throw t('errors.empty-name');
      if (!material) throw t('errors.empty-material');

      // verify if there is already a ConcreteRt essay with same name for the material
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name, material });

      const { success, error } = response.data;

      // if there is already a ConcreteRt essay with same name for the material, throw error
      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  /** @ConcreteRt Methods for ConcreteRt page (step === 1, page 2) */

  // verify inputs from ConcreteRt page (step === 1, page 2)
  submitConcreteRtStep2Data = async (concreteRtStep2: ConcreteRtData['step2Data']): Promise<void> => {
    try {
      // verify if press_constant is not empty
      if (!concreteRtStep2.pressConstant) throw t('errors.empty-press-constant');
    } catch (error) {
      throw error;
    }
  };

  // verify inputs from ConcreteRt page (step === 1, page 2)
  submitConcreteRtStep3Data = async (concreteRtStep3: ConcreteRtData['step3Data']): Promise<void> => {
    console.log("🚀 ~ CONCRETE_RT_SERVICE ~ submitConcreteRtStep3Data= ~ concreteRtStep3:", concreteRtStep3)
    try {
      // verify if concreteRt_data is not empty
      if (!concreteRtStep3.concreteRt_data) throw t('errors.empty-concreteRt_data');
    } catch (error) {
      throw error;
    }
  };

  // calculate results from ConcreteRt essay
  calculateResults = async (store: ConcreteRtData): Promise<void> => {
    console.log("🚀 ~ CONCRETE_RT_SERVICE ~ calculateResults= ~ store:", store)

    const averageDiammeter = store.step3Data.concreteRt_data.map((e) => e.d1 + e.d2 / 2);

    const heightDiammeterRatio = store.step3Data.concreteRt_data.map((e, idx) => e.height / averageDiammeter[idx]);

    if (heightDiammeterRatio.some((e) => e <= 2.06)) throw t('errors.invalid-height-diammeter-ratio');

    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-results`, {
        generalData: store.generalData,
        step2Data: store.step2Data,
        step3Data: store.step3Data
      });

      const { success, error, result } = response.data;

      if (success === false) throw error.name;

      this.store_actions.setData({ step: 2, value: result });
    } catch (error) {
      throw error;
    }
  };

  /** @Results Methods for Results page (step === 2, page 3) */

  // save essay
  saveEssay = async (store: ConcreteRtData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/save-essay`, {
        generalData: {
          ...store.generalData,
          userId: this.userId,
        },
        step2Data: store.step2Data,
        results: store.results,
      });

      const { success, error } = response.data;

      if (success === false) throw error.name;

      // this.store_actions.reset( { step: null, value: null });
    } catch (error) {
      throw error;
    }
  };
}

export default CONCRETE_RT_SERVICE;
