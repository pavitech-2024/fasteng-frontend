import { GranulometryIcon } from '@/assets';
import { t } from 'i18next';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import Api from '@/api';
import { Sample } from '@/interfaces/soils';
import { GranulometryData, GranulometryActions } from '@/stores/soils/granulometry/granulometry.store';

class Granulometry_SERVICE implements IEssayService {
  info = {
    key: 'granulometry',
    icon: GranulometryIcon,
    title: t('soils.essays.granulometry'),
    path: '/soils/essays/granulometry',
    backend_path: 'soils/essays/granulometry',
    steps: 3,
    standard: {
      name: 'NBR 7181/1984',
      link: 'https://engenhariacivilfsp.files.wordpress.com/2015/03/nbr-7181.pdf',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('granulometry'), path: 'essay-data' },
      { step: 2, description: t('results'), path: 'results' },
    ],
  };

  store_actions: GranulometryActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as GranulometryData['generalData']);
          break;
        case 1:
          const { step2Data } = data as GranulometryData;
          await this.submitStep2Data(step2Data);
          await this.calculateResults(data as GranulometryData);
          break;
        case 2:
          await this.saveEssay(data as GranulometryData);
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

  // send general data to backend to verify if there is already a Granulometry essay with same name for the sample
  submitGeneralData = async (generalData: GranulometryData['generalData']): Promise<void> => {
    try {
      const { name, sample } = generalData;

      // verify if name and sample are not empty
      if (!name) throw t('errors.empty-name');
      if (!sample) throw t('errors.empty-sample');

      // verify if there is already a Granulometry essay with same name for the sample
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name, sample });

      const { success, error } = response.data;

      // if there is already a Granulometry essay with same name for the sample, throw error
      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  /** @Granulometry Methods for Granulometry page (step === 1, page 2) */

  // verify inputs from Granulometry page (step === 1, page 2)
  submitStep2Data = async (step2Data: GranulometryData['step2Data']): Promise<void> => {
    try {
      // verify if the sample mass is not empty or negative
      if (!step2Data.sample_mass) throw t('errors.empty-sample-mass');
      if (step2Data.sample_mass < 0) throw t('errors.negative-sample-mass');

      // verify if all the passant porcentages are not empty or negative
      step2Data.table_data.forEach((row) => {
        if (row.passant == null || row.retained == null) throw t('errors.empty-sieve') + row.sieve;
        if (row.passant < 0 || row.passant < 0) throw t('errors.negative-sieve') + row.sieve;
      });

      //verify if the sum of the masses (retained + bottom) equals the sample mass
      let retained = 0.0;
      step2Data.table_data.forEach((row) => {
        retained += row.retained;
      });
      const sum = retained + step2Data.bottom;
      if (sum !== step2Data.sample_mass)
        throw t('errors.sieves-sum-not-equal-to-sample-mass') + (step2Data.sample_mass - sum) + 'g';
    } catch (error) {
      throw error;
    }
  };

  // calculate results from granulometry essay
  calculateResults = async (store: GranulometryData): Promise<void> => {
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
  saveEssay = async (store: GranulometryData): Promise<void> => {
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

export default Granulometry_SERVICE;
