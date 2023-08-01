import { Sample } from '@/interfaces/soils';
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
  table_data: { sieve: string; passant: number; retained: number }[];
  sieve_series: { label: string; value: number }[];
  bottom: number;
}

interface granulometry_results {
  total_retained: number;
  retained_porcentages: { sieve: string; retained: number }[];
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
          sample_mass: null,
          table_data: null,
          sieve_series: null,
          bottom: null,
        },
        results: {
          total_retained: null,
          retained_porcentages: [],
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
