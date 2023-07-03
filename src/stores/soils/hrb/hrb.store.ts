import { Sample } from '@/interfaces/soils';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { setDataType } from '../cbr/cbr.store';

interface GeneralData {
  userId: string;
  name: string;
  sample: Sample;
  operator?: string;
  cauculist?: string;
  description?: string;
}

export type HrbData = {
  generalData: GeneralData;
};

export type HrbActions = {
  setData: ({ step, key, value }: setDataType) => void;
};

const stepVariant = { 0: 'generalData' };

const useHrbStore = create<HrbData & HrbActions>()(
  devtools(
    persist(
      (set) => ({
        generalData: {
          userId: null,
          name: null,
          sample: null,
          operator: null,
          cauculist: null,
          description: null,
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
        name: 'hrb-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useHrbStore;
