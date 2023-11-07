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

export type ShapeIndexCircularSieveRow = {
  label: string;
  sieve1: number;
  sieve2: number;
};

export type ShapeIndexSieveRow = {
  label: string;
  retained_mass: number;
  grains_count: number;
};

export type ShapeIndexReadRow = {
  id: number;
  sieve: string;
  length: number;
  thickness: number;
};

interface ShapeIndex_step2Data {
  method: 'sieve' | 'pachymeter';
  total_mass: number;
  graduation: 'A' | 'B' | 'C' | 'D';
  circular_sieves_table_data: ShapeIndexCircularSieveRow[];
  sieves_table_data: ShapeIndexSieveRow[];
  reads_table_data: ShapeIndexReadRow[];
}

interface ShapeIndex_results {
  shape_index: number;
  alerts: string[];
}

export type ShapeIndexData = {
  generalData: GeneralData;
  step2Data: ShapeIndex_step2Data;
  results: ShapeIndex_results;
};

export type ShapeIndexActions = {
  setData: ({ step, key, value }: setDataType) => void;
};

const stepVariant = { 0: 'generalData', 1: 'step2Data', 2: 'results' };

type setDataType = { step: number; key?: string; value: unknown };

const useShapeIndexStore = create<ShapeIndexData & ShapeIndexActions>()(
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
          method: null,
          total_mass: null,
          graduation: null,
          circular_sieves_table_data: [],
          sieves_table_data: [],
          reads_table_data: [],
        },
        results: {
          shape_index: null,
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
        name: 'shapeIndex-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useShapeIndexStore;
