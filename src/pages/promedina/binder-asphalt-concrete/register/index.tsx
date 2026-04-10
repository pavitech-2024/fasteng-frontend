import useAuth from '@/contexts/auth';
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import React, { useState } from 'react';

// ============================================
// STYLES (CSS puro)
// ============================================

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f0f2f5',
  },
  header: {
    background: '#001529',
    padding: '0 24px',
    color: 'white',
  },
  headerTitle: {
    margin: '16px 0',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  content: {
    padding: '24px',
  },
  card: {
    background: 'white',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
    border: '1px solid #f0f0f0',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #f0f0f0',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
    marginBottom: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  label: {
    marginBottom: '8px',
    fontWeight: 500,
    fontSize: '14px',
    color: '#333',
  },
  input: {
    padding: '8px 12px',
    border: '1px solid #d9d9d9',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #d9d9d9',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  textarea: {
    padding: '8px 12px',
    border: '1px solid #d9d9d9',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical' as const,
  },
  switch: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  switchButton: {
    width: '44px',
    height: '22px',
    backgroundColor: '#ccc',
    borderRadius: '22px',
    position: 'relative' as const,
    cursor: 'pointer',
    transition: '0.3s',
  },
  switchButtonActive: {
    backgroundColor: '#1677ff',
  },
  switchKnob: {
    width: '18px',
    height: '18px',
    backgroundColor: 'white',
    borderRadius: '50%',
    position: 'absolute' as const,
    top: '2px',
    left: '2px',
    transition: '0.3s',
  },
  switchKnobActive: {
    left: '24px',
  },
  button: {
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
  },
  buttonPrimary: {
    backgroundColor: '#1677ff',
    color: 'white',
  },
  buttonDefault: {
    backgroundColor: 'white',
    color: '#333',
    border: '1px solid #d9d9d9',
  },
  buttonDanger: {
    backgroundColor: '#ff4d4f',
    color: 'white',
  },
  stepsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '32px',
    borderBottom: '1px solid #f0f0f0',
    paddingBottom: '16px',
  },
  step: {
    flex: 1,
    textAlign: 'center' as const,
    padding: '8px',
    color: '#999',
    cursor: 'pointer',
  },
  stepActive: {
    color: '#1677ff',
    fontWeight: 'bold',
    borderBottom: '2px solid #1677ff',
    marginBottom: '-17px',
  },
  stepCompleted: {
    color: '#52c41a',
  },
  flexBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '24px',
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '16px',
  },
  grid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '16px',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    marginBottom: '16px',
  },
  divider: {
    height: '1px',
    backgroundColor: '#f0f0f0',
    margin: '24px 0',
  },
  subCard: {
    border: '1px solid #f0f0f0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
  },
  addButton: {
    width: '100%',
    padding: '12px',
    border: '1px dashed #d9d9d9',
    backgroundColor: '#fafafa',
    borderRadius: '6px',
    cursor: 'pointer',
    textAlign: 'center' as const,
    color: '#1677ff',
  },
  removeButton: {
    padding: '6px 12px',
    backgroundColor: '#ff4d4f',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  pre: {
    background: '#f5f5f5',
    padding: '16px',
    borderRadius: '8px',
    overflow: 'auto',
    maxHeight: '600px',
    fontSize: '12px',
  },
};

// ============================================
// STORE
// ============================================

interface GeneralData {
  name: string;
  zone: string;
  layer: string;
  cityState: string;
  highway: string;
  guideLineSpeed: string;
  observations?: string;
}

