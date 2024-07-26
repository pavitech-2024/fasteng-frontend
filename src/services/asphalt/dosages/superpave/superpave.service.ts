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
          const { materialSelectionData } = data as SuperpaveData;
          await this.getStep4SpecificMasses(materialSelectionData, isConsult);
          await this.submitInitialBinder(data as SuperpaveData, this.userId, null, isConsult);
          break;
        case 4:
          await this.submitFirstCompression(data as SuperpaveData, this.userId, null, isConsult);
          break;
        case 5:
          const { generalData, initialBinderData, granulometryCompositionData, firstCompressionData } = data as SuperpaveData;
          await this.getStepFirstCurvePercentages(generalData, granulometryCompositionData, initialBinderData, firstCompressionData, isConsult);
          await this.submitFirstCurvePercentages(data as SuperpaveData, this.userId, null, isConsult);
          const { firstCurvePercentageData } = data as SuperpaveData
          await this.getChosenCurvePercentages(generalData, granulometryCompositionData, firstCurvePercentageData)
          break;
        case 6:
          await this.submitChosenCurvePercentages(data as SuperpaveData, this.userId, null, isConsult)
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

  getStep3Data = async (dosageData: SuperpaveData, user: string, isConsult?: boolean): Promise<any> => {
    const step = dosageData.generalData.step;
    if (!isConsult || (isConsult && step === 2)) {
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

      return data;
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
        binder,
      });

      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      return { data, success, error };
    } catch (error) {}
  };

  getStep4Data = async (
    step1Data: SuperpaveData['generalData'],
    step2Data: SuperpaveData['materialSelectionData'],
    step3Data: SuperpaveData['granulometryCompositionData'],
    step4Data: SuperpaveData['initialBinderData']
  ): Promise<any> => {
    try {
      const { trafficVolume } = step1Data;
      const { aggregates } = step2Data;
      const { percentageInputs, chosenCurves, lowerComposition, averageComposition, higherComposition, nominalSize } =
        step3Data;
      const { materials, binderSpecificMass } = step4Data;

      const hasNullValue = materials.some(obj => 
        Object.values(obj).some(value => value === null)
      );

      if (hasNullValue) throw new Error('Algum valor não foi informado.')
      if (binderSpecificMass === null || binderSpecificMass === 0) return Error('A massa específica do ligante deve ser informada.')

      let composition;

      if (chosenCurves.lower) composition = lowerComposition;
      if (chosenCurves.average) composition = averageComposition;
      if (chosenCurves.higher) composition = higherComposition;

      const response = await Api.post(`${this.info.backend_path}/step-4-data`, {
        materials: aggregates,
        percentsOfDosage: percentageInputs,
        specificMassesData: materials,
        chosenCurves,
        composition,
        binderSpecificMass,
        nominalSize,
        trafficVolume,
      });

      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      this.store_actions?.setData({ step: 3, value: { ...step4Data, ...data } });
    } catch (error) {
      throw error;
    }
  };

  submitInitialBinder = async (
    data: SuperpaveData,
    userId: string,
    user?: string,
    isConsult?: boolean
  ): Promise<void> => {
    if (!isConsult) {
      try {
        const { name } = data.generalData;
        const userData = userId ? userId : user;

        const initialBinderData = {
          ...data.initialBinderData,
          name,
          isConsult: null,
        };

        if (isConsult) initialBinderData.isConsult = isConsult;

        const response = await Api.post(`${this.info.backend_path}/save-initial-binder-step/${userData}`, {
          initialBinderData: {
            ...data.initialBinderData,
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

  calculateGmm = async (
    setp5Data: SuperpaveData['firstCompressionData'],
  ): Promise<any> => {
    try {
      const { riceTest } = setp5Data;

      const riceTestData = riceTest.filter((e) => {
        return !Object.values(e).some((value) => value === null);
      });
      
      const response = await Api.post(`${this.info.backend_path}/calculate-gmm`, {
        riceTest: riceTestData
      });

      console.log("🚀 ~ Superpave_SERVICE ~ response:", response)


      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      return data;
    } catch (error) {
      throw error;
    }
  };

  submitFirstCompression = async (
    data: SuperpaveData,
    userId: string,
    user?: string,
    isConsult?: boolean
  ): Promise<void> => {
    if (!isConsult) {
      try {
        const { name } = data.generalData;
        const userData = userId ? userId : user;

        const firstCompressionData = {
          ...data.firstCompressionData,
          name,
          isConsult: null,
        };

        if (isConsult) firstCompressionData.isConsult = isConsult;

        const response = await Api.post(`${this.info.backend_path}/save-first-compression-step/${userData}`, {
          firstCompressionData: {
            ...data.firstCompressionData,
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

  getStepFirstCurvePercentages = async (
    generalData: SuperpaveData['generalData'],
    step3Data: SuperpaveData['granulometryCompositionData'],
    step4Data: SuperpaveData['initialBinderData'], 
    step5Data: SuperpaveData['firstCompressionData'],
    isConsult?
  ): Promise<any> => {
    try {
      const { nominalSize, chosenCurves, porcentagesPassantsN200, percentageInputs } = step3Data;
      const { turnNumber, binderSpecificMass, granulometryComposition: binderCompositions } = step4Data;
      const { riceTest, inferiorRows, intermediariaRows, superiorRows, maximumDensity } = step5Data;
      const { trafficVolume } = generalData;

      let compositions = [inferiorRows, intermediariaRows, superiorRows];
      let densities = [maximumDensity.lower, maximumDensity.average, maximumDensity.higher]

      const response = await Api.post(`${this.info.backend_path}/step-5-parameters`, {
        granulometryComposition: compositions,
        trafficVolume,
        nominalSize,
        turnNumber,
        chosenCurves,
        binderSpecificGravity: binderSpecificMass,
        porcentagesPassantsN200,
        riceTest,
        maximumDensity: densities,
        binderCompositions,
        percentageInputs
      });

      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      return { data, success, error };
    } catch (error) {}
  };

  submitFirstCurvePercentages = async (
    data: SuperpaveData,
    userId: string,
    user?: string,
    isConsult?: boolean
  ): Promise<void> => {
    if (!isConsult) {
      try {
        const { name } = data.generalData;
        const userData = userId ? userId : user;
        const { selectedCurve } = data.firstCurvePercentageData;

        const firstCurvePercentagesData = {
          ...data.firstCurvePercentageData,
          name,
          selectedCurve,
          isConsult: null,
        };

        if (isConsult) firstCurvePercentagesData.isConsult = isConsult;

        const response = await Api.post(`${this.info.backend_path}/save-first-curve-percentage-step/${userData}`, {
          firstCurvePercentagesData: {
            ...data.firstCurvePercentageData,
            selectedCurve,
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

  getChosenCurvePercentages = async (
    generalData: SuperpaveData['generalData'],
    step3Data: SuperpaveData['granulometryCompositionData'],
    step6Data: SuperpaveData['firstCurvePercentageData'],
  ): Promise<any> => {
    try {
      const { percentageInputs } = step3Data;

      const { 
        selectedCurve, 
        table3
      } = step6Data;

      const { trafficVolume } = generalData;

      let curve;
      let percentsOfDosage;

      if (selectedCurve === 'lower') {
        curve = table3.table3Lower;
        percentsOfDosage = percentageInputs[0]
      } 
      if (selectedCurve === 'average') {
        curve = table3.table3Average;
        percentsOfDosage = percentageInputs[1]
      } 
      if (selectedCurve === 'higher') {
        curve = table3.table3Higher;
        percentsOfDosage = percentageInputs[2]
      } 

      const response = await Api.post(`${this.info.backend_path}/step-7-parameters`, {
        curve,
        trafficVolume,
        percentsOfDosage
      });

      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      return { data, success, error };
    } catch (error) {}
  };

  submitChosenCurvePercentages = async (
    data: SuperpaveData,
    userId: string,
    user?: string,
    isConsult?: boolean
  ): Promise<void> => {
    if (!isConsult) {
      try {
        const { name } = data.generalData;
        const userData = userId ? userId : user;
        const { porcentageAggregate, listOfPlis, trafficVolume } = data.chosenCurvePercentagesData;

        const chosenCurvePercentagesData = {
          ...data.chosenCurvePercentagesData,
          name,
          porcentageAggregate,
          listOfPlis,
          trafficVolume,
          isConsult: null,
        };

        if (isConsult) chosenCurvePercentagesData.isConsult = isConsult;

        const response = await Api.post(`${this.info.backend_path}/save-chosen-curve-percentage-step/${userData}`, {
          chosenCurvePercentagesData: {
            ...data.chosenCurvePercentagesData,
            porcentageAggregate,
            listOfPlis,
            trafficVolume,
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

  calculateRiceTest = async (step7Data: SuperpaveData['secondCompressionData'], idx: number): Promise<any> => {
    const { maximumDensities } = step7Data;

    const maximumDensity = maximumDensities[idx].riceTest;

    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-step-7-rice-test`, 
        maximumDensity
      );

      const { data, success, error } = response.data;
      console.log("🚀 ~ Superpave_SERVICE ~ calculateRiceTest= ~ data:", data)

      if (success === false) throw error.name;

      return data;
    } catch (error) {
      throw error;
    }
  };

  confirmSecondCompressionPercentages = async (step7Data: SuperpaveData['secondCompressionData'], idx: number): Promise<any> => {
    const { maximumDensities } = step7Data;

    const maximumDensity = maximumDensities[idx].riceTest;

    try {
      const response = await Api.post(`${this.info.backend_path}/confirm-second-compression-percentages`, 
        maximumDensity
      );

      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      return data;
    } catch (error) {
      throw error;
    }
  };
}

export default Superpave_SERVICE;
