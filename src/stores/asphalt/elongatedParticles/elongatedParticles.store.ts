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

const useElongatedParticlesStore = create<ElongatedParticlesData & ElongatedParticlesActions>()(
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
          dimensions_table_data: [],
        },
        results: {
          results_dimensions_table_data: [],
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
        name: 'elongatedParticles-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useElongatedParticlesStore;
