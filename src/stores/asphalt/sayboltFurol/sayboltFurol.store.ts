import { AsphaltMaterial } from "@/interfaces/asphalt";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

interface SayboltFurolGeneralData {
  userId: string;
  name: string;
  material: AsphaltMaterial;
  operator?: string;
  calculist?: string;
  description?: string;
}

interface SayboltFurolCalc {
  viscosityType: string,
  modified: boolean,
  dataPoints: {
    id: number,
    temperature: number,
    viscosity: number
  }[],
}

interface SayboltFurol_results {
  graph: string,
  machiningTemperatureRange: {
    higher: number,
    lower: number,
    average: number
  },
  compressionTemperatureRange: {
    higher: number,
    lower: number,
    average: number
  },
  aggregateTemperatureRange: {
    higher: number,
    lower: number,
    average: number
  },
  curvePoints: number[][],
  equation: {
    aIndex: number,
    bIndex: number
  }
}

export type SayboltFurolData = {
  generalData: SayboltFurolGeneralData;
  sayboltFurolCalc: SayboltFurolCalc;
  results: SayboltFurol_results;
};

export type SayboltFurolActions = {
  setData: ({ step, key, value }: setDataType) => void;
  reset: ({ step }: setDataType) => void;
};

type setDataType = { step: number; key?: string; value: unknown };

const stepVariant = { 0: 'generalData', 1: 'sayboltFurolCalc', 2: 'results' };

const initialState = {
  generalData: {
    userId: null,
    name: null,
    material: null,
    operator: null,
    calculist: null,
    description: null,
  },
  sayboltFurolCalc: {
    viscosityType: "Saybolt Furol",
    modified: null,
    dataPoints: [
      {
        id: 0,
        temperature: 135,
        viscosity: null
      },
      {
        id: 1,
        temperature: 150,
        viscosity: null
      },
      {
        id: 2,
        temperature: 177,
        viscosity: null
      },
    ],
  },
  results: {
    graph: null,
    machiningTemperatureRange: {
      higher: null,
      lower: null,
      average: null
    },
    compressionTemperatureRange: {
      higher: null,
      lower: null,
      average: null
    },
    aggregateTemperatureRange: {
      higher: null,
      lower: null,
      average: null
    },
    curvePoints: [[], [], [], [], [], []],
    equation: {
      aIndex: 0,
      bIndex: 0
    }
  },
};

const useSayboltFurolStore = create<SayboltFurolData & SayboltFurolActions>()(
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
        name: 'asphalt-sayboltFurol-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useSayboltFurolStore;