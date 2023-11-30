import { ConcreteMaterial } from '@/interfaces/concrete';
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface CoarseAggregateGeneralData {
  userId: string;
  experimentName: string;
  material: ConcreteMaterial;
}

interface coarseAggregate_step2Data {
  drySampleMass: number;
  saturatedSampleMass: number;
  submergedMass: number;
}

interface coarseAggregate_step3Result {
  result: number;
}

export type CoarseAggregateData = {
  generalData: CoarseAggregateGeneralData;
  step2Data: coarseAggregate_step2Data;
  result: coarseAggregate_step3Result;
};

export type CoarseAggregateActions = {
  setData: ({ step, key, value }: setDataType) => void;
};

const stepVariant = { 0: 'generalData', 1: 'step2Data', 2: 'result' };

export type setDataType = { step: number; key?: string; value: unknown };

const useCoarseAggregateStore = create<CoarseAggregateData & CoarseAggregateActions>()(
  devtools(
    persist(
      (set) => ({
        generalData: {
          userId: null,
          experimentName: null,
          material: null,
        },
        step2Data: {
          drySampleMass: null,
          saturatedSampleMass: null,
          submergedMass: null,
        },
        result: {
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
        name: 'coarseAggregate-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useCoarseAggregateStore;
