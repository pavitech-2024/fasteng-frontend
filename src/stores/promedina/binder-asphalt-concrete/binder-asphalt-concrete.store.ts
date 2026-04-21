import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

// ==================== STEP 3: TRATAMENTO SUPERFICIAL (NOVO) ====================
interface Step3Data {
  // Tratamento Superficial
  tipoTratamento: string;
  tipoEmulsao: string;
  taxaEmulsao: string;
  taxaAgregados: string;
  faixaGranulometrica: string;
  abrasaoLosAngeles: string;
  massaEspecifica: string;
  
  // Emulsão Asfáltica
  referenciaComercial: string;
  refinaria: string;
  empresaDistribuidora: string;
  dataCarregamento: string;
  numeroNotaFiscal: string;
  dataNotaFiscal: string;
  numeroCertificado: string;
  dataCertificado: string;
  
  // Parâmetros do Material
  viscosidadeSSF: string;
  peneiracao: string;
  residuo: string;
  cargaParticula: string;
  penetracao: string;
  recuperacaoElastica: string;
  pontoAmolecimento: string;
  
  observacoes: string;
}

// ==================== STEP 4: LIGANTE ASFÁLTICO (NOVO) ====================
interface Step4Data {
  // Dados Comerciais
  referenciaComercial: string;
  refinaria: string;
  empresaDistribuidora: string;
  dataCarregamento: string;
  numeroNotaFiscal: string;
  dataNotaFiscal: string;
  numeroCertificado: string;
  dataCertificado: string;
  
  // Ligante Original
  tipoCAP: string;
  performanceGrade: string;
  penetracao25: string;
  pontoAmolecimento: string;
  viscosidadeBrookfield_135: string;
  viscosidadeBrookfield_150: string;
  viscosidadeBrookfield_177: string;
  recuperacaoElastica: string;
  dsr_original_G_sen: string;
  dsr_original_temp: string;
  
  // Ligante Envelhecido RTFOT
  dsr_rtfot_G_sen: string;
  dsr_rtfot_temp: string;
  
  // MSCR
  mscr_Jnr_3_2: string;
  mscr_Jndiff: string;
  
  // LAS
  las_strain_1_25: string;
  las_strain_2_5: string;
  las_strain_5: string;
  las_af: string;
  las_FFL: string;
  las_D: string;
  
  // BBR
  bbr_S: string;
  bbr_m: string;
  bbr_temp: string;
  
  observacoes: string;
}

// ==================== STEP 5: CONCRETO ASFÁLTICO (NOVO) ====================
interface Step5Data {
  // Propriedades Gerais
  tipoCAP: string;
  massaEspecifica: string;
  resistenciaTracao: string;
  teorAsfalto: string;
  volumeVazios: string;
  faixaGranulometrica: string;
  tmn: string;
  abrasaoLosAngeles: string;
  flowNumber: string;
  moduloResiliencia: string;
  
  // Curva de Fadiga
  curvaFadiga_n_cps: string;
  curvaFadiga_k1: string;
  curvaFadiga_k2: string;
  curvaFadiga_r2: string;
  
  // Curvas-Mestras
  sigmoidal_a: string;
  sigmoidal_b: string;
  sigmoidal_d: string;
  sigmoidal_g: string;
  sigmoidal_a1: string;
  sigmoidal_a2: string;
  sigmoidal_a3: string;
  
  // Parâmetro α
  parametro_alfa: string;
  
  // Coeficientes G²
  dano_C10: string;
  dano_C11: string;
  dano_C12: string;
  dano_a: string;
  dano_b: string;
  dano_Y: string;
  dano_Delta: string;
  
  // Einf
  einf: string;
  
  // Prony
  prony_pi: string[];
  prony_Ei: string[];
  
  // Shift Model
  shiftModel_n_cps: string;
  shiftModel_ε0: string;
  shiftModel_N1: string;
  shiftModel_β: string;
  shiftModel_p1: string;
  shiftModel_p2: string;
  shiftModel_d1: string;
  shiftModel_d2: string;
  
  observacoes: string;
}

// ==================== STEPS ORIGINAIS (JÁ EXISTEM) ====================
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
  milling: string;
  interventionAtTheBase: string;
  sami: string;
  bondingPaint: string;
  priming: string;
  images: string;
  imagesDate: string;
  structuralComposition: {
    id: number;
    layer: string;
    material: string;
    thickness: string;
  }[];
  roadName?: string;
  cityState?: string;
  experimentalLength?: string;
  guideSpeed?: string;
  iriPrerehabilitation?: string;
  atPrerehabilitation?: string;
  millingThickness?: string;
  serviceTimeYears?: string;
  serviceTimeMonths?: string;
}

