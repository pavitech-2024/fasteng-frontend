import { create } from 'zustand';
import { ConcreteMaterial } from '../../interfaces/concrete';
import { setDataType } from '../soils/cbr/cbr.store';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface GeneralData {
  userId: string;
  name: string;
  material: ConcreteMaterial;
}

interface chapman_step2Data {
  displaced_volume: number;
}

export type ChapmanData = {
  generalData: GeneralData;
  step2Data: chapman_step2Data;
  results: {
    m_e: number;
  };
};

export type ChapmanActions = {
  setData: ({ step, key, value }: setDataType) => void;
};

const stepVariant = { 0: 'generalData', 1: 'step2Data', 2: 'results' };

const useChapmanStore = create<ChapmanData & ChapmanActions>()(
  devtools(
    persist(
      (set) => ({
        generalData: {
          userId: null,
          name: null,
          material: null,
        },
        step2Data: {
          displaced_volume: null,
        },
        results: {
          m_e: null,
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
        name: 'chapman-storage',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useChapmanStore;
