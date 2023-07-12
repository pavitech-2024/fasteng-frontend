/* eslint-disable @typescript-eslint/no-unused-vars */
import { CompressionIcon } from "@/assets";
import { IEssayService } from "@/interfaces/common/essay/essay-service.interface";
import { Sample } from "@/interfaces/soils";
import { t } from "i18next";
import Api from '@/api';
import { CompressionActions, CompressionData } from "@/stores/soils/compression/compression.store";

class COMPRESSION_SERVICE implements IEssayService {
  info = {
    key: 'compression',
    icon: CompressionIcon,
    title: t('soils.essays.compression'),
    path: '/soils/essays/compression',
    steps: 4,
    backend_path: 'soils/essays/compression',
    standard: {
      name: 'DNIT 164/2013 - ME',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_164_2013_me.pdf',
    },
    stepperData: [
      { step: 0, description: t('general data'), path: 'general-data' }, 
      { step: 1, description: t('hygroscopic humidity'), path: 'hygroscopic-humidity' }, // Umidade higroscópica
      { step: 2, description: t('humidity determination'), path: 'humidity-determination' }, // Determinação da umidade
      { step: 3, description: t('results'), path: 'results' },
    ],
  };

  store_actions: CompressionActions;
  userId: string;

  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
         case 0:
           await this.submitCompressionGeneralData(data as CompressionData['compressionGeneralData']);
           break;
      //  case 1:
      //     await this.submitHygroscopicData(data as CompressionData['hygroscopicData']);
      //     break;
      //   case 2:
      //     await this.submitHumidityDeterminationData(data as CompressionData['humidityDeterminationData']);
      //     await this.calculateResults(data as CompressionData);
      //     break;
      //   case 3:
      //     await this.saveEssay(data as CompressionData);
      //     break;
      //   default:
      //     throw t('errors.invalid-step');
      }
    } catch (error) {
      throw error;
    }
  };

  getSamplesByUserId = async (userId: string): Promise<Sample[]> => {
    try {
      // get all samples from user from backend
      const response = await Api.get(`soils/samples/all/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  submitCompressionGeneralData = async (generalData: CompressionData['compressionGeneralData']): Promise<void> => {
    try {
      const { name, sample } = generalData;

      if (!name) throw t('errors.empty-name');
      if (!sample) throw t('errors.empty-sample');

      const response = await Api.post(`${this.info.backend_path}/verify-init`, { name, sample });

      const { success, error } = response.data;

      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };
}

export default COMPRESSION_SERVICE;