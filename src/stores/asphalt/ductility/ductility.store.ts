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

interface Ductility_step2Data {
  first_rupture_length: number;
  second_rupture_length: number;
  third_rupture_length: number;
}

interface Ductility_results {
  ductility: number;
}

export type DuctilityData = {
  generalData: GeneralData;
  step2Data: Ductility_step2Data;
  results: Ductility_results;
};

export type DuctilityActions = {
  setData: ({ step, key, value }: setDataType) => void;
};

const stepVariant = { 0: 'generalData', 1: 'step2Data', 2: 'results' };

type setDataType = { step: number; key?: string; value: unknown };

const useDuctilityStore = create<DuctilityData & DuctilityActions>()(
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
          first_rupture_length: null,
          second_rupture_length: null,
          third_rupture_length: null,
        },
        results: {
          ductility: null,
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
        name: 'ductility-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useDuctilityStore;
