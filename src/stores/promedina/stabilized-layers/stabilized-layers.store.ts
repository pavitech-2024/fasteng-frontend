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
  observation: string;
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
  // Brookfield viscosity
  vb_sp21_20: string;
  vb_sp21_50: string;
  vb_sp21_100: string;
  //Sample data
  refinery: string;
  company: string;
  collectionDate: string;
  invoiceNumber: string;
  dataInvoice: string;
  certificateDate: string;
  certificateNumber: string;
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
  // Tech data
  mctGroup: string;
  mctGroupmctCoefficientC: string;
  mctIndexE: string;
  abrasionLA: string;
  capType: string;
  performanceGrade: string;
  penetration: string;
  softeningPoint: string;
  elasticRecovery: string;
}

interface Step4Data {
  // Fatigue curve CD
  fatigueCurve_n_cps: string;
  fatigueCurve_k1: string;
  fatigueCurve_k2: string;
  fatigueCurve_r2: string;
  // Tech data
  tmn: string;
  volumeVoids: string;
  rt: string;
  flowNumber: string;
  mr: string;
  specificMass: string;
  asphaltTenor: string;
  stabilizer: string;
  tenor: string;
  rtcd: string;
  rtf: string;
  rcs: string;
}

export type StabilizedLayersData = {
  generalData: GeneralData;
  step2Data: Step2Data;
  step3Data: Step3Data;
  step4Data: Step4Data;
  _id?: string;
};

export type StabilizedLayersActions = {
  setData: ({ step, key, value }: setDataType) => void;
  clearStore: () => void;
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
    // Paviment Data
    stabilizer: null,
    tenor: null,
    especificMass: null,
    compressionEnergy: null,
    rtcd: null,
    rtf: null,
    rcs: null,
    granulometricRange: null,
    optimalHumidity: null,
    // Resilience module
    rsInitial: null,
    rsFinal: null,
    constantA: null,
    constantB: null,
    // Material fatigue
    fatiguek1psi1: null,
    fatiguek2psi2: null,
    observations: null,
    // Brookfield viscosity
    vb_sp21_20: null,
    vb_sp21_50: null,
    vb_sp21_100: null,
    //Sample data
    refinery: null,
    company: null,
    collectionDate: null,
    invoiceNumber: null,
    dataInvoice: null,
    certificateDate: null,
    certificateNumber: null,
    // Resilience module
    k1: null,
    k2: null,
    k3: null,
    k4: null,
    // Permanent deformation
    k1psi1: null,
    k2psi2: null,
    k3psi3: null,
    k4psi4: null,
    // Tech data
    mctGroup: null,
    mctGroupmctCoefficientC: null,
    mctIndexE: null,
    abrasionLA: null,
    capType: null,
    performanceGrade: null,
    penetration: null,
    softeningPoint: null,
    elasticRecovery: null,
  },
  step4Data: {
    // Fatigue curve CD
    fatigueCurve_n_cps: null,
    fatigueCurve_k1: null,
    fatigueCurve_k2: null,
    fatigueCurve_r2: null,
    // Tech data
    tmn: null,
    volumeVoids: null,
    rt: null,
    flowNumber: null,
    mr: null,
    specificMass: null,
    asphaltTenor: null,
    stabilizer: null,
    tenor: null,
    rtcd: null,
    rtf: null,
    rcs: null,
  },
  _id: null,
};

const useStabilizedLayersStore = create<StabilizedLayersData & StabilizedLayersActions>()(
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

        clearStore: () => {
          sessionStorage.clear();
          set(initialState);
        },
      }),
      {
        // name data store e config no session storage
        name: 'stabilized-layers-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useStabilizedLayersStore;
