import { FwdIcon } from '@/assets';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { FwdActions, FwdData } from '@/stores/asphalt/fwd/fwd.store';
import { t } from 'i18next';
import Api from '@/api';

class Fwd_SERVICE implements IEssayService {
  info = {
    key: 'fwd',
    icon: FwdIcon,
    title: t('asphalt.essays.fwd'),
    path: '/asphalt/essays/fwd',
    backend_path: 'asphalt/essays/fwd',
    steps: 5,
    standard: {
      name: '',
      link: '',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('asphalt.essays.fwd.fwdStep2'), path: 'essay-data' },
      { step: 2, description: t('asphalt.essays.fwd.fwdStep3'), path: 'essay-data' },
      { step: 3, description: t('asphalt.essays.fwd.fwdStep4'), path: 'essay-data' },
      { step: 4, description: t('results'), path: 'results' },
    ],
  };
  store_actions: FwdActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as FwdData['generalData']);
          break;
        case 1:
          const { fwdStep2 } = data as FwdData;
          await this.submitFwdStep2Data(fwdStep2);
          break;
        case 2:
          const { fwdStep3 } = data as FwdData;
          await this.submitFwdStep3Data(fwdStep3);
          await this.calculateResults(data as FwdData);
          break;
        case 3:
          break;
        case 4:
          await this.saveEssay(data as FwdData);
          break;
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };

  deleteFwdEssay = async (id: string): Promise<void> => {
    try {
      await Api.delete(`${this.info.backend_path}/delete-essay/${id}`);
    } catch (error) {
      throw error;
    }
  };

  /** @generalData Methods for general-data (step === 0, page 1) */

  // get essay from user _id
  getFwdByuserId = async (userId: string) => {
    try {
      const response = await Api.get(`${this.info.backend_path}/get/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // send general data to backend to verify if there is already a Fwd essay with same name
  submitGeneralData = async (generalData: FwdData['generalData']): Promise<void> => {
    try {
      const { name } = generalData;
      // verify if name and user id are not empty
      if (!name) {
        throw t('errors.empty-name');
      }
      // verify if there is already a Fwd essay with same name for the userId
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name });

      const { success, error } = response.data;

      // if there is already a Fwd essay with same name for the userId, throw error
      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  /** @Fwd Methods for Fwd page (step === 1, page 2) */

  // verify inputs from Fwd page (step === 1, page 2)
  submitFwdStep2Data = async (fwdStep2: FwdData['fwdStep2']): Promise<void> => {
    try {
    } catch (error) {
      throw error;
    }
  };

  // verify inputs from Fwd page (step === 1, page 2)
  submitFwdStep3Data = async (fwdStep3: FwdData['fwdStep3']): Promise<void> => {
    try {
    } catch (error) {
      throw error;
    }
  };

  // calculate results from fwd essay
  calculateResults = async (store: FwdData): Promise<void> => {
    const body = {
      generalData: store.generalData,
      fwdStep2: store.fwdStep2,
      fwdStep3: store.fwdStep3,
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
  saveEssay = async (store: FwdData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/save-essay`, {
        generalData: {
          ...store.generalData,
          userId: this.userId,
        },
        fwdStep2: store.fwdStep2,
        fwdStep3: store.fwdStep3,
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

export default Fwd_SERVICE;
