import Api from "@/api";
import { CoarseAggregateIcon } from "@/assets";
import { IEssayService } from "@/interfaces/common/essay/essay-service.interface";
import { ConcreteMaterial } from "@/interfaces/concrete";
import { ConcreteRcActions, ConcreteRcData } from "@/stores/concrete/concreteRc/concreteRc.store";
import { t } from "i18next";

class CONCRETE_RC_SERVICE implements IEssayService {
    info = {
      key: 'ConcreteRc-concrete',
      icon: CoarseAggregateIcon,
      title: t('concrete.essays.ConcreteRc'),
      path: '/concrete/essays/ConcreteRc',
      backend_path: 'concrete/essays/ConcreteRc',
      steps: 3,
      standard: {
        name: 'NBR 7217/1984',
        link: 'https://engenhariacivilfsp.files.wordpress.com/2015/03/nbr-7181.pdf',
      },
      stepperData: [
        { step: 0, description: t('general data'), path: 'general-data' },
        { step: 1, description: t('ConcreteRc-concrete'), path: 'essay-data' },
        { step: 2, description: t('results'), path: 'results' },
      ],
    };
  
    store_actions: ConcreteRcActions;
    userId: string;
  
    /** @handleNext Receives the step and data from the form and calls the respective method */
    handleNext = async (step: number, data: unknown): Promise<void> => {
      try {
        switch (step) {
          case 0:
            await this.submitGeneralData(data as ConcreteRcData['generalData']);
            break;
          case 1:
            const { step2Data } = data as ConcreteRcData;
            await this.submitStep2Data(step2Data);
            await this.calculateResults(data as ConcreteRcData);
            break;
          case 2:
            await this.saveEssay(data as ConcreteRcData);
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
    getmaterialsByUserId = async (userId: string): Promise<ConcreteMaterial[]> => {
      try {
        // get all materials from user from backend
        const response = await Api.get(`concrete/materials/all/${userId}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    };
  
    // get essay from material _id
    getConcreteRcBymaterialId = async (material_id: string) => {
      try {
        const response = await Api.get(`${this.info.backend_path}/get/${material_id}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    };
  
    // send general data to backend to verify if there is already a ConcreteRc essay with same name for the material
    submitGeneralData = async (generalData: ConcreteRcData['generalData']): Promise<void> => {
      try {
        const { name, material } = generalData;
  
        // verify if name and material are not empty
        if (!name) throw t('errors.empty-name');
        if (!material) throw t('errors.empty-material');
  
        // verify if there is already a ConcreteRc essay with same name for the material
        const response = await Api.post(`${this.info.backend_path}/verify-init`, { name, material });
  
        const { success, error } = response.data;
  
        // if there is already a ConcreteRc essay with same name for the material, throw error
        if (success === false) throw error.name;
      } catch (error) {
        throw error;
      }
    };
  
    /** @ConcreteRc Methods for ConcreteRc page (step === 1, page 2) */
  
    // verify inputs from ConcreteRc page (step === 1, page 2)
    submitStep2Data = async (step2Data: ConcreteRcData['step2Data']): Promise<void> => {
      try {
        // verify if the material mass is not empty or negative
        if (!step2Data.material_mass) throw t('errors.empty-material-mass');
        if (step2Data.material_mass < 0) throw t('errors.negative-material-mass');
  
        // verify if all the passant porcentages are not empty or negative
        step2Data.table_data.forEach((row) => {
          if (row.passant === null || row.retained === null) throw t('errors.empty-sieve') + row.sieve;
          if (row.passant < 0 || row.retained < 0) throw t('errors.negative-sieve') + row.sieve;
        });
  
        //verify if the sum of the masses (retained + bottom) equals the material mass
        let retained = 0.0;
        step2Data.table_data.forEach((row) => {
          retained += row.retained;
        });
        const sum = Math.round(100 * (retained + step2Data.bottom)) / 100;
  
        if (sum > step2Data.material_mass) {
          throw `${t('errors.sieves-sum-not-equal-to-material-mass')}\nRetida + Fundos: ${sum}g.`;
        }
      } catch (error) {
        throw error;
      }
    };
  
    // calculate results from ConcreteRc essay
    calculateResults = async (store: ConcreteRcData): Promise<void> => {
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
    saveEssay = async (store: ConcreteRcData): Promise<void> => {
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
  
  export default CONCRETE_RC_SERVICE;
  