import { ConcreteMaterial } from '@/interfaces/concrete';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface sandIncrease_generalData {
  userId: string;
  name: string;
  material: ConcreteMaterial; // materialID
  operator?: string;
  description?: string;
  cauculist?: string;
}

export interface SandIncrease_Step2TableData {
  sample: number;
  moistureContent: number;
  containerWeightSample: number;
  unitMass: number;
}

interface unitMassDeterminationData {
  containerVolume: number;
  containerWeight: number;
  tableData: [
    {
      sample: '1';
      moistureContent: '0';
      containerWeightSample: number;
      unitMass: number;
    },
    {
      sample: '2';
      moistureContent: '0.5';
      containerWeightSample: number;
      unitMass: number;
    },
    {
      sample: '3';
      moistureContent: '1';
      containerWeightSample: number;
      unitMass: number;
    },
    {
      sample: '4';
      moistureContent: '2';
      containerWeightSample: number;
      unitMass: number;
    },
    {
      sample: '5';
      moistureContent: '4';
      containerWeightSample: number;
      unitMass: number;
    },
    {
      sample: '6';
      moistureContent: '5';
      containerWeightSample: number;
      unitMass: number;
    },
    {
      sample: '7';
      moistureContent: '7';
      containerWeightSample: number;
      unitMass: number;
    },
    {
      sample: '8';
      moistureContent: '9';
      containerWeightSample: number;
      unitMass: number;
    },
    {
      sample: '9';
      moistureContent: '12';
      containerWeightSample: number;
      unitMass: number;
    }
  ];
}

interface humidityFoundData {
  tableData: [
    {
      sample: '1';
      capsuleWeight: number;
      wetGrossWeight: number;
      dryGrossWeight: number;
      moistureContent: number;
    },
    {
      sample: '2';
      capsuleWeight: number;
      wetGrossWeight: number;
      dryGrossWeight: number;
      moistureContent: number;
    },
    {
      sample: '3';
      capsuleWeight: number;
      wetGrossWeight: number;
      dryGrossWeight: number;
      moistureContent: number;
    },
    {
      sample: '4';
      capsuleWeight: number;
      wetGrossWeight: number;
      dryGrossWeight: number;
      moistureContent: number;
    },
    {
      sample: '5';
      capsuleWeight: number;
      wetGrossWeight: number;
      dryGrossWeight: number;
      moistureContent: number;
    },
    {
      sample: '6';
      capsuleWeight: number;
      wetGrossWeight: number;
      dryGrossWeight: number;
      moistureContent: number;
    },
    {
      sample: '7';
      capsuleWeight: number;
      wetGrossWeight: number;
      dryGrossWeight: number;
      moistureContent: number;
    },
    {
      sample: '8';
      capsuleWeight: number;
      wetGrossWeight: number;
      dryGrossWeight: number;
      moistureContent: number;
    },
    {
      sample: '9';
      capsuleWeight: number;
      wetGrossWeight: number;
      dryGrossWeight: number;
      moistureContent: number;
    }
  ];
}

interface sandIncrease_results {
  unitMasses: number[];
  moistureContent: number[];
  swellings: number[];
  curve: [number, number][];
  retaR: [number, number][];
  retaS: [number, number][];
  retaT: [number, number][];
  retaU: [number, number][];
  averageCoefficient: number;
  criticalHumidity: number;
}

export type SandIncreaseData = {
  sandIncreaseGeneralData: sandIncrease_generalData;
  unitMassDeterminationData: unitMassDeterminationData;
  humidityFoundData: humidityFoundData;
  results: sandIncrease_results;
};

export type SandIncreaseActions = {
  setData: ({ step, key, value }: setDataType) => void;
};

type setDataType = { step: number; key?: string; value: unknown };

const stepVariant = {
  0: 'sandIncreaseGeneralData',
  1: 'unitMassDeterminationData',
  2: 'humidityFoundData',
  3: 'results',
};

const useSandIncreaseStore = create<SandIncreaseData & SandIncreaseActions>()(
  devtools(
    persist(
      (set) => ({
        sandIncreaseGeneralData: {
          userId: null,
          name: null,
          material: null,
          operator: null,
          description: null,
          cauculist: null,
        },
        unitMassDeterminationData: {
          containerVolume: null,
          containerWeight: null,
          tableData: [
            {
              sample: '1',
              moistureContent: '0',
              containerWeightSample: null,
              unitMass: null,
            },
            {
              sample: '2',
              moistureContent: '0.5',
              containerWeightSample: null,
              unitMass: null,
            },
            {
              sample: '3',
              moistureContent: '1',
              containerWeightSample: null,
              unitMass: null,
            },
            {
              sample: '4',
              moistureContent: '2',
              containerWeightSample: null,
              unitMass: null,
            },
            {
              sample: '5',
              moistureContent: '4',
              containerWeightSample: null,
              unitMass: null,
            },
            {
              sample: '6',
              moistureContent: '5',
              containerWeightSample: null,
              unitMass: null,
            },
            {
              sample: '7',
              moistureContent: '7',
              containerWeightSample: null,
              unitMass: null,
            },
            {
              sample: '8',
              moistureContent: '9',
              containerWeightSample: null,
              unitMass: null,
            },
            {
              sample: '9',
              moistureContent: '12',
              containerWeightSample: null,
              unitMass: null,
            },
          ],
        },
        humidityFoundData: {
          tableData: [
            {
              sample: '1',
              capsuleWeight: null,
              wetGrossWeight: null,
              dryGrossWeight: null,
              moistureContent: null,
            },
            {
              sample: '2',
              capsuleWeight: null,
              wetGrossWeight: null,
              dryGrossWeight: null,
              moistureContent: null,
            },
            {
              sample: '3',
              capsuleWeight: null,
              wetGrossWeight: null,
              dryGrossWeight: null,
              moistureContent: null,
            },
            {
              sample: '4',
              capsuleWeight: null,
              wetGrossWeight: null,
              dryGrossWeight: null,
              moistureContent: null,
            },
            {
              sample: '5',
              capsuleWeight: null,
              wetGrossWeight: null,
              dryGrossWeight: null,
              moistureContent: null,
            },
            {
              sample: '6',
              capsuleWeight: null,
              wetGrossWeight: null,
              dryGrossWeight: null,
              moistureContent: null,
            },
            {
              sample: '7',
              capsuleWeight: null,
              wetGrossWeight: null,
              dryGrossWeight: null,
              moistureContent: null,
            },
            {
              sample: '8',
              capsuleWeight: null,
              wetGrossWeight: null,
              dryGrossWeight: null,
              moistureContent: null,
            },
            {
              sample: '9',
              capsuleWeight: null,
              wetGrossWeight: null,
              dryGrossWeight: null,
              moistureContent: null,
            },
          ],
        },
        results: {
          unitMasses: null,
          moistureContent: null,
          swellings: null,
          curve: null,
          retaR: null,
          retaS: null,
          retaT: null,
          retaU: null,
          averageCoefficient: null,
          criticalHumidity: null,
        },

        /**
         * Updates the value of the given key in the state of the store for the given step.
         * If no key is given, the value is set as the whole state of the given step.
         * @param {{ step: number; key?: string; value: unknown }} data
         * @param {number} data.step The step of the state to update.
         * @param {string} [data.key] The key of the value to update in the state of the given step.
         * If not given, the value is set as the whole state of the given step.
         * @param {unknown} data.value The new value to set in the state of the given step.
         */
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
        name: 'sandIncrease-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useSandIncreaseStore;
