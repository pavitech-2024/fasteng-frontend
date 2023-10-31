import { DuctilityIcon } from '@/assets';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { DuctilityActions, DuctilityData } from '@/stores/asphalt/ductility/ductility.store';
import Api from '@/api';
import { t } from 'i18next';
import { AsphaltMaterial } from '@/interfaces/asphalt';

class DUCTILITY_SERVICE implements IEssayService {
  info = {
    key: 'ductility',
    icon: DuctilityIcon,
    title: t('asphalt.essays.ductility'),
    path: '/asphalt/essays/ductility',
    steps: 3,
    backend_path: 'asphalt/essays/ductility',
    standard: {
      name: 'DNIT-ME 163/98',
      link: 'https://smartdoser.fastengapp.com.br/static/media/DuctilidadeDnerMe16398.a7e9de87.pdf',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('ductility'), path: 'essay-data' },
      { step: 2, description: t('results'), path: 'results' },
    ],
  };

  store_actions: DuctilityActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      console.log(data);
      switch (step) {
        case 0:
          await this.submitGeneralData(data as DuctilityData['generalData']);
          break;
        case 1:
          const { step2Data } = data as DuctilityData;
          await this.submitStep2Data(step2Data);
          await this.calculateResults(data as DuctilityData);
          break;
        case 2:
          await this.saveEssay(data as DuctilityData);
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

  // send general data to backend to verify if there is already a Specify Mass essay with same name for the material
  submitGeneralData = async (generalData: DuctilityData['generalData']): Promise<void> => {
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

  /** @Ductility Methods for Ductility page (step === 1, page 2) */

  // verify inputs from Ductility page (step === 1, page 2)
  submitStep2Data = async (step2Data: DuctilityData['step2Data']): Promise<void> => {
    try {
      // verify if the first rupture length is not empty or negative
      if (step2Data.first_rupture_length) {
        if (!step2Data.first_rupture_length) throw t('errors.empty-first-rupture-length');
        if (step2Data.first_rupture_length < 0) throw t('errors.negative-first-rupture-length');
      }

      // verify if the second rupture length is not empty or negative
      if (step2Data.second_rupture_length) {
        if (!step2Data.second_rupture_length) throw t('errors.empty-second-rupture-length');
        if (step2Data.second_rupture_length < 0) throw t('errors.negative-second-rupture-length');
      }

      // verify if the third rupture length is not empty or negative
      if (step2Data.third_rupture_length) {
        if (!step2Data.third_rupture_length) throw t('errors.empty-third-rupture-length');
        if (step2Data.third_rupture_length < 0) throw t('errors.negative-third-rupture-length');
      }
    } catch (error) {
      throw error;
    }
  };

  // calculate results from granulometry essay
  calculateResults = async (store: DuctilityData): Promise<void> => {
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
  saveEssay = async (store: DuctilityData): Promise<void> => {
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

export default DUCTILITY_SERVICE;
