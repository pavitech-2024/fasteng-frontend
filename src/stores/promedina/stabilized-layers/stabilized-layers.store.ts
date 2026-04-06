import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

// ================== DEFINIÇÃO DO TIPO DE CADA CAMADA ==================
export interface LayerCard {
  id: string;
  title: string; // Título livre digitado pelo usuário
  grupoMCT: string;
  coeficienteC: string;
  indiceE: string;
  massaEspecifica: string;
  umidadeOtima: string;
  energiaCompactacao: string;
  moduloResiliencia: string;
  coeficienteK1: string;
  coeficienteK2: string;
  coeficienteK3: string;
  coeficienteK4: string;
  deformacaoPermanente: string;
  coeficienteK1Psi: string;
  coeficienteK2Psi: string;
  coeficienteK3Psi: string;
  coeficienteK4Psi: string;
}

// ================== INTERFACES DOS DADOS ==================
interface GeneralData {
  name: string | null;
  zone: string | null;
  layer: string | null;
  highway: string | null;
  cityState: string | null;
  guideLineSpeed: string | null;
  observations?: string | null;
  companyResponsible?: string | null;
  coatingType?: string | null;
  serviceOrder?: string | null;
  layerNumber?: string | null;
  subgradeClass?: string | null;
  subgradeThickness?: string | null;
  granularBaseThickness?: string | null;
  stabilizedLayerThickness?: string | null;
  subgradeObs?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  weather?: string | null;
  identification?: string | null;
  tipoSecao?: string | null;
  faseMonitoramento?: string | null;
  liberacaoTrafico?: string | null;
  utilizadaMedina?: string | null;
  utilizadaLvec?: string | null;
  dadosConfirmadosICT?: string | null;
  iriPreReabilitacao?: string | null;
  atPreReabilitacao?: string | null;
  fresagem?: string | null;
  espessuraFresagem?: string | null;
  intervencaoBase?: string | null;
  sami?: string | null;
  pinturaLigacao?: string | null;
  imprimacao?: string | null;
  dataUltimaAtualizacao?: string | null;
  tempoServicoAnos?: string | null;
  tempoServicoMeses?: string | null;
  local?: string | null;
  municipioEstado?: string | null;
  extensao?: string | null;
  velocidadeDiretriz?: string | null;
  kmInicial?: string | null;
  kmFinal?: string | null;
  inicioEstaca?: string | null;
  inicioMetros?: string | null;
  fimEstaca?: string | null;
  fimMetros?: string | null;
  altitudeMedia?: string | null;
  numeroFaixas?: string | null;
  faixaMonitorada?: string | null;
  larguraFaixa?: string | null;
  capaMaterial?: string | null;
  capaEspessura?: string | null;
  binderMaterial?: string | null;
  binderEspessura?: string | null;
  tsdMaterial?: string | null;
  tsdEspessura?: string | null;
  baseMaterial?: string | null;
  baseEspessura?: string | null;
  subBaseMaterial?: string | null;
  subBaseEspessura?: string | null;
  reforcoSubleitoMaterial?: string | null;
  reforcoSubleitoEspessura?: string | null;
}

interface Step2Data {
  identification: string | null;
  sectionType: string | null;
  extension: string | null;
  initialStakeMeters: string | null;
  latitudeI: string | null;
  longitudeI: string | null;
  finalStakeMeters: string | null;
  latitudeF: string | null;
  longitudeF: string | null;
  monitoringPhase: string | null;
  observation: string | null;
  trafficLiberation: string | null;
  averageAltitude: string | null;
  numberOfTracks: string | null;
  monitoredTrack: string | null;
  lastUpdate: string | null;
  trackWidth: string | null;
  milling: string | null;
  interventionAtTheBase: string | null;
  sami: string | null;
  bondingPaint: string | null;
  priming: string | null;
  images: string | null;
  imagesDate: string | null;
  structuralComposition: {
    id: number;
    layer: string | null;
    material: string | null;
    thickness: string | null;
  }[];
  iriPrerehabilitation?: string | null;
  atPrerehabilitation?: string | null;
  millingThickness?: string | null;
  roadName?: string | null;
  cityState?: string | null;
  experimentalLength?: string | null;
  guideSpeed?: string | null;
  serviceTimeYears?: string | null;
  serviceTimeMonths?: string | null;
}

