import { ConcreteMaterial } from '@/interfaces/concrete';
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

type TimeObject = {
  hours: number;
  minutes: number;
};

type ToleranceObject = {
  data: number;
  isPermited: boolean;
};

type RuptureObject = {
  type: string
  src: string
}

interface ConcreteGeneralData {
  userId: string;
  name: string;
  material: ConcreteMaterial;
  operator?: string;
  calculist?: string;
  description?: string;
}

interface ConcreteRc_step2Data {
  diammeter1: number;
  diammeter2: number;
  height: number;
  age: TimeObject;
  tolerance: TimeObject;
  newTolerance: ToleranceObject;
  correctionFactor: number
}

interface ConcreteRc_step3Data {
  rupture: RuptureObject
}

interface ConcreteRc_results {
  finalCorrectionFactor: number;
}

export type ConcreteRcData = {
  generalData: ConcreteGeneralData;
  step2Data: ConcreteRc_step2Data;
  step3Data: ConcreteRc_step3Data;
  results: ConcreteRc_results;
};

export type ConcreteRcActions = {
  setData: ({ step, key, value }: setDataType) => void;
  reset: ({ step }: setDataType) => void;
};

const stepVariant = { 0: 'generalData', 1: 'step2Data', 2: 'step3Data', 3: 'results' };

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
    diammeter1: null,
    diammeter2: null,
    height: null,
    age: {
      hours: null,
      minutes: null,
    },
    tolerance: {
      hours: null,
      minutes: null,
    },
    newTolerance: {
      data: null,
      isPermited: null,
    },
    correctionFactor: null
  },
  step3Data: {
    rupture: {
      type: null,
      src: null
    },
  },
  results: {
    finalCorrectionFactor: null,
  },
};

const useConcreteRcStore = create<ConcreteRcData & ConcreteRcActions>()(
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
        name: 'concrete-Rc-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useConcreteRcStore;