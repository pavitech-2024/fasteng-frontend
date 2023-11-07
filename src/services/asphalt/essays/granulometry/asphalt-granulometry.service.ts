import { GranulometryIcon } from '@/assets';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import {
  AsphaltGranulometryActions,
  AsphaltGranulometryData,
} from '@/stores/asphalt/granulometry/asphalt-granulometry.store';
import Api from '@/api';
import { t } from 'i18next';

class AsphaltGranulometry_SERVICE implements IEssayService {
  info = {
    key: 'granulometry',
    icon: GranulometryIcon,
    title: t('asphalt.essays.granulometry-asphalt'),
    path: '/asphalt/essays/granulometry-asphalt',
    backend_path: 'asphalt/essays/granulometry',
    steps: 3,
    standard: {
      name: '',
      link: '',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('granulometry-asphalt'), path: 'essay-data' },
      { step: 2, description: t('results'), path: 'results' },
    ],
  };

  store_actions: AsphaltGranulometryActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as AsphaltGranulometryData['generalData']);
          break;
        case 1:
          const { step2Data } = data as AsphaltGranulometryData;
          await this.submitStep2Data(step2Data);
          await this.calculateResults(data as AsphaltGranulometryData);
          break;
        case 2:
          await this.saveEssay(data as AsphaltGranulometryData);
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
  getGranulometryBymaterialId = async (material_id: string) => {
    try {
      const response = await Api.get(`${this.info.backend_path}/get/${material_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // send general data to backend to verify if there is already a Granulometry essay with same name for the material
  submitGeneralData = async (generalData: AsphaltGranulometryData['generalData']): Promise<void> => {
    try {
      const { name, material } = generalData;

      // verify if name and material are not empty
      if (!name) throw t('errors.empty-name');
      if (!material) throw t('errors.empty-material');

      // verify if there is already a Granulometry essay with same name for the material
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name, material });

      const { success, error } = response.data;

      // if there is already a Granulometry essay with same name for the material, throw error
      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  /** @Granulometry Methods for Granulometry page (step === 1, page 2) */

  // verify inputs from Granulometry page (step === 1, page 2)
  submitStep2Data = async (step2Data: AsphaltGranulometryData['step2Data']): Promise<void> => {
    try {
      // verify if the material mass is not empty or negative
      if (!step2Data.material_mass) throw t('errors.empty-material-mass');
      if (step2Data.material_mass < 0) throw t('errors.negative-material-mass');

      // verify if all the passant porcentages are not empty or negative
      step2Data.table_data.forEach((row) => {
        if (row.passant == null || row.retained == null) throw t('errors.empty-sieve') + row.sieve;
        if (row.passant < 0 || row.passant < 0) throw t('errors.negative-sieve') + row.sieve;
      });

      //verify if the sum of the masses (retained + bottom) equals the material mass
      let retained = 0.0;
      step2Data.table_data.forEach((row) => {
        retained += row.retained;
      });
      const sum = Math.round(100 * (retained + step2Data.bottom)) / 100;

      if (sum > step2Data.material_mass) {
        throw (
          t('errors.sieves-sum-not-equal-to-material-mass') +
          (step2Data.material_mass - sum) +
          'g.\n' +
          'Retida + Fundos: ' +
          sum
        );
      }
    } catch (error) {
      throw error;
    }
  };

  // calculate results from granulometry essay
  calculateResults = async (store: AsphaltGranulometryData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-results`, {
        generalData: store.generalData,
        step2Data: store.step2Data,
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
  saveEssay = async (store: AsphaltGranulometryData): Promise<void> => {
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

export default AsphaltGranulometry_SERVICE;
