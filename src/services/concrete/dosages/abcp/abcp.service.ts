import { t } from 'i18next';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import Api from '@/api';
import useABCPStore, { ABCPActions, ABCPData } from '@/stores/concrete/abcp/abcp.store';
import { ConcreteMaterial } from '@/interfaces/concrete';
import { AbcpLogo } from '@/assets';
import { ConcreteGranulometryData } from '@/stores/concrete/granulometry/granulometry.store';
import ABCP_Results from '@/components/concrete/dosages/abcp/step-5-dosage-resume';
import MaterialSelectionTable from '@/components/concrete/dosages/abcp/tables/material-selection-table';
import useAuth, { User } from '@/contexts/auth';
import { useRouter } from 'next/router';
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


  // /** @handleNext Receives the step and data from the form and calls the respective method */
  // handleNext = async (step: number, data: unknown): Promise<void> => {
  //   try {
  //     switch (step) {
  //       case 0:
  //         await this.submitGeneralData(data as ABCPData['generalData'], this.userId);
  //         break;
  //       case 1:
  //         await this.submitMaterialSelection(data as ABCPData, this.userId);
  //         break;
  //       case 2:
  //         await this.submitEssaySelection(data as ABCPData, this.userId);
  //         break;
  //       case 3:
  //         await this.submitInsertParams(data as ABCPData, this.userId);
  //         await this.calculateResults(data as ABCPData);
  //         break;
  //       case 4:
  //         await this.saveDosage(data as ABCPData);
  //         break;
  //       default:
  //         throw t('errors.invalid-step');
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // };
  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (targetStep: number, data: unknown, isConsult?: boolean, user?: string): Promise<void> => {
    try {
      if (targetStep < 0 || targetStep > this.info.steps) {
        throw new Error('Invalid target step');
      }

      let currentStep = Number(sessionStorage.getItem('abcp-step'));
      const storedDataString = sessionStorage.getItem('abcp-store');
      const parsedData = JSON.parse(storedDataString);
      let consultData;

      // Definindo isConsult como false se não for passado nenhum valor
      // isConsult = isConsult ?? false;
      isConsult = !parsedData.state.storedData._id ? false : true;

      if (isConsult) {
        currentStep = targetStep;
        sessionStorage.setItem('abcp-step', currentStep.toString())
        if (targetStep === 0 && isConsult) consultData = parsedData.state.storedData.generalData;
        if (targetStep === 1 && isConsult) consultData = parsedData.state.storedData.materialSelectionData;
        // if (targetStep === 2 && isConsult) consultData = { 
        //   ...parsedData.state.storedData.essaySelectionData, 
        //   name: parsedData.state.storedData.generalData.name
        // };
        if (targetStep === 2 && isConsult) consultData = parsedData.state.storedData.essaySelectionData;
        if (targetStep === 3 && isConsult) consultData = parsedData.state.storedData.insertParamsData;
      } else {
        consultData = data as ABCPData['generalData'];
      }

      switch (currentStep) {
        case 0:
          await this.submitGeneralData(consultData, this.userId, isConsult);
          break
        case 1:
          await this.submitMaterialSelection(data as ABCPData, this.userId, user);
          break;
        case 2:
          await this.submitEssaySelection(consultData, this.userId);
          break;
        case 3:
          await this.submitInsertParams(data as ABCPData, this.userId);
          await this.calculateResults(data as ABCPData);
          break;
        case 4:
          if (isConsult) {
            break
          } else {
            await this.saveDosage(data as ABCPData);
            break;
          }
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };

  /** @generalData Methods for general-data (step === 0, page 1) */

  // send general data to backend to verify if there is already a ABCP dosage with same name
  submitGeneralData = async (data: ABCPData['generalData'] | any, userId: string, isConsult?: boolean): Promise<void> => {
    const { name } = data;
    const userId2 = userId ? userId : data.userId;
    // const isConsult2 = !userId ? true : false;
    const isConsult2 = isConsult;
    try {

      // verify if name and sample are not empty
      //if (!name) throw t('errors.empty-name');

      // verify if there is already a ABCP essay with same name for the sample
      const response = await Api.post(`${this.info.backend_path}/verify-init/${userId2}`, { data, isConsult2 });

      const { success, error } = response.data;

      // if there is already a ABCP essay with same name for the sample, throw error
      if (success === false) throw error.name;
    } catch (error) {
      console.log('aqui')
      console.log("🚀 ~ ABCP_SERVICE ~ submitGeneralData= ~ userId:", userId)
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

  // get essay from materials id
  getEssaysByMaterialId = async (
    userId: string,
    data2: any
  ): Promise<EssaySelection_Results> => {
    console.log("🚀 ~ ABCP_SERVICE ~ data2:", data2)
    try {
      const response = await Api.post(`${this.info.backend_path}/essay-selection`, {
        //cement: cement,
        cement: {
          id: "64f03f83bd4afb4bb13aea45",
          type: "cement"
        },
        coarseAggregate: data2.coarseAggregate,
        fineAggregate: data2.fineAggregate,
      });

      const { essays, success, error } = response.data;

      if (success === false) throw error.name;
      else return essays;
    } catch (error) {
      throw error;
    }
  };

  // send the selected materials to backend
  submitMaterialSelection = async (data: ABCPData, userId: string, user?: string): Promise<void> => {
    try {
      const { coarseAggregate, fineAggregate } = data.essaySelectionData;
      const { name } = data.generalData;
      const userData = userId ? userId : user;

      if (!coarseAggregate) throw t('errors.empty-coarseAggregates');
      if (!fineAggregate) throw t('errors.empty-fineAggregates');
      //if (!cement) throw t('errors.empty-binder');

      const response = await Api.post(`${this.info.backend_path}/save-material-selection-step/${userData}`, {
        materialSelectionData: {
          name,
          coarseAggregate,
          fineAggregate,
          cement: {
            id: "64f03f83bd4afb4bb13aea45",
            type: "cement"
          }
        }
      });

      const { success, error } = response.data;

      if (success === false) throw error.name;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  /** @essaySelection Methods for essay-selection-data (step === 2, page 3) */

  // send the selected essays to backend
  submitEssaySelection = async (data: ABCPData | any, userId: string): Promise<void> => {
    console.log("🚀 ~ ABCP_SERVICE ~ submitEssaySelection= ~ data:", data)
    let coarseAggregate = data.coarseAggregate;
    let fineAggregate;
    let cement;
    let name;

    // if (data.essaySelectionData) {
    //   coarseAggregate = data.essaySelectionData.coarseAggregate;
    //   fineAggregate = data.essaySelectionData.fineAggregate;
    //   cement = data.essaySelectionData.cement;
    //   name = data.essaySelectionData.name;
    // } else {
    //   coarseAggregate = data.coarseAggregate;
    //   fineAggregate = data.fineAggregate;
    //   cement = data.cement;
    //   name = data.name;
    // }
    try {
      // const { coarseAggregate, fineAggregate, cement } = data.essaySelectionData;
      // const { name } = data.generalData

      // const { coarseAggregate, fineAggregate, cement } = essaySelection;
      // if (!coarseAggregate) throw t('errors.empty-coarseAggregates');
      // if (!fineAggregate) throw t('errors.empty-fineAggregates');
      // if (!cement) throw t('errors.empty-binder');

      const response = await Api.post(`${this.info.backend_path}/save-essay-selection-step/${userId}`, {
        essaySelectionData: {
          name,
          fineAggregate,
          coarseAggregate,
          cement
        }
      });

      const { success, error } = response.data;

      if (success === false) throw error.name;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  /** @insertParams Methods for insert-params-data (step === 3, page 4) */

  submitInsertParams = async (data: ABCPData, userId: string): Promise<void> => {
    console.log("🚀 ~ ABCP_SERVICE ~ submitInsertParams= ~ data:", data)
    try {
      const { reduction, fck, condition } = data.insertParamsData;
      const { name } = data.generalData;

      if (reduction < 40 || reduction > 100) throw t('errors.invalid-reduction');

      const response = await Api.post(`${this.info.backend_path}/save-insert-params-step/${userId}`, {
        insertParamsData: {
          name,
          reduction,
          fck,
          condition
        }
      });

      const { success, error } = response.data;

      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  // calculate results from abcp dosage
  calculateResults = async (data: ABCPData): Promise<void> => {
    try {
      const newMaterialData = { ...data.materialSelectionData };
      newMaterialData.cement = {
        id: "64f03f83bd4afb4bb13aea45",
        type: "cement"
      }

      console.log("🚀 ~ ABCP_SERVICE ~ calculateResults= ~ newMaterialData:", newMaterialData)

      const response = await Api.post(`${this.info.backend_path}/calculate-results`, {
        generalData: data.generalData,
        materialSelectionData: newMaterialData, //Teste
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
