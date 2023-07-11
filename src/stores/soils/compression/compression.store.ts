import { Sample } from '@/interfaces/soils';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface compression_generalData {
  userId: string;
  name: string; // nameEssay
  sample: Sample; // materialID
  operator?: string;
  description?: string; //  observation
  reckoner: string;
}

interface hygroscopicData {
  moldVolume: string;
  moldWeight: string;
  moldNumber: string;
  socketWeight: string;
  spaceDiscThickness: string;
  strokesPerLayer: string;
  layers: string;
}

interface humidityDeterminationData {
  capsules: string[];
  wetGrossWeightsCapsule: string[];
  dryGrossWeights: string[];
  capsulesTare: string[];
  wetGrossWeights: string[];
}

interface compression_results {
  result: string;
}

export type CompressionData = {
  compressionGeneralData: compression_generalData;
  hygroscopicData: hygroscopicData;
  HumidityDeterminationData: humidityDeterminationData;
  results: compression_results;
};

export type CompressionActions = {
  setData: ({ step, key, value }: setDataType) => void;
};

type setDataType = { step: number; key?: string; value: unknown };

const stepVariant = { 0: 'generalData', 1: 'hygroscopicData', 2: 'HumidityDeterminationData', 3: 'results' };

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
          reckoner: '',
        },
        hygroscopicData: {
          moldVolume: '',
          moldWeight: '',
          moldNumber: '',
          socketWeight: '',
          spaceDiscThickness: '',
          strokesPerLayer: '',
          layers: '',
        },
        HumidityDeterminationData: {
          capsules: [],
          wetGrossWeightsCapsule: [],
          dryGrossWeights: [],
          capsulesTare: [],
          wetGrossWeights: [],
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
