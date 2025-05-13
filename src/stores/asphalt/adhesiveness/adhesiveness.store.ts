import { AsphaltMaterial } from '@/interfaces/asphalt';
import { StoreActions } from '@/interfaces/common/stores/storeActions.interface';
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface GeneralData {
  userId: string;
  name: string;
  material: AsphaltMaterial;
}

interface adhesiveness_step2Data {
  binder: AsphaltMaterial;
  filmDisplacement: boolean;
}

export type AdhesivenessData = {
  generalData: GeneralData;
  adhesiveness: adhesiveness_step2Data;
  results: {
    filmDisplacement: boolean;
  };
};

export type AdhesivenessActions = {
  setData: ({ step, key, value }: setDataType) => void;
};

type setDataType = { step: number; key?: string; value: unknown };

const stepVariant = { 0: 'generalData', 1: 'adhesiveness', 2: 'results' };

const initialState = {
  generalData: {
    userId: null,
    name: null,
    material: null,
  },
  adhesiveness: {
    binder: null,
    filmDisplacement: null,
  },
  results: {
    filmDisplacement: null,
  },
};

const useAdhesivenessStore = create<AdhesivenessData & StoreActions>()(
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
        name: 'adhesiveness-storage',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useAdhesivenessStore;
