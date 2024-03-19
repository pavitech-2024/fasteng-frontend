import { t } from 'i18next';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import Api from '@/api';
import { UnitMassIcon } from '@/assets';
import {
  BinderAsphaltConcreteActions,
  BinderAsphaltConcreteData,
} from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';

class BINDER_ASPHALT_CONCRETE_SERVICE implements IEssayService {
  info = {
    key: 'binderAsphaltConcrete',
    icon: UnitMassIcon,
    title: t('pm.binder-asphalt-concrete-register'),
    path: '/promedina/binder-asphalt-concrete',
    steps: 4,
    backend_path: 'promedina/binder-asphalt-concrete/binder-asphalt-concrete-samples',
    standard: {
      name: '',
      link: '',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'generalData' },
      { step: 1, description: t('pm.pavement.specific.data'), path: 'step2' },
      { step: 2, description: t('pm.pavement.specific.data'), path: 'step3' },
      { step: 3, description: t('pm.pavement.specific.data'), path: 'step4' },
    ],
  };

  store_actions: BinderAsphaltConcreteActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          true;
          await this.submitGeneralData(data as BinderAsphaltConcreteData['generalData']);
          break;
        case 1:
          true;
          await this.submitStep2Data(data as BinderAsphaltConcreteData['step2Data']);
          break;
        case 2:
          true;
          await this.submitStep3Data(data as BinderAsphaltConcreteData['step3Data']);
          break;
        case 3:
          true;
          await this.submitStep4Data(data as BinderAsphaltConcreteData['step4Data']);
          await this.saveEssay(data as BinderAsphaltConcreteData);
          break;
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };

  submitGeneralData = async (generalData: BinderAsphaltConcreteData['generalData']): Promise<void> => {
    console.log('🚀 ~ BINDER_ASPHALT_CONCRETE_SERVICE ~ submitGeneralData= ~ generalData:', generalData);
    // try {
    // const { name, zone, layer, cityState, observations } = generalData;
    // if (!name) throw t('errors.empty-name');
    // if (!zone) throw t('errors.empty-zone');
    // if (!layer) throw t('errors.empty-layer');
    // if (!cityState) throw t('errors.empty-cityState');
    //   const response = await Api.post(`${this.info.backend_path}/verify-init`, {
    //     name,
    //     zone,
    //     layer,
    //     cityState,
    //     observations,
    //   });
    //   const { success, error } = response.data;
    //   if (success === false) throw error.name;
    // } catch (error) {
    //   throw error;
    // }
  };

  submitStep2Data = async (step2Data: BinderAsphaltConcreteData['step2Data']): Promise<void> => {
    console.log('🚀 ~ BINDER_ASPHALT_CONCRETE_SERVICE ~ submitStep2Data= ~ step2Data:', step2Data);
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

  submitStep3Data = async (step3Data: BinderAsphaltConcreteData['step3Data']): Promise<void> => {
    console.log('🚀 ~ BINDER_ASPHALT_CONCRETE_SERVICE ~ submitStep3Data= ~ step3Data:', step3Data);
    // try {
    // const {
    // refinery,
    // company,
    // collectionDate,
    // invoiceNumber,
    // dataInvoice,
    // certificateDate,
    // capType,
    // performanceGrade,
    // penetration,
    // softeningPoint,
    // elasticRecovery,
    // vb_sp21_20,
    // vb_sp21_50,
    // vb_sp21_100,
    // observations,
    // } = step3Data;
    // if (!refinery) throw t('errors.empty-stabilizer');
    // if (!company) throw t('errors.empty-tenor');
    // if (!collectionDate) throw t('errors.empty-especificMass');
    // if (!invoiceNumber) throw t('errors.empty-rtf');
    // if (!dataInvoice) throw t('errors.empty-rtcd');
    // if (!certificateDate) throw t('errors.empty-rcs');
    // if (!capType) throw t('errors.empty-compressionEnergy');
    // if (!performanceGrade) throw t('errors.empty-granulometricRange');
    // if (!penetration) throw t('errors.empty-rsInitial');
    // if (!softeningPoint) throw t('errors.empty-optimalHumidity');
    // if (!elasticRecovery) throw t('errors.empty-rsFinal');
    // if (!vb_sp21_20) throw t('errors.empty-constantA');
    // if (!vb_sp21_50) throw t('errors.empty-constantB');
    // if (!vb_sp21_100) throw t('errors.empty-k1psi1');
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

  submitStep4Data = async (step4Data: BinderAsphaltConcreteData['step4Data']): Promise<void> => {
    console.log('🚀 ~ BINDER_ASPHALT_CONCRETE_SERVICE ~ submitStep4Data= ~ step4Data:', step4Data);
    // try {
    // const {
    // refinery,
    // company,
    // collectionDate,
    // invoiceNumber,
    // dataInvoice,
    // certificateDate,
    // capType,
    // performanceGrade,
    // penetration,
    // softeningPoint,
    // elasticRecovery,
    // vb_sp21_20,
    // vb_sp21_50,
    // vb_sp21_100,
    // observations,
    // } = step3Data;
    // if (!refinery) throw t('errors.empty-stabilizer');
    // if (!company) throw t('errors.empty-tenor');
    // if (!collectionDate) throw t('errors.empty-especificMass');
    // if (!invoiceNumber) throw t('errors.empty-rtf');
    // if (!dataInvoice) throw t('errors.empty-rtcd');
    // if (!certificateDate) throw t('errors.empty-rcs');
    // if (!capType) throw t('errors.empty-compressionEnergy');
    // if (!performanceGrade) throw t('errors.empty-granulometricRange');
    // if (!penetration) throw t('errors.empty-rsInitial');
    // if (!softeningPoint) throw t('errors.empty-optimalHumidity');
    // if (!elasticRecovery) throw t('errors.empty-rsFinal');
    // if (!vb_sp21_20) throw t('errors.empty-constantA');
    // if (!vb_sp21_50) throw t('errors.empty-constantB');
    // if (!vb_sp21_100) throw t('errors.empty-k1psi1');
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
  saveEssay = async (store: BinderAsphaltConcreteData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/save`, {
        generalData: store.generalData,
        step2Data: store.step2Data,
        step3Data: store.step3Data,
        step4Data: store.step4Data,
      });

      const { success, error } = response.data;

      if (!success) {
        if (error && error.name === 'SampleCreationError') {
          throw new Error(t('pm.binder-asphalt-concrete-register.already-exists-error'));
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

export default BINDER_ASPHALT_CONCRETE_SERVICE;
