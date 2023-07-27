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
  capsule: number; // número de cápsulas
  wetGrossWeightCapsule: number; // peso bruto úmido (g)
  dryGrossWeight: number; // peso bruto seco (g)
  capsuleTare: number; // peso da cápsula (g)
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
    capsules: number; // número de capsulas
    wetGrossWeightsCapsule: number; // peso bruto úmido (g)
    wetGrossWeights: number; // peso úmido da amostra + cápsula (g)
    dryGrossWeights: number; // peso seco da amostra + capsula (g)
    capsulesTare: number; // peso da cápsula (g)
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
              capsule: null,
              wetGrossWeightCapsule: null,
              dryGrossWeight: null,
              capsuleTare: null,
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
              capsules: null,
              wetGrossWeightsCapsule: null,
              wetGrossWeights: null,
              dryGrossWeights: null,
              capsulesTare: null,
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
