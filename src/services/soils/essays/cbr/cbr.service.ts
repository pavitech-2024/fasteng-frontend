import { CbrIcon } from '@/assets';
import { t } from 'i18next';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import Api from '@/api';
import { Sample } from '@/interfaces/soils';
import { CbrData } from '@/stores/soils/cbr/cbr.store';

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
      { step: 2, description: t('expransion'), path: 'expansion' },
      { step: 3, description: t('results'), path: 'results' },
    ],
  };

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as CbrData['generalData']);
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
  async getSamplesByUserId(userId: string): Promise<Sample[]> {
    try {
      // get all samples from user from backend
      const response = await Api.get(`soils/samples/all/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // send general data to backend to verify if there is already a CBR essay with same name for the sample
  async submitGeneralData(generalData: CbrData['generalData']): Promise<void> {
    try {
      const { name, sample } = generalData;

      // verify if name and sample are not empty
      if (!name) throw t('errors.empty-name');
      if (!sample) throw t('errors.empty-sample');

      // verify if there is already a CBR essay with same name for the sample
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name, sample });
      const { success, error } = response.data;

      // if there is already a CBR essay with same name for the sample, throw error
      if (success === false) throw error.message;
    } catch (error) {
      throw error;
    }
  }
  /** @CBR Methods for CBR page (step === 1, page 2) */
}

export default CBR_SERVICE;