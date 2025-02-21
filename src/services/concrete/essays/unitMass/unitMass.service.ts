import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { UnitMassActions, UnitMassData } from '@/stores/concrete/unitMass/unitMass.store';
import Api from '@/api';
import { UnitMassIcon } from '@/assets';
import { t } from 'i18next';

class UNITMASS_SERVICE implements IEssayService {
  info = {
    key: 'unitMass',
    icon: UnitMassIcon,
    title: t('concrete.essays.unitMass'),
    path: '/concrete/essays/unitMass',
    steps: 3,
    backend_path: 'concrete/essays/unitMass',
    standard: {
      name: 'ABNT NM 45',
      link: '',
    },
    stepperData: [
      { step: 0, description: t('unitMass.generalData'), path: 'general-data' },
      { step: 1, description: t('unitMass.repositoryAndSample'), path: 'step2' },
      { step: 2, description: t('unitMass.result'), path: 'result' },
    ],
  };

  store_actions: UnitMassActions;
  userId: string;

  /** @handleNext Receives the step and data from the form and calls the respective method */
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as UnitMassData['generalData']);
          break;
        case 1:
          await this.submitStep2Data(data as UnitMassData);
          await this.calculateResults(data as UnitMassData);
          break;
        case 2:
          await this.saveEssay(data as UnitMassData);
          break;
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };

  submitGeneralData = async (generalData: UnitMassData['generalData']): Promise<void> => {
    try {
      const { experimentName, material, method } = generalData;

      if (!experimentName) throw t('errors.empty-experimentName');
      if (!material) throw t('errors.empty-aggregate');
      if (!method) throw t('errors.empty-method');

      const payload = {
        experimentName,
        material,
        method,
      };

      const response = await Api.post(`${this.info.backend_path}/verify-init`, payload);

      const { success, error } = response.data;

      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  submitStep2Data = async (
    // generalData: UnitMassData['generalData'],
    data: UnitMassData
  ): Promise<void> => {
    try {
      const { containerVolume, containerWeight, sampleContainerWeight } = data.step2Data;

      if (!containerVolume) throw t('errors.empty-containerVolume');
      if (!containerWeight) throw t('errors.containerWeight');
      if (!sampleContainerWeight) throw t('errors.sampleContainerWeight');
      if (containerVolume + containerWeight <= sampleContainerWeight) throw t('errors.sampleContainerWeightValue');
      if (containerVolume === 0) throw t('errors.unitMass-containerVolume-0');
      if (containerWeight >= sampleContainerWeight) throw t('errors.unitMass-containerWeight-sampleContainerWeigth');
      // if (material.description.maxDiammeter.value <= 37.5 && containerVolume < 10)
      //   throw t('errors.unitMass-containerVolume-10-maxDiameter-37.5');
      // if (
      //   material.description.maxDiammeter.value > 37.5 &&
      //   material.description.maxDiammeter.value <= 50 &&
      //   containerVolume <= 37.5 &&
      //   containerVolume < 15
      // )
      //   throw t('errors.unitMass-containerVolume-15-37.5maxDiameter-50');
      // if (
      //   material.description.maxDiammeter.value > 50 &&
      //   material.description.maxDiammeter.value <= 75 &&
      //   containerVolume < 30 &&
      //   containerVolume < 30
      // )
      //   throw t('errors.unitMass-containerVolume-30-50-maxDiameter-75');

      const response = await Api.post(`${this.info.backend_path}/step2-unitMass-data`, {
        containerVolume,
        containerWeight,
        sampleContainerWeight,
      });

      const { success, error } = response.data;

      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  calculateResults = async (store: UnitMassData): Promise<void> => {
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

  saveEssay = async (store: UnitMassData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/save-essay`, {
        generalData: {
          ...store.generalData,
          userId: this.userId,
        },
        step2Data: store.step2Data,
        result: store.result,
      });

      const { success, error } = response.data;

      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };
}

export default UNITMASS_SERVICE;
