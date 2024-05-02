import { GridColDef } from '@mui/x-data-grid';
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
}

interface SuperpaveMaterialSelectionData {
  aggregates: { _id: string; name: string }[]; // lista de ids dos agregados
  binder: string; // id do ligante
}


export type SuperpaveData = {
  generalData: SuperpaveGeneralData;
  materialSelectionData: SuperpaveMaterialSelectionData;
  createdAt: Date;
  updatedAt: Date;
};

export type SuperpaveActions = {
  setData: ({ step, key, value }: setDataType) => void;
  reset: ({ step }: setDataType) => void;
};

type setDataType = { step: number; key?: string; value: unknown };

const stepVariant = { 0: 'generalData', 1: 'materialSelectionData', 2: 'granulometryCompositionData' };

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
  },
  materialSelectionData: {
    aggregates: [],
    binder: null,
  },
  createdAt: null,
  updatedAt: null,
};

const useSuperpaveStore = create<SuperpaveData & SuperpaveActions>()(
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
        name: 'asphalt-superpave-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useSuperpaveStore;
