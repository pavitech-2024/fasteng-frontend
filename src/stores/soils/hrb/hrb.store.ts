import { SoilSample } from '@/interfaces/soils';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { setDataType } from '../cbr/cbr.store';

interface GeneralData {
  userId: string;
  name: string;
  sample: SoilSample;
  operator?: string;
  calculist?: string;
  description?: string;
}

interface hrb_step2Data {
  tableData: HRB_Step2TableData[];
  liquidity_limit: number;
  plasticity_limit: number;
}

interface hrb_results {
  classification: string;
  group_index: number;
  plasticity_index: number;
}

export interface HRB_Step2TableData {
  sieve: number;
  percent_passant: number;
}

export type HrbData = {
  generalData: GeneralData;
  step2Data: hrb_step2Data;
  results: hrb_results;
};

export type HrbActions = {
  setData: ({ step, key, value }: setDataType) => void;
  reset: () => void;
};

const stepVariant = { 0: 'generalData', 1: 'step2Data', 2: 'results' };

const initialState = {
  generalData: {
    userId: null,
    name: null,
    sample: null,
    operator: null,
    calculist: null,
    description: null,
  },

  step2Data: {
    liquidity_limit: null,
    plasticity_limit: null,
    tableData: [
      {
        sieve: 2,
        percent_passant: null,
      },

      {
        sieve: 0.43,
        percent_passant: null,
      },

      {
        sieve: 0.075,
        percent_passant: null,
      },
    ],
  },
  results: {
    classification: null,
    group_index: null,
    plasticity_index: null,
  },
};

const useHrbStore = create<HrbData & HrbActions>()(
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
        name: 'hrb-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useHrbStore;
