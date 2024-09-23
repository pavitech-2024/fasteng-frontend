import { RtcdIcon } from '@/assets';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { t } from 'i18next';
import Api from '@/api';
import { RtcdActions, RtcdData } from '@/stores/asphalt/rtcd/rtcd.store';

class Rtcd_SERVICE implements IEssayService {
  info = {
    key: 'rtcd',
    icon: RtcdIcon,
    title: t('asphalt.essays.rtcd'),
    path: '/asphalt/essays/rtcd',
    backend_path: 'asphalt/essays/rtcd',
    steps: 4,
    standard: {
      name: 'DNIT 136/2018 - ME',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_136_2018_me-1.pdf',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('asphalt.essays.rtcdStep2'), path: 'essay-data' },
      { step: 2, description: t('asphalt.essays.rtcdStep3'), path: 'essay-data' },
      { step: 3, description: t('results'), path: 'results' },
    ],
  };

  store_actions: RtcdActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as RtcdData['generalData']);
          break;
        case 1:
          const { rtcdStep2 } = data as RtcdData;
          await this.submitRtcdStep2Data(rtcdStep2);
          break;
        case 2:
          const { rtcdStep3 } = data as RtcdData;
          await this.submitRtcdStep3Data(rtcdStep3);
          await this.calculateResults(data as RtcdData);
          break;
        case 3:
          await this.saveEssay(data as RtcdData);
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
  getRtcdBymaterialId = async (material_id: string) => {
    try {
      const response = await Api.get(`${this.info.backend_path}/get/${material_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // send general data to backend to verify if there is already a Rtcd essay with same name for the material
  submitGeneralData = async (generalData: RtcdData['generalData']): Promise<void> => {
    try {
      const { name, material } = generalData;

      // verify if name and material are not empty
      if (!name) throw t('errors.empty-name');
      if (!material) throw t('errors.empty-material');

      // verify if there is already a Rtcd essay with same name for the material
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name, material });

      const { success, error } = response.data;

      // if there is already a Rtcd essay with same name for the material, throw error
      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  /** @Rtcd Methods for Rtcd page (step === 1, page 2) */

  // verify inputs from Rtcd page (step === 1, page 2)
  submitRtcdStep2Data = async (rtcdStep2: RtcdData['rtcdStep2']): Promise<void> => {
    try {
      // verify if press_constant is not empty
      if (!rtcdStep2.pressConstant) throw t('errors.empty-press-constant');
    } catch (error) {
      throw error;
    }
  };

  // verify inputs from Rtcd page (step === 1, page 2)
  submitRtcdStep3Data = async (rtcdStep3: RtcdData['rtcdStep3']): Promise<void> => {
    try {
      // verify if rtcd_data is not empty
      if (!rtcdStep3.rtcd_data) throw t('errors.empty-rtcd_data');
    } catch (error) {
      throw error;
    }
  };

  // calculate results from rtcd essay
  calculateResults = async (store: RtcdData): Promise<void> => {
    const body = {
      generalData: store.generalData,
      rtcdStep2: store.rtcdStep2,
      rtcdStep3: store.rtcdStep3,
    };
    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-results`, body);

      const { success, error, result } = response.data;

      if (success === false) throw error.name;

      this.store_actions.setData({ step: 3, value: result });
    } catch (error) {
      throw error;
    }
  };

  /** @Results Methods for Results page (step === 2, page 3) */

  // save essay
  saveEssay = async (store: RtcdData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/save-essay`, {
        generalData: {
          ...store.generalData,
          userId: this.userId,
        },
        rtcdStep2: store.rtcdStep2,
        rtcdStep3: store.rtcdStep3,
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

export default Rtcd_SERVICE;
