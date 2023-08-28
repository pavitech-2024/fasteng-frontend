import { Sample } from '@/interfaces/soils';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface GeneralData {
  userId: string;
  name: string;
  sample: Sample;
  operator?: string;
  calculist?: string;
  description?: string;
}

interface cbr_step2Data {
  ring_constant: number;
  cilinder_height: number;
  extended_reads: [
    { minimum_read: '0.5'; pol: '0.025'; mm: '0.63'; extended_read: number },
    { minimum_read: '1'; pol: '0.05'; mm: '1.27'; extended_read: number },
    { minimum_read: '1.5'; pol: '0.075'; mm: '1.90'; extended_read: number },
    { minimum_read: '2'; pol: '0.1'; mm: '2.54'; extended_read: number },
    { minimum_read: '3'; pol: '0.15'; mm: '3.81'; extended_read: number },
    { minimum_read: '4'; pol: '0.2'; mm: '5.08'; extended_read: number },
    { minimum_read: '6'; pol: '0.3'; mm: '7.62'; extended_read: number },
    { minimum_read: '8'; pol: '0.4'; mm: '10.16'; extended_read: number },
    { minimum_read: '10'; pol: '0.5'; mm: '12.7'; extended_read: number }
  ];
}

interface cbr_expansionData {
  id: number;
  date: Date;
  time: Date;
  deflectometer_read: number;
}

interface cbr_results {
  measured_pressure: number[];
  cbr: number;
  cbrs: {
    2: number;
    4: number;
    6: number;
    8: number;
    10: number;
  };
  cbr_graph: [number, number][];
  free_expansion: number;
}

export type CbrData = {
  generalData: GeneralData;
  step2Data: cbr_step2Data;
  expansionData: cbr_expansionData[];
  results: cbr_results;
};

export type CbrActions = {
  setData: ({ step, key, value }: setDataType) => void;
};

const stepVariant = { 0: 'generalData', 1: 'step2Data', 2: 'expansionData', 3: 'results' };

export type setDataType = { step: number; key?: string; value: unknown };

const useCbrStore = create<CbrData & CbrActions>()(
  devtools(
    persist(
      (set) => ({
        generalData: {
          userId: null,
          name: null,
          sample: null,
          operator: null,
          calculist: null,
          description: null,
        },
        step2Data: {
          ring_constant: 0,
          cilinder_height: 0,
          extended_reads: [
            { minimum_read: '0.5', pol: '0.025', mm: '0.63', extended_read: null },
            { minimum_read: '1', pol: '0.05', mm: '1.27', extended_read: null },
            { minimum_read: '1.5', pol: '0.075', mm: '1.90', extended_read: null },
            { minimum_read: '2', pol: '0.1', mm: '2.54', extended_read: null },
            { minimum_read: '3', pol: '0.15', mm: '3.81', extended_read: null },
            { minimum_read: '4', pol: '0.2', mm: '5.08', extended_read: null },
            { minimum_read: '6', pol: '0.3', mm: '7.62', extended_read: null },
            { minimum_read: '8', pol: '0.4', mm: '10.16', extended_read: null },
            { minimum_read: '10', pol: '0.5', mm: '12.7', extended_read: null },
          ],
        },
        expansionData: [
          { id: 0, date: null, time: null, deflectometer_read: null },
          { id: 1, date: null, time: null, deflectometer_read: null },
        ],

        results: {
          measured_pressure: [],
          cbr: null,
          cbrs: {
            2: null,
            4: null,
            6: null,
            8: null,
            10: null,
          },
          cbr_graph: [],
          free_expansion: null,
        },

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
      }),
      {
        // name data store e config no session storage
        name: 'cbr-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useCbrStore;
