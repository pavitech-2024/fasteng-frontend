import { AsphaltMaterial } from '@/interfaces/asphalt';
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface ViscosityRotationalGeneralData {
  userId: string;
  name: string;
  material: AsphaltMaterial;
  operator?: string;
  calculist?: string;
  description?: string;
}

interface ViscosityRotationalCalc {
  viscosityType: string;
  dataPoints: {
    id: number;
    temperature: number;
    viscosity: number;
  }[];
}

interface ViscosityRotational_results {
  graph: string;
  machiningTemperatureRange: {
    higher: number;
    lower: number;
    average: number;
  };
  compressionTemperatureRange: {
    higher: number;
    lower: number;
    average: number;
  };
  aggregateTemperatureRange: {
    higher: number;
    lower: number;
    average: number;
  };
  curvePoints: number[][];
  equation: {
    aIndex: number;
    bIndex: number;
  };
}

export type ViscosityRotationalData = {
  generalData: ViscosityRotationalGeneralData;
  viscosityRotationalCalc: ViscosityRotationalCalc;
  results: ViscosityRotational_results;
};

export type ViscosityRotationalActions = {
  setData: ({ step, key, value }: setDataType) => void;
  reset: () => void;
};

type setDataType = { step: number; key?: string; value: unknown };

const stepVariant = { 0: 'generalData', 1: 'viscosityRotationalCalc', 2: 'results' };

const initialState = {
  generalData: {
    userId: null,
    name: null,
    material: null,
    operator: null,
    calculist: null,
    description: null,
  },
  viscosityRotationalCalc: {
    viscosityType: 'Viscosity Rotational',
    dataPoints: [
      {
        id: 0,
        temperature: 135,
        viscosity: null,
      },
      {
        id: 1,
        temperature: 150,
        viscosity: null,
      },
      {
        id: 2,
        temperature: 177,
        viscosity: null,
      },
    ],
  },
  results: {
    graph: null,
    machiningTemperatureRange: {
      higher: null,
      lower: null,
      average: null,
    },
    compressionTemperatureRange: {
      higher: null,
      lower: null,
      average: null,
    },
    aggregateTemperatureRange: {
      higher: null,
      lower: null,
      average: null,
    },
    curvePoints: [[], [], [], [], [], []],
    equation: {
      aIndex: 0,
      bIndex: 0,
    },
  },
};

const useViscosityRotationalStore = create<ViscosityRotationalData & ViscosityRotationalActions>()(
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
        // name data store e config no session storage
        name: 'asphalt-viscosityRotational-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useViscosityRotationalStore;
