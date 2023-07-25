import { Sample } from '@/interfaces/soils';
import { getSieveName } from '@/utils/sieves';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface GeneralData {
  userId: string;
  name: string;
  sample: Sample;
  operator?: string;
  calculist?: string;
  description?: string;
}

interface granulometry_step2Data {
  sample_mass: number;
  passant_percentages: { sieve: string; passant: number }[];
  bottom: number;
}

interface granulometry_results {
  total_retained: number;
  retained_percentages: { sieve: string; retained: number }[];
  retained_accumulated_list: { sieve: string; retained: number }[];
  passants_graph: [];
  diameters_graph: [];
}

export type GranulometryData = {
  generalData: GeneralData;
  step2Data: granulometry_step2Data;
  results: granulometry_results;
};

export type GranulometryActions = {
  setData: ({ step, key, value }: setDataType) => void;
};

const stepVariant = { 0: 'generalData', 1: 'step2Data', 2: 'results' };

type setDataType = { step: number; key?: string; value: unknown };

const useGranulometryStore = create<GranulometryData & GranulometryActions>()(
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
          sample_mass: 0,
          passant_percentages: [
            { sieve: getSieveName(50), passant: 0 },
            { sieve: getSieveName(37.5), passant: 0 },
            { sieve: getSieveName(25), passant: 0 },
            { sieve: getSieveName(19), passant: 0 },
            { sieve: getSieveName(9.5), passant: 0 },
            { sieve: getSieveName(4.8), passant: 0 },
            { sieve: getSieveName(2.0), passant: 0 },
            { sieve: getSieveName(1.2), passant: 0 },
            { sieve: getSieveName(0.6), passant: 0 },
            { sieve: getSieveName(0.43), passant: 0 },
            { sieve: getSieveName(0.3), passant: 0 },
            { sieve: getSieveName(0.15), passant: 0 },
            { sieve: getSieveName(0.075), passant: 0 },
          ],
          bottom: 0,
        },
        results: {
          total_retained: null,
          retained_percentages: [],
          retained_accumulated_list: [],
          passants_graph: [],
          diameters_graph: [],
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
        name: 'granulometry-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useGranulometryStore;
