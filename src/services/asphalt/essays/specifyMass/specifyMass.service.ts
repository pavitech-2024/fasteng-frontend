import { SpecifyMassIcon } from '@/assets';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { SpecifyMassActions, SpecifyMassData } from '@/stores/asphalt/specifyMass/specifyMass.store';
import Api from '@/api';
import { t } from 'i18next';
import { AsphaltMaterial } from '@/interfaces/asphalt';

class SPECIFYMASS_SERVICE implements IEssayService {
  info = {
    key: 'specifyMass',
    icon: SpecifyMassIcon,
    title: t('asphalt.essays.specifyMass'),
    path: '/asphalt/essays/specifyMass',
    steps: 3,
    backend_path: 'asphalt/essays/specifyMass',
    standard: {
      name: 'NBR 9776',
      link: 'https://smartdoser.fastengapp.com.br/static/media/MassaEspecificaAgregadoMiudoDNIT4112019.8b89a1d7.pdf',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('specifyMass'), path: 'essay-data' },
      { step: 2, description: t('results'), path: 'results' },
    ],
  };

  store_actions: SpecifyMassActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      console.log(data);
      switch (step) {
        case 0:
          await this.submitGeneralData(data as SpecifyMassData['generalData']);
          break;
        case 1:
          const { step2Data } = data as SpecifyMassData;
          await this.submitStep2Data(step2Data);
          await this.calculateResults(data as SpecifyMassData);
          break;
        case 2:
          await this.saveEssay(data as SpecifyMassData);
          break;
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };

  /** @generalData Methods for general-data (step === 0, page 1) */

  // get all materials from user from backend
  getmaterialsByUserId = async (userId: string): Promise<AsphaltMaterial[]> => {
    try {
      // get all materials from user from backend
      const response = await Api.get(`asphalt/materials/all/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // send general data to backend to verify if there is already a Specify Mass essay with same name for the material
  submitGeneralData = async (generalData: SpecifyMassData['generalData']): Promise<void> => {
    try {
      const { name, material } = generalData;

      // verify if name and material are not empty
      if (!name) throw t('errors.empty-name');
      if (!material) throw t('errors.empty-material');

      // verify if there is already a Specify Mass essay with same name for the material
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name, material });

      const { success, error } = response.data;

      // if there is already a Specify Mass essay with same name for the material, throw error
      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  /** @SpecifyMass Methods for SpecifyMass page (step === 1, page 2) */

  // verify inputs from SpecifyMass page (step === 1, page 2)
  submitStep2Data = async (step2Data: SpecifyMassData['step2Data']): Promise<void> => {
    try {
      // verify if the material dry mass is not empty or negative
      if (!step2Data.dry_mass) throw t('errors.empty-material-dry-mass');
      if (step2Data.dry_mass < 0) throw t('errors.negative-material-dry-mass');

      // verify if the material submerged mass is not empty or negative
      if (!step2Data.submerged_mass) throw t('errors.empty-material-submerged-mass');
      if (step2Data.submerged_mass < 0) throw t('errors.negative-material-submerged-mass');

      // verify if the material surface saturated mass is not empty or negative
      if (!step2Data.surface_saturated_mass) throw t('errors.empty-material-surface-saturated-mass');
      if (step2Data.surface_saturated_mass < 0) throw t('errors.negative-material-surface-saturated-mass');

      if (step2Data.surface_saturated_mass <= step2Data.dry_mass) {
        throw t('errors.surface-saturated-mass-not-greater-than-dry-mass');
      }
      if (step2Data.submerged_mass <= step2Data.dry_mass) {
        throw t('errors.submerged-mass-not-greater-than-dry-mass');
      }
    } catch (error) {
      throw error;
    }
  };

  // calculate results from granulometry essay
  calculateResults = async (store: SpecifyMassData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-results`, {
        generalData: store.generalData,
        step2Data: store.step2Data,
      });

      const { success, error, result } = response.data;

      if (success === false) throw error.name;

      this.store_actions.setData({ step: 2, value: result });
    } catch (error) {
      throw error;
    }
  };

  /** @Results Methods for Results page (step === 2, page 3) */

  // save essay
  saveEssay = async (store: SpecifyMassData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/save-essay`, {
        generalData: {
          ...store.generalData,
          userId: this.userId,
        },
        step2Data: store.step2Data,
        results: store.results,
      });

      const { success, error } = response.data;

      if (success === false) throw error.name;

      // this.store_actions.reset( { step: null, value: null });
    } catch (error) {
      throw error;
    }
  };
}

export default SPECIFYMASS_SERVICE;
