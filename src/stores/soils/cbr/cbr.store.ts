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
};

interface cbr_step2Data {
  ringConstant: number;
  cilinderHeight: number;
};

export type CbrData = {
  generalData: GeneralData;
  step2Data: cbr_step2Data;
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
        step2Data: {
          ringConstant: null,
          cilinderHeight: null,
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