// ==================== EXPORT TYPES ====================
export type BinderAsphaltConcreteData = {
  generalData: GeneralData;
  step2Data: Step2Data;
  step3Data: Step3Data;  // NOVO
  step4Data: Step4Data;  // NOVO
  step5Data: Step5Data;  // NOVO
  _id?: string;
};

export type BinderAsphaltConcreteActions = {
  setData: ({ step, key, value }: setDataType) => void;
  clearStore: () => void;
  reset: () => void;
};

const stepVariant = { 
  0: 'generalData', 
  1: 'step2Data', 
  2: 'step3Data',  // NOVO
  3: 'step4Data',  // NOVO
  4: 'step5Data'   // NOVO
};

export type setDataType = { step: number; key?: string; value: unknown };

// ==================== INITIAL STATE ====================
const initialState = {
  generalData: {
    name: null,
    zone: null,
    layer: null,
    cityState: null,
    highway: null,
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
    roadName: null,
    cityState: null,
    experimentalLength: null,
    guideSpeed: null,
    iriPrerehabilitation: null,
    atPrerehabilitation: null,
    millingThickness: null,
    serviceTimeYears: null,
    serviceTimeMonths: null,
  },
  // ==================== NOVOS STEPS ====================
  step3Data: {
    tipoTratamento: null,
    tipoEmulsao: null,
    taxaEmulsao: null,
    taxaAgregados: null,
    faixaGranulometrica: null,
    abrasaoLosAngeles: null,
    massaEspecifica: null,
    referenciaComercial: null,
    refinaria: null,
    empresaDistribuidora: null,
    dataCarregamento: null,
    numeroNotaFiscal: null,
    dataNotaFiscal: null,
    numeroCertificado: null,
    dataCertificado: null,
    viscosidadeSSF: null,
    peneiracao: null,
    residuo: null,
    cargaParticula: null,
    penetracao: null,
    recuperacaoElastica: null,
    pontoAmolecimento: null,
    observacoes: null,
  },
  step4Data: {
    referenciaComercial: null,
    refinaria: null,
    empresaDistribuidora: null,
    dataCarregamento: null,
    numeroNotaFiscal: null,
    dataNotaFiscal: null,
    numeroCertificado: null,
    dataCertificado: null,
    tipoCAP: null,
    performanceGrade: null,
    penetracao25: null,
    pontoAmolecimento: null,
    viscosidadeBrookfield_135: null,
    viscosidadeBrookfield_150: null,
    viscosidadeBrookfield_177: null,
    recuperacaoElastica: null,
    dsr_original_G_sen: null,
    dsr_original_temp: null,
    dsr_rtfot_G_sen: null,
    dsr_rtfot_temp: null,
    mscr_Jnr_3_2: null,
    mscr_Jndiff: null,
    las_strain_1_25: null,
    las_strain_2_5: null,
    las_strain_5: null,
    las_af: null,
    las_FFL: null,
    las_D: null,
    bbr_S: null,
    bbr_m: null,
    bbr_temp: null,
    observacoes: null,
  },
  step5Data: {
    tipoCAP: null,
    massaEspecifica: null,
    resistenciaTracao: null,
    teorAsfalto: null,
    volumeVazios: null,
    faixaGranulometrica: null,
    tmn: null,
    abrasaoLosAngeles: null,
    flowNumber: null,
    moduloResiliencia: null,
    curvaFadiga_n_cps: null,
    curvaFadiga_k1: null,
    curvaFadiga_k2: null,
    curvaFadiga_r2: null,
    sigmoidal_a: null,
    sigmoidal_b: null,
    sigmoidal_d: null,
    sigmoidal_g: null,
    sigmoidal_a1: null,
    sigmoidal_a2: null,
    sigmoidal_a3: null,
    parametro_alfa: null,
    dano_C10: null,
    dano_C11: null,
    dano_C12: null,
    dano_a: null,
    dano_b: null,
    dano_Y: null,
    dano_Delta: null,
    einf: null,
    prony_pi: [],
    prony_Ei: [],
    shiftModel_n_cps: null,
    shiftModel_ε0: null,
    shiftModel_N1: null,
    shiftModel_β: null,
    shiftModel_p1: null,
    shiftModel_p2: null,
    shiftModel_d1: null,
    shiftModel_d2: null,
    observacoes: null,
  },
  _id: null,
};

// ==================== STORE ====================
const useBinderAsphaltConcreteStore = create<BinderAsphaltConcreteData & BinderAsphaltConcreteActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setData: ({ step, key, value }) =>
          set((state) => {
            if (step === 4) { // Agora step 4 = step5Data (último)
              return value;
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
        name: 'binder-concrete-asphalt-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useBinderAsphaltConcreteStore;