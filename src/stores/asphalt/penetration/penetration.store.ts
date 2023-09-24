import { AsphaltMaterial } from '@/interfaces/asphalt';
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface PenetrationGeneralData {
  userId: string;
  name: string;
  material: AsphaltMaterial;
  operator?: string;
  calculist?: string;
  description?: string;
}

interface PenetrationCalc {
  resultMode: boolean;
  experimentDate: Date;
  points: [number];
}

interface Penetration_results {
  penetration: number;
  cap: string;
  alerts: string[];
  indexOfSusceptibility: number;
}

export type PenetrationData = {
  generalData: PenetrationGeneralData;
  penetrationCalc: PenetrationCalc;
  results: Penetration_results;
};

export type PenetrationActions = {
  setData: ({ step, key, value }: setDataType) => void;
  reset: ({ step }: setDataType) => void;
};

type setDataType = { step: number; key?: string; value: unknown };

const stepVariant = { 0: 'generalData', 1: 'penetrationCalc', 2: 'results' };

const initialState = {
  generalData: {
    userId: null,
    name: null,
    material: null,
    operator: null,
    calculist: null,
    description: null,
  },
  penetrationCalc: {
    resultMode: null,
    experimentDate: null,
    points: null,
  },
  results: {
    penetration: null,
    cap: null,
    alerts: null,
    indexOfSusceptibility: null,
  },
};

const usePenetrationStore = create<PenetrationData & PenetrationActions>()(
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
        name: 'asphalt-penetration-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default usePenetrationStore;
