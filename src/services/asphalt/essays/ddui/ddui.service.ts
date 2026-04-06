import { DduiIcon } from '@/assets';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { DduiActions, DduiData } from '@/stores/asphalt/ddui/ddui.store';
import { t } from 'i18next';
import Api from '@/api';

class Ddui_SERVICE implements IEssayService {
  info = {
    key: 'ddui',
    icon: DduiIcon,
    title: t('asphalt.essays.ddui'),
    path: '/asphalt/essays/ddui',
    backend_path: 'asphalt/essays/ddui',
    steps: 4,
    standard: {
      name: 'DNIT 136/2018 - ME',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_180_2018_me-1.pdf',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('asphalt.essays.ddui.dduiStep2'), path: 'essay-data-step2' },
      { step: 2, description: t('asphalt.essays.ddui.dduiStep3'), path: 'essay-data-step3' },
      { step: 3, description: t('results'), path: 'results' },
    ],
  };
  store_actions: DduiActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as DduiData['generalData']);
          break;
        case 1:
          const { dduiStep2 } = data as DduiData;
          await this.submitDduiStep2Data(dduiStep2);
          break;
        case 2:
          const { dduiStep3 } = data as DduiData;
          await this.submitDduiStep3Data(dduiStep3);
          await this.calculateResults(data as DduiData);
          break;
        case 3:
          await this.saveEssay(data as DduiData);
          break;
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };

  deleteDduiEssay = async (id: string): Promise<void> => {
    try {
      await Api.delete(`${this.info.backend_path}/delete-essay/${id}`);
    } catch (error) {
      throw error;
    }
  };

  /** @generalData Methods for general-data (step === 0, page 1) */

  // get all materials from user from backend
  getmaterialsByUserId = async (userId: string): Promise<AsphaltMaterial> => {
    try {
      // get all materials from user from backend
      const response = await Api.get(`asphalt/materials/all/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // get essay from material _id
  getDduiBymaterialId = async (material_id: string) => {
    try {
      const response = await Api.get(`${this.info.backend_path}/get/${material_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // send general data to backend to verify if there is already a Ddui essay with same name for the material
  submitGeneralData = async (generalData: DduiData['generalData']): Promise<void> => {
    try {
      const { name } = generalData;

      // verify if name and material are not empty
      if (!name) throw t('errors.empty-name');

      // verify if there is already a Ddui essay with same name for the material
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name });

      const { success, error } = response.data;

      // if there is already a Ddui essay with same name for the material, throw error
      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  /** @Ddui Methods for Ddui page (step === 1, page 2) */

  // verify inputs from Ddui page (step === 1, page 2)
  submitDduiStep2Data = async (dduiStep2: DduiData['dduiStep2']): Promise<void> => {
    try {
    } catch (error) {
      throw error;
    }
  };

  // verify inputs from Ddui page (step === 1, page 2)
  submitDduiStep3Data = async (dduiStep3: DduiData['dduiStep3']): Promise<void> => {
    try {
    } catch (error) {
      throw error;
    }
  };

  // calculate results from ddui essay
  calculateResults = async (store: DduiData): Promise<void> => {
    const body = {
      generalData: store.generalData,
      dduiStep2: store.dduiStep2,
      dduiStep3: store.dduiStep3,
    };
    try {

      // Verifica se há valores true e false em ddui_data.condicionamento;
      const hasConditionedData =
        store.dduiStep3.ddui_data.some((item1) => item1.condicionamento) &&
        store.dduiStep3.ddui_data.some((item2) => !item2.condicionamento);

      if (!hasConditionedData) throw t('ddui.error.invalid-conditioning');

      const response = await Api.post(`${this.info.backend_path}/calculate-results`, body);

      const { success, error, result } = response.data;

      if (success === false) throw error.name;

      this.store_actions.setData({ step: 3, value: result });
    } catch (error) {
      throw error;
    }
  };

  /** @Results Methods for Results page (step === 2, page 3) */

  // save essay
  saveEssay = async (store: DduiData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/save-essay`, {
        generalData: {
          ...store.generalData,
          userId: this.userId,
        },
        dduiStep2: store.dduiStep2,
        dduiStep3: store.dduiStep3,
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

export default Ddui_SERVICE;
