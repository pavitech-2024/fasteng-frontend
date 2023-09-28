import { AbrasionIcon } from "@/assets";
import { AsphaltMaterial } from "@/interfaces/asphalt";
import { IEssayService } from "@/interfaces/common/essay/essay-service.interface";
import { t } from "i18next";
import Api from '@/api';
import { AbrasionActions, AbrasionData } from "@/stores/asphalt/abrasion.store";

class Abrasion_SERVICE implements IEssayService {
  info = {
    key: 'abrasion',
    icon: AbrasionIcon,
    title: t('asphalt.essays.abrasion'),
    path: '/asphalt/essays/abrasion',
    backend_path: 'asphalt/essays/abrasion',
    steps: 3,
    standard: {
      name: '',
      link: '',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('asphalt.essays.abrasion-asphalt'), path: 'essay-data' },
      { step: 2, description: t('results'), path: 'results' },
    ],
  };

  store_actions: AbrasionActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as AbrasionData['generalData']);
          break;
        case 1:
          const { abrasionCalc } = data as AbrasionData;
          await this.submitAbrasionCalcData(abrasionCalc);
          await this.calculateResults(data as AbrasionData);
          break;
        case 2:
          await this.saveEssay(data as AbrasionData);
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
  getAbrasionBymaterialId = async (material_id: string) => {
    try {
      const response = await Api.get(`${this.info.backend_path}/get/${material_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // send general data to backend to verify if there is already a Abrasion essay with same name for the material
  submitGeneralData = async (generalData: AbrasionData['generalData']): Promise<void> => {
    try {
      const { name, material } = generalData;

      // verify if name and material are not empty
      if (!name) throw t('errors.empty-name');
      if (!material) throw t('errors.empty-material');

      // verify if there is already a Abrasion essay with same name for the material
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name, material });

      const { success, error } = response.data;

      // if there is already a Abrasion essay with same name for the material, throw error
      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  /** @Abrasion Methods for Abrasion page (step === 1, page 2) */

  // verify inputs from Abrasion page (step === 1, page 2)
  submitAbrasionCalcData = async (abrasionCalc: AbrasionData['abrasionCalc']): Promise<void> => {
    console.log(
      '🚀 ~ file: abrasion.service.ts:101 ~ Abrasion_SERVICE ~ submitAbrasionCalcData= ~ abrasionCalc:',
      abrasionCalc
    );
    try {
    } catch (error) {
      throw error;
    }
  };

  // calculate results from abrasion essay
  calculateResults = async (store: AbrasionData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-results`, {
        generalData: store.generalData,
        abrasionCalc: store.abrasionCalc,
      });

      const { success, error, result } = response.data;
      console.log('🚀 ~ file: abrasion.service.ts:120 ~ Abrasion_SERVICE ~ calculateResults= ~ result:', result);

      if (success === false) throw error.name;

      this.store_actions.setData({ step: 2, value: result });
    } catch (error) {
      throw error;
    }
  };

  /** @Results Methods for Results page (step === 2, page 3) */

  // save essay
  saveEssay = async (store: AbrasionData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/save-essay`, {
        generalData: {
          ...store.generalData,
          userId: this.userId,
        },
        abrasionCalc: store.abrasionCalc,
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

export default Abrasion_SERVICE;