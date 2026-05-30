/* eslint-disable @typescript-eslint/no-unused-vars */
import { CompressionIcon } from '@/assets';
import { IEssayService } from '@/interfaces/common/essay/essay-service.interface';
import { SoilSample } from '@/interfaces/soils';
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
      console.error('🔴 ERRO NO SERVICE - handleNext:', error);
      throw error;
    }
  };

  getSamplesByUserId = async (userId: string): Promise<SoilSample> => {
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

      if (success === false) {
        console.error('❌ Erro ao verificar dados iniciais:', error);
        throw error.message || error.name || JSON.stringify(error);
      }
    } catch (error) {
      console.error('❌ ERRO NO submitCompressionGeneralData:', error);
      throw error;
    }
  };

  submitCompressionHygroscopicData = async (hygroscopicData: CompressionData['hygroscopicData']): Promise<void> => {
    try {
      Object.entries(hygroscopicData).forEach((array) => {
        const [key, value] = array;
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
      });

      const { humidityTable } = humidityDeterminationData;

      if (!humidityTable) throw t('errors.empty-humidity-table');

      for (let i = 0; i < humidityTable.length; i++) {
        const { 
          capsules, 
          dryGrossWeightsCapsule, 
          wetGrossWeightsCapsule, 
          wetGrossWeights,
          capsulesTare 
        } = humidityTable[i];

        // Validar se todos os campos estão preenchidos
        if (!capsulesTare || capsulesTare === null) {
          const msg = t('errors-empty-capsules-weights-hum') + ` [ ponto: ${i + 1}]`;
          console.error('❌ Validação 1 falhou:', msg);
          throw msg;
        }
        if (!wetGrossWeightsCapsule || wetGrossWeightsCapsule === null) {
          const msg = `Peso bruto da cápsula [úmido] está vazio [ ponto: ${i + 1}]`;
          console.error('❌ Validação 2 falhou:', msg);
          throw msg;
        }
        if (!wetGrossWeights || wetGrossWeights === null) {
          const msg = `Peso bruto úmido total está vazio [ ponto: ${i + 1}]`;
          console.error('❌ Validação 3 falhou:', msg);
          throw msg;
        }
        if (!dryGrossWeightsCapsule || dryGrossWeightsCapsule === null) {
          const msg = `Peso seco da cápsula está vazio [ ponto: ${i + 1}]`;
          console.error('❌ Validação 4 falhou:', msg);
          throw msg;
        }

        // Validações de lógica (mesmas do step3)
        if (wetGrossWeightsCapsule >= wetGrossWeights) {
          const msg = `Peso bruto da cápsula (${wetGrossWeightsCapsule}g) ≥ Peso bruto úmido (${wetGrossWeights}g) - O peso bruto da cápsula deve ser MENOR que o peso bruto úmido total [ ponto: ${i + 1}]`;
          console.error('❌ Validação 5 falhou:', msg);
          throw msg;
        }
        
        if (wetGrossWeightsCapsule < dryGrossWeightsCapsule) {
          const msg = `Peso bruto da cápsula [úmido] (${wetGrossWeightsCapsule}g) < Peso seco da cápsula (${dryGrossWeightsCapsule}g) - O peso úmido deve ser MAIOR ou IGUAL ao peso seco [ ponto: ${i + 1}]`;
          console.error('❌ Validação 6 falhou:', msg);
          throw msg;
        }
        
        if (wetGrossWeightsCapsule <= capsulesTare) {
          const msg = `Peso bruto da cápsula (${wetGrossWeightsCapsule}g) ≤ Tara (${capsulesTare}g) - O peso da cápsula com amostra deve ser MAIOR que a tara [ ponto: ${i + 1}]`;
          console.error('❌ Validação 7 falhou:', msg);
          throw msg;
        }
        
        if (capsulesTare >= dryGrossWeightsCapsule) {
          const msg = `Tara (${capsulesTare}g) ≥ Peso seco da cápsula (${dryGrossWeightsCapsule}g) - A tara deve ser MENOR que o peso seco [ ponto: ${i + 1}]`;
          console.error('❌ Validação 8 falhou:', msg);
          throw msg;
        }
        
        if (wetGrossWeights <= capsulesTare) {
          const msg = `Peso bruto úmido (${wetGrossWeights}g) ≤ Tara (${capsulesTare}g) - O peso bruto úmido deve ser MAIOR que a tara [ ponto: ${i + 1}]`;
          console.error('❌ Validação 9 falhou:', msg);
          throw msg;
        }
        
        if (wetGrossWeights < dryGrossWeightsCapsule) {
          const msg = `Peso bruto úmido (${wetGrossWeights}g) < Peso seco da cápsula (${dryGrossWeightsCapsule}g) - O peso bruto úmido deve ser MAIOR ou IGUAL ao peso seco [ ponto: ${i + 1}]`;
          console.error('❌ Validação 10 falhou:', msg);
          throw msg;
        }
      }
      console.log('✅ Todas as validações passaram!');
    } catch (error) {
      console.error('❌ ERRO NO submitCompressionHumidityDeterminationData:', error);
      throw error;
    }
  };

  submitCompressionData = async (hygroscopicData: CompressionData['hygroscopicData']): Promise<void> => {
    try {
      Object.entries(hygroscopicData).forEach((array) => {
        const [key, value] = array;
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
      console.log('📤 Enviando dados para calcular resultados...');
      console.log('Dados:', {
        generalData: store.compressionGeneralData,
        hygroscopicData: store.hygroscopicData,
        humidityDeterminationData: store.humidityDeterminationData,
      });

      const response = await Api.post(`${this.info.backend_path}/calculate-results`, {
        generalData: store.compressionGeneralData,
        hygroscopicData: store.hygroscopicData,
        humidityDeterminationData: store.humidityDeterminationData,
      });

      console.log('📥 Resposta recebida:', response.data);

      const { success, error, result } = response.data;

      if (success === false) {
        console.error('❌ Backend retornou sucesso=false');
        console.error('Error object:', error);
        console.error('Error type:', typeof error);
        console.error('Error.message:', error?.message);
        console.error('Error.name:', error?.name);
        throw error?.message || error?.name || JSON.stringify(error) || 'Erro ao calcular resultados';
      }

      console.log('✅ Resultados calculados com sucesso!');
      this.store_actions.setData({ step: 3, value: result });
    } catch (error) {
      console.error('❌ ERRO NO calculateResults:', error);
      throw error;
    }
  };
}

export default COMPRESSION_SERVICE;
