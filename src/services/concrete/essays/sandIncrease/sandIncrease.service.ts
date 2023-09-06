/* eslint-disable @typescript-eslint/no-unused-vars */
import { CompressionIcon, SandIncreaseIcon } from '@/assets';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { Sample } from '@/interfaces/soils';
import { t } from 'i18next';
import Api from '@/api';
import { CompressionActions, CompressionData } from '@/stores/soils/compression/compression.store';
import { Step } from '@mui/material';
import { SandIncreaseActions, SandIncreaseData } from '@/stores/concrete/sandIncrease/sandIncrease.store';
import { ConcreteMaterial } from '@/interfaces/concrete';

class SAND_INCREASE_SERVICE implements IEssayService {
  info = {
    key: 'sandIncrease',
    icon: SandIncreaseIcon,
    title: t('concrete.essays.sandIncrease'),
    path: '/concrete/essays/sand-increase',
    steps: 4,
    backend_path: 'concrete/essays/sand-increase',
    standard: {
      name: 'ABNT NBR 6467',
      link: 'link da norma',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' },
      { step: 1, description: t('unit mass determination'), path: 'passo2' },
      { step: 2, description: t('humidity found'), path: 'passo3' },
      { step: 3, description: t('results'), path: 'results' },
    ],
  };

  store_actions: SandIncreaseActions;
  userId: string;

  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitSandIncreaseGeneralData(data as SandIncreaseData['sandIncreaseGeneralData']);
          break;
        case 1:
          await this.submitUnitMassDeterminationData(data as SandIncreaseData['unitMassDeterminationData']);
          break;
        case 2:
          await this.submitHumidityFoundData(data as SandIncreaseData['humidityFoundData']);
          await this.calculateResults(data as SandIncreaseData);
          break;
        case 3:
          await this.saveEssay(data as SandIncreaseData);
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };

  /** @generalData Methods for general-data (step === 0, page 1) */

  getMaterialsByUserId = async (userId: string): Promise<ConcreteMaterial[]> => {
    try {
      const response = await Api.get(`concrete/materials/all/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  submitSandIncreaseGeneralData = async (generalData: SandIncreaseData['sandIncreaseGeneralData']): Promise<void> => {
    try {
      const { name, material } = generalData;

      if (!name) throw t('errors.empty-name');
      if (!material) throw t('errors.empty-material');

      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name, material });

      const { success, error } = response.data;

      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  // Método caluculateUnitMassDetermination com as verificações;
  // Colocar botão na tela que aciona este método;

  submitUnitMassDeterminationData = (
    unitMassDeterminationData: SandIncreaseData['unitMassDeterminationData']
  ): void => {
    try {
      if (!unitMassDeterminationData.containerVolume) throw t('errors.empty-container-volume');
      if (unitMassDeterminationData.containerVolume < 0) throw t('errors.negative-container-volume');

      if (!unitMassDeterminationData.containerWeight) throw t('errors.empty-container-weight');
      if (unitMassDeterminationData.containerWeight < 0) throw t('errors.negative-container-weight');
    } catch (error) {
      throw error;
    }
  };

  submitHumidityFoundData = (humidityFoundData: SandIncreaseData['humidityFoundData']): void => {
    try {
      //console.log(humidityFoundData);
    } catch (error) {
      throw error;
    }
  };

  calculateResults = async (store: SandIncreaseData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-results`, {
        unitMassDeterminationData: store.unitMassDeterminationData,
        humidityFoundData: store.humidityFoundData.tableData,
        sandIncreaseGeneralData: store.sandIncreaseGeneralData,
      });

      const { success, error, result } = response.data;

      if (success === false) throw error.name;

      this.store_actions.setData({ step: 3, value: result });
    } catch (error) {
      throw error;
    }
  };

  saveEssay = async (store: SandIncreaseData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/save-essay`, {
        generalData: {
          ...store.sandIncreaseGeneralData,
          userId: this.userId,
        },
        unitMassDeterminationData: store.unitMassDeterminationData,
        humidityFoundData: store.humidityFoundData,
        results: store.results,
      });

      const { success, error } = response.data;

      console.log(error);

      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };
}

export default SAND_INCREASE_SERVICE;