interface Step3Data {
  stabilizer: string | null;
  tenor: string | null;
  especificMass: string | null;
  compressionEnergy: string | null;
  rtcd: string | null;
  rtf: string | null;
  rcs: string | null;
  granulometricRange: string | null;
  optimalHumidity: string | null;
  rsInitial: string | null;
  rsFinal: string | null;
  constantA: string | null;
  constantB: string | null;
  fatiguek1psi1: string | null;
  fatiguek2psi2: string | null;
  observations: string | null;
  vb_sp21_20: string | null;
  vb_sp21_50: string | null;
  vb_sp21_100: string | null;
  refinery: string | null;
  company: string | null;
  collectionDate: string | null;
  invoiceNumber: string | null;
  dataInvoice: string | null;
  certificateDate: string | null;
  certificateNumber: string | null;
  k1: string | null;
  k2: string | null;
  k3: string | null;
  r2: string | null;
  k4: string | null;
  k1psi1: string | null;
  k2psi2: string | null;
  k3psi3: string | null;
  k4psi4: string | null;
  mctGroup: string | null;
  mctGroupmctCoefficientC: string | null;
  mctIndexE: string | null;
  abrasionLA: string | null;
  capType: string | null;
  performanceGrade: string | null;
  penetration: string | null;
  softeningPoint: string | null;
  elasticRecovery: string | null;
  // 🆕 Lista dinâmica de camadas
  layers: LayerCard[];
}

interface Step4Data {
  fatigueCurve_n_cps: string | null;
  fatigueCurve_k1: string | null;
  fatigueCurve_k2: string | null;
  fatigueCurve_r2: string | null;
  tmn: string | null;
  volumeVoids: string | null;
  rt: string | null;
  flowNumber: string | null;
  mr: string | null;
  specificMass: string | null;
  asphaltTenor: string | null;
  stabilizer: string | null;
  tenor: string | null;
  rtcd: string | null;
  rtf: string | null;
  rcs: string | null;
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
  reset: () => void;
};

const stepVariant = { 0: 'generalData', 1: 'step2Data', 2: 'step3Data', 3: 'step4Data' };

export type setDataType = { step: number; key?: string; value: unknown };

const initialState = {
  generalData: {
    name: null,
    zone: null,
    layer: null,
    highway: null,
    cityState: null,
    guideLineSpeed: null,
    observations: null,
    companyResponsible: null,
    coatingType: null,
    serviceOrder: null,
    layerNumber: null,
    subgradeClass: null,
    subgradeThickness: null,
    granularBaseThickness: null,
    stabilizedLayerThickness: null,
    subgradeObs: null,
    startDate: null,
    endDate: null,
    weather: null,
    identification: null,
    tipoSecao: null,
    faseMonitoramento: null,
    liberacaoTrafico: null,
    utilizadaMedina: null,
    utilizadaLvec: null,
    dadosConfirmadosICT: null,
    iriPreReabilitacao: null,
    atPreReabilitacao: null,
    fresagem: null,
    espessuraFresagem: null,
    intervencaoBase: null,
    sami: null,
    pinturaLigacao: null,
    imprimacao: null,
    dataUltimaAtualizacao: null,
    tempoServicoAnos: null,
    tempoServicoMeses: null,
    local: null,
    municipioEstado: null,
    extensao: null,
    velocidadeDiretriz: null,
    kmInicial: null,
    kmFinal: null,
    inicioEstaca: null,
    inicioMetros: null,
    fimEstaca: null,
    fimMetros: null,
    altitudeMedia: null,
    numeroFaixas: null,
    faixaMonitorada: null,
    larguraFaixa: null,
    capaMaterial: null,
    capaEspessura: null,
    binderMaterial: null,
    binderEspessura: null,
    tsdMaterial: null,
    tsdEspessura: null,
    baseMaterial: null,
    baseEspessura: null,
    subBaseMaterial: null,
    subBaseEspessura: null,
    reforcoSubleitoMaterial: null,
    reforcoSubleitoEspessura: null,
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
    structuralComposition: [{ id: 0, layer: null, material: null, thickness: null }],
    iriPrerehabilitation: null,
    atPrerehabilitation: null,
    millingThickness: null,
    roadName: null,
    cityState: null,
    experimentalLength: null,
    guideSpeed: null,
    serviceTimeYears: null,
    serviceTimeMonths: null,
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
    vb_sp21_20: null,
    vb_sp21_50: null,
    vb_sp21_100: null,
    refinery: null,
    company: null,
    collectionDate: null,
    invoiceNumber: null,
    dataInvoice: null,
    certificateDate: null,
    certificateNumber: null,
    k1: null,
    k2: null,
    k3: null,
    r2: null,
    k4: null,
    k1psi1: null,
    k2psi2: null,
    k3psi3: null,
    k4psi4: null,
    mctGroup: null,
    mctGroupmctCoefficientC: null,
    mctIndexE: null,
    abrasionLA: null,
    capType: null,
    performanceGrade: null,
    penetration: null,
    softeningPoint: null,
    elasticRecovery: null,
    layers: [], // ✅ Array de camadas dinâmicas
  },
  step4Data: {
    fatigueCurve_n_cps: null,
    fatigueCurve_k1: null,
    fatigueCurve_k2: null,
    fatigueCurve_r2: null,
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
              return value as any;
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
        reset: () => set(initialState),
        clearStore: () => {
          sessionStorage.clear();
          set(initialState);
        },
      }),
      {
        name: 'stabilized-layers-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useStabilizedLayersStore;