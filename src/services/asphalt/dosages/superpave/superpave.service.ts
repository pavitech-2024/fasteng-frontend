import Api from '@/api';
import { SuperpaveIcon } from '@/assets';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { SuperpaveActions, SuperpaveData } from '@/stores/asphalt/superpave/superpave.store';
import { t } from 'i18next';

class Superpave_SERVICE implements IEssayService {
  info = {
    key: 'superpave',
    icon: SuperpaveIcon,
    title: t('asphalt.dosages.superpave'),
    path: '/asphalt/dosages/superpave',
    backend_path: 'asphalt/dosages/superpave',
    steps: 11,
    standard: {
      name: '',
      link: '',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('asphalt.dosages.superpave.material_selection'), path: 'material-selection' },
      {
        step: 2,
        description: t('asphalt.dosages.superpave.granulometry_composition'),
        path: 'granulometry-composition',
      },
      { step: 3, description: t('asphalt.dosages.superpave.initial_binder'), path: 'initial-binder' },
      { step: 4, description: t('asphalt.dosages.superpave.first_compression'), path: 'first-compression' },
      {
        step: 6,
        description: t('asphalt.dosages.superpave.chosen_curve_percentages'),
        path: 'chosen-curve-percentages',
      },
      { step: 7, description: t('asphalt.dosages.superpave.second_compression'), path: 'second-compression' },
      { step: 8, description: t('asphalt.dosages.superpave.second_compression_parameters'), path: 'dosage-resume' },
      {
        step: 9,
        description: t('asphalt.dosages.superpave.confirmation_compression'),
        path: 'confirmation-compression',
      },
      { step: 10, description: t('asphalt.dosages.superpave.dosage_resume'), path: 'dosage-resume' },
    ],
  };

  store_actions: SuperpaveActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown, isConsult?: boolean): Promise<void> => {
    try {
      switch (step) {
        case 0:
          const { generalData: generalDataStep1 } = data as SuperpaveData;
          await this.submitGeneralData(generalDataStep1, this.userId, isConsult);
          break;
        case 1:
          await this.submitMaterialSelection(data as SuperpaveData, this.userId, null, isConsult);
          await this.getStep3Data(data as SuperpaveData, this.userId, isConsult);
          break;
        case 2:
          if (isConsult) {
            await this.getStep3Data(data as SuperpaveData, this.userId, isConsult);
          }
          await this.submitGranulometryComposition(data as SuperpaveData, this.userId, null, isConsult);
          break;
        case 3:
          const { materialSelectionData, initialBinderData } = data as SuperpaveData;
          await this.getStep4SpecificMasses(materialSelectionData, isConsult)
          break;
        case 4:
          break;
        case 5:
          break;
        case 6:
          break;
        case 7:
          break;
        case 8:
          break;
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };

  // send general data to backend to verify if there is already a Superpave dosage with same name for the material
  submitGeneralData = async (
    generalData: SuperpaveData['generalData'],
    userId: string,
    isConsult?: boolean
  ): Promise<void> => {
    const user = userId ? userId : generalData.userId;
    if (!isConsult) {
      try {
        const { name } = generalData;

        // verify if the project name is not empty
        if (!name) throw t('errors.empty-project-name');

        // verify if there is already a Superpave dosage with same name for the material
        const response = await Api.post(`${this.info.backend_path}/verify-init/${user}`, generalData);

        const { success, error } = response.data;

        // if there is already a Superpave dosage with same project name, throw error
        if (success === false) throw error.name;
      } catch (error) {
        // throw error;
      }
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
  submitMaterialSelection = async (
    data: SuperpaveData,
    userId: string,
    user?: string,
    isConsult?: boolean
  ): Promise<void> => {
    if (!isConsult) {
      try {
        const { aggregates, binder } = data.materialSelectionData;
        const { name } = data.generalData;
        const userData = userId ? userId : user;

        if (!aggregates) throw t('errors.empty-aggregates');
        if (!binder) throw t('errors.empty-binder');

        const materialSelectionData = {
          name,
          aggregates,
          binder,
          isConsult: null,
        };

        if (isConsult) materialSelectionData.isConsult = isConsult;

        const response = await Api.post(`${this.info.backend_path}/save-material-selection-step/${userData}`, {
          materialSelectionData: {
            name,
            aggregates,
            binder,
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

  getStep3Data = async (
    dosageData: SuperpaveData, 
    user: string, 
    isConsult?: boolean
  ): Promise<any> => {
    const step = dosageData.generalData.step;
    if (!isConsult || isConsult && step === 2) {
      try {
        const { dnitBand } = dosageData.generalData;
  
        const { aggregates } = dosageData.materialSelectionData;
  
        const response = await Api.post(`${this.info.backend_path}/step-3-data`, {
          dnitBand: dnitBand,
          aggregates: aggregates,
        });
  
        const { data, success, error } = response.data;
  
        if (success === false) throw error.name;
  
        if (step !== 2) {
          this.store_actions?.setData({ step: 2, value: { ...dosageData.granulometryCompositionData, ...data } });
        } else {
          return data;
        }
      } catch (error) {
        throw error;
      }
    }
  };

  calculateGranulometryComposition = async (
    calculateStep3Data: SuperpaveData['granulometryCompositionData'],
    step2Data: SuperpaveData['materialSelectionData'],
    step1Data: SuperpaveData['generalData'],
    chosenCurves: any
  ): Promise<any> => {
    try {
      const { percentageInputs, nominalSize, percentsToList } = calculateStep3Data;
      const { dnitBand } = step1Data;
      const { aggregates } = step2Data;

      const response = await Api.post(`${this.info.backend_path}/calculate-step-3-data`, {
        chosenCurves,
        percentageInputs,
        percentsToList,
        dnitBand,
        materials: aggregates,
        nominalSize,
      });

      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      return data
    } catch (error) {
      throw error;
    }
  };

  submitGranulometryComposition = async (
    data: SuperpaveData,
    userId: string,
    user?: string,
    isConsult?: boolean
  ): Promise<void> => {
    if (!isConsult) {
      try {
        const { name } = data.generalData;
        const userData = userId ? userId : user;

        const granulometryCompositionData = {
          ...data.granulometryCompositionData,
          name,
          isConsult: null,
        };

        if (isConsult) granulometryCompositionData.isConsult = isConsult;

        const response = await Api.post(`${this.info.backend_path}/save-granulometry-composition-step/${userData}`, {
          granulometryCompositionData: {
            ...data.granulometryCompositionData,
            name,
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

  getStep4SpecificMasses = async (step2Data: SuperpaveData['materialSelectionData'], isConsult?): Promise<any> => {
    try {
      const { aggregates, binder } = step2Data;

      const response = await Api.post(`${this.info.backend_path}/step-4-specific-masses`, {
        materials: aggregates,
        binder
      });

      const { data, success, error } = response.data;
      console.log("🚀 ~ Superpave_SERVICE ~ getStep4SpecificMasses= ~ data:", data)
  
      if (success === false) throw error.name;

      return data;
    } catch (error) {
      
    }
  }

  getStep4Data = async (
    step1Data: SuperpaveData['generalData'],
    step2Data: SuperpaveData['materialSelectionData'],
    step3Data: SuperpaveData['granulometryCompositionData'],
    step4Data: SuperpaveData['initialBinderData'], 
    isConsult?: boolean
  ): Promise<any> => {
    if (!isConsult) {
      try {
        const { trafficVolume } = step1Data;
        const { aggregates } = step2Data;
        const { percentageInputs, chosenCurves, lowerComposition, averageComposition, higherComposition, nominalSize } = step3Data;
        const { material_1, material_2, binderSpecificMass } = step4Data;

        let composition;

        if (chosenCurves.lower) composition = lowerComposition;
        if (chosenCurves.average) composition = averageComposition;
        if (chosenCurves.higher) composition = higherComposition;
        
        const response = await Api.post(`${this.info.backend_path}/step-4-data`, {
          materials: aggregates,
          percentsOfDosage: percentageInputs,
          materialsData: [material_1, material_2],
          chosenCurves,
          composition,
          binderSpecificMass,
          nominalSize
        });
  
        const { data, success, error } = response.data;
  
        if (success === false) throw error.name;
  
        this.store_actions?.setData({ step: 3, value: { ...step4Data, ...data } });
      } catch (error) {
        throw error;
      }
    }
  };
}

export default Superpave_SERVICE;
