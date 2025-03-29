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

interface FlashPoint_step2Data {
  ignition_temperature: number;
}

interface FlashPoint_results {
  temperature: number;
}

export type FlashPointData = {
  generalData: GeneralData;
  step2Data: FlashPoint_step2Data;
  results: FlashPoint_results;
};

export type FlashPointActions = {
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
    ignition_temperature: null,
  },
  results: {
    temperature: null,
  },
};

const useFlashPointStore = create<FlashPointData & StoreActions>()(
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
        name: 'flashPoint-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useFlashPointStore;
