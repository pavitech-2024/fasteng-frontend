import { ConcreteMaterial } from "@/interfaces/concrete";
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from "zustand/middleware";

interface ConcreteGeneralData {
    userId: string;
    name: string;
    material: ConcreteMaterial;
    operator?: string;
    calculist?: string;
    description?: string;
  }
  
  interface ConcreteRtStep2Data {
    dnitRange: string;
    sampleVoidVolume: number;
    pressConstant: number;
    pressSpecification: string;
    sampleOrigin: string;
  }

  interface ConcreteRtStep3Data {
    concreteRt_data: {
      id: number;
      sampleName: string;
      d1: number;
      d2: number;
      d3: number;
      h1: number;
      h2: number;
      h3: number;
      pressReading: number;
    }[];
  }
  
  interface ConcreteRt_results {
    accumulated_retained: number[];
    graph_data: [number, number][];
    passant: number[];
    retained_porcentage: number[];
    total_retained: number;
    nominal_size: number;
    nominal_diameter: number;
    fineness_module: number;
    cc: number;
    cnu: number;
    error: number;
  }
  
  export type ConcreteRtData = {
    generalData: ConcreteGeneralData;
    step2Data: ConcreteRtStep2Data;
    step3Data: ConcreteRtStep3Data;
    results: ConcreteRt_results;
  };
  
  export type ConcreteRtActions = {
    setData: ({ step, key, value }: setDataType) => void;
    reset: ({ step }: setDataType) => void;
  };
  
  const stepVariant = { 0: 'generalData', 1: 'step2Data', 2: 'results' };
  
  type setDataType = { step: number; key?: string; value: unknown };
  
  const initialState = {
    generalData: {
      userId: null,
      name: null,
      material: null,
      operator: null,
      calculist: null,
      description: null,
    },
    step2Data: {
      dnitRange: null,
      sampleVoidVolume: null,
      pressConstant: null,
      pressSpecification: null,
      sampleOrigin: null,
    },
    step3Data: {
      concreteRt_data: [
        {
          id: 0,
          sampleName: null,
          d1: null,
          d2: null,
          d3: null,
          h1: null,
          h2: null,
          h3: null,
          pressReading: null,
        },
      ],
    },
    results: {
      accumulated_retained: [],
      graph_data: [],
      passant: [],
      retained_porcentage: [],
      total_retained: null,
      nominal_size: null,
      nominal_diameter: null,
      fineness_module: null,
      cc: null,
      cnu: null,
      error: null,
    },
  };
  
  const useConcreteRtStore = create<ConcreteRtData & ConcreteRtActions>()(
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
          name: 'concrete-Rt-store',
          storage: createJSONStorage(() => sessionStorage),
        }
      )
    )
  );
  
  export default useConcreteRtStore;