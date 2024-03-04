import { GridColDef } from "@mui/x-data-grid";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface MarhsallGeneralData {
  userId: string;
  name: string;
  laboratory?: string;
  operator?: string;
  calculist?: string;
  objective: "bearing" | "bonding";
  dnitBand: "A" | "B" | "C";
  description?: string;
  step: number;
}

interface MarshallMaterialSelectionData {
  aggregates: { _id: string, name: string }[]; // lista de ids dos agregados
  binder: string; // id do ligante
}


interface MarshallGranulometryCompositionData {
  table_data: { table_rows: {
    sieve_label: string,
    [key: string] : string | {
      _id: string,
      total_passant: string,
      passant: string,
    }
  }[], table_column_headers: string [] };
  percentageInputs: {[key: string] : number}[];
  project: number[];
  dnitBands: { higher: [string, number][], lower: [string, number][] };
  graphData: any[];
}

interface MarshallInitialBinderData {

}

export type MarshallData = {
  generalData: MarhsallGeneralData;
  materialSelectionData: MarshallMaterialSelectionData;
  granulometryCompositionData: MarshallGranulometryCompositionData;
  createdAt: Date;
  updatedAt: Date;
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
    project: [],
    dnitBands: null,
    graphData: [],
  },
  createdAt: null,
  updatedAt: null
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