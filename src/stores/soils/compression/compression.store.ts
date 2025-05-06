import { SoilSample } from '@/interfaces/soils';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface compression_generalData {
  userId: string;
  name: string;
  sample: SoilSample; // materialID
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
  netWeightDrySoil: number[]; // Peso do solo seco (g)
  waterWeight: number[]; // Peso da água (g)
  hygroscopicMoisture: number; // Umidade Higroscópica (%)

  wetSoilWeights: number[]; // Peso do solo úmido (g)
  wetSoilDensitys: number[]; // Densidade do solo úmido (g/cm³)
  netWeightsDrySoil: number[];
  moistures: number[];
  drySoilDensitys: number[];
  regression: number;
  a_index: number;
  b_index: number;
  optimumMoisture: number;
  optimumDensity: number;
  graph: [number, number][];
}

export type CompressionData = {
  compressionGeneralData: compression_generalData;
  hygroscopicData: hygroscopicData;
  humidityDeterminationData: humidityDeterminationData;
  results: compression_results;
};

export type CompressionActions = {
  setData: ({ step, key, value }: setDataType) => void;
  reset: () => void;
};

type setDataType = { step: number; key?: string; value: unknown };

const stepVariant = { 0: 'compressionGeneralData', 1: 'hygroscopicData', 2: 'humidityDeterminationData', 3: 'results' };

const initialState = {
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
    netWeightDrySoil: null,
    waterWeight: null,
    hygroscopicMoisture: null,

    wetSoilWeights: null,
    wetSoilDensitys: null,
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
};

const useCompressionStore = create<CompressionData & CompressionActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        /**
         * Updates the value of the given key in the state of the store for the given step.
         * If no key is given, the value is set as the whole state of the given step.
         * @param {{ step: number; key?: string; value: unknown }} data
         * @param {number} data.step The step of the state to update.
         * @param {string} [data.key] The key of the value to update in the state of the given step.
         * If not given, the value is set as the whole state of the given step.
         * @param {unknown} data.value The new value to set in the state of the given step.
         */
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

        reset: () => {
          set(initialState);
        },
      }),
      {
        name: 'compression-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useCompressionStore;
