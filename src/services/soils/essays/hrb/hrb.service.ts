import { t } from 'i18next';
import { IEssayService } from '../../../../interfaces/common/essay/essay-service.interface';
import { HrbIcon } from '@/assets';
import Api from '../../../../api';
import { Sample } from '../../../../interfaces/soils';
import { HrbActions, HrbData } from '../../../../stores/soils/hrb/hrb.store';

class HRB_SERVICE implements IEssayService {
  info = {
    key: 'hrb',
    icon: HrbIcon,
    title: t('soils.essays.hrb'),
    path: '/soils/essays/hrb',
    steps: 3,
    backend_path: 'soils/essays/hrb',
    standard: {
      name: null,
      link: null,
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('hrb.essay-data'), path: 'essay-data' },
      { step: 2, description: t('results'), path: 'results' },
    ],
  };

  store_actions: HrbActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as HrbData['generalData']);
          break;
        case 1:
          const { step2Data } = data as HrbData;
          await this.submitEssayData(step2Data);
          await this.calculateResults(data as HrbData);
          break;
        case 2:
          await this.saveEssay(data as HrbData);
          break;
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };

  /** @generalData Methods for general-data (step === 0, page 1) */
  getSamplesByUserId = async (userId: string): Promise<Sample[]> => {
    try {
      // get all samples from user from backend
      const response = await Api.get(`soils/samples/all/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // send general data to backend to verify if there is already a HRB essay with same name for the sample
  submitGeneralData = async (generalData: HrbData['generalData']): Promise<void> => {
    try {
      const { name, sample } = generalData;

      // verify if name and sample are not empty
      if (!name) throw t('errors.empty-name');
      if (!sample) throw t('errors.empty-sample');

      // verify if there is already a HRB essay with same name for the sample
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name, sample });

      const { success, error } = response.data;

      // if there is already a HRB essay with same name for the sample, throw error
      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  /** @ESSAY_DATA Methods for HRB page (step === 1, page 2) */

  // verify inputs from Essay-Data page (step === 2, page 3)
  submitEssayData = (step2Data: HrbData['step2Data']): void => {
    try {
      //verify if all inputs from essay-data page are filled
      if (!step2Data.liquidity_limit) throw t('errors.empty-liquidity-limit');
      if (!step2Data.plasticity_limit) throw t('errors.empty-plasticity-limit');
      if (step2Data.plasticity_limit > step2Data.liquidity_limit)
        throw t('errors.plasticity-limit-greater-than-liquidity-limit');

      //verify if all inputs from table are filled
      step2Data.tableData.forEach((row) => {
        if (!row.percent_passant) throw t('errors.empty-percent-passant') + ':' + row.sieve;
      });
    } catch (error) {
      throw error;
    }
  };

  // calculate results from HRB essay
  calculateResults = async (store: HrbData): Promise<void> => {
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
  saveEssay = async (store: HrbData): Promise<void> => {
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

      console.log(error);

      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };
}

export default HRB_SERVICE;
