import Api from '@/api';
import { ConcreteRcIcon } from '@/assets';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { ConcreteMaterial } from '@/interfaces/concrete';
import Sample from '@/pages/soils/samples/sample/[id]';
import { ConcreteRcActions, ConcreteRcData } from '@/stores/concrete/concreteRc/concreteRc.store';
import { t } from 'i18next';

class CONCRETE_RC_SERVICE implements IEssayService {
  info = {
    key: 'concreteRc',
    icon: ConcreteRcIcon,
    title: t('concrete.essays.concreteRc'),
    path: '/concrete/essays/concreteRc',
    backend_path: 'concrete/essays/concreteRc',
    steps: 4,
    standard: {
      name: 'NBR 5739/2018',
      link: '',
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
          break;
        case 2:
          await this.calculateResults(data as ConcreteRcData);
          break;
        case 3:
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
      const { name } = generalData;

      // verify if there is already a ConcreteRc essay with same name
      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name });
      console.log(response);
      const { success, error } = response.data;

      // if there is already a ConcreteRc essay with same name, throw error
      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  /** @ConcreteRc Methods for ConcreteRc page (step === 1, page 2) */

  // verify inputs from ConcreteRc page (step === 1, page 2)
  submitStep2Data = async (step2Data: ConcreteRcData['step2Data']): Promise<void> => {
    // Erro: não pode ser menor que 24h
    try {
      // const { samples } = step2Data;
      // console.log('🚀 ~ CONCRETE_RC_SERVICE ~ submitStep2Data= ~ samples:', samples);
      // let lowerReference = [],
      //   higherReference = [],
      //   newTolerance = [],
      //   formattedSamples = [];



      // for (let i = 0; i < samples.length; i++) {
      //   const toleranceFound = concreteRcToleranceAge.find(
      //     (e) => e.age === samples[i].age.hours * 60 + samples[i].age.minutes
      //   );
      //   console.log('🚀 ~ CONCRETE_RC_SERVICE ~ submitStep2Data= ~ toleranceFound:', toleranceFound);
      //   if (toleranceFound) {
      //     newTolerance.push(toleranceFound);
      //   } else {
      //     // Encontrar o índice onde age se encaixa entre os valores de age no array
      //     const referenceIndex = concreteRcToleranceAge.findIndex((e, idx, arr) => {

      //       return (
      //         samples[i].age.hours * 60 + samples[i].age.minutes >= e.age * 60  &&
      //         samples[i + 1]?.age.hours * 60 + samples[i + 1]?.age.minutes < e.age * 60  
      //       );
      //     });

      //     console.log('🚀 ~ CONCRETE_RC_SERVICE ~ referenceIndex ~ referenceIndex:', referenceIndex);

      //     // Se encontramos um índice válido, pegamos o próximo
      //     if (referenceIndex !== -1) {
      //       const higherReferenceArr =
      //         concreteRcToleranceAge[referenceIndex + 1] || concreteRcToleranceAge[referenceIndex];
      //       higherReference.push(higherReferenceArr);
      //       const lowerReferenceArr =
      //         concreteRcToleranceAge[referenceIndex - 1] || concreteRcToleranceAge[referenceIndex];
      //       lowerReference.push(lowerReferenceArr);

      //       const formattedSamplesArr = samples.map((sample) => {
      //         return {
      //           age: sample.age.hours * 60 + sample.age.minutes,
      //           tolerance: sample.tolerance.hours * 60 + sample.tolerance.minutes,
      //           ...sample,
      //         };
      //       });

      //       formattedSamples.push(formattedSamplesArr);
      //     } else {
      //       console.log('Fora do findIndex');
      //       // código para lidar com o caso em que o elemento não é encontrado
      //       throw t('concrete.essays.errors.connection-error');
      //     }
      //   }
      // }

      // console.log('Passei aqui');

      // // Fazer chamada para a interpolação
      // const response = await Api.post(`${this.info.backend_path}/interpolation`, {
      //   samples: formattedSamples,
      //   higherReference,
      //   lowerReference,
      //   type: 'tolerance',
      // });

      // const { success, error, result } = response.data;

      // if (success === false) throw error.name;
      // if (!result.isPermited) throw t('concrete.essays.errors.tolerance-not-permited');

      // newTolerance = result;

      // this.store_actions.setData({ step: 1, value: { ...step2Data, newTolerance } });
    } catch (error) {
      throw error;
    }
  };

