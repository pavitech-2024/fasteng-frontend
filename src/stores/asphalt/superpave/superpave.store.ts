import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface SuperpaveGeneralData {
  userId: string;
  name: string;
  laboratory?: string;
  operator?: string;
  calculist?: string;
  trafficVolume: 'low' | 'medium' | 'medium-high' | 'high';
  objective: 'bearing' | 'bonding';
  dnitBand: 'A' | 'B' | 'C';
  description?: string;
  step: number;
}

interface SuperpaveMaterialSelectionData {
  aggregates: { _id: string; name: string }[]; // lista de ids dos agregados
  binder: string; // id do ligante
}

interface SuperpaveGranulometryCompositionData {
  table_data: {
    table_rows: {
      sieve_label: string;
      [key: string]:
        | string
        | {
            _id: string;
            total_passant: string;
            passant: string;
          };
    }[];
    table_column_headers: string[];
  };
  percentageInputs: {
    material_1: string,
    material_2: string
  }[];
  project: number[];
  dnitBands: { higher: [string, number][]; lower: [string, number][] };
  graphData: any[];
  percentsToList: any[];
  lowerComposition: {
    percentsOfMaterials: [[],[]],
    sumOfPercents: []
  },
  nominalSize: {
    value: number
  };
  pointsOfCurve: number[],
  chosenCurves: {
    lower: boolean,
    average: boolean,
    higher: boolean
  },
  bands: {
    higher: any[],
    lower: any[],
    letter: string
  }
}

// interface SuperpaveInitialBinderData {

// }

export type SuperpaveData = {
  generalData: SuperpaveGeneralData;
  materialSelectionData: SuperpaveMaterialSelectionData;
  granulometryCompositionData: SuperpaveGranulometryCompositionData;
};

export type SuperpaveActions = {
  setData: ({ step, key, value }: setDataType) => void;
  reset: ({ step }: setDataType) => void;
};

type setDataType = { step: number; key?: string; value: unknown };

const stepVariant = { 
  0: 'generalData', 
  1: 'materialSelectionData', 
  2: 'granulometryCompositionData' 
};

const initialState = {
  generalData: {
    userId: null,
    name: null,
    laboratory: null,
    operator: null,
    calculist: null,
    trafficVolume: null,
    objective: null,
    dnitBand: null,
    description: null,
    step: 0
  },
  materialSelectionData: {
    aggregates: [],
    binder: null,
  },
  granulometryCompositionData: {
    table_data: null,
    project: [],
    dnitBands: null,
    graphData: [],
    lowerComposition: {
      percentsOfMaterials: null,
      sumOfPercents: null,
    },
    percentageInputs: [{
      material_1: null,
      material_2: null
    }],
    percentsToList: [],
    nominalSize: {
      value: null
    },
    pointsOfCurve: [],
    chosenCurves: {
      lower: null,
      average: null,
      higher: null
    },
    bands: {
      higher: [],
      lower: [],
      letter: null
    }
  },
};

const useSuperpaveStore = create<SuperpaveData & SuperpaveActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setData: ({ step, key, value }) =>
          set((state) => {
            if (step === 12) {
              return value; // Substitui o estado inteiro pelo novo valor
            } else {
              if (key) {
                return {
                  ...state,
                  [stepVariant[step]]: {
                    ...state[stepVariant[step]],
                    [key]: value,
                  },
                };
              } else {
                return { ...state, [stepVariant[step]]: value };
              }
            }
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
        name: 'asphalt-superpave-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useSuperpaveStore;
