import { ConcreteMaterial } from '@/interfaces/concrete';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface sandIncrease_generalData {
  userId: string;
  name: string;
  material: ConcreteMaterial; // materialID
  operator?: string;
  description?: string;
  cauculist?: string;
}

export interface SandIncrease_Step2TableData {
  sample: number,
  moistureContent: number;
  containerWeightSample: number;
}

interface unitMassDeterminationData {
  tableData: SandIncrease_Step2TableData[];
  containerVolume: number;
  containerWeight: number;
}

interface foundHumidityData {
  teste: number
}

interface sandIncrease_results {
  result: string; // corrigir
}

export type SandIncreaseData = {
  sandIncreaseGeneralData: sandIncrease_generalData;
  unitMassDeterminationData: unitMassDeterminationData;
  foundHumidityData: foundHumidityData;
  results: sandIncrease_results;
};

export type SandIncreaseActions = {
  setData: ({ step, key, value }: setDataType) => void;
};

type setDataType = { step: number; key?: string; value: unknown };

const stepVariant = { 0: 'sandIncreaseGeneralData', 1: 'unitMassDetermination', 2: 'results' };

const useSandIncreaseStore = create<SandIncreaseData & SandIncreaseActions>()(
  devtools(
    persist(
      (set) => ({
        sandIncreaseGeneralData: {
          userId: null,
          name: null,
          material: null,
          operator: null,
          description: null,
          cauculist: null,
        },
        unitMassDeterminationData: {
          containerVolume: null,
          containerWeight: null,
          tableData: [
            {
              sample: 1,
              moistureContent: 0,
              containerWeightSample: null
            },
            {
              sample: 2,
              moistureContent: 0.5,
              containerWeightSample: null
            },
            {
              sample: 3,
              moistureContent: 1,
              containerWeightSample: null
            },
            {
              sample: 4,
              moistureContent: 2,
              containerWeightSample: null
            },
            {
              sample: 5,
              moistureContent: 4,
              containerWeightSample: null
            },
            {
              sample: 6,
              moistureContent: 5,
              containerWeightSample: null
            },
            {
              sample: 7,
              moistureContent: 7,
              containerWeightSample: null
            },
            {
              sample: 8,
              moistureContent: 9,
              containerWeightSample: null
            },
            {
              sample: 9,
              moistureContent: 12,
              containerWeightSample: null
            },
          ]
        },
        foundHumidityData: {
          teste: null
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
        name: 'sandIncrease-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useSandIncreaseStore;
