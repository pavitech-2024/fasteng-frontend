import { AngularityIcon } from '@/assets';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { AngularityActions, AngularityData } from '@/stores/asphalt/angularity/angularity.store';
import Api from '@/api';
import { t } from 'i18next';
import { AsphaltMaterial } from '@/interfaces/asphalt';

class ANGULARITY_SERVICE implements IEssayService {
  info = {
    key: 'angularity',
    icon: AngularityIcon,
    title: t('asphalt.essays.angularity'),
    path: '/asphalt/essays/angularity',
    steps: 3,
    backend_path: 'asphalt/essays/angularity',
    standard: {
      name: 'DNIT 415/2019 - ME',
      link: '',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('angularity'), path: 'essay-data' },
      { step: 2, description: t('results'), path: 'results' },
    ],
  };

  store_actions: AngularityActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as AngularityData['generalData']);
          break;
        case 1:
          const { step2Data } = data as AngularityData;
          await this.submitStep2Data(step2Data);
          await this.calculateResults(data as AngularityData);
          break;
        case 2:
          await this.saveEssay(data as AngularityData);
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
  getmaterialsByUserId = async (userId: string): Promise<AsphaltMaterial> => {
    try {
      // get all materials from user from backend
      const response = await Api.get(`asphalt/materials/all/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // send general data to backend to verify if there is already a Specify Mass essay with same name for the material
  submitGeneralData = async (generalData: AngularityData['generalData']): Promise<void> => {
    try {
      const { name, material } = generalData;

      // verify if name and material are not empty
      if (!name) throw t('errors.empty-name');
      if (!material) throw t('errors.empty-material');

      // verify if there is already a Specify Mass essay with same name for the material
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name, material });

      const { success, error } = response.data;

      // if there is already a Specify Mass essay with same name for the material, throw error
      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  /** @Angularity Methods for Angularity page (step === 1, page 2) */

  // verify inputs from Angularity page (step === 1, page 2)
  submitStep2Data = async (step2Data: AngularityData['step2Data']): Promise<void> => {
    try {
      // verify if the relative density length is not empty or negative
      if (!step2Data.relative_density) throw t('errors.empty-relative-density');
      if (step2Data.relative_density < 0) throw t('errors.negative-relative-density');

      // verify if the cylinder volume length is not empty or negative
      if (!step2Data.cylinder_volume) throw t('errors.empty-relative-density');
      if (step2Data.cylinder_volume < 0) throw t('errors.negative-relative-density');
    } catch (error) {
      throw error;
    }
  };

  // calculate results from granulometry essay
  calculateResults = async (store: AngularityData): Promise<void> => {
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
  saveEssay = async (store: AngularityData): Promise<void> => {
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

export default ANGULARITY_SERVICE;