interface StructuralCompositionItem {
  id: number;
  layer: string;
  material: string;
  thickness: string;
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
  structuralComposition: StructuralCompositionItem[];
  roadName?: string;
  cityState?: string;
  experimentalLength?: string;
  guideSpeed?: string;
  iriPrerehabilitation?: string;
  atPrerehabilitation?: string;
  millingThickness?: string;
  serviceTimeYears?: string;
  serviceTimeMonths?: string;
  utilizadaMedina?: boolean;
  utilizadaLvec?: boolean;
  dadosConfirmadosICT?: boolean;
  localConfirmado?: boolean;
  fresagem?: boolean;
  kmInicial?: string;
  inicioEstaca?: string;
  inicioMetros?: string;
  fimEstaca?: string;
  numeroFaixas?: string;
  faixaMonitorada?: string;
  larguraFaixa?: string;
  tipoTratamento?: string;
  tipoEmulsao?: string;
  taxaEmulsao?: string;
  taxaAgregados?: string;
  faixaGranulometrica?: string;
  abrasaoLosAngeles?: string;
  massaEspecifica?: string;
  referenciaComercial?: string;
  refinaria?: string;
  empresaDistribuidora?: string;
  dataCarregamento?: string;
  numeroNotaFiscal?: string;
  dataNotaFiscal?: string;
  numeroCertificado?: string;
  dataCertificado?: string;
  viscosidade?: string;
  peneiracao?: string;
  residuo?: string;
  cargaParticula?: string;
  penetracao?: string;
  recuperacaoElastica?: string;
  pontoAmolecimento?: string;
  binder_tipoCAP?: string;
  binder_massaEspecifica?: string;
  binder_resistenciaTracao?: string;
  binder_teorAsfalto?: string;
  binder_volumeVazios?: string;
  binder_tmn?: string;
  binder_abrasaoLA?: string;
  binder_curvasMestras_a?: string;
  binder_curvasMestras_b?: string;
  binder_curvasMestras_d?: string;
  binder_curvasMestras_g?: string;
  binder_curvasMestras_a1?: string;
  binder_curvasMestras_a2?: string;
  binder_curvasMestras_a3?: string;
  binder_parametroAlfa?: string;
  binder_curvaDano_numAmostras?: string;
  binder_curvaDano_potencia?: string;
  binder_curvaDano_exponencial?: string;
  binder_curvaDano_c10?: string;
  binder_curvaDano_c12?: string;
  binder_curvaDano_a?: string;
  binder_curvaDano_b?: string;
  binder_curvaDano_y?: string;
  binder_curvaDano_delta?: string;
  binder_curvaFadiga_numAmostras?: string;
  binder_curvaFadiga_k1?: string;
  binder_curvaFadiga_k2?: string;
  binder_curvaFadiga_r2?: string;
  capa_tipoCAP?: string;
  capa_massaEspecifica?: string;
  capa_resistenciaTracao?: string;
  capa_teorAsfalto?: string;
  capa_volumeVazios?: string;
  capa_tmn?: string;
  capa_abrasaoLA?: string;
  capa_curvasMestras_a?: string;
  capa_curvasMestras_b?: string;
  capa_curvasMestras_d?: string;
  capa_curvasMestras_g?: string;
  capa_parametroAlfa?: string;
  capa_curvaFadiga_numAmostras?: string;
  capa_curvaFadiga_k1?: string;
  capa_curvaFadiga_k2?: string;
  capa_curvaFadiga_r2?: string;
  ligante_original_penetracao?: string;
  ligante_original_pontoAmolecimento?: string;
  ligante_original_viscosidadeBrookfield?: string;
  ligante_original_recuperacaoElastica?: string;
  ligante_original_dsr?: string;
  ligante_rtfot_dsr?: string;
  ligante_rtfot_msnrJnr?: string;
  ligante_rtfot_msnrJnrDiff?: string;
  ligante_rtfot_las?: string;
  ligante_pav_bbrModuloRigidez?: string;
  ligante_pav_bbrCoeficienteAngular?: string;
  ligante_obs_af?: string;
  ligante_obs_ffl?: string;
  ligante_obs_nf?: string;
}

interface Step3Data {
  refinery: string;
  company: string;
  collectionDate: string;
  invoiceNumber: string;
  dataInvoice: string;
  certificateDate: string;
  certificateNumber: string;
  capType: string;
  performanceGrade: string;
  penetration: string;
  softeningPoint: string;
  elasticRecovery: string;
  vb_sp21_20: string;
  vb_sp21_50: string;
  vb_sp21_100: string;
  observations: string;
}

