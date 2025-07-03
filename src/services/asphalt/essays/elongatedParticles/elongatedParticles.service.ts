import { ElongatedParticlesIcon } from '@/assets';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import {
  ElongatedParticlesActions,
  ElongatedParticlesData,
} from '@/stores/asphalt/elongatedParticles/elongatedParticles.store';
import Api from '@/api';
import { t } from 'i18next';
import { AsphaltMaterial } from '@/interfaces/asphalt';

class ELONGATEDPARTICLES_SERVICE implements IEssayService {
  info = {
    key: 'elongatedParticles',
    icon: ElongatedParticlesIcon,
    title: t('asphalt.essays.elongatedParticles'),
    path: '/asphalt/essays/elongatedParticles',
    steps: 3,
    backend_path: 'asphalt/essays/elongatedParticles',
    standard: {
      name: 'DNIT 429/2020 - ME',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_429_2020_me-3.pdf',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('elongatedParticles'), path: 'essay-data' },
      { step: 2, description: t('results'), path: 'results' },
    ],
  };

  store_actions: ElongatedParticlesActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as ElongatedParticlesData['generalData']);
          break;
        case 1:
          const { step2Data } = data as ElongatedParticlesData;
          await this.submitStep2Data(step2Data);
          await this.calculateResults(data as ElongatedParticlesData);
          break;
        case 2:
          await this.saveEssay(data as ElongatedParticlesData);
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
  submitGeneralData = async (generalData: ElongatedParticlesData['generalData']): Promise<void> => {
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

  /** @ElongatedParticles Methods for ElongatedParticles page (step === 1, page 2) */

  // verify inputs from ElongatedParticles page (step === 1, page 2)
  submitStep2Data = async (step2Data: ElongatedParticlesData['step2Data']): Promise<void> => {
    try {
      const { dimensions_table_data } = step2Data;

      if (!dimensions_table_data) throw t('elongatedParticles.error.null-dimensions-table-data');
      dimensions_table_data.forEach((row) => {
        if (!row.sample_mass) throw t('elongatedParticles.error.empty-sample-mass') + ' - ' + row.ratio;
        if (row.sample_mass < 0) throw t('elongatedParticles.error.negative-sample-mass') + ' - ' + row.ratio;
        if (!row.mass) throw t('elongatedParticles.error.empty-mass') + ' - ' + row.ratio;
        if (row.mass < 0) throw t('elongatedParticles.error.negative-mass') + ' - ' + row.ratio;

        if (row.mass > row.sample_mass)
          throw t('elongatedParticles.error.mass-greater-than-sample-mass') + ' - ' + row.ratio;
      });
    } catch (error) {
      throw error;
    }
  };

  // calculate results from granulometry essay
  calculateResults = async (store: ElongatedParticlesData): Promise<void> => {
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
  saveEssay = async (store: ElongatedParticlesData): Promise<void> => {
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

export default ELONGATEDPARTICLES_SERVICE;
