import Api from '@/api';
import { SuperpaveIcon } from '@/assets';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { SuperpaveActions, SuperpaveData } from '@/stores/asphalt/superpave/superpave.store';
import { table } from 'console';
import { t } from 'i18next';

class Superpave_SERVICE implements IEssayService {
  info = {
    key: 'superpave',
    icon: SuperpaveIcon,
    title: t('asphalt.dosages.superpave'),
    path: '/asphalt/dosages/superpave',
    backend_path: 'asphalt/dosages/superpave',
    steps: 9,
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
    ],
  };

  store_actions: SuperpaveActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown, isConsult?: boolean): Promise<void> => {
    // Check if isConsult is undefined and assign false if so
    if (isConsult === undefined) isConsult = false;
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
        throw error;
      }
    }
  };

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
        if (aggregates.length > 2) throw t('errors.empty-second-aggregate');
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

  getStep3Data = async (dataStep3: SuperpaveData, user: string, isConsult: boolean): Promise<void> => {
    if (!isConsult) {
      try {
        const { dnitBand } = dataStep3.generalData;

        const { aggregates } = dataStep3.materialSelectionData;

        const response = await Api.post(`${this.info.backend_path}/step-3-data`, {
          dnitBand,
          aggregates,
        });

        const { data, success, error } = response.data;

        console.log(data);

        if (success === false) throw error.name;

        const { table_data } = data;

        this.store_actions.setData({ key: 'table_data', step: 2, value: table_data });
      } catch (error) {
        throw error;
      }
    }
  };


  submitSuperpaveDosageData = async (
    data: SuperpaveData,
    userId: string,
    user?: string,
    isConsult?: boolean
  ): Promise<void> => {
    if (!isConsult) {
      try {
        const userData = userId ? userId : user;

        const superpaveDosageData = {
          ...data,
          isConsult: null,
        };

        if (isConsult) superpaveDosageData.isConsult = isConsult;

        const response = await Api.post(
          `${this.info.backend_path}/save-superpave-dosage/${userData}`,
          superpaveDosageData
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

export default Superpave_SERVICE;