interface Step4Data {
  granulometricRange: string;
  tmn: string;
  asphaltTenor: string;
  specificMass: string;
  volumeVoids: string;
  abrasionLA: string;
  rt: string;
  flowNumber: string;
  mr: string;
  fatigueCurve_n_cps: string;
  fatigueCurve_k1: string;
  fatigueCurve_k2: string;
  fatigueCurve_r2: string;
  observations: string;
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
    name: '',
    zone: '',
    layer: '',
    cityState: '',
    highway: '',
    guideLineSpeed: '',
    observations: '',
  },
  step2Data: {
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
    milling: '',
    interventionAtTheBase: '',
    sami: '',
    bondingPaint: '',
    priming: '',
    images: '',
    imagesDate: '',
    trafficLiberation: '',
    lastUpdate: '',
    averageAltitude: '',
    numberOfTracks: '',
    monitoredTrack: '',
    trackWidth: '',
    structuralComposition: [{ id: 0, layer: '', material: '', thickness: '' }],
    roadName: '',
    cityState: '',
    experimentalLength: '',
    guideSpeed: '',
    iriPrerehabilitation: '',
    atPrerehabilitation: '',
    millingThickness: '',
    serviceTimeYears: '',
    serviceTimeMonths: '',
    utilizadaMedina: false,
    utilizadaLvec: false,
    dadosConfirmadosICT: false,
    localConfirmado: false,
    fresagem: false,
    kmInicial: '',
    inicioEstaca: '',
    inicioMetros: '',
    fimEstaca: '',
    numeroFaixas: '',
    faixaMonitorada: '',
    larguraFaixa: '',
    tipoTratamento: '',
    tipoEmulsao: '',
    taxaEmulsao: '',
    taxaAgregados: '',
    faixaGranulometrica: '',
    abrasaoLosAngeles: '',
    massaEspecifica: '',
    referenciaComercial: '',
    refinaria: '',
    empresaDistribuidora: '',
    dataCarregamento: '',
    numeroNotaFiscal: '',
    dataNotaFiscal: '',
    numeroCertificado: '',
    dataCertificado: '',
    viscosidade: '',
    peneiracao: '',
    residuo: '',
    cargaParticula: '',
    penetracao: '',
    recuperacaoElastica: '',
    pontoAmolecimento: '',
    binder_tipoCAP: '',
    binder_massaEspecifica: '',
    binder_resistenciaTracao: '',
    binder_teorAsfalto: '',
    binder_volumeVazios: '',
    binder_tmn: '',
    binder_abrasaoLA: '',
    binder_curvasMestras_a: '',
    binder_curvasMestras_b: '',
    binder_curvasMestras_d: '',
    binder_curvasMestras_g: '',
    binder_curvasMestras_a1: '',
    binder_curvasMestras_a2: '',
    binder_curvasMestras_a3: '',
    binder_parametroAlfa: '',
    binder_curvaDano_numAmostras: '',
    binder_curvaDano_potencia: '',
    binder_curvaDano_exponencial: '',
    binder_curvaDano_c10: '',
    binder_curvaDano_c12: '',
    binder_curvaDano_a: '',
    binder_curvaDano_b: '',
    binder_curvaDano_y: '',
    binder_curvaDano_delta: '',
    binder_curvaFadiga_numAmostras: '',
    binder_curvaFadiga_k1: '',
    binder_curvaFadiga_k2: '',
    binder_curvaFadiga_r2: '',
    capa_tipoCAP: '',
    capa_massaEspecifica: '',
    capa_resistenciaTracao: '',
    capa_teorAsfalto: '',
    capa_volumeVazios: '',
    capa_tmn: '',
    capa_abrasaoLA: '',
    capa_curvasMestras_a: '',
    capa_curvasMestras_b: '',
    capa_curvasMestras_d: '',
    capa_curvasMestras_g: '',
    capa_parametroAlfa: '',
    capa_curvaFadiga_numAmostras: '',
    capa_curvaFadiga_k1: '',
    capa_curvaFadiga_k2: '',
    capa_curvaFadiga_r2: '',
    ligante_original_penetracao: '',
    ligante_original_pontoAmolecimento: '',
    ligante_original_viscosidadeBrookfield: '',
    ligante_original_recuperacaoElastica: '',
    ligante_original_dsr: '',
    ligante_rtfot_dsr: '',
    ligante_rtfot_msnrJnr: '',
    ligante_rtfot_msnrJnrDiff: '',
    ligante_rtfot_las: '',
    ligante_pav_bbrModuloRigidez: '',
    ligante_pav_bbrCoeficienteAngular: '',
    ligante_obs_af: '',
    ligante_obs_ffl: '',
    ligante_obs_nf: '',
  },
  step3Data: {
    refinery: '',
    company: '',
    collectionDate: '',
    invoiceNumber: '',
    dataInvoice: '',
    certificateDate: '',
    certificateNumber: '',
    capType: '',
    performanceGrade: '',
    penetration: '',
    softeningPoint: '',
    elasticRecovery: '',
    vb_sp21_20: '',
    vb_sp21_50: '',
    vb_sp21_100: '',
    observations: '',
  },
  step4Data: {
    granulometricRange: '',
    tmn: '',
    asphaltTenor: '',
    specificMass: '',
    volumeVoids: '',
    abrasionLA: '',
    rt: '',
    flowNumber: '',
    mr: '',
    fatigueCurve_n_cps: '',
    fatigueCurve_k1: '',
    fatigueCurve_k2: '',
    fatigueCurve_r2: '',
    observations: '',
  },
  _id: '',
};

const useBinderAsphaltConcreteStore = create<BinderAsphaltConcreteData & BinderAsphaltConcreteActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setData: ({ step, key, value }) =>
          set((state) => {
            if (step === 3) return value;
            if (key) {
              return {
                ...state,
                [stepVariant[step]]: {
                  ...state[stepVariant[step]],
                  [key]: value,
                },
              };
            }
            return { ...state, [stepVariant[step]]: value };
          }),
        reset: () => set(initialState),
        clearStore: () => {
          sessionStorage.clear();
          set(initialState);
        },
      }),
      { name: 'binder-concrete-asphalt-store', storage: createJSONStorage(() => sessionStorage) }
    )
  )
);

