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
  hygroscopicTable: {
    id: number;
    capsule: number; // número de cápsulas
    wetGrossWeightCapsule: number; // peso bruto úmido (g)
    dryGrossWeight: number; // peso bruto seco (g)
    capsuleTare: number; // peso da cápsula (g)
  }[];
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
    dryGrossWeightsCapsule: number; // peso seco da amostra + capsula (g)
    capsulesTare: number; // peso da cápsula (g)
  }[];
}

interface compression_results {
  waterWeight: number;
  netWeightDrySoil: number;
  hygroscopicMoisture: number;
  wetSoilWeights: number;
  wetSoilDensitys: number;
  waterWeights: number;
  netWeightsDrySoil: number;
  moistures: number;
  drySoilDensitys: number;
  regression: number;
  a_index: number;
  b_index: number;
  optimumMoisture: number;
  optimumDensity: number;
  graph: number;
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
              id: 0,
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
              id: 0,
              capsules: null,
              wetGrossWeightsCapsule: null,
              wetGrossWeights: null,
              dryGrossWeightsCapsule: null,
              capsulesTare: null,
            },
          ],
        },
        results: {
          waterWeight: null,
          netWeightDrySoil: null,
          hygroscopicMoisture: null,
          wetSoilWeights: null,
          wetSoilDensitys: null,
          waterWeights: null,
          netWeightsDrySoil: null,
          moistures: null,
          drySoilDensitys: null,
          regression: null,
          a_index: null,
          b_index: null,
          optimumMoisture: null,
          optimumDensity: null,
          graph: null,
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
