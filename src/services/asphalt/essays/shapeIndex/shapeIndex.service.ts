import { ShapeIndexIcon } from '@/assets';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { ShapeIndexActions, ShapeIndexData } from '@/stores/asphalt/shapeIndex/shapeIndex.store';
import Api from '@/api';
import { t } from 'i18next';
import { AsphaltMaterial } from '@/interfaces/asphalt';

class SHAPEINDEX_SERVICE implements IEssayService {
  info = {
    key: 'shapeIndex',
    icon: ShapeIndexIcon,
    title: t('asphalt.essays.shapeIndex'),
    path: '/asphalt/essays/shapeIndex',
    steps: 3,
    backend_path: 'asphalt/essays/shapeIndex',
    standard: {
      name: 'DNIT 424/2020 - ME',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_424_2020_me.pdf',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('shapeIndex'), path: 'essay-data' },
      { step: 2, description: t('results'), path: 'results' },
    ],
  };

  store_actions: ShapeIndexActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as ShapeIndexData['generalData']);
          break;
        case 1:
          const { step2Data } = data as ShapeIndexData;
          await this.submitStep2Data(step2Data);
          await this.calculateResults(data as ShapeIndexData);
          break;
        case 2:
          await this.saveEssay(data as ShapeIndexData);
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
  getmaterialsByUserId = async (userId: string): Promise<AsphaltMaterial> => {
    try {
      // get all materials from user from backend
      const response = await Api.get(`asphalt/materials/all/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // send general data to backend to verify if there is already a Specify Mass essay with same name for the material
  submitGeneralData = async (generalData: ShapeIndexData['generalData']): Promise<void> => {
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

  /** @ShapeIndex Methods for ShapeIndex page (step === 1, page 2) */

  // verify inputs from ShapeIndex page (step === 1, page 2)
  submitStep2Data = async (step2Data: ShapeIndexData['step2Data']): Promise<void> => {
    try {
      const { method, total_mass, graduation, circular_sieves_table_data, sieves_table_data, reads_table_data } =
        step2Data;

      // verify if the method was chosen
      if (!method) throw t('shapeIndex.error.chose-method');

      // verify if the material total mass is not empty or negative
      if (!total_mass) throw t('shapeIndex.error.empty-total-mass');
      if (total_mass <= 0) throw t('shapeIndex.error.negative-or-zero-total-mass');

      // verify the input tables based on the method chosen
      if (method === 'pachymeter') {
        if (!sieves_table_data) throw t('shapeIndex.error.null-sieve-table-data');
        sieves_table_data.forEach((sieve) => {
          if (sieve.retained_mass > total_mass)
            throw t('shapeIndex.error.retained-mass-greater-than-total-mass') + ' - ' + sieve.label;
        });

        if (!reads_table_data) throw t('shapeIndex.error.null-reads-table-data');
        if (reads_table_data.length === 0) throw t('shapeIndex.error.empty-reads-table-data');
      } else if (method === 'sieve') {
        if (!graduation) throw t('shapeIndex.error.chose-graduation');

        if (!circular_sieves_table_data) throw t('shapeIndex.error.null-sieve-table-data');
        circular_sieves_table_data.forEach((sieve) => {
          if (!sieve.sieve1) throw t('shapeIndex.error.empty-sieve1') + ' - ' + sieve.label;
          if (sieve.sieve1 < 0) throw t('shapeIndex.error.negative-sieve1') + ' - ' + sieve.label;

          if (!sieve.sieve2) throw t('shapeIndex.error.empty-sieve2') + ' - ' + sieve.label;
          if (sieve.sieve2 < 0) throw t('shapeIndex.error.negative-sieve2') + ' - ' + sieve.label;
        });
      } else {
        throw t('shapeIndex.error.chose-method');
      }
    } catch (error) {
      throw error;
    }
  };

  // calculate results from granulometry essay
  calculateResults = async (store: ShapeIndexData): Promise<void> => {
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
  saveEssay = async (store: ShapeIndexData): Promise<void> => {
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

export default SHAPEINDEX_SERVICE;
