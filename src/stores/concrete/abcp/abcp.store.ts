import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { ConcreteGranulometryData } from '../granulometry/granulometry.store';
import { ConcreteUnitMassData } from '../unitMass/unitMass.store';
import { ConcreteMaterial } from '@/interfaces/concrete';

interface GeneralData {
  userId: string;
  name: string;
  laboratory?: string;
  operator?: string;
  calculist?: string;
  description?: string;
  step: number;
}

interface ABCP_MaterialSelection {
  aggregates: { _id: string; name: string }[];
  cement: string;
}

// export interface ABCP_EssaySelectionData {
//   fineAggregate: {
//     _id: string;
//     specificMass: number;
//     granulometry_id: string;
//   };
//   coarseAggregate: {
//     _id: string;
//     granulometry_id: string;
//     specificMass: number;
//     unitMass_id: number;
//   };
//   cement: {
//     _id: string;
//     specificMass: number;
//   };
// }

type AggregatesEssaysData = {
  granulometrys: ConcreteGranulometryData[],
  unitMasses: ConcreteUnitMassData[]
}

export interface ABCP_EssaySelectionData {
  aggregatesData: AggregatesEssaysData[],
  cementData: ConcreteMaterial
}

interface ABCP_InsertParamsData {
  condition: number;
  fck: number;
  reduction: number;
}

interface ABCP_Results {
  fcj: number;
  ac: number;
  ca: number; //  L/m³
  cc: number;
  cb: number;
  careia: number;
  //Graph
  Xvalues: number[];
  Yvalues: number[];
  formula: string;
  resistanceCurve: string;
}

export type ABCPData = {
  generalData: GeneralData;
  materialSelectionData: ABCP_MaterialSelection;
  essaySelectionData: ABCP_EssaySelectionData;
  insertParamsData: ABCP_InsertParamsData;
  results: ABCP_Results;
  createdAt: Date;
  updatedAt: Date;
};

export type ABCPActions = {
  setData: ({ step, key, value }: setDataType) => void;
  reset: ({ step }: setDataType) => void;
};

const stepVariant = {
  0: 'generalData',
  1: 'materialSelectionData',
  2: 'essaySelectionData',
  3: 'insertParamsData',
  4: 'results',
};

type setDataType = { step: number; key?: string; value: unknown };

const initialState = {
  generalData: {
    userId: null,
    name: null,
    laboratory: null,
    operator: null,
    calculist: null,
    description: null,
    step: 0,
  },
  materialSelectionData: {
    aggregates: [],
    cement: null,
  },
  essaySelectionData: {
    aggregatesData: [],
    cementData: null
  },
  insertParamsData: {
    condition: null,
    fck: null,
    reduction: null,
  },
  results: {
    fcj: null,
    ac: null,
    ca: null, //  L/m³
    cc: null,
    cb: null,
    careia: null,
    //Graph
    Xvalues: [],
    Yvalues: [],
    formula: null,
    resistanceCurve: null,
  },
  createdAt: null,
  updatedAt: null,
};

const useABCPStore = create<ABCPData & ABCPActions>()(
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
        name: 'abcp-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useABCPStore;
