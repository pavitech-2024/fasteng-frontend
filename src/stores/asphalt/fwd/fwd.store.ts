import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface FwdGeneralData {
  userId: string;
  name: string;
  createdAt: Date;
  operator?: string;
  calculist?: string;
  description?: string;
}

interface FwdStep2 {
  work: string;
  section: string;
  initialStake: number;
  initialSide: string;
  finalStake: number;
  finalSide: string;
}

export interface FwdStep3 {
  spreadsheetData: {
    hodometro: number;
    force: number;
    d1: number;
    d2: number;
    d3: number;
    d4: number;
    d5: number;
    d6: number;
    d7: number;
    d8: number;
    d9: number;
    d10: number;
    d11: number;
    d12: number;
    d13: number;
  }[];
}

interface FwdResults {
  processedData: {
    hodometro: number;
    force: number;
    d1: number;
    d2: number;
    d3: number;
    d4: number;
    d5: number;
    d6: number;
    d7: number;
    d8: number;
    d9: number;
    d10: number;
    d11: number;
    d12: number;
    d13: number;
    meanDeflection: number;
    areaBetweenStationCurves: number;
    cumulativeArea: number;
    cumulativeDifference: number;
  }[];
  graphData: number[][];
  deletedPositions: number[];
}

export interface FwdData {
  generalData: FwdGeneralData;
  fwdStep2: FwdStep2;
  fwdStep3: FwdStep3;
  results: FwdResults;
}

export interface FwdActions {
  setData: ({ step, key, value }: setDataType) => void;
  reset: ({ step }: setDataType) => void;
}

type setDataType = { step: number; key?: string; value: unknown };

const stepVariant = { 0: 'generalData', 1: 'fwdStep2', 2: 'fwdStep3', 3: 'fwdStep4', 4: 'results' };

const initialState: FwdData = {
  generalData: {
    userId: null,
    name: null,
    createdAt: new Date(),
    operator: null,
    calculist: null,
    description: null,
  },
  fwdStep2: {
    work: null,
    section: null,
    initialStake: null,
    initialSide: null,
    finalStake: null,
    finalSide: null,
  },
  fwdStep3: {
    spreadsheetData: [],
  },
  results: {
    processedData: [],
    graphData: [],
    deletedPositions: [],
  },
};

const useFwdStore = create<FwdData & FwdActions>()(
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
        name: 'asphalt-fwd-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useFwdStore;
