import { Sample } from '@/interfaces/soils';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface compression_generalData {
  userId: string;
  name: string; // nameEssay
  sample: Sample; // materialID
  operator?: string;
  description?: string; //  observation
  cauculist?: string;
}

interface hygroscopicData {
  capsulesNumberHyg: number[]; // número de cápsulas
  wetGrossWeightsCapsuleHyg: number[]; // peso bruto úmido (g)
  dryGrossWeightsHyg: number[]; // peso bruto seco (g)
  capsulesWeightsHyg: number[]; // peso da cápsula (g)
  moldNumber: number; // número de molde
  moldVolume: number; // volume do molde (cm³)
  moldWeight: number; // peso do molde (g)
  socketWeight: number; // peso do soquete (g)
  spaceDiscThickness: number; // espessura do disco espaçador (cm)
  strokesPerLayer: number; // golpes/camada
  layers: number; // número de camadas
}

interface humidityDeterminationData {
  capsulesNumberHum: number[]; // número de capsulas
  wetGrossWeightsCapsuleHum: number[]; // peso bruto úmido (g)
  wetWeightsCapsules: number[]; // peso úmido da amostra + cápsula (g)
  dryWeightsCapsules: number[]; // peso seco da amostra + capsula (g)
  capsulesWeightsHum: number[]; // peso da cápsula (g)
}

interface compression_results {
  result: string;
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

const stepVariant = { 0: 'generalData', 1: 'hygroscopicData', 2: 'humidityDeterminationData', 3: 'results' };

const useCompressionStore = create<CompressionData & CompressionActions>()(
  devtools(
    persist(
      (set) => ({
        compressionGeneralData: {
          userId: '',
          name: '',
          sample: null,
          operator: '',
          description: '',
          cauculist: '',
        },
        hygroscopicData: {
          capsulesNumberHyg: [0, 0], 
          wetGrossWeightsCapsuleHyg: [0, 0], 
          dryGrossWeightsHyg: [0, 0], 
          capsulesWeightsHyg: [0, 0], 
          moldNumber: 0, 
          moldVolume: 0,
          moldWeight: 0, 
          socketWeight: 0,
          spaceDiscThickness: 0,
          strokesPerLayer: 0, 
          layers: 0, 
        },
        humidityDeterminationData: {
          capsulesNumberHum: [0, 0], 
          wetGrossWeightsCapsuleHum: [0, 0], 
          wetWeightsCapsules: [0, 0], 
          dryWeightsCapsules: [0, 0], 
          capsulesWeightsHum: [0, 0], 
        },
        results: {
          result: '',
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
