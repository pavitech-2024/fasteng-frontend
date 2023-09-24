import { PenetrationIcon } from '@/assets';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { PenetrationActions, PenetrationData } from '@/stores/asphalt/penetration/penetration.store';
import { t } from 'i18next';
import Api from '@/api';

class Penetration_SERVICE implements IEssayService {
  info = {
    key: 'penetration-asphalt',
    icon: PenetrationIcon,
    title: t('asphalt.essays.penetration'),
    path: '/asphalt/essays/penetration-asphalt',
    backend_path: 'asphalt/essays/penetration',
    steps: 3,
    standard: {
      name: '',
      link: '',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('penetration-asphalt'), path: 'essay-data' },
      { step: 2, description: t('results'), path: 'results' },
    ],
  };

  store_actions: PenetrationActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as PenetrationData['generalData']);
          break;
        case 1:
          const { penetrationCalc } = data as PenetrationData;
          await this.submitPenetrationCalcData(penetrationCalc);
          await this.calculateResults(data as PenetrationData);
          break;
        case 2:
          await this.saveEssay(data as PenetrationData);
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
  getmaterialsByUserId = async (userId: string): Promise<AsphaltMaterial[]> => {
    try {
      // get all materials from user from backend
      const response = await Api.get(`asphalt/materials/all/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // get essay from material _id
  getPenetrationBymaterialId = async (material_id: string) => {
    try {
      const response = await Api.get(`${this.info.backend_path}/get/${material_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // send general data to backend to verify if there is already a Penetration essay with same name for the material
  submitGeneralData = async (generalData: PenetrationData['generalData']): Promise<void> => {
    try {
      const { name, material } = generalData;

      // verify if name and material are not empty
      if (!name) throw t('errors.empty-name');
      if (!material) throw t('errors.empty-material');

      // verify if there is already a Penetration essay with same name for the material
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name, material });

      const { success, error } = response.data;

      // if there is already a Penetration essay with same name for the material, throw error
      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  /** @Penetration Methods for Penetration page (step === 1, page 2) */

  // verify inputs from Penetration page (step === 1, page 2)
  submitPenetrationCalcData = async (penetrationCalc: PenetrationData['penetrationCalc']): Promise<void> => {
    console.log(
      '🚀 ~ file: penetration.service.ts:101 ~ Penetration_SERVICE ~ submitPenetrationCalcData= ~ penetrationCalc:',
      penetrationCalc
    );
    try {
    } catch (error) {
      throw error;
    }
  };

  // calculate results from penetration essay
  calculateResults = async (store: PenetrationData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-results`, {
        generalData: store.generalData,
        penetrationCalc: store.penetrationCalc,
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
  saveEssay = async (store: PenetrationData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/save-essay`, {
        generalData: {
          ...store.generalData,
          userId: this.userId,
        },
        penetrationCalc: store.penetrationCalc,
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

export default Penetration_SERVICE;
