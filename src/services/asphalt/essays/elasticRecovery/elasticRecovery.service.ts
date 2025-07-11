import { ElasticRecoveryIcon } from '@/assets';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { t } from 'i18next';
import Api from '@/api';
import { ElasticRecoveryActions, ElasticRecoveryData } from '@/stores/asphalt/elasticRecovery/elasticRecovery.store';

class ElasticRecovery_SERVICE implements IEssayService {
  info = {
    key: 'elasticRecovery',
    icon: ElasticRecoveryIcon,
    title: t('asphalt.essays.elasticRecovery'),
    path: '/asphalt/essays/elasticRecovery',
    backend_path: 'asphalt/essays/elasticRecovery',
    steps: 3,
    standard: {
      name: '',
      link: '',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('asphalt.essays.elasticRecovery'), path: 'essay-data' },
      { step: 2, description: t('results'), path: 'results' },
    ],
  };

  store_actions: ElasticRecoveryActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as ElasticRecoveryData['generalData']);
          break;
        case 1:
          const { elasticRecoveryCalc } = data as ElasticRecoveryData;
          await this.submitElasticRecoveryCalcData(elasticRecoveryCalc);
          await this.calculateResults(data as ElasticRecoveryData);
          break;
        case 2:
          await this.saveEssay(data as ElasticRecoveryData);
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

  // get essay from material _id
  getElasticRecoveryBymaterialId = async (material_id: string) => {
    try {
      const response = await Api.get(`${this.info.backend_path}/get/${material_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // send general data to backend to verify if there is already a ElasticRecovery essay with same name for the material
  submitGeneralData = async (generalData: ElasticRecoveryData['generalData']): Promise<void> => {
    try {
      const { name, material } = generalData;

      // verify if name and material are not empty
      if (!name) throw t('errors.empty-name');
      if (!material) throw t('errors.empty-material');

      // verify if there is already a ElasticRecovery essay with same name for the material
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name, material });

      const { success, error } = response.data;

      // if there is already a ElasticRecovery essay with same name for the material, throw error
      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  /** @ElasticRecovery Methods for ElasticRecovery page (step === 1, page 2) */

  // verify inputs from ElasticRecovery page (step === 1, page 2)
  submitElasticRecoveryCalcData = async (
    elasticRecoveryCalc: ElasticRecoveryData['elasticRecoveryCalc']
  ): Promise<void> => {
    try {
      const { lengths } = elasticRecoveryCalc;
      lengths.forEach((row) => {
        if (Number(row.stretching_length) < 0) throw t('errors.negative-stretching-length');
        if (Number(row.juxtaposition_length) < 0) throw t('errors.negative-juxtaposition-length');
      });
    } catch (error) {
      throw error;
    }
  };

  // calculate results from elasticRecovery essay
  calculateResults = async (store: ElasticRecoveryData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-results`, {
        generalData: store.generalData,
        elasticRecoveryCalc: store.elasticRecoveryCalc,
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
  saveEssay = async (store: ElasticRecoveryData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/save-essay`, {
        generalData: {
          ...store.generalData,
          userId: this.userId,
        },
        elasticRecoveryCalc: store.elasticRecoveryCalc,
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

export default ElasticRecovery_SERVICE;