  // verify inputs from ConcreteRc page (step === 1, page 2)
  calculateStep2Data = async (step2Data: ConcreteRcData['step2Data']): Promise<void> => {
    // try {
    //   const { diammeter1, diammeter2, height, newTolerance } = step2Data;
    //   let correctionFactor;
    //   const averageDiammeter = (diammeter1 + diammeter2) / 2;
    //   const diammHeightRatio = height / averageDiammeter;
    //   console.log('🚀 ~ CONCRETE_RC_SERVICE ~ calculateStep2Data= ~ diammHeightRatio:', diammHeightRatio);
    //   if (diammHeightRatio >= 2.06) throw t('concrete.essays.errors.invalid-diammHeightRatio');
    //   if (diammHeightRatio <= 1.94 || (diammHeightRatio > 1.94 && diammHeightRatio < 2.06)) {
    //     const correctionFactorArr = [
    //       {
    //         diammHeightRatio: 2.0,
    //         correctionFactor: 1.0,
    //       },
    //       {
    //         diammHeightRatio: 1.75,
    //         correctionFactor: 0.98,
    //       },
    //       {
    //         diammHeightRatio: 1.5,
    //         correctionFactor: 0.96,
    //       },
    //       {
    //         diammHeightRatio: 1.25,
    //         correctionFactor: 0.93,
    //       },
    //       {
    //         diammHeightRatio: 1.0,
    //         correctionFactor: 0.86,
    //       },
    //     ];
    //     const diammHeightRatioFound = correctionFactorArr.find((e) => e.diammHeightRatio === diammHeightRatio);
    //     if (diammHeightRatioFound) {
    //       correctionFactor = newTolerance.data * diammHeightRatioFound.correctionFactor;
    //     } else {
    //       // Interpolação
    //       let higherReference = null;
    //       let lowerReference = null;
    //       for (let i = 0; i < correctionFactorArr.length - 1; i++) {
    //         // Verifica se o `diammHeightRatio` está entre os valores de `diammHeightRatio` adjacentes
    //         if (
    //           correctionFactorArr[i].diammHeightRatio > diammHeightRatio &&
    //           correctionFactorArr[i + 1].diammHeightRatio < diammHeightRatio
    //         ) {
    //           higherReference = correctionFactorArr[i];
    //           lowerReference = correctionFactorArr[i + 1];
    //         }
    //       }
    //       const response = await Api.post(`${this.info.backend_path}/interpolation`, {
    //         age_diammHeightRatio: diammHeightRatio,
    //         tolerance_strenght: newTolerance.data,
    //         higherReference,
    //         lowerReference,
    //         type: 'correctionFactor',
    //       });
    //       const { success, error, result } = response.data;
    //       if (success === false) throw error.name;
    //       correctionFactor = result.data;
    //     }
    //   }
    //   this.store_actions.setData({ step: 1, key: 'correctionFactor', value: correctionFactor });
    // } catch (error) {
    //   throw error;
    // }
  };

  // calculate results from ConcreteRc essay
  calculateResults = async (store: ConcreteRcData): Promise<void> => {
    try {
      const formattedSamples = store.step2Data.samples.map((sample) => ({
        ...sample,
        age: (sample.age.hours * 60) + sample.age.minutes,
        tolerance:  (sample.tolerance.hours * 60) + sample.tolerance.minutes
      }));

      console.log("🚀 ~ CONCRETE_RC_SERVICE ~ formattedSamples ~ formattedSamples:", formattedSamples)

      const response = await Api.post(`${this.info.backend_path}/calculate-results`, {
        generalData: store.generalData,
        step2Data: formattedSamples,
        step3Data: store.step3Data,
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
        step3Data: store.step3Data,
        results: store.results,
      });

      const { success, error } = response.data;

      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };
}

export default CONCRETE_RC_SERVICE;
