import { RtfoIcon } from '@/assets';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { RtfoActions, RtfoData } from '@/stores/asphalt/rtfo/rtfo.store';
import { t } from 'i18next';
import Api from '@/api';

class Rtfo_SERVICE implements IEssayService {
  info = {
    key: 'rtfo',
    icon: RtfoIcon,
    title: t('asphalt.essays.rtfo'),
    path: '/asphalt/essays/rtfo',
    backend_path: 'asphalt/essays/rtfo',
    steps: 3,
    standard: {
      name: '',
      link: '',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('asphalt.essays.rtfo'), path: 'essay-data' },
      { step: 2, description: t('results'), path: 'results' },
    ],
  };

  store_actions: RtfoActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as RtfoData['generalData']);
          break;
        case 1:
          const { rtfoCalc } = data as RtfoData;
          await this.submitRtfoCalcData(rtfoCalc);
          await this.calculateResults(data as RtfoData);
          break;
        case 2:
          await this.saveEssay(data as RtfoData);
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
  getRtfoBymaterialId = async (material_id: string) => {
    try {
      const response = await Api.get(`${this.info.backend_path}/get/${material_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // send general data to backend to verify if there is already a Rtfo essay with same name for the material
  submitGeneralData = async (generalData: RtfoData['generalData']): Promise<void> => {
    try {
      const { name, material } = generalData;

      // verify if name and material are not empty
      if (!name) throw t('errors.empty-name');
      if (!material) throw t('errors.empty-material');

      // verify if there is already a Rtfo essay with same name for the material
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name, material });

      const { success, error } = response.data;

      // if there is already a Rtfo essay with same name for the material, throw error
      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  /** @Rtfo Methods for Rtfo page (step === 1, page 2) */

  // verify inputs from Rtfo page (step === 1, page 2)
  submitRtfoCalcData = async (rtfoCalc: RtfoData['rtfoCalc']): Promise<void> => {
    console.log('🚀 ~ file: rtfo.service.ts:101 ~ Rtfo_SERVICE ~ submitRtfoCalcData= ~ rtfoCalc:', rtfoCalc);
    try {
    } catch (error) {
      throw error;
    }
  };

  // calculate results from rtfo essay
  calculateResults = async (store: RtfoData): Promise<void> => {
    const body = {
      generalData: store.generalData,
      rtfo: store.rtfoCalc,
    };
    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-results`, body);

      const { success, error, result } = response.data;
      console.log('🚀 ~ file: rtfo.service.ts:120 ~ Rtfo_SERVICE ~ calculateResults= ~ result:', result);

      if (success === false) throw error.name;

      this.store_actions.setData({ step: 2, value: result });
    } catch (error) {
      throw error;
    }
  };

  /** @Results Methods for Results page (step === 2, page 3) */

  // save essay
  saveEssay = async (store: RtfoData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/save-essay`, {
        generalData: {
          ...store.generalData,
          userId: this.userId,
        },
        rtfoCalc: store.rtfoCalc,
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

export default Rtfo_SERVICE;
