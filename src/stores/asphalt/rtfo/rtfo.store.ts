import { AsphaltMaterial } from "@/interfaces/asphalt";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

interface RtfoGeneralData {
  userId: string;
  name: string;
  material: AsphaltMaterial;
  operator?: string;
  calculist?: string;
  description?: string;
}

interface RtfoCalc {
  resultMode: boolean;
  experimentDate: Date;
  points: number[];
}

interface Rtfo_results {
  rtfo: number;
  cap: string;
  alerts: string[];
  indexOfSusceptibility: number;
}

export type RtfoData = {
  generalData: RtfoGeneralData;
  rtfoCalc: RtfoCalc;
  results: Rtfo_results;
};

export type RtfoActions = {
  setData: ({ step, key, value }: setDataType) => void;
  reset: ({ step }: setDataType) => void;
};

type setDataType = { step: number; key?: string; value: unknown };

const stepVariant = { 0: 'generalData', 1: 'rtfoCalc', 2: 'results' };

const initialState = {
  generalData: {
    userId: null,
    name: null,
    material: null,
    operator: null,
    calculist: null,
    description: null,
  },
  rtfoCalc: {
    resultMode: null,
    experimentDate: null,
    points: null,
  },
  results: {
    rtfo: null,
    cap: null,
    alerts: null,
    indexOfSusceptibility: null,
  },
};

const useRtfoStore = create<RtfoData & RtfoActions>()(
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
        name: 'asphalt-rtfo-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useRtfoStore;
