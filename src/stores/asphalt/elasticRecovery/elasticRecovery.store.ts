import { AsphaltMaterial } from '@/interfaces/asphalt';
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface ElasticRecoveryGeneralData {
  userId: string;
  name: string;
  material: AsphaltMaterial;
  operator?: string;
  calculist?: string;
  description?: string;
}

interface ElasticRecoveryCalc {
  lengths: {
    id: number,
    stretching_length: number,
    juxtaposition_length: number,
  }[]
}

interface ElasticRecovery_results {
  elasticRecovery: number;
}

export type ElasticRecoveryData = {
  generalData: ElasticRecoveryGeneralData;
  elasticRecoveryCalc: ElasticRecoveryCalc;
  results: ElasticRecovery_results;
};

export type ElasticRecoveryActions = {
  setData: ({ step, key, value }: setDataType) => void;
  reset: ({ step }: setDataType) => void;
};

type setDataType = { step: number; key?: string; value: unknown };

const stepVariant = { 0: 'generalData', 1: 'elasticRecoveryCalc', 2: 'results' };

const initialState = {
  generalData: {
    userId: null,
    name: null,
    material: null,
    operator: null,
    calculist: null,
    description: null,
  },
  elasticRecoveryCalc: {
    lengths: [
      {
        id: 0,
        stretching_length: null,
        juxtaposition_length: null,
      }
    ],
  },
  results: {
    elasticRecovery: null,
  },
};

const useElasticRecoveryStore = create<ElasticRecoveryData & ElasticRecoveryActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

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

        reset: ({ step }) => {
          set(initialState);
          return {
            [stepVariant[step]]: null,
          };
        },
      }),
      {
        // name data store e config no session storage
        name: 'asphalt-elasticRecovery-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useElasticRecoveryStore;
