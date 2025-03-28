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

export type ElongatedParticlesDimensionsRow = {
  ratio: string;
  sample_mass: number;
  mass: number;
};

export type ElongatedParticlesResultsDimensionsRow = {
  ratio: string;
  particles_percentage: number;
};

interface ElongatedParticles_step2Data {
  dimensions_table_data: ElongatedParticlesDimensionsRow[];
}

interface ElongatedParticles_results {
  results_dimensions_table_data: ElongatedParticlesResultsDimensionsRow[];
  alerts: string[];
}

export type ElongatedParticlesData = {
  generalData: GeneralData;
  step2Data: ElongatedParticles_step2Data;
  results: ElongatedParticles_results;
};

export type ElongatedParticlesActions = {
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
    dimensions_table_data: [],
  },
  results: {
    results_dimensions_table_data: [],
    alerts: [],
  },
}

const useElongatedParticlesStore = create<ElongatedParticlesData & StoreActions>()(
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
            set(initialState)
          }
      }),
      {
        name: 'elongatedParticles-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useElongatedParticlesStore;
