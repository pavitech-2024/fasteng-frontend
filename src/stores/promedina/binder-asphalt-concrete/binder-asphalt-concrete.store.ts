import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

// ==================== STEP 2: TRATAMENTO SUPERFICIAL ====================
interface Step2Data {
  // Tratamento Superficial
  tipoTratamento: string;
  tipoEmulsao: string;
  taxaEmulsao: string;        // l/m²
  taxaAgregados: string;      // kg/m² por camada
  faixaGranulometrica: string;
  abrasaoLosAngeles: string;  // %
  massaEspecifica: string;    // g/cm³
  
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
  peneiracao: string;         // %
  residuo: string;            // %
  cargaParticula: string;
  penetracao: string;         // mm
  recuperacaoElastica: string; // %
  pontoAmolecimento: string;   // °C
  
  observacoes: string;
}

// ==================== STEP 3: LIGANTE ASFÁLTICO ====================
interface Step3Data {
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
  penetracao25: string;       // mm
  pontoAmolecimento: string;   // °C
  viscosidadeBrookfield_135: string;  // cP (SP21, 20rpm)
  viscosidadeBrookfield_150: string;  // cP (SP21, 50rpm)
  viscosidadeBrookfield_177: string;  // cP (SP21, 100rpm)
  recuperacaoElastica: string; // %
  dsr_original_G_sen: string;  // DSR - G*/sen(δ) (MPa)
  dsr_original_temp: string;    // Temperatura do teste (°C)
  
  // Ligante Envelhecido RTFOT
  dsr_rtfot_G_sen: string;     // DSR - G*/sen(δ) (MPa)
  dsr_rtfot_temp: string;       // Temperatura do teste (°C)
  
  // MSCR (Multiple Stress Creep Recovery)
  mscr_Jnr_3_2: string;        // Jnr 3,2 (1/kPa)
  mscr_Jndiff: string;         // Jndiff (%)
  
  // LAS (Linear Amplitude Sweep)
  las_strain_1_25: string;     // Strain 1,25% - Nº
  las_strain_2_5: string;      // Strain 2,5% - Nº
  las_strain_5: string;        // Strain 5% - Nº
  las_af: string;              // af - comprimento na trinca
  las_FFL: string;             // FFL - Fator de fadiga de ligante
  las_D: string;               // D³
  
  // Ligante Envelhecido RTFOT + PAV
  bbr_S: string;               // Módulo de rigidez S (MPa)
  bbr_m: string;               // Coeficiente angular m (MPa)
  bbr_temp: string;            // Temperatura do teste (°C)
  
  observacoes: string;
}

// ==================== STEP 4: CONCRETO ASFÁLTICO ====================
interface Step4Data {
  // Propriedades Gerais
  tipoCAP: string;
  massaEspecifica: string;     // g/cm³
  resistenciaTracao: string;   // MPa
  teorAsfalto: string;         // %
  volumeVazios: string;        // %
  faixaGranulometrica: string;
  tmn: string;                 // Tamanho Máximo Nominal (mm)
  abrasaoLosAngeles: string;   // %
  flowNumber: string;          // FN
  moduloResiliencia: string;   // Módulo de Resiliência 25°C (MPa)
  
  // Curva de Fadiga (Compressão Diametral)
  curvaFadiga_n_cps: string;   // Nº de Amostras (CPs)
  curvaFadiga_k1: string;      // Coeficiente de Regressão (k1)
  curvaFadiga_k2: string;      // Coeficiente de Regressão (k2)
  curvaFadiga_r2: string;      // Coef. de Determinação (R²)
  
  // Curvas-Mestras e Coeficientes
  sigmoidal_a: string;
  sigmoidal_b: string;
  sigmoidal_d: string;
  sigmoidal_g: string;
  sigmoidal_a1: string;
  sigmoidal_a2: string;
  sigmoidal_a3: string;
  
  // Parâmetro α de evolução do dano
  parametro_alfa: string;
  
  // Coeficientes de regressão das curvas características de dano (G²)
  dano_C10: string;
  dano_C11: string;
  dano_C12: string;
  dano_a: string;
  dano_b: string;
  dano_Y: string;
  dano_Delta: string;
  
  // Einf
  einf: string;                // kPa
  
  // Módulos de Relaxação (Prony)
  prony_pi: string[];          // array de tempos (s)
  prony_Ei: string[];          // array de módulos (kPa)
  
  // Coeficientes de regressão do shift model
  shiftModel_n_cps: string;    // Nº de Amostras (CPs)
  shiftModel_ε0: string;
  shiftModel_N1: string;
  shiftModel_β: string;
  shiftModel_p1: string;
  shiftModel_p2: string;
  shiftModel_d1: string;
  shiftModel_d2: string;
  
  observacoes: string;
}

interface GeneralData {
  name: string;
  zone: string;
  layer: string;
  cityState: string;
  highway: string;
  guideLineSpeed: string;
  observations?: string;
}

export type BinderAsphaltConcreteData = {
  generalData: GeneralData;
  step2Data: Step2Data;
  step3Data: Step3Data;
  step4Data: Step4Data;
  _id?: string;
};

export type BinderAsphaltConcreteActions = {
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
    cityState: null,
    highway: null,
    guideLineSpeed: null,
    observations: null,
  },
  step2Data: {
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
  step3Data: {
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
  step4Data: {
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

const useBinderAsphaltConcreteStore = create<BinderAsphaltConcreteData & BinderAsphaltConcreteActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setData: ({ step, key, value }) =>
          set((state) => {
            if (step === 3) {
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