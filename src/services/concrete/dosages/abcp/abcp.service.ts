import { t } from 'i18next';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import Api from '@/api';
import { ABCPActions, ABCPData } from '@/stores/concrete/abcp/abcp.store';
import { ConcreteMaterial } from '@/interfaces/concrete';
import { AbcpLogo } from '@/assets';
// import { persist } from 'zustand/middleware';

class ABCP_SERVICE implements IEssayService {
  info = {
    key: 'abcp',
    icon: AbcpLogo,
    title: t('concrete.essays.abcp'),
    path: '/concrete/dosages/abcp',
    backend_path: 'concrete/dosages/abcp',
    steps: 3,
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
  
  // get all materials from user from backend
  getMaterialsByUserId = async (userId: string): Promise<ConcreteMaterial[]> => {
    try {
      // get all materials from user from backend
      const response = await Api.get(`concrete/materials/all/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // send the selected materials to backend
  submitMaterialSelection = async (materialSelection: ABCPData['materialSelectionData']): Promise<void> => {
    try {
      const { coarseAggregates, fineAggregates, binder } = materialSelection;
      
      if (!coarseAggregates) throw t('errors.empty-coarseAggregates');
      if (!fineAggregates) throw t('errors.empty-fineAggregates');
      if (!binder) throw t('errors.empty-binder');


    } catch (error) {
      throw error;
    }
  }

  /** @essaySelection Methods for essay-selection-data (step === 2, page 3) */

  // get essay from material_id
  getGranulometryByMaterialId = async (material_id: string): Promise<any> => {
    try {
      const response = await Api.get(`${this.info.backend_path}/get/${material_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
}

export default ABCP_SERVICE;
