import { SoilSample } from '@/interfaces/soils';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface SoilsGeneralData {
  userId: string;
  name: string;
  sample: SoilSample;
  operator?: string;
  calculist?: string;
  description?: string;
}

interface SoilsGranulometry_step2Data {
  sample_mass: number;
  table_data: { sieve: string; passant: number; retained: number }[];
  sieve_series: { label: string; value: number }[];
  bottom: number;
}

interface SoilsGranulometry_results {
  accumulated_retained: number[];
  graph_data: [number, number][];
  passant: number[];
  retained_porcentage: number[];
  total_retained: number;
  nominal_size: number;
  nominal_diameter: number;
  fineness_module: number;
  cc: number;
  cnu: number;
  error: number;
}

export type SoilsGranulometryData = {
  generalData: SoilsGeneralData;
  step2Data: SoilsGranulometry_step2Data;
  results: SoilsGranulometry_results;
};

export type SoilsGranulometryActions = {
  setData: ({ step, key, value }: setDataType) => void;
  reset: () => void;
};

const stepVariant = { 0: 'generalData', 1: 'step2Data', 2: 'results' };

type setDataType = { step: number; key?: string; value: unknown };

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
    sample_mass: null,
    table_data: null,
    sieve_series: null,
    bottom: null,
  },
  results: {
    accumulated_retained: [],
    graph_data: [],
    passant: [],
    retained_porcentage: [],
    total_retained: null,
    nominal_size: null,
    nominal_diameter: null,
    fineness_module: null,
    cc: null,
    cnu: null,
    error: null,
  },
};

const useSoilsGranulometryStore = create<SoilsGranulometryData & SoilsGranulometryActions>()(
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
        // name data store e config no session storage
        name: 'soils-granulometry-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useSoilsGranulometryStore;
