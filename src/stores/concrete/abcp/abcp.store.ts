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
    specific_mass: number;
    granulometry_id: string;
  };
  coarseAggregate: {
    _id: string;
    specific_mass: number;
    granulometry_id: string;
    unit_mass_id: string;
  };
  cement: {
    _id: string;
    specific_mass: number;
  };
}

export type ABCPData = {
  generalData: GeneralData;
  materialSelectionData: ABCP_MaterialSelection;
  essaySelectionData: ABCP_EssaySelectionData;
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
    coarseAggregate: null,
    fineAggregate: null,
    cement: null,
  },
  essaySelectionData: {
    fineAggregate: null,
    coarseAggregate: null,
    cement: null,
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
