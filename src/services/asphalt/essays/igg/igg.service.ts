import { IggIcon } from '@/assets';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { IggActions, IggData } from '@/stores/asphalt/igg/igg.store';
import { t } from 'i18next';
import Api from '@/api';

class Igg_SERVICE implements IEssayService {
  info = {
    key: 'igg',
    icon: IggIcon,
    title: t('asphalt.essays.igg'),
    path: '/asphalt/essays/igg',
    backend_path: 'asphalt/essays/igg',
    steps: 5,
    standard: {
      name: '',
      link: '',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('asphalt.essays.igg.iggStep2'), path: 'essay-data' },
      { step: 2, description: t('asphalt.essays.igg.iggStep3'), path: 'essay-data' },
      { step: 3, description: t('asphalt.essays.igg.iggStep4'), path: 'essay-data' },
      { step: 4, description: t('results'), path: 'results' },
    ],
  };
  store_actions: IggActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as IggData['generalData']);
          break;
        case 1:
          const { iggStep2 } = data as IggData;
          await this.submitIggStep2Data(iggStep2);
          break;
        case 2:
          const { iggStep3 } = data as IggData;
          await this.submitIggStep3Data(iggStep3);
          break;
        case 3:
          const { iggStep4 } = data as IggData;
          await this.submitIggStep4Data(iggStep4);
          await this.calculateResults(data as IggData);
          break;
        case 4:
          await this.saveEssay(data as IggData);
          break;
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };

  /** @generalData Methods for general-data (step === 0, page 1) */

  // get essay from user _id
  getIggByuserId = async (userId: string) => {
    try {
      const response = await Api.get(`${this.info.backend_path}/get/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // send general data to backend to verify if there is already a Igg essay with same name
  submitGeneralData = async (generalData: IggData['generalData']): Promise<void> => {
    try {
      const { name } = generalData;
      // verify if name and user id are not empty
      if (!name) {
        throw t('errors.empty-name');
      }
      // verify if there is already a Igg essay with same name for the userId
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name });

      const { success, error } = response.data;

      // if there is already a Igg essay with same name for the userId, throw error
      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  /** @Igg Methods for Igg page (step === 1, page 2) */

  // verify inputs from Igg page (step === 1, page 2)
  submitIggStep2Data = async (iggStep2: IggData['iggStep2']): Promise<void> => {
    try {
    } catch (error) {
      throw error;
    }
  };

  // verify inputs from Igg page (step === 1, page 2)
  submitIggStep3Data = async (iggStep3: IggData['iggStep3']): Promise<void> => {
    try {
      if (!iggStep3.stakes) throw t('errors.empty-stakes');
    } catch (error) {
      throw error;
    }
  };
  // verify inputs from Igg page (step === 1, page 2)
  submitIggStep4Data = async (iggStep4: IggData['iggStep4']): Promise<void> => {
    try {
      if (!iggStep4.sections) throw t('errors.empty-sections');
    } catch (error) {
      throw error;
    }
  };

  // calculate results from igg essay
  calculateResults = async (store: IggData): Promise<void> => {
    const body = {
      generalData: store.generalData, // userId, name, operator, callculist, createdAt, description, calculist
      iggStep2: store.iggStep2, // work, section, initialStake, initialSide, finalStake, finalSide
      iggStep3: store.iggStep3, // Stakes: array de indice 0 a 24 (25 posições) com os dados da tabela
      iggStep4: store.iggStep4, // sections
    };
    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-results`, body);

      const { success, error, result } = response.data;

      if (success === false) throw error;

      this.store_actions.setData({ step: 4, value: result });
    } catch (error) {
      throw error;
    }
  };

  /** @Results Methods for Results page (step === 2, page 3) */

  // save essay
  saveEssay = async (store: IggData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/save-essay`, {
        generalData: {
          ...store.generalData,
          userId: this.userId,
        },
        iggStep2: store.iggStep2,
        iggStep3: store.iggStep3,
        iggStep4: store.iggStep4,
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

export default Igg_SERVICE;
