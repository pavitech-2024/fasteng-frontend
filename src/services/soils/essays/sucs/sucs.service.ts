import { SucsIcon } from '@/assets';
import { t } from 'i18next';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import Api from '@/api';
import { Sample } from '@/interfaces/soils';
import { SucsData, SucsActions } from '@/stores/soils/sucs/sucs.store';

class SUCS_SERVICE implements IEssayService {
  info = {
    key: 'sucs',
    icon: SucsIcon,
    title: t('soils.essays.sucs'),
    path: '/soils/essays/sucs',
    backend_path: 'soils/essays/sucs',
    steps: 3,
    standard: {
      name: 'DNIT 172/2016 - ME',
      link: 'https://smartdoser.fastengapp.com.br/static/media/SUCSDnit1722016me1.7e341c51.pdf',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: 'SUCS', path: 'essay-data' },
      { step: 2, description: t('results'), path: 'results' },
    ],
  };

  store_actions: SucsActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as SucsData['generalData']);
          break;
        case 1:
          const { step2Data } = data as SucsData;
          await this.submitStep2Data(step2Data);
          await this.calculateResults(data as SucsData);
          break;
        case 2:
          await this.saveEssay(data as SucsData);
          break;
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };

  /** @generalData Methods for general-data (step === 0, page 1) */

  // get all samples from user from backend
  getSamplesByUserId = async (userId: string): Promise<Sample[]> => {
    try {
      // get all samples from user from backend
      const response = await Api.get(`soils/samples/all/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // send general data to backend to verify if there is already a SUCS essay with same name for the sample
  submitGeneralData = async (generalData: SucsData['generalData']): Promise<void> => {
    try {
      const { name, sample } = generalData;

      // verify if name and sample are not empty
      if (!name) throw t('errors.empty-name');
      if (!sample) throw t('errors.empty-sample');

      // verify if there is already a SUCS essay with same name for the sample
      // or if there's any Granulometry essay associated with the sample _id
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name, sample });

      const { success, error } = response.data;

      // if there is already a SUCS essay with same name for the sample
      // or there isn't a Granulometry essay associated with the sample _id,
      // throw an error
      if (success === false) throw t(error.message);
    } catch (error) {
      throw error;
    }
  };

  /** @SUCS Methods for SUCS page (step === 1, page 2) */

  // verify inputs from SUCS page (step === 1, page 2)
  submitStep2Data = async (step2Data: SucsData['step2Data']): Promise<void> => {
    try {
      // verify if LL is not empty or negative
      if (!step2Data.liquidity_limit) throw t('errors.empty-ll-porcentage');
      if (step2Data.liquidity_limit < 0) throw t('errors.negative-ll-porcentage');

      // verify if LP is not empty or negative
      if (!step2Data.plasticity_limit) throw t('errors.empty-lp-porcentage');
      if (step2Data.plasticity_limit < 0) throw t('errors.negative-lp-porcentage');

      // verify if all the sieves are not empty or negative
      step2Data.sieves.forEach((row) => {
        if (!row.passant) throw t('errors.empty-sieve') + row.sieve;
        if (row.passant < 0) throw t('errors.negative-sieve') + row.sieve;
      });
    } catch (error) {
      throw error;
    }
  };

  // calculate results from sucs essay
  calculateResults = async (store: SucsData): Promise<void> => {
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
  saveEssay = async (store: SucsData): Promise<void> => {
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
      // else
    } catch (error) {
      throw error;
    }
  };
}

export default SUCS_SERVICE;
