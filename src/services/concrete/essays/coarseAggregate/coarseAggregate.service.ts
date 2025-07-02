import { CoarseAggregateIcon } from '@/assets';
import { t } from 'i18next';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import Api from '@/api';
import { ConcreteMaterial } from '@/interfaces/concrete';
import { CoarseAggregateData, CoarseAggregateActions } from '@/stores/concrete/coarseAggregate/coarseAggregate.store';
// import { persist } from 'zustand/middleware';

class COARSE_AGGREGATE_SERVICE implements IEssayService {
  info = {
    key: 'coarseAggregate',
    icon: CoarseAggregateIcon,
    title: t('concrete.essays.coarseAggregate'),
    path: '/concrete/essays/coarseAggregate',
    backend_path: 'concrete/essays/coarseAggregate',
    steps: 3,
    standard: {
      name: 'ABNT NM 53',
      link: 'https://www.normas.com.br/visualizar/abnt-nbr-nm/22881/abnt-nbrnm53-agregado-graudo-determinacao-de-massa-especifica-massa-especifica-aparente-e-absorcao-de-agua',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('coarseAggregate.specificData'), path: 'essay-data' },
      { step: 2, description: t('results'), path: 'results' },
    ],
  };

  store_actions: CoarseAggregateActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as CoarseAggregateData['generalData']);
          break;
        case 1:
          const { step2Data } = data as CoarseAggregateData;
          await this.submitStep2Data(step2Data);
          await this.calculateResults(data as CoarseAggregateData);
          break;
        case 2:
          await this.saveEssay(data as CoarseAggregateData);
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
      // get all materials from user from backend
      const response = await Api.get(`concrete/materials/all/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // get essay from material _id
  getCoarseAggregateByMaterialId = async (material_id: string) => {
    try {
      const response = await Api.get(`${this.info.backend_path}/get/${material_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // send general data to backend to verify if there is already a Granulometry essay with same name for the material
  submitGeneralData = async (generalData: CoarseAggregateData['generalData']): Promise<void> => {
    try {
      const { experimentName, material } = generalData;

      // verify if name and material are not empty
      if (!experimentName) throw t('errors.empty-name');
      if (!material) throw t('errors.empty-material');

      // verify if there is already a Granulometry essay with same name for the material
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { experimentName, material });

      const { success, error } = response.data;

      // if there is already a Coarse Aggregate essay with same name for the material, throw error
      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  /** @CoarseAggregateData Methods for Coarse AggregateData page (step === 1, page 2) */

  // verify inputs from Coarse Aggregate page (step === 1, page 2)
  submitStep2Data = async (step2Data: CoarseAggregateData['step2Data']): Promise<void> => {
    try {
      // verify if the values are not empty or negative
      if (!step2Data.drySampleMass) throw t('errors.coarseAggregate.empty-dry-sample-mass');
      if (step2Data.drySampleMass < 0) throw t('errors.coarseAggregate.negative-dry-sample-mass');
      if (!step2Data.saturatedSampleMass) throw t('errors.coarseAggregate.empty-saturated-sample-mass');
      if (step2Data.saturatedSampleMass < 0) throw t('errors.coarseAggregate.negative-saturated-sample-mass');
      if (!step2Data.submergedMass) throw t('errors.coarseAggregate.empty-submerged-mass');
      if (step2Data.submergedMass < 0) throw t('errors.coarseAggregate.negative-submerged-mass');
    } catch (error) {
      throw error;
    }
  };

  // calculate results from coarse aggregate essay
  calculateResults = async (store: CoarseAggregateData): Promise<void> => {
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
  saveEssay = async (store: CoarseAggregateData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/save-essay`, {
        generalData: {
          ...store.generalData,
          userId: this.userId,
        },
        step2Data: store.step2Data,
        result: store.result,
      });

      const { success, error } = response.data;

      if (success === false) throw error.name;

      // this.store_actions.reset( { step: null, value: null });
    } catch (error) {
      throw error;
    }
  };
}

export default COARSE_AGGREGATE_SERVICE;
