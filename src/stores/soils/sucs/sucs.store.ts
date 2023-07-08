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

interface EssayGeneralData {
    initial_sample_mass: number;
    ll_porcentage: number;
    lp_porcentage: number;
    seives: [
        { number: 'Nº 4'; mm: '4.80'; passant: number },
        { number: 'Nº 200'; mm: '0.075'; passant: number },
    ]
}

interface sucs_results {
    cc: number;
    cnu: number;
    ip: number;
    classification: string;
}

export type SucsData = {
    generalData: GeneralData;
    essayGeneralData: EssayGeneralData;
    results: sucs_results;
};

export type SucsActions = {
    setData: ({ step, key, value }: setDataType) => void;
};

const stepVariant = { 0: 'generalData', 1: 'essayGeneralData', 2: 'results' };

type setDataType = { step: number; key?: string; value: unknown };

const useSucsStore = create<SucsData & SucsActions>()(
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
                essayGeneralData: {
                    initial_sample_mass: 0,
                    ll_porcentage: 0,
                    lp_porcentage: 0,
                    seives: [
                        { number: 'Nº 4', mm: '4.80', passant: null },
                        { number: 'Nº 200', mm: '0.075', passant: null },
                    ]
                },
                results: {
                    cc: null,
                    cnu: null,
                    ip: null,
                    classification: null,
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
                name: 'sucs-store',
                storage: createJSONStorage(() => sessionStorage),
            }
        )
    )
);

export default useSucsStore;