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
          await this.calculateResults(data as ConcreteRcData);
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

  // get all materials from user from backend
  getmaterialsByUserId = async (userId: string): Promise<ConcreteMaterial> => {
    try {
      // get all materials from user from backend
      const response = await Api.get(`concrete/materials/all/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // get essay from material _id
  getConcreteRcBymaterialId = async (material_id: string) => {
    try {
      const response = await Api.get(`${this.info.backend_path}/get/${material_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // send general data to backend to verify if there is already a ConcreteRc essay with same name for the material
  submitGeneralData = async (generalData: ConcreteRcData['generalData']): Promise<void> => {
    try {
      const { name } = generalData;

      // verify if there is already a ConcreteRc essay with same name
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name });
      const { success, error } = response.data;

      // if there is already a ConcreteRc essay with same name, throw error
      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  /** @ConcreteRc Methods for ConcreteRc page (step === 1, page 2) */

  // verify inputs from ConcreteRc page (step === 1, page 2)
  submitStep2Data = async (step2Data: ConcreteRcData['step2Data']): Promise<void> => {
    try {
      const { samples } = step2Data;

      samples.forEach((sample, index) => {
        const { diammeter1, diammeter2, height } = sample;
        const diammeterHeightRatio = height / (diammeter1 + diammeter2 / 2);
        if (diammeterHeightRatio >= 2.06) {
          throw (
            t(`errors.invalid-diammeter-height-ratio`) +
            ` ${index + 1}.` +
            ` d/h atual = ${diammeterHeightRatio.toFixed(2)}.`
          );
        }
      });
    } catch (error) {
      throw error;
    }
  };

  // verify inputs from ConcreteRc page (step === 1, page 2)
  calculateStep2Data = async (step2Data: ConcreteRcData['step2Data']): Promise<void> => {
    try {
    } catch (error) {
      throw error;
    }
  };

  // calculate results from ConcreteRc essay
  calculateResults = async (store: ConcreteRcData): Promise<void> => {
    try {
      const formattedSamples = store.step2Data.samples.map((sample) => ({
        ...sample,
        age: sample.age.hours * 60 + sample.age.minutes,
        tolerance: sample.tolerance.hours * 60 + sample.tolerance.minutes,
      }));

      const response = await Api.post(`${this.info.backend_path}/calculate-results`, {
        generalData: store.generalData,
        step2Data: formattedSamples,
        step3Data: store.step3Data,
      });

      const { success, error, result } = response.data;

      if (success === false) throw error.name;

      this.store_actions.setData({ step: 3, value: result });
    } catch (error) {
      throw error;
    }
  };

  /** @Results Methods for Results page (step === 2, page 3) */

  // save essay
  saveEssay = async (store: ConcreteRcData): Promise<void> => {
    try {
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
    } catch (error) {
      throw error;
    }
  };
}

export default CONCRETE_RC_SERVICE;
