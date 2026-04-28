import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

/* =========================
   STEP 3 (CAMADAS)
========================= */

interface Step3Layer {
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

interface Step3Data {
  subleito: Step3Layer;
  aterro: Step3Layer;
  subBaseGranular: Step3Layer;
  baseGranular: Step3Layer;
  observations: string;
}

/* =========================
   STEP 1
========================= */

interface GeneralData {
  name: string;
  zone: string;
  layer: string;
  cityState: string;
  highway: string;
  guideLineSpeed: string;
  observations?: string;
  tipoSecao: string;
  faseMonitoramento: string;
  liberacaoTrafico: string;
  utilizadaMeDiNa: string;
  utilizadaLVECD: string;
  dadosConfirmadosICT: string;

  ir1PreReabilitacao: string;
  atPreReabilitacao: string;
  fresagem: string;
  espessuraFresagem: string;
  intervencaoBase: string;
  sami: string;
  pinturaLigacao: string;
  imprimacao: string;

  dataUltimaAtualizacao: string;
  tempoServicoAnos: string;
  tempoServicoMeses: string;

  local: string;
  municipioEstado: string;
  extensao: string;
  velocidadeDiretriz: string;
  kmInicial: string;
  kmFinal: string;
  inicioEstaca: string;
  inicioMetros: string;
  fimEstaca: string;
  fimMetros: string;
  altitudeMedia: string;
  numeroFaixas: string;
  faixaMonitorada: string;
  larguraFaixa: string;

  capaMaterial: string;
  capaEspessura: string;
  binderMaterial: string;
  binderEspessura: string;
  tsdMaterial: string;
  tsdEspessura: string;
  baseMaterial: string;
  baseEspessura: string;
  subBaseMaterial: string;
  subBaseEspessura: string;
  reforcoSubleitoMaterial: string;
  reforcoSubleitoEspessura: string;
}

/* =========================
   STEP 2
========================= */

interface Step2Data {
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
  milling: string;
  interventionAtTheBase: string;
  sami: string;
  bondingPaint: string;
  priming: string;
  images: string;
  imagesDate: string;
  lastUpdate: string;

  structuralComposition: {
    id: number;
    layer: string;
    material: string;
    thickness: string;
  }[];

  tipoSecao: string;
  estrutura: string;
  material: string;
  longitude: string;
  latitude: string;
  altitude: string;
  fonteMonitoramento: string;
  longitudeFora: string;
  latitudeFora: string;
  pregoeiro: string;
  informacaoBase: string;
  pontoLigacao: string;
  ultimaAtualizacao: string;
  local: string;
  municipioEstado: string;
  extensao: string;
  velocidadeDiretaVia: string;
  larguraFaixa: string;
  inicioEstaca: string;
  inicioLatitude: string;
  fimMetros: string;
  fimLongitude: string;
  altitudeMedia: string;
}

/* =========================
   FACTORIES (🔥 ESSENCIAL)
========================= */

const createEmptyLayer = (): Step3Layer => ({
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

const createStep3Data = (): Step3Data => ({
  subleito: createEmptyLayer(),
  aterro: createEmptyLayer(),
  subBaseGranular: createEmptyLayer(),
  baseGranular: createEmptyLayer(),
  observations: '',
});

const createGeneralData = (): GeneralData => ({
  name: '',
  zone: '',
  layer: '',
  cityState: '',
  highway: '',
  guideLineSpeed: '',
  observations: '',
  tipoSecao: '',
  faseMonitoramento: '',
  liberacaoTrafico: '',
  utilizadaMeDiNa: '',
  utilizadaLVECD: '',
  dadosConfirmadosICT: '',

  ir1PreReabilitacao: '',
  atPreReabilitacao: '',
  fresagem: '',
  espessuraFresagem: '',
  intervencaoBase: '',
  sami: '',
  pinturaLigacao: '',
  imprimacao: '',

  dataUltimaAtualizacao: '',
  tempoServicoAnos: '',
  tempoServicoMeses: '',

  local: '',
  municipioEstado: '',
  extensao: '',
  velocidadeDiretriz: '',
  kmInicial: '',
  kmFinal: '',
  inicioEstaca: '',
  inicioMetros: '',
  fimEstaca: '',
  fimMetros: '',
  altitudeMedia: '',
  numeroFaixas: '',
  faixaMonitorada: '',
  larguraFaixa: '',

  capaMaterial: '',
  capaEspessura: '',
  binderMaterial: '',
  binderEspessura: '',
  tsdMaterial: '',
  tsdEspessura: '',
  baseMaterial: '',
  baseEspessura: '',
  subBaseMaterial: '',
  subBaseEspessura: '',
  reforcoSubleitoMaterial: '',
  reforcoSubleitoEspessura: '',
});

const createStep2Data = (): Step2Data => ({
  identification: '',
  sectionType: '',
  extension: '',
  initialStakeMeters: '',
  latitudeI: '',
  longitudeI: '',
  finalStakeMeters: '',
  latitudeF: '',
  longitudeF: '',
  monitoringPhase: '',
  observation: '',
  trafficLiberation: '',
  averageAltitude: '',
  numberOfTracks: '',
  monitoredTrack: '',
  trackWidth: '',
  milling: '',
  interventionAtTheBase: '',
  sami: '',
  bondingPaint: '',
  priming: '',
  images: '',
  imagesDate: '',
  lastUpdate: '',

  structuralComposition: [
    { id: 0, layer: '', material: '', thickness: '' }
  ],

  tipoSecao: '',
  estrutura: '',
  material: '',
  longitude: '',
  latitude: '',
  altitude: '',
  fonteMonitoramento: '',
  longitudeFora: '',
  latitudeFora: '',
  pregoeiro: '',
  informacaoBase: '',
  pontoLigacao: '',
  ultimaAtualizacao: '',
  local: '',
  municipioEstado: '',
  extensao: '',
  velocidadeDiretaVia: '',
  larguraFaixa: '',
  inicioEstaca: '',
  inicioLatitude: '',
  fimMetros: '',
  fimLongitude: '',
  altitudeMedia: '',
});

/* =========================
   STORE
========================= */

const stepVariant = {
  0: 'generalData',
  1: 'step2Data',
  2: 'step3Data',
} as const;

type setDataType = {
  step: number;
  key?: string;
  value: unknown;
};

type Store = {
  generalData: GeneralData;
  step2Data: Step2Data;
  step3Data: Step3Data;
  _id?: string;

  setData: (data: setDataType) => void;
  reset: () => void;
  clearStore: () => void;
};

const initialState = {
  generalData: createGeneralData(),
  step2Data: createStep2Data(),
  step3Data: createStep3Data(),
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

export default useGranularLayersStore;