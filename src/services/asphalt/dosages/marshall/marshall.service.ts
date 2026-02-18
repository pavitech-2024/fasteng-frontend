import Api from '@/api';
import { MarshallIconPng } from '@/assets';
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
      name: 'DNIT-ME 043/95',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_447_2024_me.pdf',
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
          await this.submitGeneralData(data as MarshallData, this.userId, isConsult);
          break;
        case 1:
          await this.submitMaterialSelection(data as MarshallData, this.userId, null, isConsult);
          const { materialSelectionData, generalData } = data as MarshallData;
          await this.getStep3Data(generalData, materialSelectionData, this.userId, isConsult);
          break;
        case 2:
          await this.submitGranulometryComposition(data as MarshallData, this.userId, null, isConsult);
          break;
        case 3:
          // this.calculateBinderTrialData(
          //   data as MarshallData['binderTrialData'],
          //   data as MarshallData['granulometryCompositionData'],
          //   data as MarshallData['materialSelectionData']
          // );
          await this.submitBinderTrialData(data as MarshallData, this.userId, null, isConsult);
          break;
        case 4:
          await this.submitMaximumMixtureDensityData(data as MarshallData, this.userId, null, isConsult);
          break;
        case 5:
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
      throw error;
    }
  };

  // send general data to backend to verify if there is already a Marshall dosage with same name for the material
  submitGeneralData = async (data: MarshallData, userId: string, isConsult = false): Promise<void> => {
    const user = userId || data.generalData.userId;
    if (!isConsult) {
      try {
        const { name } = data.generalData;

        if (!name) throw t('errors.empty-project-name');

        const dataWithDosageId = {
          generalData: data.generalData,
          _id: data._id,
        }

        const response = await Api.post(`${this.info.backend_path}/verify-init/${user}`, dataWithDosageId);

        const { success, dosage, error } = response.data;

        if (!success) throw error.name;

        const newGeralData = data.generalData

        this.store_actions.setData({ step: 10, value: {...dosage, generalData: newGeralData}  });
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

  getIndexesOfMissesSpecificGravity = async (materialData: MarshallData['materialSelectionData']) => {
    const { aggregates } = materialData;
    try {
      const response = await Api.post(`${this.info.backend_path}/get-specific-mass-indexes`, aggregates);

      const { success, error } = response.data;
      const { missesSpecificGravity } = response.data.data;

      if (success === false) throw error.name;

      return missesSpecificGravity;
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
    }
  };

  getStep3Data = async (
    generalData: MarshallData['generalData'],
    step2Data: MarshallData['materialSelectionData'],
    user: string,
    isConsult?: boolean
  ): Promise<any> => {
    if (!isConsult) {
      try {
        const { dnitBand } = generalData;

        const { aggregates } = step2Data;

        const response = await Api.post(`${this.info.backend_path}/step-3-data`, {
          dnitBand,
          aggregates,
        });

        const { data, success, error } = response.data;

        if (success === false) throw error.name;

        return data;
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

      // Reduzimos a matriz somando todos os valores de todas as propriedades de cada objeto.
      const inputsSum = percentageInputs.reduce((sum, input) => {
        return sum + Object.values(input).reduce((objSum, value) => objSum + value, 0);
      }, 0);

      // Verificamos se a soma total é 100.
      if (inputsSum !== 100) throw t('errors.invalid-inputs-sum');

      const response = await Api.post(`${this.info.backend_path}/calculate-granulometry`, {
        dnitBands: dnitBandLetter,
        percentageInputs,
        tableRows: table_data.table_rows,
      });

      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      const { percentsOfMaterials, pointsOfCurve, sumOfPercents, table_data: tableData, projections, bands } = data;

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
          dnitBands,
          bands,
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
          dnitBands,
          bands,
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
            dnitBands,
            bands,
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
        if (percentsOfDosage.length === 0) throw t('errors.binder-trial-not-calculated');

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
        throw error;
      }
    }
  };

  calculateMaximumMixtureDensityDMT = async (
    step2Data: MarshallData['materialSelectionData'],
    step4Data: MarshallData['binderTrialData'],
    maximumMixtureDensityData: MarshallData['maximumMixtureDensityData']
  ): Promise<any> => {
    const { aggregates } = step2Data;
    const { missingSpecificMass, listOfSpecificGravities } = maximumMixtureDensityData;
    const { newPercentOfDosage, trial } = step4Data;
    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-step-5-dmt-data`, {
        aggregates,
        percentsOfDosage: newPercentOfDosage,
        trial,
        missingSpecificGravity: missingSpecificMass,
        listOfSpecificGravities
      });

      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      return data;
    } catch (error) {
      throw error;
    }
  };

  calculateRiceTest = async (maximumMixtureDensityData: MarshallData['maximumMixtureDensityData']): Promise<any> => {
    const { riceTest, temperatureOfWater } = maximumMixtureDensityData;
    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-step-5-rice-test`, {
        riceTest,
        temperatureOfWater,
      });

      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      const result = {
        ...maximumMixtureDensityData,
        ...data,
      };

      return result;
    } catch (error) {
      throw error;
    }
  };

  calculateGmmData = async (
    step2Data: MarshallData['materialSelectionData'],
    maximumMixtureDensityData: MarshallData['maximumMixtureDensityData']
  ): Promise<any> => {
    const { gmm, temperatureOfWater } = maximumMixtureDensityData;
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
        ...maximumMixtureDensityData,
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
        throw error;
      }
    }
  };

  setVolumetricParametersData = async (
    step6Data: MarshallData['volumetricParametersData'],
    step4Data: MarshallData['binderTrialData'],
    maximumMixtureDensityData: MarshallData['maximumMixtureDensityData'],
    isConsult?: boolean
  ): Promise<any> => {
    const volumetricParametersData = step6Data;
    const { percentsOfDosage, trial } = step4Data;
    const { maxSpecificGravity, temperatureOfWater } = maximumMixtureDensityData;
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
    maximumMixtureDensityData: MarshallData['maximumMixtureDensityData'],
    step4Data: MarshallData['binderTrialData'],
    step7Data: MarshallData['optimumBinderContentData']
  ): Promise<any> => {
    const { percentageInputs } = step3Data;
    const { maxSpecificGravity, listOfSpecificGravities } = maximumMixtureDensityData;
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
        throw error;
      }
    }
  };

  confirmSpecificGravity = async (
    step3Data: MarshallData['granulometryCompositionData'],
    maximumMixtureDensityData: MarshallData['maximumMixtureDensityData'],
    step7Data: MarshallData['optimumBinderContentData'],
    step8Data: MarshallData['confirmationCompressionData'],
    isRiceTest: boolean
  ): Promise<any> => {
    const { percentageInputs } = step3Data;
    const { listOfSpecificGravities } = maximumMixtureDensityData;
    const { gmmInput, riceTest } = step8Data;
    const { optimumContent, confirmedPercentsOfDosage } = step7Data.optimumBinder;
    let method;
    let result;

    if (isRiceTest) {
      method = 'GMM';
    } else {
      method = maximumMixtureDensityData.maxSpecificGravity.method;
    }

    try {
      const response = await Api.post(`${this.info.backend_path}/confirm-specific-gravity`, {
        method,
        listOfSpecificGravities,
        percentsOfDosage: percentageInputs,
        confirmedPercentsOfDosage,
        optimumContent,
        gmm: gmmInput,
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
    maximumMixtureDensityData: MarshallData['maximumMixtureDensityData'],
    step7Data: MarshallData['optimumBinderContentData'],
    step8Data: MarshallData['confirmationCompressionData']
  ): Promise<any> => {
    const { listOfSpecificGravities } = maximumMixtureDensityData;
    const { optimumContent, confirmedPercentsOfDosage } = step7Data.optimumBinder;
    const { optimumBinder } = step8Data;
    const { result: resultNumber } = step8Data.confirmedSpecificGravity;
    const {  temperatureOfWater } = step8Data;
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
        throw error;
      }
    }
  };saveFatigueCurve = async (data: { dosageId: string; ncp?: string; k1?: string; k2?: string; r2?: string; obs?: string }) => {
  try {
    
    const { dosageId, ncp, k1, k2, r2, obs } = data;
    
    // 1. Verifique e limpe o ID
    if (!dosageId || dosageId.trim() === '') {
      throw new Error('ID da dosagem não fornecido');
    }
    
    // 2. Encode o ID para URL
    const encodedId = encodeURIComponent(dosageId.trim());
    
    // 3. Prepare os dados
    const fatigueData = {
      ncp: ncp && ncp.trim() !== '' ? Number(ncp) : undefined,
      k1: k1 && k1.trim() !== '' ? Number(k1) : undefined,
      k2: k2 && k2.trim() !== '' ? Number(k2) : undefined,
      r2: r2 && r2.trim() !== '' ? Number(r2) : undefined,
      observations: obs && obs.trim() !== '' ? obs.trim() : undefined,
    };
    
    
    // 4. Construa a URL
    const basePath = this.info.backend_path; // 'asphalt/dosages/marshall'
    const url = `${basePath}/${encodedId}/fatigue-curve`;
    
    // 5. Faça a requisição
    const response = await Api.patch(url, fatigueData);
    
    
    const { success, error } = response.data;
    
    if (!success) {
      console.error('❌ Erro do backend:', error);
      throw error?.message || error?.name || 'Erro ao salvar curva de fadiga';
    }
    
    return response.data;
    
  } catch (error: any) {
    console.error('💥 ERRO CRÍTICO ao salvar curva de fadiga:', error);
    console.error('💥 Mensagem:', error.message);
    console.error('💥 Stack:', error.stack);
    
    // Para erros de rede/404
    if (error.response) {
      console.error('💥 Status:', error.response.status);
      console.error('💥 Data:', error.response.data);
    }
    
    throw new Error(`Falha ao salvar curva de fadiga: ${error.message}`);
  }
};

saveResilienceModule = async (data: { dosageId: string; k1?: string; k2?: string; k3?: string; r2?: string }) => {
  try {
    
    const { dosageId, k1, k2, k3, r2 } = data;
    
    // 1. Verifique e limpe o ID
    if (!dosageId || dosageId.trim() === '') {
      throw new Error('ID da dosagem não fornecido');
    }
    
    // 2. Encode o ID para URL
    const encodedId = encodeURIComponent(dosageId.trim());
    
    // 3. Prepare os dados
    const resilienceData = {
      k1: k1 && k1.trim() !== '' ? Number(k1) : undefined,
      k2: k2 && k2.trim() !== '' ? Number(k2) : undefined,
      k3: k3 && k3.trim() !== '' ? Number(k3) : undefined,
      r2: r2 && r2.trim() !== '' ? Number(r2) : undefined,
    };
    
    
    // 4. Construa a URL
    const basePath = this.info.backend_path; // 'asphalt/dosages/marshall'
    const url = `${basePath}/${encodedId}/resilience-module`;
    
    // 5. Faça a requisição
    const response = await Api.patch(url, resilienceData);
    
    
    const { success, error } = response.data;
    
    if (!success) {
      console.error('❌ Erro do backend:', error);
      throw error?.message || error?.name || 'Erro ao salvar módulo de resiliência';
    }
    
    return response.data;
    
  } catch (error: any) {
    console.error('💥 ERRO CRÍTICO ao salvar módulo de resiliência:', error);
    console.error('💥 Mensagem:', error.message);
    
    if (error.response) {
      console.error('💥 Status:', error.response.status);
      console.error('💥 Data:', error.response.data);
    }
    
    throw new Error(`Falha ao salvar módulo de resiliência: ${error.message}`);
  }
};

}

export default Marshall_SERVICE;
