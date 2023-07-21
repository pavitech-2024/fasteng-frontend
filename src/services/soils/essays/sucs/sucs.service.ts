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
      link: 'https://smartdoser.fastengapp.com.br/static/media/CBRDnit1722016me1.7e341c51.pdf',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: 'SUCS', path: 'essay-general-data' },
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

  // send general data to backend to verify if there is already a CBR essay with same name for the sample
  submitGeneralData = async (generalData: SucsData['generalData']): Promise<void> => {
    try {
      const { name, sample } = generalData;

      // verify if name and sample are not empty
      if (!name) throw t('errors.empty-name');
      if (!sample) throw t('errors.empty-sample');

      // verify if there is already a CBR essay with same name for the sample
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name, sample });

      const { success, error } = response.data;

      // if there is already a CBR essay with same name for the sample, throw error
      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  /** @CBR Methods for CBR page (step === 1, page 2) */

  // verify inputs from CBR page (step === 1, page 2)
  submitEssayGeneralData = (essayGeneralData: SucsData['essayGeneralData']): void => {
    try {
      // verify if the initial sample mass is not empty or negative
      if (!essayGeneralData.initial_sample_mass) throw t('errors.empty-initial-sample-mass');
      if (essayGeneralData.initial_sample_mass < 0) throw t('errors.negative-initial-sample-mass');

      // verify if LL is not empty or negative
      if (!essayGeneralData.ll_porcentage) throw t('errors.empty-ll-porcentage');
      if (essayGeneralData.ll_porcentage < 0) throw t('errors.negative-ll-porcentage');

      // verify if LP is not empty or negative
      if (!essayGeneralData.lp_porcentage) throw t('errors.empty-lp-porcentage');
      if (essayGeneralData.lp_porcentage < 0) throw t('errors.negative-lp-porcentage');

      // verify if the seives are not empty or nagative
      if (!essayGeneralData.seives[0].passant) throw t('errors.empty-seive') + ' [ Nº 4 ]';
      if (essayGeneralData.seives[0].passant < 0) throw t('errors.negative-seive') + ' [ Nº 4 ]';
      if (!essayGeneralData.seives[1].passant) throw t('errors.empty-seive') + ' [ Nº 200 ]';
      if (essayGeneralData.seives[1].passant < 0) throw t('errors.negative-seive') + ' [ Nº 200 ]';
    } catch (error) {
      throw error;
    }
  };

  // calculate results
  calculateResults = async (store: SucsData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-results`, {
        generalData: store.generalData,
        essayGeneralData: store.essayGeneralData,
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
        essayGeneralData: store.essayGeneralData,
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

export default SUCS_SERVICE;
