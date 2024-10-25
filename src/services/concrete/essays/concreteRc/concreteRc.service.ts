import Api from '@/api';
import { CoarseAggregateIcon } from '@/assets';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { ConcreteMaterial } from '@/interfaces/concrete';
import { ConcreteRcActions, ConcreteRcData } from '@/stores/concrete/concreteRc/concreteRc.store';
import { t } from 'i18next';

class CONCRETE_RC_SERVICE implements IEssayService {
  info = {
    key: 'concreteRc',
    icon: CoarseAggregateIcon,
    title: t('concrete.essays.concreteRc'),
    path: '/concrete/essays/concreteRc',
    backend_path: 'concrete/essays/concreteRc',
    steps: 3,
    standard: {
      name: 'NBR 7217/1984',
      link: 'https://engenhariacivilfsp.files.wordpress.com/2015/03/nbr-7181.pdf',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('concreteRc.step2'), path: 'essay-data' },
      { step: 2, description: t('concreteRc.step3'), path: 'essay-data' },
      { step: 3, description: t('results'), path: 'results' },
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
          await this.calculateStep2Data(step2Data);
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

      // // verify if name and material are not empty
      // if (!name) throw t('errors.empty-name');
      // if (!material) throw t('errors.empty-material');

      // verify if there is already a ConcreteRc essay with same name for the material
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name, material });
      console.log(response);
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
      const { age, tolerance } = step2Data;
      let lowerReference, higherReference;
      let newTolerance;

      const concreteRcToleranceAge = [
        {
          age: 24.0,
          tolerance: 0.5,
        },
        {
          age: 72.0, // 3d
          tolerance: 2,
        },
        {
          age: 168, // 7d
          tolerance: 6,
        },
        {
          age: 672, // 28d
          tolerance: 24,
        },
        {
          age: 1512, // 63d
          tolerance: 36,
        },
        {
          age: 2184, // 91d
          tolerance: 48,
        },
      ];

      const toleranceFound = concreteRcToleranceAge.find((e) => e.age === age.hours * 60 + age.minutes);

      if (toleranceFound) {
        newTolerance = toleranceFound;
      } else {
        // Encontrar o índice onde age se encaixa entre os valores de age no array
        const referenceIndex = concreteRcToleranceAge.findIndex((e, i, arr) => {
          const nextAge = arr[i + 1]?.age * 60;
          const totalMinutes = age.hours * 60 + age.minutes;
          return totalMinutes >= e.age * 60 && (nextAge === undefined || totalMinutes < nextAge); // Verifica o intervalo
        });

        // Se encontramos um índice válido, pegamos o próximo
        if (referenceIndex !== -1) {
          higherReference = concreteRcToleranceAge[referenceIndex + 1] || concreteRcToleranceAge[referenceIndex];
          lowerReference = concreteRcToleranceAge[referenceIndex - 1] || concreteRcToleranceAge[referenceIndex];

          // Fazer chamada para a interpolação
          const response = await Api.post(`${this.info.backend_path}/interpolation`, {
            age_diammHeightRatio: age.hours * 60 + age.minutes,
            tolerance_strenght: tolerance.hours * 60 + tolerance.minutes,
            higherReference,
            lowerReference,
            type: 'tolerance',
          });

          const { success, error, result } = response.data;

          if (success === false) throw error.name;

          newTolerance = result;
        } else {
          throw t('errooooouuu');
        }
      }
      this.store_actions.setData({ step: 1, value: { ...step2Data, newTolerance } });
    } catch (error) {
      throw error;
    }
  };

  // verify inputs from ConcreteRc page (step === 1, page 2)
  calculateStep2Data = async (step2Data: ConcreteRcData['step2Data']): Promise<void> => {
    try {
      const { diammeter1, diammeter2, height, newTolerance } = step2Data;
      let correctionFactor;

      const averageDiammeter = diammeter1 + diammeter2 / 2;
      const diammHeightRatio = averageDiammeter / height;

      if (diammHeightRatio >= 2.06) throw t('erro testeeee');
      if (diammHeightRatio <= 1.94) {
        const correctionFactorArr = [
          {
            diammHeightRatio: 2.0,
            correctionFactor: 1.0,
          },
          {
            diammHeightRatio: 1.75,
            correctionFactor: 0.98,
          },
          {
            diammHeightRatio: 1.5,
            correctionFactor: 0.96,
          },
          {
            diammHeightRatio: 1.25,
            correctionFactor: 0.93,
          },
          {
            diammHeightRatio: 1.0,
            correctionFactor: 0.86,
          },
        ];

        const diammHeightRatioFound = correctionFactorArr.find((e) => e.diammHeightRatio === diammHeightRatio);

        if (diammHeightRatioFound) {
          correctionFactor = newTolerance.data * diammHeightRatioFound.correctionFactor;
        } else {
          // Interpolação
          let higherReference = null;
          let lowerReference = null;

          for (let i = 0; i < correctionFactorArr.length; i++) {
            // Verifica se o `diammHeightRatio` está entre os valores de `diammHeightRatio` adjacentes

            if (
              correctionFactorArr[i].diammHeightRatio > diammHeightRatio &&
              correctionFactorArr[i + 1].diammHeightRatio < diammHeightRatio
            ) {
              higherReference = correctionFactorArr[i];
              lowerReference = correctionFactorArr[i + 1];
            }
          }

          // Fazer chamada para a interpolação
          const response = await Api.post(`${this.info.backend_path}/interpolation`, {
            age_diammHeightRatio: diammHeightRatio,
            tolerance_strenght: newTolerance.data,
            higherReference,
            lowerReference,
            type: 'correctionFactor',
          });

          const { success, error, result } = response.data;

          if (success === false) throw error.name;

          correctionFactor = result;
        }
      }
      this.store_actions.setData({ step: 2, value: { ...step2Data, correctionFactor } });
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
        step3Data: store.step3Data
      });

      const { success, error, result } = response.data;

      if (success === false) throw error.name;

      this.store_actions.setData({ step: 3, value: result });
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
