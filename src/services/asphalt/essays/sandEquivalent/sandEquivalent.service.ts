import { SandEquivalentIcon } from '@/assets';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { SandEquivalentActions, SandEquivalentData } from '@/stores/asphalt/sandEquivalent/sandEquivalent.store';
import { t } from 'i18next';
import Api from '@/api';

class SandEquivalent_SERVICE implements IEssayService {
  info = {
    key: 'sand-equivalent',
    icon: SandEquivalentIcon,
    title: t('asphalt.essays.sandEquivalent'),
    path: '/asphalt/essays/sand-equivalent',
    backend_path: 'asphalt/essays/sandEquivalent',
    steps: 3,
    standard: {
      name: 'DNIT-ME 054/97',
      link: 'https://smartdoser.fastengapp.com.br/static/media/EquivalenteAreiaDNERME05497.a8d7e948.pdf',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('asphalt.essays.sand-equivalent'), path: 'essay-data' },
      { step: 2, description: t('results'), path: 'results' },
    ],
  };

  store_actions: SandEquivalentActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as SandEquivalentData['generalData']);
          break;
        case 1:
          const { sandEquivalentCalc } = data as SandEquivalentData;
          await this.submitSandEquivalentCalcData(sandEquivalentCalc);
          await this.calculateResults(data as SandEquivalentData);
          break;
        case 2:
          await this.saveEssay(data as SandEquivalentData);
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
  getSandEquivalentBymaterialId = async (material_id: string) => {
    try {
      const response = await Api.get(`${this.info.backend_path}/get/${material_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // send general data to backend to verify if there is already a SandEquivalent essay with same name for the material
  submitGeneralData = async (generalData: SandEquivalentData['generalData']): Promise<void> => {
    try {
      const { name, material } = generalData;

      // verify if name and material are not empty
      if (!name) throw t('errors.empty-name');
      if (!material) throw t('errors.empty-material');

      // verify if there is already a SandEquivalent essay with same name for the material
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name, material });

      const { success, error } = response.data;

      // if there is already a SandEquivalent essay with same name for the material, throw error
      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  /** @SandEquivalent Methods for SandEquivalent page (step === 1, page 2) */

  // verify inputs from SandEquivalent page (step === 1, page 2)
  submitSandEquivalentCalcData = async (
    sandEquivalentCalc: SandEquivalentData['sandEquivalentCalc']
  ): Promise<void> => {
    console.log(
      '🚀 ~ file: sandEquivalent.service.ts:101 ~ SandEquivalent_SERVICE ~ submitSandEquivalentCalcData= ~ sandEquivalentCalc:',
      sandEquivalentCalc
    );
    try {
    } catch (error) {
      throw error;
    }
  };

  // calculate results from sandEquivalent essay
  calculateResults = async (store: SandEquivalentData): Promise<void> => {
    const body = {
      generalData: store.generalData,
      sandEquivalent: store.sandEquivalentCalc,
    };
    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-results`, body);

      const { success, error, result } = response.data;
      console.log(
        '🚀 ~ file: sandEquivalent.service.ts:120 ~ SandEquivalent_SERVICE ~ calculateResults= ~ result:',
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
  saveEssay = async (store: SandEquivalentData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/save-essay`, {
        generalData: {
          ...store.generalData,
          userId: this.userId,
        },
        sandEquivalentCalc: store.sandEquivalentCalc,
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

export default SandEquivalent_SERVICE;