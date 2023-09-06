import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface GeneralData {
  userId: string;
  name: string;
  laboratory?: string;
  operator?: string;
  calculist?: string;
  description?: string;
}

interface ABCP_MaterialSelection {
  coarseAggregates: string[];
  fineAggregates: string[];
  cements: string[];
}

interface ABCP_EssaySelection {
  fineAggregates: { _id: string; specific_mass: number; granulometry_id: string }[];
  coarseAggregates: {
    _id: string;
    specific_mass: number;
    granulometry_id: string;
    granulometry_name: string;
    unit_mass_id: string;
    unit_mass_name: string;
  }[];
  cements: { _id: string; specific_mass: number }[];
}

export type ABCPData = {
  generalData: GeneralData;
  materialSelectionData: ABCP_MaterialSelection;
  essaySelectionData: ABCP_EssaySelection;
};

export type ABCPActions = {
  setData: ({ step, key, value }: setDataType) => void;
  reset: ({ step }: setDataType) => void;
};

const stepVariant = { 0: 'generalData', 1: 'materialSelectionData', 2: 'essaySelectionData' };

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
    coarseAggregates: [],
    fineAggregates: [],
    cements: [],
  },
  essaySelectionData: {
    fineAggregates: [],
    coarseAggregates: [],
    cements: [],
  },
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
