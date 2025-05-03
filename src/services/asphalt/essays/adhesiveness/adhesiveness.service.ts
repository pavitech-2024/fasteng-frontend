import { SpecifyMassIcon } from '@/assets';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import { AdhesivenessActions, AdhesivenessData } from '@/stores/asphalt/adhesiveness/adhesiveness.store';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import Api from '@/api';
import { t } from 'i18next';

class ADHESIVENESS_SERVICE implements IEssayService {
  info = {
    key: 'adhesiveness',
    icon: SpecifyMassIcon,
    title: t('asphalt.essays.adhesiveness'),
    path: '/asphalt/essays/adhesiveness',
    steps: 3,
    backend_path: 'asphalt/essays/adhesiveness',
    standard: {
      name: 'DNIT-ME 078/94',
      link: 'https://smartdoser.fastengapp.com.br/static/media/AdesividadeDnitme07894.b8c14e56.pdf',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('adhesiveness.step2'), path: 'adhesiveness-step2' },
      { step: 2, description: t('results'), path: 'results' },
    ],
  };

  store_actions: AdhesivenessActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as AdhesivenessData['generalData']);
          break;
        case 1:
          await this.calculateResults(data as AdhesivenessData);
          break;
        case 2:
          await this.saveEssay(data as AdhesivenessData);
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
  getMaterialsByUserId = async (userId: string): Promise<AsphaltMaterial[]> => {
    try {
      const { data } = await Api.get(`/asphalt/materials/all/${userId}`);

      //filtrando apenas os materiais de tipo "coarseAggregate"
      return data.filter((material) => material.type === 'coarseAggregate');
    } catch (error) {
      throw error;
    }
  };

  getBindersByUserId = async (userId: string): Promise<AsphaltMaterial[]> => {
    try {
      const { data } = await Api.get(`/asphalt/materials/all/${userId}`);

      //filtrando apenas os materiais de tipo "asphaltBinder"
      return data.filter((material) => material.type === 'asphaltBinder');
    } catch (error) {
      throw error;
    }
  };

  // send general data to backend to verify if there is already a Adhesiveness essay with same name for the material
  submitGeneralData = async (generalData: AdhesivenessData['generalData']): Promise<void> => {
    try {
      const { name, material } = generalData;

      // verify if name and material are not empty
      if (!name) throw t('errors.empty-name');
      if (!material) throw t('errors.empty-material');

      // verify if there is already a Adhesiveness essay with same name for the material
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name, material });

      const { success, error } = response.data;

      // if there is already a Adhesiveness essay with same name for the material, throw error
      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  /** @adhesivenessData Methods for adhesiveness-data (step === 1, page 2) */
  // calculate results
  calculateResults = async (adhesivenessData: AdhesivenessData): Promise<void> => {
    try {
      //verify if displaced_volume (only input) is blank
      if (!adhesivenessData.adhesiveness.filmDisplacement) throw t('errors.empty-displaced-volume');

      // calculate results
      const response = await Api.post(`${this.info.backend_path}/calculate-results`, adhesivenessData);

      const { success, error, result } = response.data;

      if (success === false) throw error.name;

      this.store_actions.setData({ step: 2, value: result });
    } catch (error) {
      throw error;
    }
  };

  /** @saveEssay Methods for save-essay (step === 2, page 3) */
  // save essay
  saveEssay = async (store: AdhesivenessData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/save-essay`, {
        generalData: {
          ...store.generalData,
          userId: this.userId,
        },
        adhesiveness: store.adhesiveness,
        results: store.results,
      });

      const { success, error } = response.data;

      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };
}

export default ADHESIVENESS_SERVICE;
