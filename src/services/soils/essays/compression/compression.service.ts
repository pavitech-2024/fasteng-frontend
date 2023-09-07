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
          await this.submitCompressionData(data as CompressionData['hygroscopicData']);
          break;
        case 2:
          const { hygroscopicData, humidityDeterminationData } = data as CompressionData;
          //await this.submitCompressionHygroscopicData(hygroscopicData);
          await this.submitCompressionHumidityDeterminationData(humidityDeterminationData);
          await this.calculateResults(data as CompressionData);
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
    console.log(
      '🚀 ~ file: compression.service.ts:67 ~ COMPRESSION_SERVICE ~ submitCompressionGeneralData= ~ generalData:',
      generalData
    );
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

      const {
        hygroscopicTable,
        moldNumber,
        moldVolume,
        moldWeight,
        socketWeight,
        spaceDiscThickness,
        strokesPerLayer,
        layers,
      } = hygroscopicData;

      if (!hygroscopicTable) throw t('errors.empty-hygroscopic-table');
      if (!moldNumber) throw t('errors.empty-mold-number');
      if (!moldVolume) throw t('errors.empty-mold-volume');
      if (!moldWeight) throw t('errors.empty-mold-weight');
      if (!socketWeight) throw t('errors.empty-socket-weight');
      if (!spaceDiscThickness) throw t('errors.empty-space-disc-thickness');
      if (!strokesPerLayer) throw t('errors.empty-strokes-per-layer');
      if (!layers) throw t('errors.empty-layers');

      for (let i = 0; i < hygroscopicTable.length; i++) {
        const { wetGrossWeightCapsule, dryGrossWeight, capsuleTare } = hygroscopicTable[i];

        if (!capsuleTare || capsuleTare >= dryGrossWeight) {
          if (hygroscopicTable[i].capsule) {
            throw t('errors.invalid-capsules-number-hyg') + ` [ ${hygroscopicTable[i].capsule} ]`;
          } else {
            throw t('errors.invalid-capsules-number-hyg') + ` [ linha: ${i + 1} ]`;
          }
        }

        if (dryGrossWeight >= wetGrossWeightCapsule) {
          if (hygroscopicTable[i].capsule) {
            throw t('errors.invalid-dry-weights-capsule-hyg') + ` [ ${hygroscopicTable[i].capsule} ]`;
          } else {
            throw t('errors.invalid-dry-weights-capsule-hyg') + ` [ linha: ${i + 1} ]`;
          }
        }
      }
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

      const { humidityTable } = humidityDeterminationData;

      if (!humidityTable) throw t('errors.empty-humidity-table');

      for (let i = 0; i < humidityTable.length; i++) {
        const { capsules, dryGrossWeightsCapsule, wetGrossWeightsCapsule, capsulesTare } = humidityTable[i];

        if (!capsulesTare) {
          throw t('errors-empty-capsules-weights-hum') + ` [ ponto: ${i + 1}]`;
        }

        if (capsulesTare >= dryGrossWeightsCapsule) {
          if (humidityTable[i].capsules) {
            throw t('errors.invalid-capsules-number-hum') + ` [ ${humidityTable[i].capsules} ]`;
          } else {
            throw t('errors.invalid-capsules-number-hum') + ` [ ponto: ${i + 1} ]`;
          }
        }

        if (dryGrossWeightsCapsule >= wetGrossWeightsCapsule) {
          if (humidityTable[i].capsules) {
            throw t('errors.invalid-dry-weights-capsule-hum') + ` [ ${humidityTable[i].capsules} ]`;
          } else {
            throw t('errors.invalid-dry-weights-capsule-hum') + ` [ ponto: ${i + 1} ]`;
          }
        }
      }
    } catch (error) {
      throw error;
    }
  };

  submitCompressionData = async (hygroscopicData: CompressionData['hygroscopicData']): Promise<void> => {
    try {
      Object.entries(hygroscopicData).forEach((array) => {
        const [key, value] = array;
        if (!value) console.log(`errors.empty-${key}`);
        // ver se precisa de mais alguma validação fora ver se esta vazio
      });

      const {
        hygroscopicTable,
        moldNumber,
        moldVolume,
        moldWeight,
        socketWeight,
        spaceDiscThickness,
        strokesPerLayer,
        layers,
      } = hygroscopicData;

      if (!hygroscopicTable) throw t('errors.empty-hygroscopic-table');
      if (!moldNumber) throw t('errors.empty-mold-number');
      if (!moldVolume) throw t('errors.empty-mold-volume');
      if (!moldWeight) throw t('errors.empty-mold-weight');
      if (!socketWeight) throw t('errors.empty-socket-weight');
      if (!spaceDiscThickness) throw t('errors.empty-space-disc-thickness');
      if (!strokesPerLayer) throw t('errors.empty-strokes-per-layer');
      if (!layers) throw t('errors.empty-layers');

      for (let i = 0; i < hygroscopicTable.length; i++) {
        const { wetGrossWeightCapsule, dryGrossWeight, capsuleTare } = hygroscopicTable[i];

        if (!capsuleTare || capsuleTare >= dryGrossWeight) {
          if (hygroscopicTable[i].capsule) {
            throw t('errors.invalid-capsules-number-hyg') + ` [ ${hygroscopicTable[i].capsule} ]`;
          } else {
            throw t('errors.invalid-capsules-number-hyg') + ` [ linha: ${i + 1} ]`;
          }
        }

        if (dryGrossWeight >= wetGrossWeightCapsule) {
          if (hygroscopicTable[i].capsule) {
            throw t('errors.invalid-dry-weights-capsule-hyg') + ` [ ${hygroscopicTable[i].capsule} ]`;
          } else {
            throw t('errors.invalid-dry-weights-capsule-hyg') + ` [ linha: ${i + 1} ]`;
          }
        }
      }
    } catch (error) {
      throw error;
    }
  };

  calculateResults = async (store: CompressionData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-results`, {
        generalData: store.compressionGeneralData,
        hygroscopicData: store.hygroscopicData,
        humidityDeterminationData: store.humidityDeterminationData,
      });

      const { success, error, result } = response.data;

      if (success === false) throw error.name;

      this.store_actions.setData({ step: 3, value: result });
    } catch (error) {
      throw error;
    }
  };

  calculateResults = async (store: CompressionData): Promise<void> => {
    try {
      const response = await Api.post(`${this.info.backend_path}/calculate-results`, {
        generalData: store.compressionGeneralData,
        hygroscopicData: store.hygroscopicData,
        humidityDeterminationData: store.humidityDeterminationData,
      });

      const { success, error, result } = response.data;

      if (success === false) throw error.name;

      this.store_actions.setData({ step: 3, value: result });
    } catch (error) {
      throw error;
    }
  };
}

export default COMPRESSION_SERVICE;
