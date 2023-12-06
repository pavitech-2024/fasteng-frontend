import { AsphaltMaterial } from '@/interfaces/asphalt';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface RtcdGeneralData {
  userId: string;
  name: string;
  material: AsphaltMaterial;
  operator?: string;
  calculist?: string;
  description?: string;
}

interface RtcdStep2 {
  dnitRange: string;
  sampleVoidVolume: number;
  pressConstant: number;
  pressSpecification: string;
  sampleOrigin: string;
}

interface RtcdStep3 {
  rtcd_data: {
    id: number;
    sampleName: string;
    d1: number;
    d2: number;
    d3: number;
    h1: number;
    h2: number;
    h3: number;
    pressReading: number;
  }[];
}

interface Rtcd_results {
  everyRtsMpa: number[];
  everyRtsKgf: number[];
  average: number;
}

export type RtcdData = {
  generalData: RtcdGeneralData;
  rtcdStep2: RtcdStep2;
  rtcdStep3: RtcdStep3;
  results: Rtcd_results;
};

export type RtcdActions = {
  setData: ({ step, key, value }: setDataType) => void;
  reset: ({ step }: setDataType) => void;
};

type setDataType = { step: number; key?: string; value: unknown };

const stepVariant = { 0: 'generalData', 1: 'rtcdStep2', 2: 'rtcdStep3', 3: 'results' };

const initialState = {
  generalData: {
    userId: null,
    name: null,
    material: null,
    operator: null,
    calculist: null,
    description: null,
  },
  rtcdStep2: {
    dnitRange: null,
    sampleVoidVolume: null,
    pressConstant: null,
    pressSpecification: null,
    sampleOrigin: null,
  },
  rtcdStep3: {
    rtcd_data: [
      {
        id: 0,
        sampleName: null,
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
    average: null,
  },
};

const useRtcdStore = create<RtcdData & RtcdActions>()(
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
        name: 'asphalt-rtcd-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useRtcdStore;
