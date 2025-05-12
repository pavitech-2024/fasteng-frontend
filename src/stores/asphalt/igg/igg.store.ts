import { StoreActions } from '@/interfaces/common/stores/storeActions.interface';
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
  _id?: string;
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

const useIggStore = create<IggData & StoreActions>()(
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
        name: 'asphalt-igg-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useIggStore;
