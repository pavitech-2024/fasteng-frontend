import Api from "@/api";
import { MarshallIconPng } from "@/assets";
import { AsphaltMaterial } from "@/interfaces/asphalt";
import { IEssayService } from "@/interfaces/common/essay/essay-service.interface";
import { MarshallActions, MarshallData } from "@/stores/asphalt/marshall/marshall.store";
import { t } from "i18next";

class Marshall_SERVICE implements IEssayService {
  info = {
    key: 'marshall',
    icon: MarshallIconPng,
    title: t('asphalt.dosages.marshall'),
    path: '/asphalt/dosages/marshall',
    backend_path: 'asphalt/dosages/marshall',
    steps: 9,
    standard: {
      name: '',
      link: '',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('asphalt.dosages.marshall.material_selection'), path: 'material-selection' },
      { step: 2, description: t('asphalt.dosages.marshall.granulometry_composition'), path: 'granulometry-composition' },
      { step: 3, description: t('asphalt.dosages.marshall.initial_binder'), path: 'initial-binder' },
      { step: 4, description: t('asphalt.dosages.marshall.max_density'), path: 'max-density' },
      { step: 5, description: t('asphalt.dosages.marshall.volumetric_parameters'), path: 'volumetric-parameters' },
      { step: 6, description: t('asphalt.dosages.marshall.optimal_binder'), path: 'optimal-binder' },
      { step: 7, description: t('asphalt.dosages.marshall.confirm_compression'), path: 'confirm-compression' },
      { step: 8, description: t('asphalt.dosages.marshall.dosage_resume'), path: 'dosage-resume' },
    ],
  };

  store_actions: MarshallActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as MarshallData['generalData']);
          break;
        case 1:
          const { generalData, materialSelectionData } = data as MarshallData;
          await this.submitMaterialSelection(materialSelectionData);
          await this.getStep3Data(generalData, materialSelectionData);
          break;
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  }

  // send general data to backend to verify if there is already a Marshall dosage with same name for the material
  submitGeneralData = async (generalData: MarshallData['generalData']): Promise<void> => {
    try {
      const { projectName } = generalData;

      // verify if the project name is not empty
      if (!projectName) throw t('errors.empty-project-name');

      // verify if there is already a Marshall dosage with same name for the material
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { projectName });

      const { success, error } = response.data;

      // if there is already a Marshall dosage with same project name, throw error
      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  /** @materialSelection Methods for material-selection-data (step === 1, page 2) */

  // get all materials from user, that have the dosage essays
  getMaterialsByUserId = async (userId: string): Promise<AsphaltMaterial[]> => {
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
  submitMaterialSelection = async (materialSelectionData: MarshallData['materialSelectionData']): Promise<void> => {
    try {
      const { aggregates, binder } = materialSelectionData;

      if (!aggregates) throw t('errors.empty-aggregates');
      if (!binder) throw t('errors.empty-binder');

      
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getStep3Data = async (generalData: MarshallData['generalData'], materialSelectionData: MarshallData['materialSelectionData']): Promise<void> => {
    try {
      
      const { dnitBand } = generalData;

      const { aggregates } = materialSelectionData;

      const response = await Api.post(`${this.info.backend_path}/step-3-data`, { 
        dnitBand: dnitBand, 
        aggregates: aggregates 
      });

      const { data, success, error } = response.data;

      console.log(data)

      if (success === false) throw error.name;

      const { dnitBands, granulometry_data } = data;

      this.store_actions.setData({ key: "dnitBands", step: 2, value: dnitBands });
      this.store_actions.setData({ key: "granulometry_data", step: 2, value: granulometry_data });
    } catch (error) {
      throw error;
    }
  }
}

export default Marshall_SERVICE;