import { Sample } from '@/interfaces/soils';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface compression_generalData {
  userId: string;
  name: string;
  sample: Sample; // materialID
  operator?: string;
  description?: string;
  cauculist?: string;
}

export type hygTable = {
  id: number;
  capsulesNumberHyg: number; // número de cápsulas
  wetGrossWeightsCapsuleHyg: number; // peso bruto úmido (g)
  dryGrossWeightsHyg: number; // peso bruto seco (g)
  capsulesWeightsHyg: number; // peso da cápsula (g)
};

interface hygroscopicData {
  // tabela
  hygroscopicTable: hygTable[];
  moldNumber: number; // número de molde
  moldVolume: number; // volume do molde (cm³)
  moldWeight: number; // peso do molde (g)
  socketWeight: number; // peso do soquete (g)
  spaceDiscThickness: number; // espessura do disco espaçador (cm)
  strokesPerLayer: number; // golpes/camada
  layers: number; // número de camadas
}

interface humidityDeterminationData {
  humidityTable: {
    id: number;
    capsulesNumberHum: number; // número de capsulas
    wetGrossWeightsCapsuleHum: number; // peso bruto úmido (g)
    wetWeightsCapsules: number; // peso úmido da amostra + cápsula (g)
    dryWeightsCapsules: number; // peso seco da amostra + capsula (g)
    capsulesWeightsHum: number; // peso da cápsula (g)
  }[];
}

interface compression_results {
  result: string; // corrigir
}

export type CompressionData = {
  compressionGeneralData: compression_generalData;
  hygroscopicData: hygroscopicData;
  humidityDeterminationData: humidityDeterminationData;
  results: compression_results;
};

export type CompressionActions = {
  setData: ({ step, key, value }: setDataType) => void;
};

type setDataType = { step: number; key?: string; value: unknown };

const stepVariant = { 0: 'compressionGeneralData', 1: 'hygroscopicData', 2: 'humidityDeterminationData', 3: 'results' };

const useCompressionStore = create<CompressionData & CompressionActions>()(
  devtools(
    persist(
      (set) => ({
        compressionGeneralData: {
          userId: null,
          name: null,
          sample: null,
          operator: null,
          description: null,
          cauculist: null,
        },
        hygroscopicData: {
          hygroscopicTable: [
            {
              id: null,
              capsulesNumberHyg: null,
              wetGrossWeightsCapsuleHyg: null,
              dryGrossWeightsHyg: null,
              capsulesWeightsHyg: null,
            },
          ],
          moldNumber: null,
          moldVolume: null,
          moldWeight: null,
          socketWeight: null,
          spaceDiscThickness: null,
          strokesPerLayer: null,
          layers: null,
        },
        humidityDeterminationData: {
          humidityTable: [
            {
              id: null,
              capsulesNumberHum: null,
              wetGrossWeightsCapsuleHum: null,
              wetWeightsCapsules: null,
              dryWeightsCapsules: null,
              capsulesWeightsHum: null,
            },
          ],
        },
        results: {
          result: null,
        },

        setData: ({ step, key, value }) =>
          set((state) => {
            if (key)
              return {
                ...state,
                [stepVariant[step]]: {
                  ...state[stepVariant[step]],
                  [key]: value,
                },
              };
            else return { ...state, [stepVariant[step]]: value };
          }),
      }),
      {
        name: 'compression-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useCompressionStore;
