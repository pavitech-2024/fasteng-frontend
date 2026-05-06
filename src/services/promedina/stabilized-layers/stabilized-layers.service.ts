import { t } from 'i18next';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import {
  StabilizedLayersActions,
  StabilizedLayersData,
} from '@/stores/promedina/stabilized-layers/stabilized-layers.store';
import samplesService from './stabilized-layers-view.service';
import stabilizedLayersImage from '../../../assets/pro-medina/stabilizedLayers/stabilized-layers-image.png';

class STABILIZEDLAYERS_SERVICE implements IEssayService {
  info = {
    key: 'stabilized-layers',
    icon: stabilizedLayersImage,
    title: t('pm.stabilized-layers-register'),
    path: '/promedina/stabilized-layers',
    steps: 3,
    backend_path: 'promedina/stabilized-layers/stabilized-layers-samples',
    standard: {
      name: '',
      link: '',
    },
    stepperData: [
      { step: 0, description: t('pm.general.data'), path: 'generalData' },
      { step: 1, description: t('pm.pavement.specific.data'), path: 'step2' },
      { step: 2, description: t('pm.register.resume'), path: 'resume' },
    ],
  };

  store_actions: StabilizedLayersActions;
  userId: string;

  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as StabilizedLayersData['generalData']);
          break;
        case 1:
          await this.submitStep2Data(data as StabilizedLayersData['step2Data']);
          break;
        case 2:
          await this.saveSample(data as StabilizedLayersData);
          break;
        default:
          throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };

  submitGeneralData = async (generalData: StabilizedLayersData['generalData']): Promise<void> => {
    // Dados salvos no store automaticamente
  };

  submitStep2Data = async (step2Data: StabilizedLayersData['step2Data']): Promise<void> => {
    // Dados salvos no store automaticamente
  };

  saveSample = async (store: StabilizedLayersData): Promise<void> => {
  console.log("🚀 [saveSample] INÍCIO");
  console.log("📦 STORE ORIGINAL:", store);

  const { _id } = store;
  console.log("🆔 ID:", _id);

  const replaceNullValues = (data: StabilizedLayersData): StabilizedLayersData => {
    const newData = { ...data };

    const recursiveReplaceNull = (obj: Record<string, any>, path = '') => {
      for (const key in obj) {
        const fullPath = path ? `${path}.${key}` : key;

        if (obj[key] === null) {
          console.log(`⚠️ NULL encontrado em: ${fullPath}`);
          obj[key] = '-';
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          recursiveReplaceNull(obj[key], fullPath);
        }
      }
    };

    recursiveReplaceNull(newData);
    return newData;
  };

  console.log("🔧 Normalizando nulls...");
  const updatedData = replaceNullValues(store);
  console.log("✅ DATA APÓS NORMALIZAÇÃO:", updatedData);

  const { generalData, step2Data } = updatedData;

  console.log("📄 GENERAL DATA:", generalData);
  console.log("📄 STEP2 DATA:", step2Data);

  try {
    let response;

    if (!_id || _id === '---') {
      console.log("🆕 MODO: CREATE");

      const { _id, ...storeWithoutId } = store;

      console.log("📤 PAYLOAD CREATE:", {
        ...storeWithoutId,
        generalData,
        step2Data
      });

      response = await samplesService.saveSample({
        ...storeWithoutId,
        generalData,
        step2Data
      });

    } else {
      console.log("✏️ MODO: UPDATE");

      console.log("📤 PAYLOAD UPDATE:", {
        ...store,
        generalData,
        step2Data
      });

      response = await samplesService.updateSample(_id, {
        ...store,
        generalData,
        step2Data
      });
    }

    console.log("📥 RESPONSE RECEBIDA:", response);

    const { success, error } = response.data;

    console.log("📊 SUCCESS:", success);
    console.log("📊 ERROR:", error);

    if (!success) {
      console.log("❌ BACKEND RETORNOU ERRO");

      if (error && error.name === 'SampleCreationError') {
        throw new Error(t('pm.register.already-exists-error'));
      }
    }

    console.log("🎉 FINALIZADO COM SUCESSO");

  } catch (error: any) {
    console.log("💥 ERRO CAPTURADO:", error);

    console.log("📡 STATUS:", error?.response?.status);
    console.log("📡 DATA:", error?.response?.data);

    if (error?.response?.status === 413) {
      console.log("🚨 PAYLOAD MUITO GRANDE");
      throw new Error(t('pm.register.payload-too-large-error'));
    }

    throw error;
  }
};
}

export default STABILIZEDLAYERS_SERVICE;