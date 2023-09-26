import { AsphaltMaterial } from '@/interfaces/asphalt';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface GeneralData {
    userId: string;
    name: string;
    material: AsphaltMaterial;
    operator?: string;
    calculist?: string;
    description?: string;
}

interface FlashPoint_step2Data {
    ignition_temperature: number;
}

interface FlashPoint_results {
    temperature: number;
}

export type FlashPointData = {
    generalData: GeneralData;
    step2Data: FlashPoint_step2Data;
    results: FlashPoint_results;
};

export type FlashPointActions = {
    setData: ({ step, key, value }: setDataType) => void;
};

const stepVariant = { 0: 'generalData', 1: 'step2Data', 2: 'results' };

type setDataType = { step: number; key?: string; value: unknown };

const useFlashPointStore = create<FlashPointData & FlashPointActions>()(
    devtools(
        persist(
            (set) => ({
                generalData: {
                    userId: null,
                    name: null,
                    material: null,
                    operator: null,
                    calculist: null,
                    description: null,
                },
                step2Data: {
                    ignition_temperature: null,
                },
                results: {
                    temperature: null,
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
                name: 'flashPoint-store',
                storage: createJSONStorage(() => sessionStorage),
            }
        )
    )
);

export default useFlashPointStore;
