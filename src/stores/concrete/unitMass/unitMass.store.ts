import { ConcreteMaterial } from '@/interfaces/concrete';
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface UnitMassGeneralData {
  userId: string;
  experimentName: string;
  material: ConcreteMaterial;
  method: 'A' | 'B' | 'C';
}

interface unitMass_step2Data {
  containerVolume: number;
  containerWeight: number;
  sampleContainerWeight: number;
}

interface unitMass_step3Result {
  result: number;
}

export type UnitMassData = {
  generalData: UnitMassGeneralData;
  step2Data: unitMass_step2Data;
  result: unitMass_step3Result;
};

export type UnitMassActions = {
  setData: ({ step, key, value }: setDataType) => void;
};
const stepVariant = { 0: 'generalData', 1: 'step2Data', 2: 'result' };

export type setDataType = { step: number; key?: string; value: unknown };

const useUnitMassStore = create<UnitMassData & UnitMassActions>()(
  devtools(
    persist(
      (set) => ({
        generalData: {
          userId: null,
          experimentName: null,
          material: null,
          method: null,
        },
        step2Data: {
          containerVolume: null,
          containerWeight: null,
          sampleContainerWeight: null,
        },
        result: {
          result: null,
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
        name: 'unitMass-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useUnitMassStore;
