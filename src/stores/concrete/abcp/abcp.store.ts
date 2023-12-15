import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import ABCP_EssaySelection from '../../../components/concrete/dosages/abcp/step-3-essays-selection';

interface GeneralData {
  userId: string;
  name: string;
  laboratory?: string;
  operator?: string;
  calculist?: string;
  description?: string;
}

interface ABCP_MaterialSelection {
  coarseAggregate: string;
  fineAggregate: string;
  cement: string;
}

interface ABCP_EssaySelectionData {
  fineAggregate: {
    _id: string;
    specificMass: number;
    granulometry_id: string;
  };
  coarseAggregate: {
    _id: string;
    granulometry_id: string;
    specificMass: number;
    unitMass_id: number
  };
  cement: {
    _id: string;
    specificMass: number;
  };
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
  Xvalues: number[],
  Yvalues: number[],
  formula: string,
  resistanceCurve: string,
}

export type ABCPData = {
  generalData: GeneralData;
  materialSelectionData: ABCP_MaterialSelection;
  essaySelectionData: ABCP_EssaySelectionData;
  insertParamsData: ABCP_InsertParamsData;
  results: ABCP_Results
};

export type ABCPActions = {
  setData: ({ step, key, value }: setDataType) => void;
  reset: ({ step }: setDataType) => void;
};

const stepVariant = { 0: 'generalData', 1: 'materialSelectionData', 2: 'essaySelectionData', 3: 'insertParamsData' };

type setDataType = { step: number; key?: string; value: unknown };

const initialState = {
  generalData: {
    userId: null,
    name: null,
    laboratory: null,
    operator: null,
    calculist: null,
    description: null,
  },
  materialSelectionData: {
    coarseAggregate: null,
    fineAggregate: null,
    cement: null,
  },
  essaySelectionData: {
    fineAggregate: {
      _id: null,
      specificMass: null,
      granulometry_id: null,
    },
    coarseAggregate: {
      _id: null,
      granulometry_id: null,
      specificMass: null,
      unitMass_id: null
    },
    cement: {
      _id: null,
      specificMass: null
    },
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
  }
};

const useABCPStore = create<ABCPData & ABCPActions>()(
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
        name: 'abcp-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useABCPStore;
