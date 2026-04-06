import { t } from 'i18next';
import { SpecifyMassIcon } from '@/assets';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { ConcreteMaterial } from '@/interfaces/concrete';
import Api from '@/api';
import { ChapmanActions, ChapmanData } from '../../../../stores/concrete/chapman/chapman.store';

class CHAPMAN_SERVICE implements IEssayService {
  info = {
    key: 'chapman',
    icon: SpecifyMassIcon,
    title: t('concrete.essays.chapman'),
    path: '/concrete/essays/chapman',
    steps: 3,
    backend_path: 'concrete/essays/chapman',
    standard: {
      name: 'NBR 9776',
      link: 'https://www.target.com.br/produtos/normas-tecnicas/36401/nbr9776-agregados-determinacao-da-massa-especifica-de-agregados-miudos-por-meio-do-frasco-chapman',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('chapman.specifyMass'), path: 'specify-mass-chapman' },
      { step: 2, description: t('results'), path: 'results' },
    ],
  };

  store_actions: ChapmanActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as ChapmanData['generalData']);
          break;
        case 1:
          await this.calculateResults(data as ChapmanData);
          break;
        case 2:
          await this.saveEssay(data as ChapmanData);
          break;
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };

  /** @generalData Methods for general-data (step === 0, page 1) */
  // get all materials from user from backend
  getmaterialsByUserId = async (userId: string): Promise<ConcreteMaterial> => {
    try {
      const { data } = await Api.get(`/concrete/materials/all/${userId}`);
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  // send general data to backend to verify if there is already a CBR essay with same name for the sample
  submitGeneralData = async (generalData: ChapmanData['generalData']): Promise<void> => {
    try {
      const { name, material } = generalData;

      // verify if name and material are not empty
      if (!name) throw t('errors.empty-name');
      if (!material) throw t('errors.empty-material');

      // verify if there is already a CHAPMAN essay with same name for the material
      const response = await Api.post(`${this.info.backend_path}/verify-init`, generalData);

      const { success, error } = response.data;

      // if there is already a CHAPMAN essay with same name for the material, throw error
      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  /** @chapmanData Methods for chapman-data (step === 1, page 2) */
  // calculate results
  calculateResults = async (chapmanData: ChapmanData): Promise<void> => {
    try {
      //verify if displaced_volume (only input) is blank
      if (!chapmanData.step2Data.displaced_volume) throw t('errors.empty-displaced-volume');

      // calculate results
      const response = await Api.post(`${this.info.backend_path}/calculate-results`, chapmanData);

      const { success, error, result } = response.data;

      if (success === false) throw error.name;

      this.store_actions.setData({ step: 2, value: result });
    } catch (error) {
      throw error;
    }
  };

  /** @saveEssay Methods for save-essay (step === 2, page 3) */
  // save essay
  saveEssay = async (store: ChapmanData): Promise<void> => {
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
    } catch (error) {
      throw error;
    }
  };
}

export default CHAPMAN_SERVICE;
