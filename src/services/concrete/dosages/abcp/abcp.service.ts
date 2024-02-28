import { t } from 'i18next';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import Api from '@/api';
import { ABCPActions, ABCPData } from '@/stores/concrete/abcp/abcp.store';
import { ConcreteMaterial } from '@/interfaces/concrete';
import { AbcpLogo } from '@/assets';
import { ConcreteGranulometryData } from '@/stores/concrete/granulometry/granulometry.store';

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
  handleNext = async (targetStep: number, data: unknown, isConsult?: boolean): Promise<void> => {
    // Check if isConsult is undefined and assign false if so
    if (isConsult === undefined) isConsult = false;

    try {
      switch (targetStep) {
        case 0:
          await this.submitGeneralData(data as ABCPData['generalData'], this.userId, isConsult);
          break;
        case 1:
          await this.submitMaterialSelection(data as ABCPData, this.userId, null, isConsult);
          break;
        case 2:
          await this.submitEssaySelection(data as ABCPData, this.userId, isConsult);
          break;
        case 3:
          await this.submitInsertParams(data as ABCPData, this.userId, isConsult);
          await this.calculateResults(data as ABCPData, isConsult);
          break;
        case 4:
          await this.calculateResults(data as ABCPData, isConsult);
          await this.saveDosage(data as ABCPData, isConsult);
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
  submitGeneralData = async (data: ABCPData['generalData'], userId: string, isConsult?: boolean): Promise<void> => {
    const user = userId ? userId : data.userId;
    if (!isConsult) {
      try {
        // verify if there is already a ABCP dosage with same name for the sample
        const response = await Api.post(`${this.info.backend_path}/verify-init/${user}`, data);

        const { success, error } = response.data;

        // if there is already a ABCP dosage with same name for the sample, throw error
        if (success === false) throw error.name;
      } catch (error) {
        throw error;
      }
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

  // get essay from materials id
  getEssaysByMaterialId = async (
    data: ABCPData['essaySelectionData'] | ABCPData['materialSelectionData']
  ): Promise<EssaySelection_Results> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/essay-selection`, {
        cement: data.cement,
        coarseAggregate: data.coarseAggregate,
        fineAggregate: data.fineAggregate,
      });

      const { essays, success, error } = response.data;

      if (success === false) throw error.name;
      else return essays;
    } catch (error) {
      throw error;
    }
  };

  // send the selected materials to backend
  submitMaterialSelection = async (
    data: ABCPData,
    userId: string,
    user?: string,
    isConsult?: boolean
  ): Promise<void> => {
    if (!isConsult) {
      try {
        const { coarseAggregate, fineAggregate, cement } = data.materialSelectionData;
        const { name } = data.generalData;
        const userData = userId ? userId : user;

        if (!coarseAggregate) throw t('errors.empty-coarseAggregates');
        if (!fineAggregate) throw t('errors.empty-fineAggregates');
        if (!cement) throw t('errors.empty-binder');

        const materialSelectionData = {
          name,
          coarseAggregate,
          fineAggregate,
          cement,
          isConsult: null,
        };

        if (isConsult) materialSelectionData.isConsult = isConsult;

        const response = await Api.post(`${this.info.backend_path}/save-material-selection-step/${userData}`, {
          materialSelectionData: {
            name,
            coarseAggregate,
            fineAggregate,
            cement,
          },
        });

        const { success, error } = response.data;

        if (success === false) throw error.name;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  };

  /** @essaySelection Methods for essay-selection-data (step === 2, page 3) */

  // send the selected essays to backend
  submitEssaySelection = async (data: ABCPData, userId: string, isConsult?: boolean): Promise<void> => {
    if (!isConsult) {
      const { coarseAggregate, fineAggregate, cement } = data.essaySelectionData;

      const { name } = data.generalData;

      try {
        const response = await Api.post(`${this.info.backend_path}/save-essay-selection-step/${userId}`, {
          essaySelectionData: {
            name,
            fineAggregate,
            coarseAggregate,
            cement,
          },
        });

        const { success, error } = response.data;

        if (success === false) throw error.name;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  };

  /** @insertParams Methods for insert-params-data (step === 3, page 4) */

  submitInsertParams = async (data: ABCPData, userId: string, isConsult?: boolean): Promise<void> => {
    if (!isConsult) {
      try {
        const { reduction, fck, condition } = data.insertParamsData;
        const { name } = data.generalData;

        if (reduction < 40 || reduction > 100) throw t('errors.invalid-reduction');

        const response = await Api.post(`${this.info.backend_path}/save-insert-params-step/${userId}`, {
          insertParamsData: {
            name,
            reduction,
            fck,
            condition,
          },
        });

        const { success, error } = response.data;

        if (success === false) throw error.name;
      } catch (error) {
        throw error;
      }
    }
  };

  // calculate results from abcp dosage
  calculateResults = async (data: ABCPData, isConsult?: boolean): Promise<void> => {
    if (!isConsult) {
      try {
        const response = await Api.post(`${this.info.backend_path}/calculate-results`, {
          generalData: data.generalData,
          materialSelectionData: data.materialSelectionData,
          essaySelectionData: data.essaySelectionData,
          insertParamsData: data.insertParamsData,
        });

        const { success, error, result } = response.data;

        if (success === false) throw error.name;
        else {
          this.store_actions.setData({ step: 4, value: result });
          return result;
        }
      } catch (error) {
        throw error;
      }
    }
  };

  /** @Results Methods for Results page (step === 4, page 5) */

  // save dosage

  saveDosage = async (data: ABCPData, isConsult?: boolean) => {
    if (!isConsult) {
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
    }
  };
}

export default ABCP_SERVICE;
