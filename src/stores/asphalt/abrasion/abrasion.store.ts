import { AsphaltMaterial } from '@/interfaces/asphalt';
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface AbrasionGeneralData {
  userId: string;
  name: string;
  material: AsphaltMaterial;
  operator?: string;
  calculist?: string;
  description?: string;
}

interface AbrasionCalc {
  initialMass: number;
  finalMass: number;
  graduation: string;
}

interface Abrasion_results {
  losAngelesAbrasion: number;
  alerts: string[];
}

export type AbrasionData = {
  generalData: AbrasionGeneralData;
  abrasionCalc: AbrasionCalc;
  results: Abrasion_results;
};

export type AbrasionActions = {
  setData: ({ step, key, value }: setDataType) => void;
  reset: ({ step }: setDataType) => void;
};

type setDataType = { step: number; key?: string; value: unknown };

const stepVariant = { 0: 'generalData', 1: 'abrasionCalc', 2: 'results' };

const initialState = {
  generalData: {
    userId: null,
    name: null,
    material: null,
    operator: null,
    calculist: null,
    description: null,
  },
  abrasionCalc: {
    initialMass: null,
    finalMass: null,
    graduation: null,
  },
  results: {
    losAngelesAbrasion: null,
    alerts: null,
  },
};

const useAbrasionStore = create<AbrasionData & AbrasionActions>()(
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
        name: 'asphalt-abrasion-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useAbrasionStore;
