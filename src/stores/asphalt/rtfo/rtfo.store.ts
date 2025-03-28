import { AsphaltMaterial } from '@/interfaces/asphalt';
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface RtfoGeneralData {
  userId: string;
  name: string;
  material: AsphaltMaterial;
  operator?: string;
  calculist?: string;
  description?: string;
}

interface RtfoCalc {
  list: {
    sampleWeight: number;
    finalSampleWeight: number;
  }[];
}

interface Rtfo_results {
  list: {
    initialSetWeight: number;
    weightLoss: number;
  }[];
  weightLossAverage: number;
  alerts: string[];
}

export type RtfoData = {
  generalData: RtfoGeneralData;
  rtfoCalc: RtfoCalc;
  results: Rtfo_results;
};

export type RtfoActions = {
  setData: ({ step, key, value }: setDataType) => void;
  reset: () => void;
};

type setDataType = { step: number; key?: string; value: unknown };

const stepVariant = { 0: 'generalData', 1: 'rtfoCalc', 2: 'results' };

const initialState = {
  generalData: {
    userId: null,
    name: null,
    material: null,
    operator: null,
    calculist: null,
    description: null,
  },
  rtfoCalc: {
    list: [
      {
        sampleWeight: null,
        finalSampleWeight: null,
      },
    ],
  },
  results: {
    list: [
      {
        initialSetWeight: null,
        weightLoss: null,
      },
    ],
    weightLossAverage: null,
    alerts: null,
  },
};

const useRtfoStore = create<RtfoData & RtfoActions>()(
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
        // name data store e config no session storage
        name: 'asphalt-rtfo-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useRtfoStore;
