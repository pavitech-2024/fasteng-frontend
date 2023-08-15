import { ConcreteMaterial } from '@/interfaces/concrete';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface sandIncrease_generalData {
  userId: string;
  name: string;
  material: ConcreteMaterial; // materialID
  operator?: string;
  description?: string;
  cauculist?: string;
}

interface sandIncrease_results {
  result: string; // corrigir
}

export type SandIncreaseData = {
  sandIncreaseGeneralData: sandIncrease_generalData;
  results: sandIncrease_results;
};

export type SandIncreaseActions = {
  setData: ({ step, key, value }: setDataType) => void;
};

type setDataType = { step: number; key?: string; value: unknown };

const stepVariant = { 0: 'sandIncreaseGeneralData', 2: 'results' };

const useSandIncreaseStore = create<SandIncreaseData & SandIncreaseActions>()(
  devtools(
    persist(
      (set) => ({
        sandIncreaseGeneralData: {
          userId: null,
          name: null,
          material: null,
          operator: null,
          description: null,
          cauculist: null,
        },
        results: {
          result: null,
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
        name: 'sandIncrease-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useSandIncreaseStore;
