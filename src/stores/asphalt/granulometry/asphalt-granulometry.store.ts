import { AsphaltMaterial } from "@/interfaces/asphalt";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

interface AsphaltGeneralData {
  userId: string;
  name: string;
  material: AsphaltMaterial;
  operator?: string;
  calculist?: string;
  description?: string;
}

interface AsphaltGranulometry_step2Data {
  material_mass: number;
  table_data: { sieve: string; passant: number; retained: number }[];
  sieve_series: { label: string; value: number }[];
  bottom: number;
}

interface AsphaltGranulometry_results {
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

export type AsphaltGranulometryData = {
  generalData: AsphaltGeneralData;
  step2Data: AsphaltGranulometry_step2Data;
  results: AsphaltGranulometry_results;
};

export type AsphaltGranulometryActions = {
  setData: ({ step, key, value }: setDataType) => void;
  reset: ({ step }: setDataType) => void;
};

type setDataType = { step: number; key?: string; value: unknown };

const stepVariant = { 0: 'generalData', 1: 'step2Data', 2: 'results' };

const initialState = {
  generalData: {
    userId: null,
    name: null,
    material: null,
    operator: null,
    calculist: null,
    description: null,
  },
  step2Data: {
    material_mass: null,
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

const useAsphaltGranulometryStore = create<AsphaltGranulometryData & AsphaltGranulometryActions>()(
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
        name: 'asphalt-granulometry-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useAsphaltGranulometryStore;