import Api from '@/api';
import { ConcreteRtIcon } from '@/assets';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { ConcreteMaterial } from '@/interfaces/concrete';
import { ConcreteRtActions, ConcreteRtData } from '@/stores/concrete/concreteRt/concreteRt.store';
import { t } from 'i18next';

class CONCRETE_RT_SERVICE implements IEssayService {
  info = {
    key: 'concreteRt',
    icon: ConcreteRtIcon,
    title: t('concrete.essays.concreteRt'),
    path: '/concrete/essays/concreteRt',
    backend_path: 'concrete/essays/concreteRt',
    steps: 5,
    standard: {
      name: 'NBR 13279/2005',
      link: '',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('concreteRt.step2Data'), path: 'essay-data' },
      { step: 2, description: t('concreteRt.step3Data'), path: 'essay-data' },
      { step: 3, description: t('concreteRt.step4Data'), path: 'essay-data' },
      { step: 4, description: t('results'), path: 'results' },
    ],
  };

  store_actions: ConcreteRtActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as ConcreteRtData['generalData']);
          break;
        case 1:
          const { step2Data } = data as ConcreteRtData;
          await this.submitStep2Data(data as ConcreteRtData['step2Data']);
          await this.calculateStep2Data(step2Data);
          break;
        case 2:
          await this.submitStep3Data(data as ConcreteRtData['step3Data']);
          break;
        case 3:
          await this.calculateResults(data as ConcreteRtData);
          break;
        case 4:
          await this.saveEssay(data as ConcreteRtData);
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
  getConcreteRtBymaterialId = async (material_id: string) => {
    try {
      const response = await Api.get(`${this.info.backend_path}/get/${material_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // send general data to backend to verify if there is already a ConcreteRt essay with same name for the material
  submitGeneralData = async (generalData: ConcreteRtData['generalData']): Promise<void> => {
    try {
      const { name, material } = generalData;

      // verify if name and material are not empty
      if (!name) throw t('errors.empty-name');
      if (!material) throw t('errors.empty-material');

      // verify if there is already a ConcreteRt essay with same name for the material
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name, material });

      const { success, error } = response.data;

      // if there is already a ConcreteRt essay with same name for the material, throw error
      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  /** @ConcreteRt Methods for ConcreteRt page (step === 1, page 2) */

  // verify inputs from ConcreteRt page (step === 1, page 2)
  submitStep2Data = async (concreteRtStep2: ConcreteRtData['step2Data']): Promise<void> => {
    try {
      // verify if press_constant is not empty
      // if (!concreteRtStep2.pressConstant) throw t('errors.empty-press-constant');
    } catch (error) {
      throw error;
    }
  };

  // verify inputs from ConcreteRc page (step === 1, page 2)
  calculateStep2Data = async (step2Data: ConcreteRtData['step2Data']): Promise<void> => {
    try {
      const { age, tolerance } = step2Data;
      let finalTolerance;

      const ruptureAgeArr = [
        {
          ruptureAge: 1440, // 1440 minutes = 24h
          tolerance: 60, // 60 minutes = 1h
        },
        {
          ruptureAge: 4320, // 4320 minutes = 72h = 3d
          tolerance: 120, // 120 minutes = 2h
        },
        {
          ruptureAge: 10080, // 10080 minutes = 168h = 7d
          tolerance: 240, // 240 minutes = 4h
        },
        {
          ruptureAge: 20160, // 20160 minutes = 336h = 14d
          tolerance: 360, // 360 minutes = 6h
        },
        {
          ruptureAge: 40320, // 40320 minutes = 672h = 28d
          tolerance: 480, // 480 minutes = 8h
        },
        {
          ruptureAge: 131040, // 131040 minutes = 2184h = 91d
          tolerance: 1440, // 1440 minutes = 24h
        },
      ];

      const ruptureAgeFound = ruptureAgeArr.find((e) => e.ruptureAge === age.hours * 60 + age.minutes);

      const ageInMinutes = age.hours * 60 + age.minutes;

      if (ruptureAgeFound) {
        finalTolerance = ruptureAgeFound.tolerance;
      } else {
        // Interpolação
        let higherReference = null;
        let lowerReference = null;

        for (let i = 0; i < ruptureAgeArr.length; i++) {
          if (ruptureAgeArr[i].ruptureAge < ageInMinutes && ruptureAgeArr[i + 1].ruptureAge > ageInMinutes) {
            lowerReference = ruptureAgeArr[i];
            higherReference = ruptureAgeArr[i + 1];
          }
        }

        const response = await Api.post(`${this.info.backend_path}/interpolation`, {
          age: age.hours * 60 + age.minutes,
          tolerance: tolerance.hours * 60 + tolerance.minutes,
          higherReference,
          lowerReference,
        });

        const { success, error, result } = response.data;

        if (success === false) throw error.name;

        finalTolerance = result;
      }
      this.store_actions.setData({ step: 1, key: 'finalTolerance', value: finalTolerance });
    } catch (error) {
      throw error;
    }
  };

  // verify inputs from ConcreteRt page (step === 4, page 4)
  submitStep3Data = async (concreteRtStep3: ConcreteRtData['step3Data']): Promise<void> => {
    try {
      // verify if press_constant is not empty
      // if (!concreteRtStep2.pressConstant) throw t('errors.empty-press-constant');
    } catch (error) {
      throw error;
    }
  };

  // calculate results from ConcreteRt essay
  calculateResults = async (store: ConcreteRtData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-results`, {
        generalData: store.generalData,
        step2Data: store.step2Data,
        step3Data: store.step3Data,
        step4Data: store.step4Data,
      });

      const { success, error, result } = response.data;

      if (success === false) throw error.name;

      this.store_actions.setData({ step: 4, value: result });
    } catch (error) {
      throw error;
    }
  };

  /** @Results Methods for Results page (step === 2, page 3) */

  // save essay
  saveEssay = async (store: ConcreteRtData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/save-essay`, {
        generalData: {
          ...store.generalData,
          userId: this.userId,
        },
        step2Data: store.step2Data,
        step3Data: store.step3Data,
        step4Data: store.step4Data,
        results: store.results,
      });

      const { success, error } = response.data;

      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };
}

export default CONCRETE_RT_SERVICE;
