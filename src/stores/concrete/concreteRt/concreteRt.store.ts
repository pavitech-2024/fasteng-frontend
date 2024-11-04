import { ConcreteMaterial } from '@/interfaces/concrete';
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

type TimeObject = {
  hours: number;
  minutes: number;
};

type GraphImgObject = {
  name: string;
  src: string;
};

interface ConcreteGeneralData {
  userId: string;
  name: string;
  material: ConcreteMaterial;
  operator?: string;
  calculist?: string;
  description?: string;
}

interface ConcreteRtStep2Data {
  age: TimeObject;
  tolerance: TimeObject;
  finalTolerance: number;
}

interface ConcreteRtStep3Data {
  appliedCharge: number;
  supportsDistance: number;
  graphImg: GraphImgObject;
}

interface ConcreteRtStep4Data {
  compressionCharge: number;
  graphImg: GraphImgObject;
}

interface ConcreteRt_results {
  flexualTensileStrength: number;
  compressionResistance: number;
}

export type ConcreteRtData = {
  generalData: ConcreteGeneralData;
  step2Data: ConcreteRtStep2Data;
  step3Data: ConcreteRtStep3Data;
  step4Data: ConcreteRtStep4Data;
  results: ConcreteRt_results;
};

export type ConcreteRtActions = {
  setData: ({ step, key, value }: setDataType) => void;
  reset: ({ step }: setDataType) => void;
};

const stepVariant = { 0: 'generalData', 1: 'step2Data', 2: 'step3Data', 3: 'step4Data',  4: 'results' };

type setDataType = { step: number; key?: string; value: unknown };

const initialState = {
  generalData: {
    userId: null,
    name: null,
    material: null,
    operator: null,
    calculist: null,
    description: null,
  },
  step2Data: {
    age: {
      hours: null,
      minutes: null,
    },
    tolerance: {
      hours: null,
      minutes: null,
    },
    finalTolerance: null,
  },
  step3Data: {
    appliedCharge: null,
    supportsDistance: null,
    graphImg: {
      name: null,
      src: null,
    },
  },
  step4Data: {
    compressionCharge: null,
    graphImg: {
      name: null,
      src: null,
    },
  },
  results: {
    flexualTensileStrength: null,
    compressionResistance: null,
  },
};

const useConcreteRtStore = create<ConcreteRtData & ConcreteRtActions>()(
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
        name: 'concrete-Rt-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useConcreteRtStore;
