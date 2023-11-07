import { CbrIcon } from '@/assets';
import { t } from 'i18next';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import Api from '@/api';
import { Sample } from '@/interfaces/soils';
import { CbrData, CbrActions } from '@/stores/soils/cbr/cbr.store';

class CBR_SERVICE implements IEssayService {
  info = {
    key: 'cbr',
    icon: CbrIcon,
    title: t('soils.essays.cbr'),
    path: '/soils/essays/cbr',
    steps: 4,
    backend_path: 'soils/essays/cbr',
    standard: {
      name: 'DNIT 172/2016 - ME',
      link: 'https://smartdoser.fastengapp.com.br/static/media/CBRDnit1722016me1.7e341c51.pdf',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: 'CBR', path: 'passo2' },
      { step: 2, description: t('cbr.expansion'), path: 'expansion' },
      { step: 3, description: t('results'), path: 'results' },
    ],
  };

  store_actions: CbrActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as CbrData['generalData']);
          break;
        case 1:
          await this.submitCbrData(data as CbrData['step2Data']);
          break;
        case 2:
          const { expansionData } = data as CbrData;
          await this.submitExpansionData(expansionData);
          await this.calculateResults(data as CbrData);
          break;
        case 3:
          await this.saveEssay(data as CbrData);
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

  // send general data to backend to verify if there is already a CBR essay with same name for the sample
  submitGeneralData = async (generalData: CbrData['generalData']): Promise<void> => {
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
  submitCbrData = (cbrData: CbrData['step2Data']): void => {
    try {
      // verify if ring_constant is not empty or negative
      if (!cbrData.ring_constant) throw t('errors.empty-ring-constant');
      if (cbrData.ring_constant < 0) throw t('errors.negative-ring-constant');

      // verify if cylinder_height is not empty or negative
      if (!cbrData.cylinder_height) throw t('errors.empty-cylinder-height');
      if (cbrData.cylinder_height < 0) throw t('errors.negative-cylinder-height');

      // verify if extended_reads that are required ( 2 min and 4 min ) are not empty or negative
      if (!cbrData.extended_reads[3].extended_read) throw t('errors.empty-extended-read') + ' [ 2 min ]';
      if (cbrData.extended_reads[3].extended_read <= 0) throw t('errors.negative-extended-read') + ' [ 2 min ]';

      if (!cbrData.extended_reads[5].extended_read) throw t('errors.empty-extended-read') + ' [ 4 min ]';
      if (cbrData.extended_reads[5].extended_read <= 0) throw t('errors.negative-extended-read') + ' [ 4 min ]';
    } catch (error) {
      throw error;
    }
  };

  /** @Expansion Methods for Expansio page (step === 2, page 3) */

  // verify inputs from Expansion page (step === 2, page 3)
  submitExpansionData = async (expansionData: CbrData['expansionData']): Promise<void> => {
    try {
      // verify if there is at least one data point

      if (expansionData.length < 2) throw t('errors.empty-expansion-data');

      // verify if all data points have a valid value
      expansionData.forEach((dataPoint, index) => {
        if (!dataPoint.deflectometer_read) throw t('errors.empty-deflectometer-read') + ` [ ${index + 1} ]`;
        if (dataPoint.deflectometer_read < 0) throw t('errors.negative-deflectometer-read') + ` [ ${index + 1} ]`;
        if (!dataPoint.date) throw t('errors.empty-date') + ` [ ${index + 1} ]`;
        if (!dataPoint.time) throw t('errors.empty-time') + ` [ ${index + 1} ]`;
      });
    } catch (error) {
      throw error;
    }
  };

  // calculate results
  calculateResults = async (store: CbrData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-results`, {
        generalData: store.generalData,
        step2Data: store.step2Data,
        expansionData: store.expansionData,
      });

      const { success, error, result } = response.data;

      if (success === false) throw error.name;

      this.store_actions.setData({ step: 3, value: result });
    } catch (error) {
      throw error;
    }
  };

  /** @Results Methods for Results page (step === 3, page 4) */

  // save essay
  saveEssay = async (store: CbrData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/save-essay`, {
        generalData: {
          ...store.generalData,
          userId: this.userId,
        },
        step2Data: store.step2Data,
        expansionData: store.expansionData,
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

export default CBR_SERVICE;
