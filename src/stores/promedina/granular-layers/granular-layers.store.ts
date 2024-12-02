import { initializeTraceState } from 'next/dist/trace';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface GeneralData {
  name: string;
  zone: string;
  layer: string;
  cityState: string;
  highway: string;
  guideLineSpeed: string;
  observations?: string;
}

interface Step2Data {
  // PavimentData
  identification: string;
  sectionType: string;
  extension: string;
  initialStakeMeters: string;
  latitudeI: string;
  longitudeI: string;
  finalStakeMeters: string;
  latitudeF: string;
  longitudeF: string;
  monitoringPhase: string;
  observation: string;
  trafficLiberation: string;
  averageAltitude: string;
  numberOfTracks: string;
  monitoredTrack: string;
  trackWidth: string;
  // Paviment Preparation
  milling: string;
  interventionAtTheBase: string;
  sami: string;
  bondingPaint: string;
  priming: string;
  images: string;
  imagesDate: string;
  // Last Update
  lastUpdate: string;
  // Structural Composition
  structuralComposition: {
    id: number;
    layer: string;
    material: string;
    thickness: string;
  }[];
}

export type StructuralCompositionTable = {
  id: number;
  layer: string;
  material: string;
  thickness: number;
};

interface Step3Data {
  // Paviment Data
  mctGroup: string;
  mctCoefficientC: string;
  mctIndexE: string;
  especificMass: string;
  compressionEnergy: string;
  granulometricRange: string;
  optimalHumidity: string;
  abrasionLA: string;
  // Resilience module
  k1: string;
  k2: string;
  k3: string;
  k4: string;
  // Permanent deformation
  k1psi1: string;
  k2psi2: string;
  k3psi3: string;
  k4psi4: string;
  observations: string;
}

export type GranularLayersData = {
  generalData: GeneralData;
  step2Data: Step2Data;
  step3Data: Step3Data;
  _id: string;
};

export type GranularLayersActions = {
  setData: ({ step, key, value }: setDataType) => void;
};

const stepVariant = { 0: 'generalData', 1: 'step2Data', 2: 'step3Data' };

export type setDataType = { step: number; key?: string; value: unknown };

const initialState = {
  generalData: {
    highway: null,
    name: null,
    zone: null,
    layer: null,
    cityState: null,
    guideLineSpeed: null,
    observations: null,
  },
  step2Data: {
    identification: null,
    sectionType: null,
    extension: null,
    initialStakeMeters: null,
    latitudeI: null,
    longitudeI: null,
    finalStakeMeters: null,
    latitudeF: null,
    longitudeF: null,
    monitoringPhase: null,
    observation: null,
    milling: null,
    interventionAtTheBase: null,
    sami: null,
    bondingPaint: null,
    priming: null,
    images: null,
    imagesDate: null,
    trafficLiberation: null,
    lastUpdate: null,
    averageAltitude: null,
    numberOfTracks: null,
    monitoredTrack: null,
    trackWidth: null,
    structuralComposition: [
      {
        id: 0,
        layer: null,
        material: null,
        thickness: null,
      },
    ],
  },
  step3Data: {
    mctGroup: null,
    mctCoefficientC: null,
    mctIndexE: null,
    especificMass: null,
    compressionEnergy: null,
    granulometricRange: null,
    optimalHumidity: null,
    abrasionLA: null,
    k1: null,
    k2: null,
    k3: null,
    k4: null,
    k1psi1: null,
    k2psi2: null,
    k3psi3: null,
    k4psi4: null,
    observations: null,
  },
  _id: null,
};

const useGranularLayersStore = create<GranularLayersData & GranularLayersActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setData: ({ step, key, value }) =>
          set((state) => {
            if (step === 3) {
              return value; // Substitui o estado inteiro pelo novo valor
            } else {
              if (key) {
                return {
                  ...state,
                  [stepVariant[step]]: {
                    ...state[stepVariant[step]],
                    [key]: value,
                  },
                };
              } else {
                return { ...state, [stepVariant[step]]: value };
              }
            }
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
        name: 'granularLayers-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useGranularLayersStore;
