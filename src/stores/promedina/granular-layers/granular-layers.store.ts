import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

/* =========================
   STEP 2 (CAMADAS DINÂMICAS) - antigo STEP 3
========================= */

export interface Step2Layer {
  id: string;
  name: string;

  mctCoefficientC: string;
  mctIndexE: string;
  especificMass: string;
  optimalHumidity: string;
  compressionEnergy: string;

  k1: string;
  k2: string;
  k3: string;
  k4: string;

  k1psi1: string;
  k2psi2: string;
  k3psi3: string;
  k4psi4: string;
}

export interface Step2Data {
  layers: Step2Layer[];
  observations: string;
}

/* =========================
   STEP 0 (GENERAL DATA)
========================= */

interface GeneralData {
  // IDENTIFICAÇÃO
  name: string;
  tipoSecao: string;
  faseMonitoramento: string;
  liberacaoTrafico: string;
  utilizadaMedina: string;
  utilizadaLvec: string;
  dadosConfirmadosICT: string;
  observation: string;

  // PREPARO DO PAVIMENTO
  iriPrerehabilitation: string;
  atPrerehabilitation: string;
  fresagem: string;
  millingThickness: string;
  interventionAtTheBase: string;
  sami: string;
  bondingPaint: string;
  priming: string;

  // DATA ÚLTIMA ATUALIZAÇÃO
  lastUpdate: string;
  serviceTimeYears: string;
  serviceTimeMonths: string;

  // CARACTERÍSTICAS
  roadName: string;
  cityState: string;
  experimentalLength: string;
  guideSpeed: string;
  kmInicial: string;
  kmFinal: string;
  inicioEstaca: string;
  inicioMetros: string;
  fimEstaca: string;
  fimMetros: string;
  averageAltitude: string;
  numberOfTracks: string;
  monitoredTrack: string;
  trackWidth: string;

  // COMPOSIÇÃO ESTRUTURAL
  structuralComposition: {
    id: number;
    layer: string;
    material: string;
    thickness: string;
  }[];

  images: string;
  imagesDate: string;
}

/* =========================
   FACTORIES
========================= */

const createEmptyLayer = (): Step2Layer => ({
  id: crypto.randomUUID(),
  name: '',

  mctCoefficientC: '',
  mctIndexE: '',
  especificMass: '',
  optimalHumidity: '',
  compressionEnergy: '',

  k1: '',
  k2: '',
  k3: '',
  k4: '',

  k1psi1: '',
  k2psi2: '',
  k3psi3: '',
  k4psi4: '',
});

const createStep2Data = (): Step2Data => ({
  layers: [createEmptyLayer()],
  observations: '',
});

const createGeneralData = (): GeneralData => ({
  name: '',
  tipoSecao: '',
  faseMonitoramento: '',
  liberacaoTrafico: '',
  utilizadaMedina: '',
  utilizadaLvec: '',
  dadosConfirmadosICT: '',
  observation: '',

  iriPrerehabilitation: '',
  atPrerehabilitation: '',
  fresagem: '',
  millingThickness: '',
  interventionAtTheBase: '',
  sami: '',
  bondingPaint: '',
  priming: '',

  lastUpdate: '',
  serviceTimeYears: '',
  serviceTimeMonths: '',

  roadName: '',
  cityState: '',
  experimentalLength: '',
  guideSpeed: '',
  kmInicial: '',
  kmFinal: '',
  inicioEstaca: '',
  inicioMetros: '',
  fimEstaca: '',
  fimMetros: '',
  averageAltitude: '',
  numberOfTracks: '',
  monitoredTrack: '',
  trackWidth: '',

  structuralComposition: [
    { id: 0, layer: '', material: '', thickness: '' }
  ],

  images: '',
  imagesDate: '',
});

/* =========================
   STORE
========================= */

const stepVariant = {
  0: 'generalData',
  1: 'step2Data',
} as const;

type setDataType = {
  step: number;
  key?: string;
  value: any;
};

type Store = {
  generalData: GeneralData;
  step2Data: Step2Data;
  _id?: string;

  setData: (data: setDataType) => void;
  reset: () => void;
  clearStore: () => void;
};

const initialState: Omit<Store, 'setData' | 'reset' | 'clearStore'> = {
  generalData: createGeneralData(),
  step2Data: createStep2Data(),
  _id: undefined,
};

const useGranularLayersStore = create<Store>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setData: ({ step, key, value }) => {
          set((state) => {
            if (!key) {
              return {
                ...state,
                [stepVariant[step]]: value,
              };
            }

            return {
              ...state,
              [stepVariant[step]]: {
                ...state[stepVariant[step]],
                [key]: value,
              },
            };
          });
        },

        reset: () => set(initialState),

        clearStore: () => {
          sessionStorage.clear();
          set(initialState);
        },
      }),
      {
        name: 'granularLayers-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export type GranularLayersActions = {
  generalData: GeneralData;
  step2Data: Step2Data;
  _id?: string;
  setData: (data: setDataType) => void;
  reset: () => void;
  clearStore: () => void;
};

export type GranularLayersData = {
  generalData: GeneralData;
  step2Data: Step2Data;
  _id?: string;
};

export default useGranularLayersStore;