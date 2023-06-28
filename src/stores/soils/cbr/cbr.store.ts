import { Sample } from '@/interfaces/soils';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface GeneralData {
  userId: string;
  name: string;
  sample: Sample;
  operator?: string;
  cauculist?: string;
  description?: string;
}

export type CbrData = {
  generalData: GeneralData;
};
type Actions = {
  setData: ({ step, key, value }: setDataType) => void;
};

const stepVariant = { 0: 'generalData', 1: 'cbr', 2: 'expansion', 3: 'results' };

type setDataType = { step: number; key: string; value: unknown };

const useCbrStore = create<CbrData & Actions>()(
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
          set((state) => ({
            ...state,
            [stepVariant[step]]: {
              ...state[stepVariant[step]],
              [key]: value,
            },
          })),
      }),
      { name: 'cbr-store3213' }
    )
  )
);

export default useCbrStore;