/* eslint-disable @typescript-eslint/no-unused-vars */
import { CompressionIcon } from '@/assets';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { Sample } from '@/interfaces/soils';
import { t } from 'i18next';
import Api from '@/api';
import { CompressionActions, CompressionData } from '@/stores/soils/compression/compression.store';
import { Step } from '@mui/material';

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
      { step: 0, description: t('compression.general_data'), path: 'general-data' },
      { step: 1, description: t('compression.hygroscopic_humidity'), path: 'hygroscopic-humidity' }, // Umidade higroscópica
      { step: 2, description: t('compression.humidity_determination'), path: 'humidity-determination' }, // Determinação da umidade
      { step: 3, description: t('compression.results'), path: 'results' },
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
        case 1:
          await this.submitCompressionHygroscopicData(data as CompressionData['hygroscopicData']);
          break;
        case 2:
          await this.submitCompressionHumidityDeterminationData(data as CompressionData['humidityDeterminationData']);
          //await this.calculateResults(data as CompressionData);
          break;
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

  submitCompressionHygroscopicData = async (hygroscopicData: CompressionData['hygroscopicData']): Promise<void> => {
    try {
      Object.entries(hygroscopicData).forEach((array) => {
        const [key, value] = array;
        if (!value) console.log(`errors.empty-${key}`);
        // ver se precisa de mais alguma validação fora ver se esta vazio
      });

      const response = await Api.post(`${this.info.backend_path}/verify-init`, {
        hygroscopicData,
      });

      const { success, error } = response.data;

      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };

  submitCompressionHumidityDeterminationData = async (
    humidityDeterminationData: CompressionData['humidityDeterminationData']
  ): Promise<void> => {
    try {
      Object.entries(humidityDeterminationData).forEach((array) => {
        const [key, value] = array;
        if (!value) console.log(`errors.empty-${key}`);
        // ver se precisa de mais alguma validação fora ver se esta vazio
      });

      const response = await Api.post(`${this.info.backend_path}/verify-init`, {
        humidityDeterminationData,
      });

      const { success, error } = response.data;

      if (success === false) throw error.name;
    } catch (error) {
      throw error;
    }
  };
}

export default COMPRESSION_SERVICE;
