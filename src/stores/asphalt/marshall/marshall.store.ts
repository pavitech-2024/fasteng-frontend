import { GridColDef } from "@mui/x-data-grid";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface MarhsallGeneralData {
  userId: string;
  projectName: string;
  labName?: string;
  operator?: string;
  calculist?: string;
  objective: "bearing" | "bonding";
  dnitBand: "A" | "B" | "C";
  description?: string;
}

interface MarshallMaterialSelectionData {
  aggregates: string[]; // lista de ids dos agregados
  binder: string; // id do ligante
}

interface MarshallGranulometryCompositionData {
  granulometry_data: { _id: string, passants: any }[];
  project: number[];
  dnitBands: { higher: [string, number][], lower: [string, number][] };
  graphData: any[];
  table_rows: any[];
  table_columns: GridColDef[];
}

export type MarshallData = {
  generalData: MarhsallGeneralData;
  materialSelectionData: MarshallMaterialSelectionData;
  granulometryCompositionData: MarshallGranulometryCompositionData;
}

export type MarshallActions = {
  setData: ({ step, key, value }: setDataType) => void;
  reset: ({ step }: setDataType) => void;
}

type setDataType = { step: number; key?: string; value: unknown };

const stepVariant = { 0: 'generalData', 1: 'materialSelectionData', 2: 'granulometryCompositionData' };

const initialState = {
  generalData: {
    userId: null,
    projectName: null,
    labName: null,
    operator: null,
    calculist: null,
    objective: null,
    dnitBand: null,
    description: null,
  },
  materialSelectionData: {
    aggregates: [],
    binder: null,
  },
  granulometryCompositionData: {
    granulometry_data: [],
    project: [],
    dnitBands: null,
    graphData: [],
    table_rows: [],
    table_columns: [],
  }
};

const useMarshallStore = create<MarshallData & MarshallActions>()(
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
        name: 'asphalt-marshall-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useMarshallStore;