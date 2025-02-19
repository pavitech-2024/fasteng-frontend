import { SoilSample } from '@/interfaces/soils';
import { getSieveName } from '@/utils/sieves';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface GeneralData {
  userId: string;
  name: string;
  sample: SoilSample;
  operator?: string;
  calculist?: string;
  description?: string;
}

interface sucs_step2Data {
  cc: number;
  cnu: number;
  liquidity_limit: number;
  plasticity_limit: number;
  sieves: { sieve: string; passant: number }[];
  organic_matter: boolean;
}

interface sucs_results {
  cc: number;
  cnu: number;
  ip: number;
  classification: string;
}

export type SucsData = {
  generalData: GeneralData;
  step2Data: sucs_step2Data;
  results: sucs_results;
};

export type SucsActions = {
  setData: ({ step, key, value }: setDataType) => void;
};

const stepVariant = { 0: 'generalData', 1: 'step2Data', 2: 'results' };

type setDataType = { step: number; key?: string; value: unknown };

const useSucsStore = create<SucsData & SucsActions>()(
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
          cc: null,
          cnu: null,
          liquidity_limit: null,
          plasticity_limit: null,
          sieves: [
            { sieve: getSieveName(4.8), passant: null },
            { sieve: getSieveName(0.075), passant: null },
          ],
          organic_matter: null,
        },
        results: {
          cc: null,
          cnu: null,
          ip: null,
          classification: null,
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
        // name data store e config no session storage
        name: 'sucs-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useSucsStore;
