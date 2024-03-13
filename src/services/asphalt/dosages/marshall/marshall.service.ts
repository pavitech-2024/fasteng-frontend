import Api from "@/api";
import { MarshallIconPng } from "@/assets";
import MaterialSelectionTable from "@/components/concrete/dosages/abcp/tables/material-selection-table";
import { AsphaltMaterial } from "@/interfaces/asphalt";
import { IEssayService } from "@/interfaces/common/essay/essay-service.interface";
import { MarshallActions, MarshallData } from "@/stores/asphalt/marshall/marshall.store";
import { constants } from "buffer";
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
  handleNext = async (step: number, data: unknown, isConsult?: boolean): Promise<void> => {
    // Check if isConsult is undefined and assign false if so
    if (isConsult === undefined) isConsult = false;
    try {
      switch (step) {
        case 0:
          const { generalData: generalDataStep1 } = data as MarshallData;
          await this.submitGeneralData(generalDataStep1, this.userId, isConsult);
          break;
        case 1:
          await this.submitMaterialSelection(data as MarshallData, this.userId, null, isConsult);
          await this.getStep3Data(data as MarshallData, this.userId, isConsult);
          break;
        case 2:
          await this.submitGranulometryComposition(data as MarshallData, this.userId, null, isConsult)
          break;
        case 3:
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
  }

  // send general data to backend to verify if there is already a Marshall dosage with same name for the material
  submitGeneralData = async (generalData: MarshallData['generalData'], userId: string, isConsult?: boolean): Promise<void> => {
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
        if (aggregates.length > 2) throw t('errors.empty-second-aggregate')
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

  getStep3Data = async (dataStep3: MarshallData, user: string, isConsult: boolean): Promise<void> => {
    if (!isConsult) {
      try {

        const { dnitBand } = dataStep3.generalData;

        const { aggregates } = dataStep3.materialSelectionData;

        const response = await Api.post(`${this.info.backend_path}/step-3-data`, {
          dnitBand,
          aggregates
        });

        const { data, success, error } = response.data;

        console.log(data)

        if (success === false) throw error.name;

        const { table_data } = data;
        console.log("🚀 ~ Marshall_SERVICE ~ getStep3Data= ~ table_data:", table_data)

        this.store_actions.setData({ key: "table_data", step: 2, value: table_data });
      } catch (error) {
        throw error;
      }
    }
  }

  calculateGranulometryComposition = async (calculateStep3Data: MarshallData['granulometryCompositionData']): Promise<any> => {
    try {
      const {
        dnitBands,
        percentageInputs,
        table_data,
      } = calculateStep3Data;


      const response = await Api.post(`${this.info.backend_path}/calculate-step-3-data`, {
        dnitBands,
        percentageInputs,
        tableRows: table_data.table_rows
      });

      const { data, success, error } = response.data;

      if (success === false) throw error.name;

      const { percentsOfMaterials, pointsOfCurve, sumOfPercents, table_data: tableData, projections } = data;

      const tableData2 = {
        table_rows: tableData,
        table_column_headers: calculateStep3Data.table_data.table_column_headers
      }

      const granulometricResults = {
        ...calculateStep3Data,
        percentsOfMaterials,
        pointsOfCurve,
        sumOfPercents,
        table_data: tableData2,
        projections
      };

      console.log("🚀 ~ Marshall_SERVICE ~ calculateGranulometryComposition= ~ granulometricResults:", granulometricResults)

      return granulometricResults;
    } catch (error) {
      //throw error;
    }
  }

  submitGranulometryComposition = async (
    data: MarshallData,
    userId: string,
    user?: string,
    isConsult?: boolean
  ): Promise<void> => {
    if (!isConsult) {
      try {
        const { table_data, pointsOfCurve, sumOfPercents, percentageInputs, percentsOfMaterials, graphData, projections } = data.granulometryCompositionData;
        const { name } = data.generalData;
        const userData = userId ? userId : user;

        if (!table_data) throw t('errors.empty-aggregates');
        if (pointsOfCurve.length === 0) throw t('errors.empty-second-aggregate')
        if (sumOfPercents.length === 0) throw t('errors.empty-binder');
        if (Object.values(percentageInputs[0]).some(value => value === null)) throw t('errors.empty-binder');
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
            name
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
}

export default Marshall_SERVICE;