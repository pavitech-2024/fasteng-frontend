import { Sample } from '@/interfaces/soils';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { setDataType } from '../cbr/cbr.store';

interface GeneralData {
  userId: string;
  name: string;
  sample: Sample;
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
};

const stepVariant = { 0: 'generalData', 1: 'step2Data', 2: 'results' };

const useHrbStore = create<HrbData & HrbActions>()(
  devtools(
    persist(
      (set) => ({
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
        name: 'hrb-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useHrbStore;