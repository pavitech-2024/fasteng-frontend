import Api from '@/api';
import { UnitMassIcon } from '@/assets';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { GranularLayersActions, GranularLayersData } from '@/stores/promedina/granular-layers/granular-layers.store';
import { t } from 'i18next';

class GRANULARLAYERS_SERVICE implements IEssayService {
  info = {
    key: 'granularLayers',
    icon: UnitMassIcon,
    title: t('pm.granular-layers-register'),
    path: '/promedina/granular-layers',
    steps: 3,
    backend_path: 'promedina/granular-layers/granular-layers-samples',
    standard: {
      name: '',
      link: '',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'generalData' },
      { step: 1, description: t('pm.pavement.specific.data'), path: 'step2' },
      { step: 2, description: t('pm.pavement.specific.data'), path: 'step3' },
    ],
  };

  store_actions: GranularLayersActions;
  userId: string;

  //   /** @handleNext Receives the step and data from the form and calls the respective method */
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as GranularLayersData['generalData']);
          break;
        case 1:
          await this.submitStep2Data(data as GranularLayersData['step2Data']);
          break;
        case 2:
          await this.submitStep3Data(data as GranularLayersData['step3Data']);
          await this.saveSample(data as GranularLayersData);
          break;
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };

  submitGeneralData = async (generalData: GranularLayersData['generalData']): Promise<void> => {
    function replaceNullValues(data: GranularLayersData['generalData']): GranularLayersData['generalData'] {
      const newData: GranularLayersData['generalData'] = { ...data };

      for (const key in newData) {
        if (newData[key] === null || newData[key] === undefined) {
          newData[key] = '-';
        }
      }

      return newData;
    }

    const newData = replaceNullValues(generalData);

    this.store_actions.setData({ step: 0, value: newData });
  };

  submitStep2Data = async (step2Data: GranularLayersData['step2Data']): Promise<void> => {
    // if (step2Data) {
    //   true;
    // }
    // try {
    //   const {
    //     identification,
    //     sectionType,
    //     extension,
    //     initialStakeMeters,
    //     latitudeI,
    //     longitudeI,
    //     finalStakeMeters,
    //     latitudeF,
    //     longitudeF,
    //     monitoringPhase,
    //     observation,
    //     milling,
    //     interventionAtTheBase,
    //     sami,
    //     bondingPaint,
    //     priming,
    //     material,
    //     thickness,
    //   } = step2Data;
    //   if (!identification) throw t('errors.empty-identification');
    //   if (!sectionType) throw t('errors.empty-sectionType');
    //   if (!extension) throw t('errors.empty-extension');
    //   if (!initialStakeMeters) throw t('errors.empty-initialStakeMeters');
    //   if (!latitudeI) throw t('errors.empty-latitudeI');
    //   if (!longitudeI) throw t('errors.empty-longitudeI');
    //   if (!finalStakeMeters) throw t('errors.empty-finalStakeMeters');
    //   if (!latitudeF) throw t('errors.empty-latitudeF');
    //   if (!longitudeF) throw t('errors.empty-longitudeF');
    //   if (!monitoringPhase) throw t('errors.empty-monitoringPhase');
    //   if (!milling) throw t('errors.empty-milling');
    //   if (!interventionAtTheBase) throw t('errors.empty-interventionAtTheBase');
    //   if (!bondingPaint) throw t('errors.empty-bondingPaint');
    //   if (!sami) throw t('errors.empty-sami');
    //   if (!priming) throw t('errors.empty-priming');
    //   if (!material) throw t('errors.empty-material');
    //   if (!thickness) throw t('errors.empty-thickness');
    //   const response = await Api.post(`${this.info.backend_path}/verify-init`, {
    //     step2Data,
    //     observation,
    //   });
    //   const { success, error } = response.data;
    //   if (success === false) throw error.name;
    // } catch (error) {
    //   throw error;
    // }
  };

  submitStep3Data = async (step3Data: GranularLayersData['step3Data']): Promise<void> => {
    console.log(step3Data);
    // if (step3Data) {
    //   true;
    // }
    // try {
    // const {
    //   stabilizer,
    //   tenor,
    //   especificMass,
    //   compressionEnergy,
    //   rtcd,
    //   rtf,
    //   rcs,
    //   granulometricRange,
    //   optimalHumidity,
    //   rsInitial,
    //   rsFinal,
    //   constantA,
    //   constantB,
    //   k1psi1,
    //   k2psi2,
    //   observations,
    // } = step3Data;

    // if (!stabilizer) throw t('errors.empty-stabilizer');
    // if (!tenor) throw t('errors.empty-tenor');
    // if (!especificMass) throw t('errors.empty-especificMass');
    // if (!rtf) throw t('errors.empty-rtf');
    // if (!rtcd) throw t('errors.empty-rtcd');
    // if (!rcs) throw t('errors.empty-rcs');
    // if (!compressionEnergy) throw t('errors.empty-compressionEnergy');
    // if (!granulometricRange) throw t('errors.empty-granulometricRange');
    // if (!rsInitial) throw t('errors.empty-rsInitial');
    // if (!optimalHumidity) throw t('errors.empty-optimalHumidity');
    // if (!rsFinal) throw t('errors.empty-rsFinal');
    // if (!constantA) throw t('errors.empty-constantA');
    // if (!constantB) throw t('errors.empty-constantB');
    // if (!k1psi1) throw t('errors.empty-k1psi1');
    // if (!k2psi2) throw t('errors.empty-k2psi2');

    //   const response = await Api.post(`${this.info.backend_path}/verify-init`, {
    //     step3Data,
    //     //observations,
    //   });

    //   const { success, error } = response.data;

    //   if (success === false) throw error.name;
    // } catch (error) {
    //   throw error;
    // }
  };

  // save essay
  saveSample = async (store: GranularLayersData): Promise<void> => {
    const { generalData, step2Data, step3Data } = store;

    try {
      const response = await Api.post(`${this.info.backend_path}/save`, {
        generalData,
        step2Data,
        step3Data,
      });

      const { success, error } = response.data;

      if (!success) {
        if (error && error.name === 'SampleCreationError') {
          throw new Error(t('pm.register.already-exists-error'));
        }
      }
    } catch (error) {
      if (error.response?.status === 413) {
        throw new Error(t('pm.register.payload-too-large-error'));
      }

      throw error;
    }
  };
}
export default GRANULARLAYERS_SERVICE;
