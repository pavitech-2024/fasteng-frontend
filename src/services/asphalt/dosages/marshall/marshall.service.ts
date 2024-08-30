import Api from '@/api';
import { MarshallIconPng } from '@/assets';
import MaterialSelectionTable from '@/components/concrete/dosages/abcp/tables/material-selection-table';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { MarshallActions, MarshallData } from '@/stores/asphalt/marshall/marshall.store';
import { t } from 'i18next';

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
      {
        step: 2,
        description: t('asphalt.dosages.marshall.granulometry_composition'),
        path: 'granulometry-composition',
      },
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
  handleNext = async (step: number, data: unknown, isConsult?: boolean): Promise<void> => {
    // Check if isConsult is undefined and assign false if so
    if (isConsult === undefined) isConsult = false;
    try {
      switch (step) {
        case 0:
          const { generalData: generalData} = data as MarshallData;
          await this.submitGeneralData(generalData, this.userId, isConsult);
          break;
        case 1:
          await this.submitMaterialSelection(data as MarshallData, this.userId, null, isConsult);
          const { materialSelectionData } = data as MarshallData;
          await this.getStep3Data(generalData, materialSelectionData, this.userId, isConsult);
          break;
        case 2:
          await this.submitGranulometryComposition(data as MarshallData, this.userId, null, isConsult);
          break;
        case 3:
          this.calculateBinderTrialData(
            data as MarshallData['binderTrialData'],
            data as MarshallData['granulometryCompositionData'],
            data as MarshallData['materialSelectionData']
          );
          await this.submitBinderTrialData(data as MarshallData, this.userId, null, isConsult);
          break;
        case 4:
          await this.submitMaximumMixtureDensityData(data as MarshallData, this.userId, null, isConsult);
          break;
        case 5:
          // await this.setVolumetricParametersData(
          //   data as MarshallData['volumetricParametersData'],
          //   data as MarshallData['binderTrialData'],
          //   data as MarshallData['maximumMixtureDensityData'],
          //   isConsult
          // );
          await this.submitVolumetricParametersData(data as MarshallData, this.userId, null, isConsult);
          break;
        case 6:
          await this.submitOptimumBinderContentData(data as MarshallData, this.userId, null, isConsult);
          break;
        case 7:
          await this.submitConfirmationCompressionData(data as MarshallData, this.userId, null, isConsult);
          break;
        case 8:
          await this.submitMarshalDosageData(data as MarshallData, this.userId, null, isConsult);
          break;
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      //throw error;
    }
  };

  // send general data to backend to verify if there is already a Marshall dosage with same name for the material
  submitGeneralData = async (
    generalData: MarshallData['generalData'],
    userId: string,
    isConsult?: boolean
  ): Promise<void> => {
    const user = userId ? userId : generalData.userId;
    if (!isConsult) {
      try {
        const { name } = generalData;

        // verify if the project name is not empty
        if (!name) throw t('errors.empty-project-name');

        // verify if there is already a Marshall dosage with same name for the material
        const response = await Api.post(`${this.info.backend_path}/verify-init/${user}`, generalData);

        const { success, error } = response.data;

        // if there is already a Marshall dosage with same project name, throw error
        if (success === false) throw error.name;
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

  getIndexesOfMissesSpecificGravity = async (materialData: MarshallData['materialSelectionData']) => {
    const { aggregates } = materialData;
    try {
      const response = await Api.post(`${this.info.backend_path}/get-specific-mass-indexes`, aggregates);

      const { success, error } = response.data;
      const { indexesOfMissesSpecificGravity } = response.data.data;

      if (success === false) throw error.name;

      return indexesOfMissesSpecificGravity;
    } catch (error) {
      throw error;
    }
  };

  // send the selected materials to backend
  submitMaterialSelection = async (
    data: MarshallData,
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
        // if (aggregates.length < 2) throw t('errors.empty-second-aggregate');
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

  getStep3Data = async (generalData: MarshallData['generalData'], step2Data: MarshallData['materialSelectionData'], user: string, isConsult?: boolean): Promise<any> => {
    if (!isConsult) {
      try {
        const { dnitBand } = generalData;

        const { aggregates } = step2Data;

        const response = await Api.post(`${this.info.backend_path}/step-3-data`, {
          dnitBand,
          aggregates,
        });

        const { data, success, error } = response.data;

        console.log(data);

        if (success === false) throw error.name;

        return data

        // this.store_actions.setData({ key: 'table_data', step: 2, value: table_data });
      } catch (error) {
        throw error;
      }
    }
  };

  calculateGranulometryComposition = async (
    calculateStep3Data: MarshallData['granulometryCompositionData'],
    generalData: MarshallData['generalData']
  ): Promise<any> => {
    try {
      const { dnitBand: dnitBandLetter } = generalData;
      const { percentageInputs, table_data } = calculateStep3Data;

      const response = await Api.post(`${this.info.backend_path}/calculate-step-3-data`, {
        dnitBands: dnitBandLetter,
        percentageInputs,
        tableRows: table_data.table_rows,
      });

      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      const {
        percentsOfMaterials,
        pointsOfCurve,
        sumOfPercents,
        table_data: tableData,
        projections,
        bands,
      } = data;

      const tableData2 = {
        table_rows: tableData,
        table_column_headers: calculateStep3Data.table_data.table_column_headers,
      };

      const granulometricResults = {
        ...calculateStep3Data,
        percentsOfMaterials,
        pointsOfCurve,
        sumOfPercents,
        table_data: tableData2,
        projections,
        bands,
      };

      return granulometricResults;
    } catch (error) {
      throw error;
    }
  };

  submitGranulometryComposition = async (
    data: MarshallData,
    userId: string,
    user?: string,
    isConsult?: boolean
  ): Promise<void> => {
    if (!isConsult) {
      try {
        const {
          table_data,
          pointsOfCurve,
          sumOfPercents,
          percentageInputs,
          percentsOfMaterials,
          graphData,
          projections,
        } = data.granulometryCompositionData;
        const { name } = data.generalData;
        const userData = userId ? userId : user;

        if (!table_data) throw t('errors.empty-aggregates');
        if (pointsOfCurve.length === 0) throw t('errors.empty-second-aggregate');
        if (sumOfPercents.length === 0) throw t('errors.empty-binder');
        if (Object.values(percentageInputs[0]).some((value) => value === null)) throw t('errors.empty-binder');
        if (percentsOfMaterials.length === 0) throw t('errors.empty-binder');

        const granulometryCompositionData = {
          table_data,
          pointsOfCurve,
          sumOfPercents,
          percentageInputs,
          percentsOfMaterials,
          graphData,
          projections,
          name,
          isConsult: null,
        };

        if (isConsult) granulometryCompositionData.isConsult = isConsult;

        const response = await Api.post(`${this.info.backend_path}/save-granulometry-composition-step/${userData}`, {
          granulometryCompositionData: {
            table_data,
            pointsOfCurve,
            sumOfPercents,
            percentageInputs,
            percentsOfMaterials,
            graphData,
            projections,
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

  calculateBinderTrialData = async (
    step4Data: MarshallData['binderTrialData'],
    step3Data: MarshallData['granulometryCompositionData'],
    step2Data: MarshallData['materialSelectionData']
  ): Promise<any> => {
    try {
      const { trial } = step4Data;

      const { binder } = step2Data;

      const percentsOfDosages = step3Data.percentageInputs;

      const response = await Api.post(`${this.info.backend_path}/calculate-step-4-data`, {
        trial,
        binder,
        percentsOfDosages,
      });

      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      const { bandsOfTemperatures, percentsOfDosage, newPercentOfDosage } = data;

      const resultObj = {
        bandsOfTemperatures,
        percentsOfDosage,
        newPercentOfDosage,
      };

      const result = {
        ...step4Data,
        ...resultObj,
      };

      return result;
    } catch (error) {
      throw error;
    }
  };

  submitBinderTrialData = async (
    data: MarshallData,
    userId: string,
    user?: string,
    isConsult?: boolean
  ): Promise<void> => {
    if (!isConsult) {
      try {
        const { trial, percentsOfDosage, bandsOfTemperatures, newPercentOfDosage } = data.binderTrialData;
        const { name } = data.generalData;
        const userData = userId ? userId : user;

        if (!trial) throw t('errors.empty-trial');
        if (percentsOfDosage.length === 0) throw t('errors.empty-percents-dosage');

        const binderTrialData = {
          trial,
          percentsOfDosage,
          newPercentOfDosage,
          bandsOfTemperatures,
          name,
          isConsult: null,
        };

        if (isConsult) binderTrialData.isConsult = isConsult;

        const response = await Api.post(`${this.info.backend_path}/save-binder-trial-step/${userData}`, {
          binderTrialData: {
            trial,
            percentsOfDosage,
            newPercentOfDosage,
            bandsOfTemperatures,
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

  calculateMaximumMixtureDensityDMT = async (
    step2Data: MarshallData['materialSelectionData'],
    step4Data: MarshallData['binderTrialData'],
    step5Data: MarshallData['maximumMixtureDensityData']
  ): Promise<any> => {
    const { aggregates } = step2Data;
    const { indexesOfMissesSpecificGravity, missingSpecificMass } = step5Data;
    const { newPercentOfDosage, trial } = step4Data;
    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-step-5-dmt-data`, {
        aggregates,
        percentsOfDosage: newPercentOfDosage,
        trial,
        indexesOfMissesSpecificGravity,
        missingSpecificGravity: missingSpecificMass,
      });

      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      const { listOfSpecificGravities, maxSpecificGravity } = data;

      return data;
    } catch (error) {
      throw error;
    }
  };

  calculateRiceTest = async (step5Data: MarshallData['maximumMixtureDensityData']): Promise<any> => {
    const { riceTest, temperatureOfWater } = step5Data;
    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-step-5-rice-test`, {
        riceTest,
        temperatureOfWater,
      });

      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      const result = {
        ...step5Data,
        ...data,
      };

      return result;
    } catch (error) {
      throw error;
    }
  };

  calculateGmmData = async (
    step2Data: MarshallData['materialSelectionData'],
    step5Data: MarshallData['maximumMixtureDensityData']
  ): Promise<any> => {
    const { gmm, temperatureOfWater } = step5Data;
    const { aggregates } = step2Data;
    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-step-5-gmm-data`, {
        gmm,
        temperatureOfWaterGmm: temperatureOfWater,
        aggregates,
      });

      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      const result = {
        ...step5Data,
        ...data,
      };

      return result;
    } catch (error) {
      throw error;
    }
  };

  submitMaximumMixtureDensityData = async (
    data: MarshallData,
    userId: string,
    user?: string,
    isConsult?: boolean
  ): Promise<void> => {
    if (!isConsult) {
      try {
        const { maxSpecificGravity, temperatureOfWater, listOfSpecificGravities } = data.maximumMixtureDensityData;
        const { name } = data.generalData;
        const userData = userId ? userId : user;

        const maximumMixtureDensityData = {
          maxSpecificGravity,
          name,
          isConsult: null,
        };

        if (isConsult) maximumMixtureDensityData.isConsult = isConsult;

        const response = await Api.post(`${this.info.backend_path}/save-maximum-mixture-density-step/${userData}`, {
          maximumMixtureDensityData: {
            maxSpecificGravity,
            temperatureOfWater,
            name,
            listOfSpecificGravities,
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

  setVolumetricParametersData = async (
    step6Data: MarshallData['volumetricParametersData'],
    step4Data: MarshallData['binderTrialData'],
    step5Data: MarshallData['maximumMixtureDensityData'],
    isConsult?: boolean
  ): Promise<any> => {
    const volumetricParametersData = step6Data;
    const { percentsOfDosage, trial } = step4Data;
    const { maxSpecificGravity, temperatureOfWater } = step5Data;

    const { volumetricParameters, ...formattedVolumetricParameters } = volumetricParametersData;

    if (!isConsult) {
      try {
        const response = await Api.post(`${this.info.backend_path}/set-step-6-volumetric-parameters`, {
          volumetricParametersData: formattedVolumetricParameters,
          maxSpecificGravity,
          temperatureOfWater,
          trial,
          percentsOfDosage: percentsOfDosage[2],
        });

        const { data, success, error } = response.data;

        if (success === false) throw error.name;

        return data;
      } catch (error) {
        throw error;
      }
    }
  };

  submitVolumetricParametersData = async (
    data: MarshallData,
    userId: string,
    user?: string,
    isConsult?: boolean
  ): Promise<void> => {
    console.log('aqui');
    if (!isConsult) {
      try {
        const volumetricParameters = data.volumetricParametersData;
        const { name } = data.generalData;
        const userData = userId ? userId : user;

        const volumetricParametersData = {
          ...volumetricParameters,
          name,
          isConsult: null,
        };

        if (isConsult) volumetricParametersData.isConsult = isConsult;

        const response = await Api.post(`${this.info.backend_path}/save-volumetric-parameters-step/${userData}`, {
          volumetricParametersData: {
            ...volumetricParameters,
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

  plotDosageGraph = async (dnitBand: string, volumetricParameters: any, trial: number, percentsOfDosage: any[]) => {
    try {
      const response = await Api.post(`${this.info.backend_path}/step-7-plot-dosage-graph`, {
        dnitBand,
        volumetricParameters,
        trial,
        percentsOfDosage,
      });

      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      return data;
    } catch (error) {
      throw error;
    }
  };

  setOptimumBinderContentData = async (
    generalData: MarshallData['generalData'],
    step3Data: MarshallData['granulometryCompositionData'],
    step6Data: MarshallData['volumetricParametersData'],
    step4Data: MarshallData['binderTrialData']
  ): Promise<any> => {
    const { dnitBand } = generalData;
    const { volumetricParameters } = step6Data;
    const { trial } = step4Data;
    let result;

    try {
      const response = await Api.post(`${this.info.backend_path}/set-step-7-optimum-binder`, {
        volumetricParametersData: volumetricParameters,
      });

      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      result = {
        ...data,
      };

      try {
        const { percentageInputs: percentsOfDosage } = step3Data;
        const dosageGraph = await this.plotDosageGraph(dnitBand, volumetricParameters, trial, percentsOfDosage);

        result = { ...result, dosageGraph: dosageGraph.optimumBinderDosageGraph };

        return result;
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  };

  setOptimumBinderExpectedParameters = async (
    step3Data: MarshallData['granulometryCompositionData'],
    step5Data: MarshallData['maximumMixtureDensityData'],
    step4Data: MarshallData['binderTrialData'],
    step7Data: MarshallData['optimumBinderContentData']
  ): Promise<any> => {
    const { percentageInputs } = step3Data;
    const { maxSpecificGravity, listOfSpecificGravities } = step5Data;
    const { trial } = step4Data;
    const { curveVv, curveRBV } = step7Data.optimumBinder;
    const { optimumContent, confirmedPercentsOfDosage } = step7Data.optimumBinder;
    let result;

    try {
      const response = await Api.post(`${this.info.backend_path}/step-7-get-expected-parameters`, {
        percentsOfDosage: percentageInputs,
        maxSpecificGravity,
        listOfSpecificGravities,
        trial,
        confirmedPercentsOfDosage,
        curveVv,
        curveRBV,
        optimumContent,
      });

      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      result = {
        ...data,
      };

      return result;
    } catch (error) {
      throw error;
    }
  };

  submitOptimumBinderContentData = async (
    data: MarshallData,
    userId: string,
    user?: string,
    isConsult?: boolean
  ): Promise<void> => {
    if (!isConsult) {
      try {
        const { optimumBinder, expectedParameters, graphics } = data.optimumBinderContentData;
        const { name } = data.generalData;
        const userData = userId ? userId : user;

        const optimumBinderContentData = {
          optimumBinder,
          expectedParameters,
          graphics,
          name,
          isConsult: null,
        };

        if (isConsult) optimumBinderContentData.isConsult = isConsult;

        const response = await Api.post(`${this.info.backend_path}/save-optimum-binder-content-step/${userData}`, {
          optimumBinderContentData: {
            optimumBinder,
            expectedParameters,
            graphics,
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

  confirmSpecificGravity = async (
    step3Data: MarshallData['granulometryCompositionData'],
    step5Data: MarshallData['maximumMixtureDensityData'],
    step7Data: MarshallData['optimumBinderContentData'],
    step8Data: MarshallData['confirmationCompressionData'],
    isRiceTest: boolean
  ): Promise<any> => {
    const { percentageInputs } = step3Data;
    const { listOfSpecificGravities } = step5Data;
    const { gmm, riceTest } = step8Data;
    const { optimumContent, confirmedPercentsOfDosage } = step7Data.optimumBinder;
    let method;
    let result;

    if (isRiceTest) {
      method = 'GMM';
    } else {
      method = step5Data.maxSpecificGravity.method;
    }

    try {
      const response = await Api.post(`${this.info.backend_path}/confirm-specific-gravity`, {
        method,
        listOfSpecificGravities,
        percentsOfDosage: percentageInputs,
        confirmedPercentsOfDosage,
        optimumContent,
        gmm,
        valuesOfSpecificGravity: riceTest,
      });

      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      result = {
        ...data,
      };

      return result;
    } catch (error) {
      throw error;
    }
  };

  confirmVolumetricParameters = async (
    step5Data: MarshallData['maximumMixtureDensityData'],
    step7Data: MarshallData['optimumBinderContentData'],
    step8Data: MarshallData['confirmationCompressionData']
  ): Promise<any> => {
    const { temperatureOfWater, listOfSpecificGravities } = step5Data;
    const { optimumContent, confirmedPercentsOfDosage } = step7Data.optimumBinder;
    const { optimumBinder } = step8Data;
    const { result: resultNumber } = step8Data.confirmedSpecificGravity;
    let result;

    const confirmVolumetricParameters = {
      valuesOfVolumetricParameters: optimumBinder,
      confirmedSpecificGravity: resultNumber,
      optimumContent,
      confirmedPercentsOfDosage,
      listOfSpecificGravities,
      temperatureOfWater,
    };

    try {
      const response = await Api.post(
        `${this.info.backend_path}/confirm-volumetric-parameters`,
        confirmVolumetricParameters
      );

      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      result = {
        ...data,
      };

      return result;
    } catch (error) {
      throw error;
    }
  };

  submitConfirmationCompressionData = async (
    data: MarshallData,
    userId: string,
    user?: string,
    isConsult?: boolean
  ): Promise<void> => {
    if (!isConsult) {
      try {
        const { confirmedSpecificGravity, optimumBinder, riceTest } = data.confirmationCompressionData;
        const { name } = data.generalData;
        const userData = userId ? userId : user;

        const confirmationCompressionData = {
          optimumBinder,
          confirmedSpecificGravity,
          riceTest,
          name,
          isConsult: null,
        };

        if (isConsult) confirmationCompressionData.isConsult = isConsult;

        const response = await Api.post(
          `${this.info.backend_path}/save-confirmation-compression-data-step/${userData}`,
          {
            confirmationCompressionData: {
              optimumBinder,
              confirmedSpecificGravity,
              riceTest,
              name,
            },
          }
        );

        const { success, error } = response.data;

        if (success === false) throw error.name;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  };

  submitMarshalDosageData = async (
    data: MarshallData,
    userId: string,
    user?: string,
    isConsult?: boolean
  ): Promise<void> => {
    if (!isConsult) {
      try {
        const userData = userId ? userId : user;

        const marshallDosageData = {
          ...data,
          isConsult: null,
        };

        if (isConsult) marshallDosageData.isConsult = isConsult;

        const response = await Api.post(
          `${this.info.backend_path}/save-marshall-dosage/${userData}`,
          marshallDosageData
        );

        const { success, error } = response.data;

        if (success === false) throw error.name;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  };
}

export default Marshall_SERVICE;
