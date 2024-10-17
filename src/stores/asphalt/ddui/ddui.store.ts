import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface DduiGeneralData {
  userId: string;
  name: string;
  operator?: string;
  calculist?: string;
  description?: string;
}

interface DduiStep2 {
  dnitRange: string;
  sampleVoidVolume: number;
  pressConstant: number;
  pressSpecification: string;
  sampleOrigin: string;
  minRrt: number;
}

interface DduiStep3 {
  ddui_data: {
    id: number;
    sampleName: string;
    condicionamento: boolean;
    d1: number;
    d2: number;
    d3: number;
    h1: number;
    h2: number;
    h3: number;
    pressReading: number;
  }[];
}

interface Ddui_results {
  everyRtsMpa: number[];
  everyRtsKgf: number[];
  conditionedAverage: number;
  unconditionedAverage: number;
  rrt: number;
}

export type DduiData = {
  generalData: DduiGeneralData;
  dduiStep2: DduiStep2;
  dduiStep3: DduiStep3;
  results: Ddui_results;
};

export type DduiActions = {
  setData: ({ step, key, value }: setDataType) => void;
  reset: ({ step }: setDataType) => void;
};

type setDataType = { step: number; key?: string; value: unknown };

const stepVariant = { 0: 'generalData', 1: 'dduiStep2', 2: 'dduiStep3', 3: 'results' };

const initialState = {
  generalData: {
    userId: null,
    name: null,
    operator: null,
    calculist: null,
    description: null,
  },
  dduiStep2: {
    dnitRange: null,
    sampleVoidVolume: null,
    pressConstant: null,
    pressSpecification: null,
    sampleOrigin: null,
    minRrt: null,
  },
  dduiStep3: {
    ddui_data: [
      {
        id: 0,
        sampleName: null,
        condicionamento: false,
        d1: null,
        d2: null,
        d3: null,
        h1: null,
        h2: null,
        h3: null,
        pressReading: null,
      },
    ],
  },
  results: {
    everyRtsMpa: [],
    everyRtsKgf: [],
    conditionedAverage: null,
    unconditionedAverage: null,
    rrt: null,
  },
};

const useDduiStore = create<DduiData & DduiActions>()(
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
          set(initialState);
          return {
            [stepVariant[step]]: null,
          };
        },
      }),
      {
        // name data store e config no session storage
        name: 'asphalt-ddui-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useDduiStore;
