import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface IggGeneralData {
  userId: string;
  name: string;
  createdAt: Date;
  operator?: string;
  calculist?: string;
  description?: string;
}

interface IggStep2 {
  work: string;
  section: string;
  initialStake: number;
  initialSide: string;
  finalStake: number;
  finalSide: string;
}

interface IggStep3 {
  stakes: number[][];
}

interface IggStep4 {
  sections: {
    id: number;
    initial: number;
    final: number;
  }[];
}

interface IggResults {
  iggs: number[];
  igis: number[];
  minIndexIGG: null;
  maxIndexIGG: null;
  arrowsAverage: number[];
  variancesAverage: number[];
  conditions: string[];
}

export interface IggData {
  generalData: IggGeneralData;
  iggStep2: IggStep2;
  iggStep3: IggStep3;
  iggStep4: IggStep4;
  results: IggResults;
}

export interface IggActions {
  setData: ({ step, key, value }: setDataType) => void;
  reset: ({ step }: setDataType) => void;
}

type setDataType = { step: number; key?: string; value: unknown };

const stepVariant = { 0: 'generalData', 1: 'iggStep2', 2: 'iggStep3', 3: 'iggStep4', 4: 'results' };

const initialState: IggData = {
  generalData: {
    userId: null,
    name: null,
    createdAt: new Date(),
    operator: null,
    calculist: null,
    description: null,
  },
  iggStep2: {
    work: null,
    section: null,
    initialStake: null,
    initialSide: null,
    finalStake: null,
    finalSide: null,
  },
  iggStep3: {
    stakes: [],
  },
  iggStep4: {
    sections: [
      {
        id: 0,
        initial: 0,
        final: 0,
      },
    ],
  },
  results: {
    iggs: [],
    igis: [],
    arrowsAverage: [],
    variancesAverage: [],
    conditions: [],
    minIndexIGG: null,
    maxIndexIGG: null,
  },
};

const useIggStore = create<IggData & IggActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

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

        reset: ({ step }) => {
          set((state) => {
            const resetState = { ...state };

            resetState[stepVariant[step]] = initialState[stepVariant[step]];

            return resetState;
          });
        },
      }),
      {
        name: 'asphalt-igg-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useIggStore;
