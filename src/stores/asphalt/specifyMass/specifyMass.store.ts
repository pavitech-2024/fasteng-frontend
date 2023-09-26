import { AsphaltMaterial } from "@/interfaces/asphalt";
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

interface SpecifyMass_step2Data {
    dry_mass: number;
    submerged_mass: number;
    surface_saturated_mass: number;
}

interface SpecifyMass_results {
    bulk_specify_mass: number;
    apparent_specify_mass: number;
    absorption: number;
}

export type SpecifyMassData = {
    generalData: GeneralData;
    step2Data: SpecifyMass_step2Data;
    results: SpecifyMass_results;
};

export type SpecifyMassActions = {
    setData: ({ step, key, value }: setDataType) => void;
}

const stepVariant = { 0: 'generalData', 1: 'step2Data', 2: 'results' };

type setDataType = { step: number; key?: string; value: unknown };

const useSpecifyMassStore = create<SpecifyMassData & SpecifyMassActions>()(
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
                    dry_mass: null,
                    submerged_mass: null,
                    surface_saturated_mass: null,
                },
                results: {
                    bulk_specify_mass: null,
                    apparent_specify_mass: null,
                    absorption: null,
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
                name: 'specifyMass-store',
                storage: createJSONStorage(() => sessionStorage),
            }
        )
    )
);

export default useSpecifyMassStore;