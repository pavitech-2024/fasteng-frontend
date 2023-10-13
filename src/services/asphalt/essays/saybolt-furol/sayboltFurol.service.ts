import Api from '@/api';
import { SayboltFurolIcon } from '@/assets';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { SayboltFurolActions, SayboltFurolData } from '@/stores/asphalt/sayboltFurol/sayboltFurol.store';
import { t } from 'i18next';

class SayboltFurol_SERVICE implements IEssayService {
  info = {
    key: 'saybolt-furol',
    icon: SayboltFurolIcon,
    title: t('asphalt.essays.saybolt'),
    path: '/asphalt/essays/saybolt',
    backend_path: 'asphalt/essays/sayboltFurol',
    steps: 3,
    standard: {
      name: '',
      link: '',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('asphalt.essays.saybolt'), path: 'essay-data' },
      { step: 2, description: t('results'), path: 'results' },
    ],
  };

  store_actions: SayboltFurolActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as SayboltFurolData['generalData']);
          break;
        case 1:
          const { sayboltFurolCalc } = data as SayboltFurolData;
          await this.submitSayboltFurolCalcData(sayboltFurolCalc);
          await this.calculateResults(data as SayboltFurolData);
          break;
        case 2:
          await this.saveEssay(data as SayboltFurolData);
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
  getSayboltFurolBymaterialId = async (material_id: string) => {
    try {
      const response = await Api.get(`${this.info.backend_path}/get/${material_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // send general data to backend to verify if there is already a SayboltFurol essay with same name for the material
  submitGeneralData = async (generalData: SayboltFurolData['generalData']): Promise<void> => {
    try {
      const { name, material } = generalData;

      // verify if name and material are not empty
      if (!name) throw t('errors.empty-name');
      if (!material) throw t('errors.empty-material');

      // verify if there is already a SayboltFurol essay with same name for the material
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name, material });

      const { success, error } = response.data;

      // if there is already a SayboltFurol essay with same name for the material, throw error
      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  /** @SayboltFurol Methods for SayboltFurol page (step === 1, page 2) */

  // verify inputs from SayboltFurol page (step === 1, page 2)
  submitSayboltFurolCalcData = async (sayboltFurolCalc: SayboltFurolData['sayboltFurolCalc']): Promise<void> => {
    console.log(
      '🚀 ~ file: sayboltFurol.service.ts:101 ~ SayboltFurol_SERVICE ~ submitSayboltFurolCalcData= ~ sayboltFurolCalc:',
      sayboltFurolCalc
    );
    try {
    } catch (error) {
      throw error;
    }
  };

  // calculate results from sayboltFurol essay
  calculateResults = async (store: SayboltFurolData): Promise<void> => {
    const body = {
      generalData: store.generalData,
      sayboltFurol: store.sayboltFurolCalc,
    };
    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-results`, body);

      const { success, error, result } = response.data;
      console.log(
        '🚀 ~ file: sayboltFurol.service.ts:120 ~ SayboltFurol_SERVICE ~ calculateResults= ~ result:',
        result
      );

      if (success === false) throw error.name;

      this.store_actions.setData({ step: 2, value: result });
    } catch (error) {
      throw error;
    }
  };

  /** @Results Methods for Results page (step === 2, page 3) */

  // save essay
  saveEssay = async (store: SayboltFurolData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/save-essay`, {
        generalData: {
          ...store.generalData,
          userId: this.userId,
        },
        sayboltFurolCalc: store.sayboltFurolCalc,
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

export default SayboltFurol_SERVICE;
