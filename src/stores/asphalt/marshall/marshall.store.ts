import { GridColDef } from '@mui/x-data-grid';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface MarhsallGeneralData {
  userId: string;
  name: string;
  laboratory?: string;
  operator?: string;
  calculist?: string;
  objective: 'bearing' | 'bonding';
  dnitBand: 'A' | 'B' | 'C';
  description?: string;
  step: number;
}

interface MarshallMaterialSelectionData {
  aggregates: { _id: string; name: string }[]; // lista de ids dos agregados
  binder: string; // id do ligante
}

interface MarshallGranulometryCompositionData {
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
  percentageInputs: { [key: string]: number }[];
  sumOfPercents: number[];
  dnitBands: { higher: [string, number][]; lower: [string, number][] };
  pointsOfCurve: any[];
  percentsOfMaterials: any[];
  graphData: any[];
  projections: any[];
}

interface MarshallBinderTrialData {
  trial: number;
  percentsOfDosage: any[];
  bandsOfTemperatures: {
    machiningTemperatureRange: {
      higher: number;
      average: number;
      lower: number;
    };
    compressionTemperatureRange: {
      higher: number;
      average: number;
      lower: number;
    };
    AggregateTemperatureRange: {
      higher: number;
      average: number;
      lower: number;
    };
  };
}

interface MarshallMaximumMixtureDensityData {
  dmt: {
    material_1: number,
    material_2: number
  },
  indexesOfMissesSpecificGravity: number[]
}

export type MarshallData = {
  generalData: MarhsallGeneralData;
  materialSelectionData: MarshallMaterialSelectionData;
  granulometryCompositionData: MarshallGranulometryCompositionData;
  binderTrialData: MarshallBinderTrialData;
  maximumMixtureDensityData: MarshallMaximumMixtureDensityData
  createdAt: Date;
  updatedAt: Date;
};

export type MarshallActions = {
  setData: ({ step, key, value }: setDataType) => void;
  reset: ({ step }: setDataType) => void;
};

type setDataType = { step: number; key?: string; value: unknown };

const stepVariant = {
  0: 'generalData',
  1: 'materialSelectionData',
  2: 'granulometryCompositionData',
  3: 'binderTrialData',
  4: 'maximumMixtureDensityData'
};

const initialState = {
  generalData: {
    userId: null,
    name: null,
    laboratory: null,
    operator: null,
    calculist: null,
    objective: null,
    dnitBand: null,
    description: null,
    step: 0,
  },
  materialSelectionData: {
    aggregates: [],
    binder: null,
  },
  granulometryCompositionData: {
    table_data: null,
    percentageInputs: [],
    dnitBands: null,
    pointsOfCurve: [],
    sumOfPercents: [],
    percentsOfMaterials: [],
    graphData: [],
    projections: [],
  },
  binderTrialData: {
    trial: null,
    percentsOfDosage: [],
    bandsOfTemperatures: {
      machiningTemperatureRange: {
        higher: null,
        average: null,
        lower: null,
      },
      compressionTemperatureRange: {
        higher: null,
        average: null,
        lower: null,
      },
      AggregateTemperatureRange: {
        higher: null,
        average: null,
        lower: null,
      },
    },
  },
  maximumMixtureDensityData: {
    dmt: {
      material_1: null,
      material_2: null
    },
    indexesOfMissesSpecificGravity: []
  },
  createdAt: null,
  updatedAt: null,
};

const useMarshallStore = create<MarshallData & MarshallActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setData: ({ step, key, value }) =>
          set((state) => {
            if (step === 10) {
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
        name: 'asphalt-marshall-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useMarshallStore;
