import Api from '@/api';
import { SuperpaveIcon } from '@/assets';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { getSuperpaveStore, SuperpaveActions, SuperpaveData } from '@/stores/asphalt/superpave/superpave.store';
import { t } from 'i18next';

class Superpave_SERVICE implements IEssayService {
  userId: string;

  get store_actions(): SuperpaveActions {
    return getSuperpaveStore.getState();
  }

  info = {
    key: 'superpave',
    icon: SuperpaveIcon,
    title: t(''),
    path: '/asphalt/dosages/superpave',
    backend_path: 'asphalt/dosages/superpave',
    steps: 13,
    standard: {
      name: '',
      link: '',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('asphalt.dosages.superpave.granulometry_essay'), path: 'granulometry-essay' },
      { step: 2, description: t('asphalt.dosages.superpave.granulometry_essay_result'), path: 'granulometry-essay-result' },
      { step: 3, description: t('asphalt.dosages.superpave.material_selection'), path: 'material-selection' },
      {
        step: 4,
        description: t('asphalt.dosages.superpave.granulometry_composition'),
        path: 'granulometry-composition',
      },
      { step: 5, description: t('asphalt.dosages.superpave.initial_binder'), path: 'initial-binder' },
      { step: 6, description: t('asphalt.dosages.superpave.first_compression'), path: 'first-compression' },
      {
        step: 7,
        description: t('asphalt.dosages.superpave.first_compression_parameters'),
        path: 'first-curve-percentages',
      },
      {
        step: 8,
        description: t('asphalt.dosages.superpave.chosen_curve_percentages'),
        path: 'chosen-curve-percentages',
      },
      { step: 9, description: t('asphalt.dosages.superpave.second_compression'), path: 'second-compression' },
      {
        step: 10,
        description: t('asphalt.dosages.superpave.second_compression_parameters'),
        path: 'second-compression-parameters',
      },
      {
        step: 11,
        description: t('asphalt.dosages.superpave.confirmation_compression'),
        path: 'confirmation-compression',
      },
      { step: 12, description: t('asphalt.dosages.superpave.dosage_resume'), path: 'dosage-resume' },
    ],
  };

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown, isConsult?: boolean): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as SuperpaveData, this.userId, isConsult);
          break;
        case 1:
          await this.calculateGranulometryEssayData(data as SuperpaveData, isConsult);
          break;
        case 2:
          await this.submitGranulometryEssayData(data as SuperpaveData, this.userId, null, isConsult);
        case 3:
          await this.submitMaterialSelection(data as SuperpaveData, this.userId, null, isConsult);
          await this.getStep3Data(data as SuperpaveData, this.userId, isConsult);
          break;
        case 4:
          if (isConsult) {
            await this.getStep3Data(data as SuperpaveData, this.userId, isConsult);
          }
          await this.submitGranulometryComposition(data as SuperpaveData, this.userId, null, isConsult);
          break;
        case 5:
          const { materialSelectionData } = data as SuperpaveData;
          await this.getStep4SpecificMasses(materialSelectionData, isConsult);
          await this.submitInitialBinder(data as SuperpaveData, this.userId, null, isConsult);
          break;
        case 6:
          await this.submitFirstCompression(data as SuperpaveData, this.userId, null, isConsult);
          break;
        case 7:
          const { generalData, initialBinderData, granulometryCompositionData, firstCompressionData } =
            data as SuperpaveData;
          await this.getStepFirstCurvePercentages(
            generalData,
            granulometryCompositionData,
            initialBinderData,
            firstCompressionData,
            isConsult
          );
          await this.submitFirstCurvePercentages(data as SuperpaveData, this.userId, null, isConsult);
          const { firstCurvePercentagesData } = data as SuperpaveData;
          await this.getChosenCurvePercentages(generalData, granulometryCompositionData, firstCurvePercentagesData);
          break;
        case 8:
          await this.submitChosenCurvePercentages(data as SuperpaveData, this.userId, null, isConsult);
          break;
        case 9:
          await this.submitSecondCompressionData(data as SuperpaveData, this.userId, null, isConsult);
          break;
        case 10:
          await this.submitSecondCompressionParams(data as SuperpaveData, this.userId, null, isConsult);
          break;
        case 11:
          await this.submitConfirmattionCompression(data as SuperpaveData, this.userId, null, isConsult);
          break;
        case 12:
          await this.submitSuperpaveDosage(data as SuperpaveData, this.userId, null, isConsult);
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      if (step < 10) {
        throw error;
      }
    }
  };

  // send general data to backend to verify if there is already a Marshall dosage with same name for the material
  submitGeneralData = async (data: SuperpaveData, userId: string, isConsult = false): Promise<void> => {
    const user = userId || data.generalData.userId;
    if (!isConsult) {
      try {
        const { name } = data.generalData;

        if (!name) throw t('errors.empty-project-name');

        const response = await Api.post(`${this.info.backend_path}/verify-init/${user}`, data.generalData);

        const { success, dosage, error } = response.data;

        if (!success) throw error.name;

        this.store_actions.setData({ step: 12, value: { ...data, ...dosage } });
      } catch (error) {
        throw error;
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

  /**
   * Gets all materials from user, that have the dosage essays
   * @param userId user id
   * @returns materials list
   * @throws error if there is an error
   */
  validateGranulometryEssayData = async (data: SuperpaveData): Promise<void> => {
    // Verify if the material mass is not empty or negative
    if (!data.granulometryEssayData.material_mass) throw t('errors.empty-material-mass');
    if (data.granulometryEssayData.material_mass < 0) throw t('errors.negative-material-mass');

    // Verify if all the passant percentages are not empty or negative
    data.granulometryEssayData.table_data.forEach((row) => {
      if (row.passant == null || row.retained == null) throw t('errors.empty-sieve') + row.sieve_label;
      if (row.passant < 0 || row.retained < 0) throw t('errors.negative-sieve') + row.sieve_label;
    });

    // Verify if the sum of the masses (retained + bottom) equals the material mass
    let retained = 0.0;
    data.granulometryEssayData.table_data.forEach((row) => {
      retained += row.retained;
    });
    const sum = Math.round(100 * (retained + data.granulometryEssayData.bottom)) / 100;

    if (sum > data.granulometryEssayData.material_mass) {
      throw (
        t('errors.sieves-sum-not-equal-to-material-mass') +
        (data.granulometryEssayData.material_mass - sum) +
        'g.\n' +
        'Retida + Fundos: ' +
        sum
      );
    }
  };

  /**
   * Submit the granulometry essay data to the backend to calculate the results
   * @param data the data to be sent to the backend
   * @param userId the id of the user
   * @param user the user that is consulting the essay (optional)
   * @param isConsult is the user consulting the essay (optional)
   */
  calculateGranulometryEssayData = async (data: SuperpaveData, isConsult?: boolean): Promise<void> => {
    if (!isConsult) {
      try {
        const response = await Api.post(`${this.info.backend_path}/calculate-granulometry-essay-data`, data.granulometryEssayData);

        const { success, error, result } = response.data;
        console.log("🚀 ~ Superpave_SERVICE ~ calculateGranulometryEssayData= ~ response.data:", response.data)

        if (success === false) throw error.name;

        this.store_actions.setData({ step: 2, value: result });
      } catch (error) {
        throw error;
      }
    } else {
      this.store_actions.setAllData(data);
    }
  };

  submitGranulometryEssayData = async (
    data: SuperpaveData,
    userId: string,
    user?: string,
    isConsult?: boolean
  ): Promise<void> => {
    if (!isConsult) {
      try {
        const { name } = data.generalData;
        const userData = userId ? userId : user;

        const response = await Api.post(`${this.info.backend_path}/save-granulometry-essay-step/${userData}`, {
          granulometryEssayData: {
            name,
            data: data.granulometryEssayData,
          },
        });

        const { success, error } = response.data;

        if (success === false) throw error.name;
      } catch (error) {
        throw error;
      }
    } else {
      this.store_actions.setAllData(data);
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
        throw error;
      }
    } else {
      this.store_actions.setAllData(data);
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
          return data;
        } else {
          return data;
        }
      } catch (error) {
        throw error;
      }
    } else {
      this.store_actions.setData({ step, value: dosageData });
    }
  };

  /**
   * Calculates the granulometry composition based on the user's input.
   * @param calculateStep3Data - The data of the granulometry composition calculation.
   * @param step2Data - The data of the material selection step.
   * @param step1Data - The data of the general step.
   * @param chosenCurves - The chosen curves of the lower, average and higher curves.
   * @returns The calculated granulometry composition.
   */
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

      const selectedCurveInputs = chosenCurves.lower
        ? percentageInputs[0]
        : chosenCurves.average
        ? percentageInputs[1]
        : chosenCurves.higher
        ? percentageInputs[2]
        : percentageInputs;

      /**
       * Sums up the values of the selected curve inputs.
       * If selectedCurveInputs is not an object, returns 0.
       */
      const inputsSum =
        selectedCurveInputs instanceof Object
          ? Object.values(selectedCurveInputs).reduce((sum, input) => sum + Number(input), 0)
          : 0;

      if (inputsSum !== 100) throw t('errors.invalid-inputs-sum');

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
      const { percentageInputs, chosenCurves, lowerComposition, averageComposition, higherComposition, nominalSize } =
        step3Data;
      const { materials, binderSpecificMass } = step4Data;

      const hasNullValue = materials.some((obj) => Object.values(obj).some((value) => value === null));

      if (hasNullValue) throw new Error('Algum valor não foi informado.');
      // if (binderSpecificMass === null || binderSpecificMass === 0)
      //   return Error('A massa específica do ligante deve ser informada.');

      let composition;

      if (chosenCurves.lower) composition = lowerComposition;
      if (chosenCurves.average) composition = averageComposition;
      if (chosenCurves.higher) composition = higherComposition;

      const response = await Api.post(`${this.info.backend_path}/step-4-data`, {
        materials,
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

      return data;
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
        throw error;
      }
    }
  };

  calculateGmm = async (setp5Data: SuperpaveData['firstCompressionData']): Promise<any> => {
    try {
      const { riceTest } = setp5Data;

      const riceTestData = riceTest.filter((e) => {
        return !Object.values(e).some((value) => value === null);
      });

      const response = await Api.post(`${this.info.backend_path}/calculate-gmm`, {
        riceTest: riceTestData,
      });

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

      const compositions = [inferiorRows, intermediariaRows, superiorRows];
      const densities = [maximumDensity.lower, maximumDensity.average, maximumDensity.higher];

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
        percentageInputs,
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
        const { selectedCurve } = data.firstCurvePercentagesData;

        const firstCurvePercentagesData = {
          ...data.firstCurvePercentagesData,
          name,
          selectedCurve,
          isConsult: null,
        };

        if (isConsult) firstCurvePercentagesData.isConsult = isConsult;

        const response = await Api.post(`${this.info.backend_path}/save-first-curve-percentage-step/${userData}`, {
          firstCurvePercentagesData: {
            ...data.firstCurvePercentagesData,
            selectedCurve,
            name,
          },
        });

        const { success, error } = response.data;

        if (success === false) throw error.name;
      } catch (error) {
        throw error;
      }
    }
  };

  getChosenCurvePercentages = async (
    generalData: SuperpaveData['generalData'],
    step3Data: SuperpaveData['granulometryCompositionData'],
    step6Data: SuperpaveData['firstCurvePercentagesData']
  ): Promise<any> => {
    try {
      const { percentageInputs } = step3Data;

      const { selectedCurve, table3 } = step6Data;

      const { trafficVolume } = generalData;

      let curve;
      let percentsOfDosage;

      if (selectedCurve === 'lower') {
        curve = table3.table3Lower;
        percentsOfDosage = percentageInputs[0];
      }
      if (selectedCurve === 'average') {
        curve = table3.table3Average;
        percentsOfDosage = percentageInputs[1];
      }
      if (selectedCurve === 'higher') {
        curve = table3.table3Higher;
        percentsOfDosage = percentageInputs[2];
      }

      const response = await Api.post(`${this.info.backend_path}/step-7-parameters`, {
        curve,
        trafficVolume,
        percentsOfDosage,
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
        throw error;
      }
    }
  };

  calculateRiceTest = async (step7Data: SuperpaveData['secondCompressionData'], idx: number): Promise<any> => {
    const { maximumDensities } = step7Data;

    const maximumDensity = maximumDensities[idx].riceTest;

    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-step-7-rice-test`, maximumDensity);

      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      return data;
    } catch (error) {
      throw error;
    }
  };

  confirmSecondCompression = async (
    step7Data: SuperpaveData['secondCompressionData'],
    step3Data: SuperpaveData['granulometryCompositionData'],
    step4Data: SuperpaveData['initialBinderData'],
    step5Data: SuperpaveData['firstCurvePercentagesData']
  ): Promise<any> => {
    const { halfLess, halfPlus, normal, onePlus, maximumDensities } = step7Data;
    const { binderSpecificMass, granulometryComposition } = step4Data;
    const { percentageInputs, porcentagesPassantsN200 } = step3Data;
    const { selectedCurve, table3 } = step5Data;

    const composition = {
      halfLess,
      halfPlus,
      normal,
      onePlus,
    };

    let combinedGsb;
    let selectedPercentsOfDosage;
    let selectedGse;

    const hasNullValues = maximumDensities.some(
      (e) => e.insertedGmm === null && Object.values(e.riceTest).some((i) => i === null)
    );

    if (hasNullValues) throw t('errors.empty-gmm');

    const formattedCurveName = `${selectedCurve.charAt(0).toUpperCase() + selectedCurve.slice(1)}`;
    const propertyName = `table3${formattedCurveName}`;
    const expectedPli = table3[propertyName][`expectedPli${formattedCurveName}`];

    if (selectedCurve === 'lower') {
      combinedGsb = granulometryComposition[0].combinedGsb;
      selectedGse = granulometryComposition[0].gse;
      selectedPercentsOfDosage = percentageInputs[0];
    }
    if (selectedCurve === 'average') {
      combinedGsb = granulometryComposition[1].combinedGsb;
      selectedGse = granulometryComposition[1].gse;
      selectedPercentsOfDosage = percentageInputs[1];
    }
    if (selectedCurve === 'higher') {
      combinedGsb = granulometryComposition[2].combinedGsb;
      selectedGse = granulometryComposition[2].gse;
      selectedPercentsOfDosage = percentageInputs[2];
    }

    const percentsOfDosageValues = Object.values(selectedPercentsOfDosage).map((value) => Number(value));

    try {
      const response = await Api.post(`${this.info.backend_path}/confirm-second-compression-data`, {
        composition,
        binderSpecificGravity: binderSpecificMass,
        percentsOfDosage: percentsOfDosageValues,
        maximumDensities,
        expectedPli,
        combinedGsb,
        porcentagesPassantsN200,
        Gse: selectedGse,
      });

      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      return data;
    } catch (error) {
      throw error;
    }
  };

  submitSecondCompressionData = async (
    data: SuperpaveData,
    userId: string,
    user?: string,
    isConsult?: boolean
  ): Promise<void> => {
    if (!isConsult) {
      try {
        const { name } = data.generalData;
        const userData = userId ? userId : user;

        const secondCompressionData = {
          ...data.secondCompressionData,
          name,
          isConsult: null,
        };

        if (isConsult) secondCompressionData.isConsult = isConsult;

        const response = await Api.post(`${this.info.backend_path}/save-second-compression-data-step/${userData}`, {
          secondCompressionData: {
            ...data.secondCompressionData,
            name,
          },
        });

        const { success, error } = response.data;

        if (success === false) throw error.name;
      } catch (error) {
        throw error;
      }
    }
  };

  getSecondCompressionPercentages = async (step8Data: SuperpaveData['secondCompressionData']): Promise<any> => {
    try {
      const { expectedPli, composition } = step8Data;

      const response = await Api.post(`${this.info.backend_path}/get-step-9-data`, {
        expectedPli,
        composition,
      });

      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      return { data, success, error };
    } catch (error) {}
  };

  submitSecondCompressionParams = async (
    data: SuperpaveData,
    userId: string,
    user?: string,
    isConsult?: boolean
  ): Promise<void> => {
    if (!isConsult) {
      try {
        const { name } = data.generalData;
        const userData = userId ? userId : user;

        const secondCompressionParams = {
          ...data.secondCompressionPercentagesData,
          name,
          isConsult: null,
        };

        if (isConsult) secondCompressionParams.isConsult = isConsult;

        const response = await Api.post(`${this.info.backend_path}/save-second-compression-params-step/${userData}`, {
          secondCompressionParams: {
            ...data.secondCompressionPercentagesData,
            name,
          },
        });

        const { success, error } = response.data;

        if (success === false) throw error.name;
      } catch (error) {
        throw error;
      }
    }
  };

  calculateRiceTestStep9 = async (step9Data: SuperpaveData['confirmationCompressionData']) => {
    try {
      const { riceTest, gmm } = step9Data;

      const response = await Api.post(`${this.info.backend_path}/calculate-step-9-rice-test`, {
        riceTest,
        gmm,
      });

      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      return { data, success, error };
    } catch (error) {
      throw error;
    }
  };

  calculateDosageEquation = async (
    step2Data: SuperpaveData['granulometryCompositionData'],
    step3Data: SuperpaveData['initialBinderData'],
    step5Data: SuperpaveData['firstCurvePercentagesData'],
    step8Data: SuperpaveData['secondCompressionPercentagesData'],
    step9Data: SuperpaveData['confirmationCompressionData'],
    isConsult?: boolean
  ) => {
    if (!isConsult) {
      try {
        const { table: samplesData, gmm } = step9Data;
        const { porcentagesPassantsN200, percentageInputs } = step2Data;
        const { optimumContent } = step8Data;
        const { binderSpecificMass, materials } = step3Data;
        const { selectedCurve, table3 } = step5Data;

        let choosenGranulometryComposition;
        let selectedPercentsOfDosage;

        if (selectedCurve === 'lower') {
          choosenGranulometryComposition = table3.table3Lower;
          selectedPercentsOfDosage = percentageInputs[0];
        }
        if (selectedCurve === 'average') {
          choosenGranulometryComposition = table3.table3Average;
          selectedPercentsOfDosage = percentageInputs[1];
        }
        if (selectedCurve === 'higher') {
          choosenGranulometryComposition = table3.table3Higher;
          selectedPercentsOfDosage = percentageInputs[2];
        }

        const percentsOfDosageValues = Object.values(selectedPercentsOfDosage).map((item) => Number(item));

        choosenGranulometryComposition = {
          ...choosenGranulometryComposition,
          percentsOfDosage: percentsOfDosageValues,
        };

        const response = await Api.post(`${this.info.backend_path}/calculate-dosage-equation`, {
          samplesData,
          choosenGranulometryComposition,
          optimumContent,
          binderSpecificGravity: binderSpecificMass,
          listOfSpecificGravities: materials,
          porcentagesPassantsN200,
          gmm,
        });

        const { data, success, error } = response.data;

        if (success === false) throw error.name;

        return data;
      } catch (error) {
        throw error;
      }
    }
  };

  submitConfirmattionCompression = async (
    data: SuperpaveData,
    userId: string,
    user?: string,
    isConsult?: boolean
  ): Promise<void> => {
    if (!isConsult) {
      try {
        const { name } = data.generalData;
        const userData = userId ? userId : user;

        const confirmationCompressionData = {
          ...data.secondCompressionPercentagesData,
          name,
          isConsult: null,
        };

        if (isConsult) confirmationCompressionData.isConsult = isConsult;

        const response = await Api.post(`${this.info.backend_path}/save-confirmattion-compression-step/${userData}`, {
          confirmationCompressionData: {
            ...data.confirmationCompressionData,
            name,
          },
        });

        const { success, error } = response.data;

        if (success === false) throw error.name;
      } catch (error) {
        throw error;
      }
    }
  };

  submitSuperpaveDosage = async (
    superpaveData: SuperpaveData,
    userId: string,
    user?: string,
    isConsult?: boolean
  ): Promise<void> => {
    if (!isConsult) {
      try {
        const { name } = superpaveData.generalData;
        const userData = userId ? userId : user;

        const resumeDosage = {
          ...superpaveData.dosageResume,
          name,
          isConsult: null,
        };

        if (isConsult) resumeDosage.isConsult = isConsult;

        const response = await Api.post(`${this.info.backend_path}/save-superpave-dosage/${userData}`, {
          dosageResume: {
            ...superpaveData.dosageResume,
            name,
          },
        });

        const { data, success, error } = response.data;

        if (success === false) throw error.name;

        this.store_actions.setData({
          step: 10,
          value: {
            ...superpaveData,
            dosageResume: data.dosageResume,
          },
        });
      } catch (error) {
        throw error;
      }
    }
  };
}

export default Superpave_SERVICE;
