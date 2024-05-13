import { t } from 'i18next';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import Api from '@/api';
import { ABCPActions, ABCPData } from '@/stores/concrete/abcp/abcp.store';
import { ConcreteMaterial } from '@/interfaces/concrete';
import { AbcpLogo } from '@/assets';
import { ConcreteGranulometryData } from '@/stores/concrete/granulometry/granulometry.store';
import ABCP_Results from '@/components/concrete/dosages/abcp/step-5-dosage-resume';
import MaterialSelectionTable from '@/components/concrete/dosages/abcp/tables/material-selection-table';
// import { persist } from 'zustand/middleware';

type EssaySelection_Results = {
  cement: {
    _id: string;
    name: string;
  };
  fineAggregate: {
    name: string;
    _id: string;
    granulometrys: ConcreteGranulometryData[];
  };
  coarseAggregate: {
    name: string;
    _id: string;
    granulometrys: ConcreteGranulometryData[];
  };
};

class ABCP_SERVICE implements IEssayService {
  info = {
    key: 'abcp',
    icon: AbcpLogo,
    title: t('concrete.essays.abcp'),
    path: '/concrete/dosages/abcp',
    backend_path: 'concrete/dosages/abcp',
    steps: 5,
    standard: {
      name: '',
      link: 'https://abcp.org.br/wp-content/uploads/2020/07/Metodo_Dosagem_Concreto_ABCPonLINE_22.07.2020.pdf',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('abcp.material-selection'), path: 'materials-selection' },
      { step: 2, description: t('abcp.essay-selection'), path: 'essays-selection' },
      { step: 3, description: t('abcp.inserting-params'), path: 'inserting-params' },
      { step: 4, description: t('abcp.dosage-resume'), path: 'dosage-resume' },
    ],
  };

  store_actions: ABCPActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as ABCPData['generalData']);
          break;
        case 1:
          await this.submitMaterialSelection(data as ABCPData['materialSelectionData']);
          break;
        case 2:
          await this.submitEssaySelection(data as ABCPData['essaySelectionData']);
          break;
        case 3:
          await this.submitInsertParams(data as ABCPData['insertParamsData']);
          await this.calculateResults(data as ABCPData);
          break;
        case 4:
          await this.saveDosage(data as ABCPData);
          break;
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };

  /** @generalData Methods for general-data (step === 0, page 1) */

  // send general data to backend to verify if there is already a ABCP dosage with same name
  submitGeneralData = async (generalData: ABCPData['generalData']): Promise<void> => {
    try {
      const { name } = generalData;

      // verify if name and sample are not empty
      if (!name) throw t('errors.empty-name');

      // verify if there is already a ABCP essay with same name for the sample
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name });

      const { success, error } = response.data;

      // if there is already a ABCP essay with same name for the sample, throw error
      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  /** @materialSelection Methods for material-selection-data (step === 1, page 2) */

  // get all materials from user, that have the dosage essays
  getMaterialsByUserId = async (userId: string): Promise<ConcreteMaterial[]> => {
    try {
      const response = await Api.get(`${this.info.backend_path}/material-selection/${userId}`);

      const { materials, success, error } = response.data;
      if (success === false) throw error.name;
      else return materials;
    } catch (error) {
      throw error;
    }
  };

  // send the selected materials to backend
  submitMaterialSelection = async (materialSelection: ABCPData['materialSelectionData']): Promise<void> => {
    try {
      const { coarseAggregate, fineAggregate, cement } = materialSelection;

      if (!coarseAggregate) throw t('errors.empty-coarseAggregates');
      if (!fineAggregate) throw t('errors.empty-fineAggregates');
      if (!cement) throw t('errors.empty-binder');
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  /** @essaySelection Methods for essay-selection-data (step === 2, page 3) */

  // send the selected essays to backend
  submitEssaySelection = async (essaySelection: ABCPData['essaySelectionData']): Promise<void> => {
    try {
      // const { coarseAggregate, fineAggregate, cement } = essaySelection;
      // if (!coarseAggregate) throw t('errors.empty-coarseAggregates');
      // if (!fineAggregate) throw t('errors.empty-fineAggregates');
      // if (!cement) throw t('errors.empty-binder');
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // get essay from materials id
  getEssaysByMaterialId = async (
    userId: string,
    { cement, coarseAggregate, fineAggregate }: ABCPData['materialSelectionData']
  ): Promise<EssaySelection_Results> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/essay-selection`, {
        cement_id: cement,
        coarseAggregate_id: coarseAggregate,
        fineAggregate_id: fineAggregate,
      });

      const { essays, success, error } = response.data;

      console.log('aqui', essays);

      if (success === false) throw error.name;
      else return essays;
    } catch (error) {
      throw error;
    }
  };

  /** @insertParams Methods for insert-params-data (step === 3, page 4) */

  submitInsertParams = async ({ condition, fck, reduction }: ABCPData['insertParamsData']): Promise<void> => {
    try {
      if (reduction < 40 || reduction > 100) throw t('errors.invalid-reduction');
    } catch (error) {
      throw error;
    }
  };

  // calculate results from abcp dosage
  calculateResults = async (data: ABCPData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-results`, {
        generalData: data.generalData,
        materialSelectionData: data.materialSelectionData,
        essaySelectionData: data.essaySelectionData,
        insertParamsData: data.insertParamsData,
      });

      const { success, error, result } = response.data;

      if (success === false) throw error.name;

      this.store_actions.setData({ step: 4, value: result });
    } catch (error) {
      throw error;
    }
  };

  /** @Results Methods for Results page (step === 4, page 5) */

  // save dosage

  saveDosage = async (data: ABCPData) => {
    try {
      const response = await Api.post(`${this.info.backend_path}/save-dosage`, {
        generalData: {
          ...data.generalData,
          userId: this.userId,
        },
        materialSelectionData: data.materialSelectionData,
        essaySelectionData: data.essaySelectionData,
        insertParamsData: data.insertParamsData,
        results: data.results,
      });

      const { success, error } = response.data;

      if (success === false) throw error.name;

      // this.store_actions.reset( { step: null, value: null });
    } catch (error) {
      throw error;
    }
  };
}

export default ABCP_SERVICE;
