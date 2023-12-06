import { SofteningPointIcon } from '@/assets';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { SofteningPointActions, SofteningPointData } from '@/stores/asphalt/softeningPoint/softeningPoint.store';
import Api from '@/api';
import { t } from 'i18next';

class SofteningPoint_SERVICE implements IEssayService {
  info = {
    key: 'softening-point',
    icon: SofteningPointIcon,
    title: t('asphalt.essays.softeningPoint'),
    path: '/asphalt/essays/softeningPoint',
    backend_path: 'asphalt/essays/softeningPoint',
    steps: 3,
    standard: {
      name: 'DNIT 131/2010 - ME',
      link: 'https://smartdoser.fastengapp.com.br/static/media/PontoDeAmolecimentoDNITME1312010.90d3b6e9.pdf',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('asphalt.essays.softening-point'), path: 'essay-data' },
      { step: 2, description: t('results'), path: 'results' },
    ],
  };

  store_actions: SofteningPointActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as SofteningPointData['generalData']);
          break;
        case 1:
          const { softeningPointCalc } = data as SofteningPointData;
          await this.submitSofteningPointCalcData(softeningPointCalc);
          await this.calculateResults(data as SofteningPointData);
          break;
        case 2:
          await this.saveEssay(data as SofteningPointData);
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
  getSofteningPointBymaterialId = async (material_id: string) => {
    try {
      const response = await Api.get(`${this.info.backend_path}/get/${material_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // send general data to backend to verify if there is already a SofteningPoint essay with same name for the material
  submitGeneralData = async (generalData: SofteningPointData['generalData']): Promise<void> => {
    try {
      const { name, material } = generalData;

      // verify if name and material are not empty
      if (!name) throw t('errors.empty-name');
      if (!material) throw t('errors.empty-material');

      // verify if there is already a SofteningPoint essay with same name for the material
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name, material });

      const { success, error } = response.data;

      // if there is already a SofteningPoint essay with same name for the material
      // or there isn't a Penetration essay associated with the sample _id,
      // throw an error
      if (success === false) throw t(error.message);
    } catch (error) {
      throw error;
    }
  };

  /** @SofteningPoint Methods for SofteningPoint page (step === 1, page 2) */

  // verify inputs from SofteningPoint page (step === 1, page 2)
  submitSofteningPointCalcData = async (
    softeningPointCalc: SofteningPointData['softeningPointCalc']
  ): Promise<void> => {
    console.log(
      '🚀 ~ file: softeningPoint.service.ts:101 ~ SofteningPoint_SERVICE ~ submitSofteningPointCalcData= ~ softeningPointCalc:',
      softeningPointCalc
    );
    try {
      const { temperature1, temperature2 } = softeningPointCalc;

      if (!temperature1) throw t('asphalt.essays.softening-point-error-empty-temperature1');
      if (!temperature2) throw t('asphalt.essays.softening-point-error-empty-temperature2');
    } catch (error) {
      throw error;
    }
  };

  // calculate results from softeningPoint essay
  calculateResults = async (store: SofteningPointData): Promise<void> => {
    const body = {
      generalData: store.generalData,
      softeningPoint: store.softeningPointCalc,
    };
    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-results`, body);

      const { success, error, result } = response.data;
      console.log(
        '🚀 ~ file: softeningPoint.service.ts:120 ~ SofteningPoint_SERVICE ~ calculateResults= ~ result:',
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
  saveEssay = async (store: SofteningPointData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/save-essay`, {
        generalData: {
          ...store.generalData,
          userId: this.userId,
        },
        softeningPointCalc: store.softeningPointCalc,
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

export default SofteningPoint_SERVICE;
