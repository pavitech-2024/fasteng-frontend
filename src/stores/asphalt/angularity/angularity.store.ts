import { AsphaltMaterial } from '@/interfaces/asphalt';
import { StoreActions } from '@/interfaces/common/stores/storeActions.interface';
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
};

const useAngularityStore = create<AngularityData & StoreActions>()(
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
        name: 'angularity-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useAngularityStore;
