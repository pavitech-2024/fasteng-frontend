import { AsphaltMaterial } from '@/interfaces/asphalt';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface GeneralData {
  userId: string;
  name: string;
  material: AsphaltMaterial;
  operator?: string;
  calculist?: string;
  description?: string;
}

export type row_step2 = {
  diameter?: string;
  determination: string;
  cylinder_mass: number;
  cylinder_mass_plus_sample: number;
};

interface Angularity_step2Data {
  relative_density: number;
  cylinder_volume: number;
  method: 'A' | 'B' | 'C';
  determinations: row_step2[];
}

export type row_results = {
  label: string;
  angularity: number;
};

interface Angularity_results {
  angularities: { label: string; angularity: number }[];
  averageOfAll: number;
  porcentagesOfVoids: number[];
  alerts: string[];
}

export type AngularityData = {
  generalData: GeneralData;
  step2Data: Angularity_step2Data;
  results: Angularity_results;
};

export type AngularityActions = {
  setData: ({ step, key, value }: setDataType) => void;
};

const stepVariant = { 0: 'generalData', 1: 'step2Data', 2: 'results' };

type setDataType = { step: number; key?: string; value: unknown };

const useAngularityStore = create<AngularityData & AngularityActions>()(
  devtools(
    persist(
      (set) => ({
        generalData: {
          userId: null,
          name: null,
          material: null,
          operator: null,
          calculist: null,
          description: null,
        },
        step2Data: {
          relative_density: null,
          cylinder_volume: null,
          method: null,
          determinations: [],
        },
        results: {
          angularities: [],
          averageOfAll: null,
          porcentagesOfVoids: [],
          alerts: [],
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
        name: 'angularity-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useAngularityStore;
