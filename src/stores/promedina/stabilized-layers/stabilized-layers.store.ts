import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface GeneralData {
  name: string;
  zone: string;
  layer: string;
  highway: string;
  cityState: string;
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
  observation?: string;
  trafficLiberation: string;
  averageAltitude: string;
  numberOfTracks: string;
  monitoredTrack: string;
  lastUpdate: string;
  trackWidth: string;
  // Paviment Preparation
  milling: string;
  interventionAtTheBase: string;
  sami: string;
  bondingPaint: string;
  priming: string;
  images: string;
  imagesDate: string;
  // Structural Composition
  structuralComposition: {
    id: number;
    layer: string;
    material: string;
    thickness: string;
  }[];
}

interface Step3Data {
  // Paviment Data
  stabilizer: string;
  tenor: string;
  especificMass: string;
  compressionEnergy: string;
  rtcd: string;
  rtf: string;
  rcs: string;
  granulometricRange: string;
  optimalHumidity: string;
  // Resilience module
  rsInitial: string;
  rsFinal: string;
  constantA: string;
  constantB: string;
  // Material fatigue
  fatiguek1psi1: string;
  fatiguek2psi2: string;
  observations: string;
}

export type StabilizedLayersData = {
  generalData: GeneralData;
  step2Data: Step2Data;
  step3Data: Step3Data;
};

export type StabilizedLayersActions = {
  setData: ({ step, key, value }: setDataType) => void;
};

const stepVariant = { 0: 'generalData', 1: 'step2Data', 2: 'step3Data' };

export type setDataType = { step: number; key?: string; value: unknown };

const useStabilizedLayersStore = create<StabilizedLayersData & StabilizedLayersActions>()(
  devtools(
    persist(
      (set) => ({
        generalData: {
          name: null,
          zone: null,
          highway: null,
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
          stabilizer: null,
          tenor: null,
          especificMass: null,
          compressionEnergy: null,
          rtcd: null,
          rtf: null,
          rcs: null,
          granulometricRange: null,
          optimalHumidity: null,
          rsInitial: null,
          rsFinal: null,
          constantA: null,
          constantB: null,
          fatiguek1psi1: null,
          fatiguek2psi2: null,
          observations: null,
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
        name: 'stabilizedLayers-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useStabilizedLayersStore;