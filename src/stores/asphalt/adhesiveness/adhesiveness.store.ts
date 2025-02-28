import { AsphaltMaterial } from '@/interfaces/asphalt';
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

const useAdhesivenessStore = create<AdhesivenessData & AdhesivenessActions>()(
  devtools(
    persist(
      (set) => ({
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
        name: 'adhesiveness-storage',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useAdhesivenessStore;
