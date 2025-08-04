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
      {
        step: 2,
        description: t('asphalt.dosages.superpave.granulometry_essay_result'),
        path: 'granulometry-essay-result',
      },
      {
        step: 3,
        description: t('asphalt.dosages.superpave.granulometry_composition'),
        path: 'granulometry-composition',
      },
      { step: 4, description: t('asphalt.dosages.superpave.initial_binder'), path: 'initial-binder' },
      { step: 5, description: t('asphalt.dosages.superpave.first_compression'), path: 'first-compression' },
      {
        step: 6,
        description: t('asphalt.dosages.superpave.first_compression_parameters'),
        path: 'first-curve-percentages',
      },
      {
        step: 7,
        description: t('asphalt.dosages.superpave.chosen_curve_percentages'),
        path: 'chosen-curve-percentages',
      },
      { step: 8, description: t('asphalt.dosages.superpave.second_compression'), path: 'second-compression' },
      {
        step: 9,
        description: t('asphalt.dosages.superpave.second_compression_parameters'),
        path: 'second-compression-parameters',
      },
      {
        step: 10,
        description: t('asphalt.dosages.superpave.confirmation_compression'),
        path: 'confirmation-compression',
      },
      { step: 11, description: t('asphalt.dosages.superpave.dosage_resume'), path: 'dosage-resume' },
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
          await this.validateGranulometryEssayData(data as SuperpaveData);
          await this.calculateGranulometryEssayData(data as SuperpaveData, isConsult);
          await this.submitGranulometryEssayData(data as SuperpaveData, this.userId, null, isConsult);
          break;
        case 2:
          await this.submitGranulometryEssayResults(data as SuperpaveData, this.userId, null, isConsult);
        case 3:
          await this.getGranulometricCompositionData(data as SuperpaveData, this.userId, isConsult);
          break;
        case 4:
          if (isConsult) {
            // await this.getGranulometricCompositionData(data as SuperpaveData, this.userId, isConsult);
          }
          await this.submitGranulometryComposition(data as SuperpaveData, this.userId, null, isConsult);
          await this.submitInitialBinder(data as SuperpaveData, this.userId, null, isConsult);
          break;
        case 5:
          const { granulometryEssayData } = data as SuperpaveData;
          await this.getFirstCompressionSpecificMasses(granulometryEssayData);
          await this.submitFirstCompression(data as SuperpaveData, this.userId, null, isConsult);
          break;
        case 6:
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
          // await this.submitPercentsOfChosenCurve(data as SuperpaveData, this.userId, null, isConsult);
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
          // await this.submitSecondCompressionParams(data as SuperpaveData, this.userId, null, isConsult);
          await this.submitConfirmattionCompression(data as SuperpaveData, this.userId, null, isConsult);
          break;
        case 11:
          await this.submitSuperpaveDosage(data as SuperpaveData, this.userId, null, isConsult);
          break;
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      if (step < 12) {
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
  getmaterialsByUserId = async (userId: string): Promise<AsphaltMaterial> => {
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

    data.granulometryEssayData?.data.granulometrys?.forEach((material, i) => {
      if (!material.material_mass) throw t('errors.empty-material-mass');
      if (material.material_mass < 0) throw t('errors.negative-material-mass');
    });

    // Verify if all the passant percentages are not empty or negative
    data.granulometryEssayData?.data.granulometrys?.forEach((material) => {
      material.table_data.forEach((row) => {
        if (row.passant === null) throw t('errors.empty-passant') + row.sieve_label;
        if (row.passant < 0) throw t('errors.negative-passant') + row.sieve_label;
      });
    });

    // Verify if the sum of the masses (retained + bottom) equals the material mass
    let retained = 0.0;

    data.granulometryEssayData?.data.granulometrys?.forEach((material) => {
      material.table_data.forEach((row) => {
        retained += row.retained;
      });
    });

    data.granulometryEssayData?.data.viscosity?.dataPoints?.forEach((point, index) => {
      if (!point.viscosity) throw `${t('errors.empty-viscosity')} + ${index}`;
      if (point.viscosity < 1) throw t('errors.zero-viscosity');
    });
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
        const granulometryEssayData = {
          granulometrys: data.granulometryEssayData.data.granulometrys,
          viscosity: data.granulometryEssayData.data.viscosity,
        };

        const response = await Api.post(
          `${this.info.backend_path}/calculate-granulometry-essay-data`,
          granulometryEssayData
        );

        const { success, error, granulometry, viscosity } = response.data;

        if (success === false) throw error.name;

        const formattedGranulometry = granulometry.map((item) => {
          return {
            material: item.material,
            result: item.result,
          };
        });

        this.store_actions.setData({
          step: 2,
          value: {
            granulometrys: formattedGranulometry,
            viscosity: { material: viscosity.material, result: viscosity.result },
          },
        });
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

        const response = await Api.post(`${this.info.backend_path}/save-granulometry-essay-data/${userData}`, {
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

  submitGranulometryEssayResults = async (
    data: SuperpaveData,
    userId: string,
    user?: string,
    isConsult?: boolean
  ): Promise<void> => {
    if (!isConsult) {
      try {
        const { name } = data.generalData;
        const userData = userId ? userId : user;

        const response = await Api.post(`${this.info.backend_path}/save-granulometry-essay-results/${userData}`, {
          granulometryEssayResults: {
            name,
            data: data.granulometryEssayData,
            results: data.granulometryResultsData,
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

  getGranulometricCompositionData = async (
    dosageData: SuperpaveData,
    user: string,
    isConsult?: boolean
  ): Promise<any> => {
    const step = dosageData.generalData.step;
    if (!isConsult || (isConsult && step === 2)) {
      try {
        const { dnitBand } = dosageData.generalData;
        const { granulometrys: resultsData } = dosageData.granulometryResultsData;
        const { data: essayStep } = dosageData.granulometryEssayData;
        const essayData = essayStep.granulometrys;

        let aggregates = essayData.map((item) => {
          return {
            data: item,
            results: resultsData.find((result) => result.material.name === item.material.name),
          };
        });

        aggregates = aggregates.filter(
          (agg) => agg.data.material.type !== 'asphaltBinder' && agg.data.material.type !== 'CAP'
        );

        const response = await Api.post(`${this.info.backend_path}/get-granulometric-composition-data`, {
          dnitBand: dnitBand,
          aggregates: aggregates,
        });

        const { data, success, error } = response.data;

        if (success === false) throw error.name;

        this.store_actions.setData({
          step: 3,
          value: {
            ...dosageData.granulometryCompositionData,
            ...data,
          },
        });
      } catch (error) {
        throw error;
      }
    } else {
      this.store_actions.setData({ step, value: dosageData });
    }
  };

  /**
   * Calculates the granulometry composition based on the user's input.
   * @param step4Data - The data of the granulometry composition calculation.
   * @param step2Data - The data of the material selection step.
   * @param step1Data - The data of the general step.
   * @param chosenCurves - The chosen curves of the lower, average and higher curves.
   * @returns The calculated granulometry composition.
   */
  calculateGranulometryComposition = async (
    granulometryCompositionData: SuperpaveData['granulometryCompositionData'],
    granulometryEssayData: SuperpaveData['granulometryEssayData'],
    generalData: SuperpaveData['generalData'],
    chosenCurves: any
  ): Promise<any> => {
    try {
      const { percentageInputs, nominalSize, percentsToList } = granulometryCompositionData;
      const { dnitBand } = generalData;
      const aggregates = granulometryEssayData.data.materials;

      const response = await Api.post(`${this.info.backend_path}/calculate-granulometric-composition-data`, {
        chosenCurves,
        percentageInputs,
        percentsToList,
        dnitBand,
        materials: aggregates,
        nominalSize,
      });

      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      const formattedData = { ...data };

      const prevData = { ...granulometryCompositionData, ...formattedData };

      return prevData;
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

  getFirstCompressionSpecificMasses = async (
    granulometryEssayData: SuperpaveData['granulometryEssayData']
  ): Promise<any> => {
    try {
      const { materials } = granulometryEssayData.data;

      const response = await Api.post(`${this.info.backend_path}/step-5-specific-masses`, {
        materials,
      });

      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      return { data, success, error };
    } catch (error) {}
  };

  calculateStep5Data = async (
    step1Data: SuperpaveData['generalData'],
    step2Data: SuperpaveData['granulometryEssayData'],
    step3Data: SuperpaveData['granulometryCompositionData'],
    step4Data: SuperpaveData['initialBinderData']
  ): Promise<any> => {
    try {
      const { trafficVolume } = step1Data;
      const { percentageInputs, chosenCurves, lowerComposition, averageComposition, higherComposition, nominalSize } =
        step3Data;
      const { materials, binderSpecificMass } = step4Data;
      const materialsWithoutBinder = materials.filter(
        (material) => material.type.includes('Aggregate') || material.type.includes('filler')
      );
      const hasNullValue = materialsWithoutBinder.some((obj) => Object.values(obj).some((value) => value === null));
      if (hasNullValue) throw new Error('Algum valor não foi informado.');
      let composition;

      if (chosenCurves.includes('lower')) composition = lowerComposition;
      if (chosenCurves.includes('average')) composition = averageComposition;
      if (chosenCurves.includes('higher')) composition = higherComposition;

      const response = await Api.post(`${this.info.backend_path}/calculate-step-5-data`, {
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

      const response = await Api.post(`${this.info.backend_path}/get-first-compression-parameters`, {
        granulometryComposition: compositions,
        trafficVolume,
        nominalSize,
        turnNumber,
        chosenCurves,
        porcentagesPassantsN200,
        binderSpecificGravity: binderSpecificMass,
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


  submitPercentsOfChosenCurve = async (
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

        const response = await Api.post(`${this.info.backend_path}/save-percents-of-chosen-curve-step/${userData}`, {
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

      const response = await Api.post(`${this.info.backend_path}/calculate-chosen-curve-percentages`, {
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
    initialBinderData: SuperpaveData['initialBinderData'],
    step5Data: SuperpaveData['firstCurvePercentagesData']
  ): Promise<any> => {
    const { halfLess, halfPlus, normal, onePlus, maximumDensities } = step7Data;
    const { binderSpecificMass, granulometryComposition } = initialBinderData;
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

  getSecondCompressionPercentages = async (
    firstCurvePercentagesData: SuperpaveData['firstCurvePercentagesData'],
    secondCompressionData: SuperpaveData['secondCompressionData']
  ): Promise<any> => {
    try {
      const { selectedCurve, table3 } = firstCurvePercentagesData;
      const { composition } = secondCompressionData;

      const expectedPli =
        selectedCurve === 'lower'
          ? table3.table3Lower.expectedPliLower
          : selectedCurve === 'average'
          ? table3.table3Average.expectedPliAverage
          : table3.table3Higher.expectedPliHigher;

      const response = await Api.post(`${this.info.backend_path}/get-second-compression-percentage-data`, {
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
    confirmationCompressionData: SuperpaveData['confirmationCompressionData'],
    isConsult?: boolean
  ) => {
    if (!isConsult) {
      try {
        const { table, gmm } = confirmationCompressionData;
        const { porcentagesPassantsN200, percentageInputs } = step2Data;
        const { optimumContent } = step8Data;
        const { binderSpecificMass, materials } = step3Data;
        const { selectedCurve, table3 } = step5Data;

        const dataCopy: any = {...confirmationCompressionData};
        const samplesData = table ? table : dataCopy.samplesData;

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
          samplesData: samplesData ? samplesData : confirmationCompressionData.table,
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
          ...data.confirmationCompressionData,
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
