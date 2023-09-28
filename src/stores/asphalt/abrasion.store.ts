import { AsphaltMaterial } from "@/interfaces/asphalt";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

interface AbrasionGeneralData {
  userId: string;
  name: string;
  material: AsphaltMaterial;
  operator?: string;
  calculist?: string;
  description?: string;
}

interface AbrasionCalc {
  resultMode: boolean;
  experimentDate: Date;
  points: number[];
}

interface Abrasion_results {
  abrasion: number;
  cap: string;
  alerts: string[];
  indexOfSusceptibility: number;
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
    resultMode: null,
    experimentDate: null,
    points: null,
  },
  results: {
    abrasion: null,
    cap: null,
    alerts: null,
    indexOfSusceptibility: null,
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