// ============================================
// SWITCH COMPONENT
// ============================================

const SwitchComponent = ({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label?: string }) => {
  return (
    <div style={styles.switch}>
      {label && <label style={styles.label}>{label}</label>}
      <div
        style={{ ...styles.switchButton, ...(checked ? styles.switchButtonActive : {}) }}
        onClick={() => onChange(!checked)}
      >
        <div style={{ ...styles.switchKnob, ...(checked ? styles.switchKnobActive : {}) }} />
      </div>
    </div>
  );
};

// ============================================
// STEP 1 - GENERAL DATA
// ============================================

const Step1GeneralData = () => {
  const store = useBinderAsphaltConcreteStore();
  const step = 0;

  const handleChange = (key: string, value: any) => {
    store.setData({ step, key, value });
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Dados Gerais</h2>
      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Nome</label>
          <input
            style={styles.input}
            value={store.generalData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Digite o nome"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Zona</label>
          <input
            style={styles.input}
            value={store.generalData.zone || ''}
            onChange={(e) => handleChange('zone', e.target.value)}
            placeholder="Digite a zona"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Camada</label>
          <input
            style={styles.input}
            value={store.generalData.layer || ''}
            onChange={(e) => handleChange('layer', e.target.value)}
            placeholder="Digite a camada"
          />
        </div>
      </div>
      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Cidade/Estado</label>
          <input
            style={styles.input}
            value={store.generalData.cityState || ''}
            onChange={(e) => handleChange('cityState', e.target.value)}
            placeholder="Cidade/UF"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Rodovia</label>
          <input
            style={styles.input}
            value={store.generalData.highway || ''}
            onChange={(e) => handleChange('highway', e.target.value)}
            placeholder="Rodovia/Avenida/Rua"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Velocidade Diretriz (km/h)</label>
          <input
            type="number"
            style={styles.input}
            value={store.generalData.guideLineSpeed || ''}
            onChange={(e) => handleChange('guideLineSpeed', e.target.value)}
            placeholder="Velocidade"
          />
        </div>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Observações</label>
        <textarea
          style={styles.textarea}
          rows={3}
          value={store.generalData.observations || ''}
          onChange={(e) => handleChange('observations', e.target.value)}
          placeholder="Observações..."
        />
      </div>
    </div>
  );
};

// ============================================
// STEP 2 - PAVIMENT DATA
// ============================================

const Step2PavimentData = () => {
  const store = useBinderAsphaltConcreteStore();
  const step = 1;
  const data = store.step2Data;

  const handleChange = (key: string, value: any) => {
    store.setData({ step, key, value });
  };

  const handleStructuralCompositionChange = (index: number, field: string, value: string) => {
    const newComposition = [...data.structuralComposition];
    newComposition[index] = { ...newComposition[index], [field]: value };
    handleChange('structuralComposition', newComposition);
  };

  return (
    <div>
      {/* 1. Identificação e Controle */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>1. Identificação e Controle</h2>
        <div style={styles.grid3}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Instituição</label>
            <input style={styles.input} value={data.identification || ''} onChange={(e) => handleChange('identification', e.target.value)} placeholder="Instituição" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Número do Trecho</label>
            <input style={styles.input} value={data.sectionType || ''} onChange={(e) => handleChange('sectionType', e.target.value)} placeholder="Nº do trecho" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Ano de Implantação</label>
            <input style={styles.input} value={data.observation || ''} onChange={(e) => handleChange('observation', e.target.value)} placeholder="AAAA" />
          </div>
        </div>
        <div style={styles.grid3}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tipo de Seção</label>
            <select style={styles.select} value={data.monitoringPhase || ''} onChange={(e) => handleChange('monitoringPhase', e.target.value)}>
              <option value="">Selecione</option>
              <option value="Pavimento Novo">Pavimento Novo</option>
              <option value="Reabilitacao">Reabilitação</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Fase de Monitoramento</label>
            <select style={styles.select} value={data.trafficLiberation || ''} onChange={(e) => handleChange('trafficLiberation', e.target.value)}>
              <option value="">Selecione</option>
              <option value="Pre-Execucao">Pré-Execução</option>
              <option value="Execucao">Execução</option>
              <option value="Pos-Execucao">Pós-Execução</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Liberação ao Tráfego</label>
            <input type="date" style={styles.input} value={data.lastUpdate || ''} onChange={(e) => handleChange('lastUpdate', e.target.value)} />
          </div>
        </div>
        <div style={styles.grid3}>
          <SwitchComponent
            checked={data.utilizadaMedina || false}
            onChange={(checked) => handleChange('utilizadaMedina', checked)}
            label="Utilizada na Calibração do MeDiNa"
          />
          <SwitchComponent
            checked={data.utilizadaLvec || false}
            onChange={(checked) => handleChange('utilizadaLvec', checked)}
            label="Utilizada na Calibração do LVECD"
          />
          <SwitchComponent
            checked={data.dadosConfirmadosICT || false}
            onChange={(checked) => handleChange('dadosConfirmadosICT', checked)}
            label="Dados Confirmados pela ICT"
          />
        </div>
      </div>

      {/* 2. Preparo do Pavimento */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>2. Preparo do Pavimento</h2>
        <div style={styles.grid3}>
          <div style={styles.formGroup}>
            <label style={styles.label}>IRI (m/km) Pré-Reabilitação</label>
            <input type="number" style={styles.input} value={data.iriPrerehabilitation || ''} onChange={(e) => handleChange('iriPrerehabilitation', e.target.value)} placeholder="Valor do IRI" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>AT (%) Pré-Reabilitação</label>
            <input type="number" style={styles.input} value={data.atPrerehabilitation || ''} onChange={(e) => handleChange('atPrerehabilitation', e.target.value)} placeholder="Valor do AT" />
          </div>
          <div style={styles.formGroup}>
            <SwitchComponent
              checked={data.fresagem || false}
              onChange={(checked) => handleChange('fresagem', checked)}
              label="Fresagem"
            />
            {data.fresagem && (
              <input style={{ ...styles.input, marginTop: '8px' }} placeholder="Espessura fresada (mm)" value={data.millingThickness || ''} onChange={(e) => handleChange('millingThickness', e.target.value)} />
            )}
          </div>
        </div>
        <div style={styles.grid4}>
          <SwitchComponent
            checked={data.interventionAtTheBase === 'Sim'}
            onChange={(checked) => handleChange('interventionAtTheBase', checked ? 'Sim' : 'Não')}
            label="Intervenção na base"
          />
          <SwitchComponent
            checked={data.sami === 'Sim'}
            onChange={(checked) => handleChange('sami', checked ? 'Sim' : 'Não')}
            label="SAMI"
          />
          <SwitchComponent
            checked={data.bondingPaint === 'Sim'}
            onChange={(checked) => handleChange('bondingPaint', checked ? 'Sim' : 'Não')}
            label="Pintura de ligação"
          />
          <SwitchComponent
            checked={data.priming === 'Sim'}
            onChange={(checked) => handleChange('priming', checked ? 'Sim' : 'Não')}
            label="Imprimação"
          />
        </div>
      </div>

      {/* 3. Data da última atualização */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>3. Data da última atualização</h2>
        <div style={styles.grid3}>
          <SwitchComponent
            checked={data.localConfirmado || false}
            onChange={(checked) => handleChange('localConfirmado', checked)}
            label="Local confirmado"
          />
          <div style={styles.formGroup}>
            <label style={styles.label}>Tempo em Serviço (anos)</label>
            <input type="number" style={styles.input} value={data.serviceTimeYears || ''} onChange={(e) => handleChange('serviceTimeYears', e.target.value)} placeholder="Anos" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tempo em Serviço (meses)</label>
            <input type="number" style={styles.input} value={data.serviceTimeMonths || ''} onChange={(e) => handleChange('serviceTimeMonths', e.target.value)} placeholder="Meses" />
          </div>
        </div>
      </div>

      {/* 4. Características do Local */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>4. Características do Local</h2>
        <div style={styles.grid2}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Local (nome da rodovia/avenida/rua)</label>
            <input style={styles.input} value={data.roadName || ''} onChange={(e) => handleChange('roadName', e.target.value)} placeholder="Nome da via" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Município</label>
            <input style={styles.input} value={data.cityState || ''} onChange={(e) => handleChange('cityState', e.target.value)} placeholder="Município" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Extensão (m)</label>
            <input type="number" style={styles.input} value={data.experimentalLength || ''} onChange={(e) => handleChange('experimentalLength', e.target.value)} placeholder="Extensão" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Velocidade Diretriz (km/h)</label>
            <input type="number" style={styles.input} value={data.guideSpeed || ''} onChange={(e) => handleChange('guideSpeed', e.target.value)} placeholder="Velocidade" />
          </div>
        </div>
      </div>

      {/* 5. Georreferenciamento */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>5. Georreferenciamento e Geometria</h2>
        <div style={styles.grid4}>
          <div style={styles.formGroup}>
            <label style={styles.label}>km Inicial</label>
            <input style={styles.input} value={data.kmInicial || ''} onChange={(e) => handleChange('kmInicial', e.target.value)} placeholder="km inicial" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Início - Estaca</label>
            <input style={styles.input} value={data.inicioEstaca || ''} onChange={(e) => handleChange('inicioEstaca', e.target.value)} placeholder="Estaca" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Início - Metros</label>
            <input style={styles.input} value={data.inicioMetros || ''} onChange={(e) => handleChange('inicioMetros', e.target.value)} placeholder="Metros" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Fim - Estaca</label>
            <input style={styles.input} value={data.fimEstaca || ''} onChange={(e) => handleChange('fimEstaca', e.target.value)} placeholder="Estaca final" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Altitude Média (m)</label>
            <input type="number" style={styles.input} value={data.averageAltitude || ''} onChange={(e) => handleChange('averageAltitude', e.target.value)} placeholder="Altitude" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Número de Faixas</label>
            <input type="number" style={styles.input} value={data.numeroFaixas || ''} onChange={(e) => handleChange('numeroFaixas', e.target.value)} placeholder="Nº faixas" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Faixa Monitorada</label>
            <input style={styles.input} value={data.faixaMonitorada || ''} onChange={(e) => handleChange('faixaMonitorada', e.target.value)} placeholder="Faixa" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Largura da Faixa</label>
            <input type="number" style={styles.input} value={data.larguraFaixa || ''} onChange={(e) => handleChange('larguraFaixa', e.target.value)} placeholder="Largura (m)" />
          </div>
        </div>
      </div>

      {/* 6. Composição Estrutural */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>6. Composição Estrutural (por camada)</h2>
        {data.structuralComposition.map((layer, index) => (
          <div key={layer.id} style={styles.subCard}>
            <div style={styles.grid3}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Camada</label>
                <input style={styles.input} value={layer.layer || ''} onChange={(e) => handleStructuralCompositionChange(index, 'layer', e.target.value)} placeholder="Ex: Cama, Binder, Base" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Material</label>
                <input style={styles.input} value={layer.material || ''} onChange={(e) => handleStructuralCompositionChange(index, 'material', e.target.value)} placeholder="Material" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Espessura (mm)</label>
                <input type="number" style={styles.input} value={layer.thickness || ''} onChange={(e) => handleStructuralCompositionChange(index, 'thickness', e.target.value)} placeholder="Espessura" />
              </div>
            </div>
            {index > 0 && (
              <button
                style={styles.removeButton}
                onClick={() => {
                  const newComposition = data.structuralComposition.filter((_, i) => i !== index);
                  handleChange('structuralComposition', newComposition);
                }}
              >
                Remover Camada
              </button>
            )}
          </div>
        ))}
        <button
          style={styles.addButton}
          onClick={() => {
            const newId = data.structuralComposition.length;
            handleChange('structuralComposition', [...data.structuralComposition, { id: newId, layer: '', material: '', thickness: '' }]);
          }}
        >
          + Adicionar Camada
        </button>
      </div>

      {/* 7. Tratamento Superficial */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Tratamento Superficial</h2>
        <div style={styles.grid3}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tipo de Tratamento</label>
            <input style={styles.input} value={data.tipoTratamento || ''} onChange={(e) => handleChange('tipoTratamento', e.target.value)} placeholder="Tipo" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tipo de Emulsão</label>
            <input style={styles.input} value={data.tipoEmulsao || ''} onChange={(e) => handleChange('tipoEmulsao', e.target.value)} placeholder="Tipo de emulsão" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Taxa de Emulsão (l/m²)</label>
            <input type="number" style={styles.input} value={data.taxaEmulsao || ''} onChange={(e) => handleChange('taxaEmulsao', e.target.value)} placeholder="l/m²" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Taxa de Agregados (kg/m²)</label>
            <input type="number" style={styles.input} value={data.taxaAgregados || ''} onChange={(e) => handleChange('taxaAgregados', e.target.value)} placeholder="kg/m²" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Faixa Granulométrica</label>
            <input style={styles.input} value={data.faixaGranulometrica || ''} onChange={(e) => handleChange('faixaGranulometrica', e.target.value)} placeholder="Faixa" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Abrasão Los Angeles (%)</label>
            <input type="number" style={styles.input} value={data.abrasaoLosAngeles || ''} onChange={(e) => handleChange('abrasaoLosAngeles', e.target.value)} placeholder="%" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Massa Específica (g/cm³)</label>
            <input type="number" step="0.01" style={styles.input} value={data.massaEspecifica || ''} onChange={(e) => handleChange('massaEspecifica', e.target.value)} placeholder="g/cm³" />
          </div>
        </div>

        <div style={styles.divider} />

        <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Emulsão Asfáltica</h3>
        <div style={styles.grid3}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Referência Comercial</label>
            <input style={styles.input} value={data.referenciaComercial || ''} onChange={(e) => handleChange('referenciaComercial', e.target.value)} placeholder="Referência" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Refinaria</label>
            <input style={styles.input} value={data.refinaria || ''} onChange={(e) => handleChange('refinaria', e.target.value)} placeholder="Refinaria" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Empresa Distribuidora</label>
            <input style={styles.input} value={data.empresaDistribuidora || ''} onChange={(e) => handleChange('empresaDistribuidora', e.target.value)} placeholder="Distribuidora" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Data do Carregamento</label>
            <input type="date" style={styles.input} value={data.dataCarregamento || ''} onChange={(e) => handleChange('dataCarregamento', e.target.value)} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Número da Nota Fiscal</label>
            <input style={styles.input} value={data.numeroNotaFiscal || ''} onChange={(e) => handleChange('numeroNotaFiscal', e.target.value)} placeholder="NF" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Data da Nota Fiscal</label>
            <input type="date" style={styles.input} value={data.dataNotaFiscal || ''} onChange={(e) => handleChange('dataNotaFiscal', e.target.value)} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Número do Certificado</label>
            <input style={styles.input} value={data.numeroCertificado || ''} onChange={(e) => handleChange('numeroCertificado', e.target.value)} placeholder="Certificado" />
          </div>
        </div>

        <div style={styles.divider} />

        <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Parâmetros do Material</h3>
        <div style={styles.grid4}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Viscosidade (SSF)</label>
            <input style={styles.input} value={data.viscosidade || ''} onChange={(e) => handleChange('viscosidade', e.target.value)} placeholder="SSF" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Peneiração (%)</label>
            <input type="number" style={styles.input} value={data.peneiracao || ''} onChange={(e) => handleChange('peneiracao', e.target.value)} placeholder="%" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Resíduo (%)</label>
            <input type="number" style={styles.input} value={data.residuo || ''} onChange={(e) => handleChange('residuo', e.target.value)} placeholder="%" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Carga de Partícula</label>
            <input style={styles.input} value={data.cargaParticula || ''} onChange={(e) => handleChange('cargaParticula', e.target.value)} placeholder="Carga" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Penetração (mm)</label>
            <input type="number" style={styles.input} value={data.penetracao || ''} onChange={(e) => handleChange('penetracao', e.target.value)} placeholder="mm" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Recuperação Elástica (%)</label>
            <input type="number" style={styles.input} value={data.recuperacaoElastica || ''} onChange={(e) => handleChange('recuperacaoElastica', e.target.value)} placeholder="%" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Ponto de Amolecimento (°C)</label>
            <input type="number" style={styles.input} value={data.pontoAmolecimento || ''} onChange={(e) => handleChange('pontoAmolecimento', e.target.value)} placeholder="°C" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// STEP 3 - LIGANTE ASFÁLTICO
// ============================================

const Step3LiganteAsfaltico = () => {
  const store = useBinderAsphaltConcreteStore();
  const step = 2;
  const data = store.step3Data;

  const handleChange = (key: string, value: any) => {
    store.setData({ step, key, value });
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Ligante Asfáltico - Revestimento</h2>
      <div style={styles.grid3}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Refinaria</label>
          <input style={styles.input} value={data.refinery || ''} onChange={(e) => handleChange('refinery', e.target.value)} placeholder="Refinaria" />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Empresa Distribuidora</label>
          <input style={styles.input} value={data.company || ''} onChange={(e) => handleChange('company', e.target.value)} placeholder="Distribuidora" />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Data do Carregamento</label>
          <input type="date" style={styles.input} value={data.collectionDate || ''} onChange={(e) => handleChange('collectionDate', e.target.value)} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Número da Nota Fiscal</label>
          <input style={styles.input} value={data.invoiceNumber || ''} onChange={(e) => handleChange('invoiceNumber', e.target.value)} placeholder="NF" />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Data da Nota Fiscal</label>
          <input type="date" style={styles.input} value={data.dataInvoice || ''} onChange={(e) => handleChange('dataInvoice', e.target.value)} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Número do Certificado</label>
          <input style={styles.input} value={data.certificateNumber || ''} onChange={(e) => handleChange('certificateNumber', e.target.value)} placeholder="Certificado" />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Data do Certificado</label>
          <input type="date" style={styles.input} value={data.certificateDate || ''} onChange={(e) => handleChange('certificateDate', e.target.value)} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Tipo de CAP</label>
          <input style={styles.input} value={data.capType || ''} onChange={(e) => handleChange('capType', e.target.value)} placeholder="Tipo de CAP" />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Performance Grade (PG)</label>
          <input style={styles.input} value={data.performanceGrade || ''} onChange={(e) => handleChange('performanceGrade', e.target.value)} placeholder="PG" />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Penetração (mm) - 25°C</label>
          <input type="number" step="0.1" style={styles.input} value={data.penetration || ''} onChange={(e) => handleChange('penetration', e.target.value)} placeholder="mm" />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Ponto de amolecimento (°C)</label>
          <input type="number" step="0.1" style={styles.input} value={data.softeningPoint || ''} onChange={(e) => handleChange('softeningPoint', e.target.value)} placeholder="°C" />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Recuperação elástica (%)</label>
          <input type="number" step="0.1" style={styles.input} value={data.elasticRecovery || ''} onChange={(e) => handleChange('elasticRecovery', e.target.value)} placeholder="%" />
        </div>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Observações</label>
        <textarea style={styles.textarea} rows={3} value={data.observations || ''} onChange={(e) => handleChange('observations', e.target.value)} placeholder="Observações..." />
      </div>
    </div>
  );
};

// ============================================
// STEP 4 - CONCRETO ASFÁLTICO
// ============================================

const Step4ConcretoAsfaltico = () => {
  const store = useBinderAsphaltConcreteStore();
  const step = 3;
  const data = store.step4Data;

  const handleChange = (key: string, value: any) => {
    store.setData({ step, key, value });
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Concreto Asfáltico</h2>
      <div style={styles.grid3}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Faixa Granulométrica</label>
          <input style={styles.input} value={data.granulometricRange || ''} onChange={(e) => handleChange('granulometricRange', e.target.value)} placeholder="Faixa" />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Tamanho Máximo Nominal (mm)</label>
          <input type="number" style={styles.input} value={data.tmn || ''} onChange={(e) => handleChange('tmn', e.target.value)} placeholder="TMN" />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Teor de Asfalto (%)</label>
          <input type="number" step="0.1" style={styles.input} value={data.asphaltTenor || ''} onChange={(e) => handleChange('asphaltTenor', e.target.value)} placeholder="%" />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Massa Específica (g/cm³)</label>
          <input type="number" step="0.01" style={styles.input} value={data.specificMass || ''} onChange={(e) => handleChange('specificMass', e.target.value)} placeholder="g/cm³" />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Volume de Vazios (%)</label>
          <input type="number" step="0.1" style={styles.input} value={data.volumeVoids || ''} onChange={(e) => handleChange('volumeVoids', e.target.value)} placeholder="%" />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Abrasão Los Angeles (%)</label>
          <input type="number" style={styles.input} value={data.abrasionLA || ''} onChange={(e) => handleChange('abrasionLA', e.target.value)} placeholder="%" />
        </div>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Observações</label>
        <textarea style={styles.textarea} rows={3} value={data.observations || ''} onChange={(e) => handleChange('observations', e.target.value)} placeholder="Observações..." />
      </div>
    </div>
  );
};

// ============================================
// STEP 5 - RESUMO
// ============================================

const Step5Resumo = () => {
  const store = useBinderAsphaltConcreteStore();

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Resumo do Cadastro</h2>
      <pre style={styles.pre}>
        {JSON.stringify(store, null, 2)}
      </pre>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const BinderAsphaltConcrete = () => {
  const { user } = useAuth();
  const store = useBinderAsphaltConcreteStore();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Dados Gerais', content: <Step1GeneralData /> },
    { title: 'Pavimentação', content: <Step2PavimentData /> },
    { title: 'Ligante Asfáltico', content: <Step3LiganteAsfaltico /> },
    { title: 'Concreto Asfáltico', content: <Step4ConcretoAsfaltico /> },
    { title: 'Resumo', content: <Step5Resumo /> },
  ];

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      alert('Cadastro salvo com sucesso! Verifique o console para ver os dados.');
      console.log('Dados salvos:', store);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Cadastro de Pavimentação</h1>
      </div>
      <div style={styles.content}>
        <div style={styles.card}>
          <div style={styles.stepsContainer}>
            {steps.map((step, index) => (
              <div
                key={step.title}
                style={{
                  ...styles.step,
                  ...(currentStep === index ? styles.stepActive : {}),
                  ...(currentStep > index ? styles.stepCompleted : {}),
                }}
                onClick={() => setCurrentStep(index)}
              >
                {step.title}
              </div>
            ))}
          </div>
          {steps[currentStep].content}
          <div style={styles.flexBetween}>
            <button
              style={{ ...styles.button, ...styles.buttonDefault, visibility: currentStep === 0 ? 'hidden' : 'visible' }}
              onClick={prev}
            >
              Anterior
            </button>
            <button
              style={{ ...styles.button, ...styles.buttonPrimary }}
              onClick={next}
            >
              {currentStep === steps.length - 1 ? 'Salvar' : 'Próximo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
  
export default BinderAsphaltConcrete;