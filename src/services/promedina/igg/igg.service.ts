// src/services/promedina/igg/igg.service.ts
import { t } from 'i18next';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { IggAnalysisData, IggAnalysisActions } from '@/stores/promedina/igg/igg.store';
import iggAnalysisService from './igg-view.service';
import iggImage from '../../../assets/pro-medina/igg/igg.png';

class IGG_SERVICE implements IEssayService {
  info = {
    key: 'igg',
    icon: iggImage,
    title: t('pm.igg-register'),
    path: '/promedina/igg',
    steps: 3,
    backend_path: 'promedina/igg/igg-analysis',
    standard: {
      name: '',
      link: '',
    },
    stepperData: [
      { step: 0, description: t('pm.general.data'), path: 'generalData' },
      { step: 1, description: t('pm.stations.defects'), path: 'stations' },
      { step: 2, description: t('pm.register.resume'), path: 'results' },
    ],
  };

  store_actions: IggAnalysisActions;
  userId: string;

  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitGeneralData(data as IggAnalysisData['generalData']);
          break;
        case 1:
          await this.submitStationsData(data as IggAnalysisData['stations']);
          break;
        case 2:
          await this.saveAnalysis(data as IggAnalysisData);
          break;
        default:
          throw new Error(t('errors.invalid-step'));
      }
    } catch (error) {
      throw error;
    }
  };

  submitGeneralData = async (generalData: IggAnalysisData['generalData']): Promise<void> => {
    // Dados salvos no store automaticamente
    console.log('📋 Dados gerais IGG:', generalData);
  };

  submitStationsData = async (stations: IggAnalysisData['stations']): Promise<void> => {
    // Dados salvos no store automaticamente
    console.log('🚉 Estações IGG:', stations.length);
  };

  saveAnalysis = async (store: IggAnalysisData): Promise<void> => {
    console.log("🚀 [saveIGGAnalysis] INÍCIO");
    console.log("📦 STORE ORIGINAL:", store);

    const { _id } = store;
    console.log("🆔 ID:", _id);

    // Normalização de valores null
    const replaceNullValues = (data: any): any => {
      const newData = { ...data };

      const recursiveReplaceNull = (obj: Record<string, any>, path = '') => {
        for (const key in obj) {
          const fullPath = path ? `${path}.${key}` : key;

          if (obj[key] === null) {
            console.log(`⚠️ NULL encontrado em: ${fullPath}`);
            obj[key] = '-';
          } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            recursiveReplaceNull(obj[key], fullPath);
          } else if (Array.isArray(obj[key])) {
            obj[key].forEach((item: any, index: number) => {
              if (typeof item === 'object' && item !== null) {
                recursiveReplaceNull(item, `${fullPath}[${index}]`);
              }
            });
          }
        }
      };

      recursiveReplaceNull(newData);
      return newData;
    };

    console.log("🔧 Normalizando nulls...");
    const updatedData = replaceNullValues(store);
    console.log("✅ DATA APÓS NORMALIZAÇÃO:", updatedData);

    const { name, description, road, section, subtrack, pavementType, evaluationDate, stations, results, status, userId } = updatedData;

    console.log("📄 NAME:", name);
    console.log("📄 ROAD:", road);
    console.log("📄 STATIONS:", stations?.length);

    try {
      let response;

      if (!_id || _id === '---') {
        console.log("🆕 MODO: CREATE");

        const { _id, ...storeWithoutId } = store;

        console.log("📤 PAYLOAD CREATE:", {
          name,
          description,
          road,
          section,
          subtrack,
          pavementType,
          evaluationDate,
          stations,
          results,
          status,
          userId,
        });

        response = await iggAnalysisService.saveAnalysis({
          name,
          description,
          road,
          section,
          subtrack,
          pavementType,
          evaluationDate,
          stations,
          results,
          status: status || 'draft',
          userId,
        });

      } else {
        console.log("✏️ MODO: UPDATE");

        console.log("📤 PAYLOAD UPDATE:", {
          name,
          description,
          road,
          section,
          subtrack,
          pavementType,
          evaluationDate,
          stations,
          results,
          status,
        });

        response = await iggAnalysisService.updateAnalysis(_id, {
          name,
          description,
          road,
          section,
          subtrack,
          pavementType,
          evaluationDate,
          stations,
          results,
          status,
        });
      }

      console.log("📥 RESPONSE RECEBIDA:", response);

      const { data } = response;

      console.log("📊 DATA:", data);

      if (data && data._id) {
        console.log("🎉 ANÁLISE IGG SALVA COM SUCESSO! ID:", data._id);
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

      if (error?.response?.status === 409) {
        console.log("🚨 ANÁLISE JÁ EXISTE");
        throw new Error(t('pm.register.already-exists-error'));
      }

      throw error;
    }
  };
}

export default IGG_SERVICE;