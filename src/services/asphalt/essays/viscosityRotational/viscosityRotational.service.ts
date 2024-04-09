import Api from '@/api';
import { RotationalIcon } from '@/assets';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import {
  ViscosityRotationalActions,
  ViscosityRotationalData,
} from '@/stores/asphalt/viscosityRotational/viscosityRotational.store';
import { t } from 'i18next';

class ViscosityRotational_SERVICE implements IEssayService {
  info = {
    key: 'viscosity-rotational',
    icon: RotationalIcon,
    title: t('asphalt.essays.viscosityRotational'),
    path: '/asphalt/essays/viscosityRotational',
    backend_path: 'asphalt/essays/viscosityRotational',
    steps: 3,
    standard: {
      name: 'ABNT NBR15184/2004',
      link: '',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('asphalt.essays.viscosityRotational'), path: 'essay-data' },
      { step: 2, description: t('results'), path: 'results' },
    ],
  };

  store_actions: ViscosityRotationalActions;
  userId: string;

  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as ViscosityRotationalData['generalData']);
          break;
        case 1:
          const { viscosityRotationalCalc } = data as ViscosityRotationalData;
          await this.submitViscosityRotationalCalcData(viscosityRotationalCalc);
          await this.calculateResults(data as ViscosityRotationalData);
          break;
        case 2:
          await this.saveEssay(data as ViscosityRotationalData);
          break;
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };

  getmaterialsByUserId = async (userId: string): Promise<AsphaltMaterial[]> => {
    try {
      const response = await Api.get(`asphalt/materials/all/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  getViscosityRotationalBymaterialId = async (material_id: string) => {
    try {
      const response = await Api.get(`${this.info.backend_path}/get/${material_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  submitGeneralData = async (generalData: ViscosityRotationalData['generalData']): Promise<void> => {
    try {
      const { name, material } = generalData;

      if (!name) throw t('errors.empty-name');
      if (!material) throw t('errors.empty-material');

      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name, material });

      const { success, error } = response.data;

      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  submitViscosityRotationalCalcData = async (
    viscosityRotationalCalc: ViscosityRotationalData['viscosityRotationalCalc']
  ): Promise<void> => {
    try {
    } catch (error) {
      throw error;
    }
  };

  calculateResults = async (store: ViscosityRotationalData): Promise<void> => {
    const body = {
      generalData: store.generalData,
      viscosityRotationalCalc: store.viscosityRotationalCalc,
    };
    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-results`, body);

      const { success, error, result } = response.data;

      if (success === false) throw error.name;

      this.store_actions.setData({ step: 2, value: result });
    } catch (error) {
      throw error;
    }
  };

  saveEssay = async (store: ViscosityRotationalData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/save-essay`, {
        generalData: {
          ...store.generalData,
          userId: this.userId,
        },
        viscosityRotationalCalc: store.viscosityRotationalCalc,
        results: store.results,
      });

      const { success, error } = response.data;

      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };
}

export default ViscosityRotational_SERVICE;
