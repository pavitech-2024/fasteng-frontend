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
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '16px',
    marginTop: '8px',
    color: '#1677ff',
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
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    marginBottom: '16px',
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
  summarySection: {
    marginBottom: '24px',
  },
  summarySubtitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '1px solid #e8e8e8',
    color: '#1677ff',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '12px',
    marginBottom: '16px',
  },
  summaryItem: {
    display: 'flex',
    padding: '8px 0',
    borderBottom: '1px solid #f5f5f5',
  },
  summaryLabel: {
    width: '180px',
    fontWeight: 500,
    color: '#666',
    fontSize: '13px',
  },
  summaryValue: {
    flex: 1,
    color: '#333',
    fontSize: '13px',
    wordBreak: 'break-word' as const,
  },
  summaryEmpty: {
    color: '#999',
    fontStyle: 'italic',
  },
  summaryCard: {
    background: '#fafafa',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '12px',
  },
  layerCard: {
    background: '#f5f5f5',
    borderRadius: '6px',
    padding: '10px',
    marginBottom: '8px',
    borderLeft: '3px solid #1677ff',
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
};

// ============================================
// STORE
// ============================================

interface GeneralData {
  // Dados Gerais (mantido para compatibilidade)
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
  // IDENTIFICAÇÃO
  tipoSecao: string;
  faseMonitoramento: string;
  liberacaoTrafego: string;
  utilizadaMedina: boolean;
  utilizadaLvec: boolean;
  dadosConfirmadosICT: boolean;
  observacoes: string;
  
  // PREPARO DO PAVIMENTO
  iriPrerehabilitation: string;
  atPrerehabilitation: string;
  fresagem: boolean;
  espessuraFresagem: string;
  intervencaoBase: boolean;
  sami: boolean;
  pinturaLigacao: boolean;
  imprimacao: boolean;
  
  // DATA DA ÚLTIMA ATUALIZAÇÃO
  dataUltimaAtualizacao: string;
  tempoServicoMeses: string;
  
  // CARACTERÍSTICAS
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
  
  // COMPOSIÇÃO ESTRUTURAL
  structuralComposition: StructuralCompositionItem[];
  
  // Campos antigos mantidos para compatibilidade
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
  bondingPaint: string;
  priming: string;
  images: string;
  imagesDate: string;
  roadName?: string;
  cityState?: string;
  experimentalLength?: string;
  guideSpeed?: string;
  millingThickness?: string;
  serviceTimeYears?: string;
  serviceTimeMonths?: string;
  localConfirmado?: boolean;
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
    // IDENTIFICAÇÃO
    tipoSecao: '',
    faseMonitoramento: '',
    liberacaoTrafego: '',
    utilizadaMedina: false,
    utilizadaLvec: false,
    dadosConfirmadosICT: false,
    observacoes: '',
    
    // PREPARO DO PAVIMENTO
    iriPrerehabilitation: '',
    atPrerehabilitation: '',
    fresagem: false,
    espessuraFresagem: '',
    intervencaoBase: false,
    sami: false,
    pinturaLigacao: false,
    imprimacao: false,
    
    // DATA DA ÚLTIMA ATUALIZAÇÃO
    dataUltimaAtualizacao: '',
    tempoServicoMeses: '',
    
    // CARACTERÍSTICAS
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
    
    // COMPOSIÇÃO ESTRUTURAL
    structuralComposition: [
      { id: 0, layer: 'Capa', material: '', thickness: '' },
      { id: 1, layer: 'Binder', material: '', thickness: '' },
      { id: 2, layer: 'TSD', material: '', thickness: '' },
      { id: 3, layer: 'Base', material: '', thickness: '' },
      { id: 4, layer: 'Sub-base', material: '', thickness: '' },
      { id: 5, layer: 'Reforço do Subleito', material: '', thickness: '' },
    ],
    
    // Campos antigos (compatibilidade)
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
    lastUpdate: '',
    trackWidth: '',
    milling: '',
    interventionAtTheBase: '',
    bondingPaint: '',
    priming: '',
    images: '',
    imagesDate: '',
    roadName: '',
    cityState: '',
    experimentalLength: '',
    guideSpeed: '',
    millingThickness: '',
    serviceTimeYears: '',
    serviceTimeMonths: '',
    localConfirmado: false,
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
// STEP 1 - PAVIMENT DATA (conforme as imagens)
// ============================================

const Step1PavimentData = () => {
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
      {/* ============================================ */}
      {/* IDENTIFICAÇÃO */}
      {/* ============================================ */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>IDENTIFICAÇÃO</h2>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>TIPO DE SEÇÃO</label>
          <select 
            style={styles.select} 
            value={data.tipoSecao || ''} 
            onChange={(e) => handleChange('tipoSecao', e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="Pavimento Novo">Pavimento Novo</option>
            <option value="Reabilitacao">Reabilitação</option>
          </select>
        </div>

        <div style={{ ...styles.grid2, marginTop: '16px', marginBottom: '16px' }}>
          <div style={styles.formGroup}>
            <label style={styles.label}>FASE DE MONITORAMENTO</label>
            <select 
              style={styles.select} 
              value={data.faseMonitoramento || ''} 
              onChange={(e) => handleChange('faseMonitoramento', e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="Pre-Execucao">Pré-Execução</option>
              <option value="Execucao">Execução</option>
              <option value="Pos-Execucao">Pós-Execução</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>LIBERAÇÃO AO TRÁFEGO</label>
            <input 
              type="date" 
              style={styles.input} 
              value={data.liberacaoTrafego || ''} 
              onChange={(e) => handleChange('liberacaoTrafego', e.target.value)} 
            />
          </div>
        </div>

        <div style={{ ...styles.grid3, marginBottom: '16px' }}>
          <SwitchComponent
            checked={data.utilizadaMedina || false}
            onChange={(checked) => handleChange('utilizadaMedina', checked)}
            label="UTILIZADA NA CALIBRAÇÃO DO MeDiNa"
          />
          <SwitchComponent
            checked={data.utilizadaLvec || false}
            onChange={(checked) => handleChange('utilizadaLvec', checked)}
            label="UTILIZADA NA CALIBRAÇÃO DO LVECD"
          />
          <SwitchComponent
            checked={data.dadosConfirmadosICT || false}
            onChange={(checked) => handleChange('dadosConfirmadosICT', checked)}
            label="DADOS CONFIRMADOS PELA ICT"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>OBSERVAÇÕES</label>
          <textarea 
            style={styles.textarea} 
            rows={3} 
            value={data.observacoes || ''} 
            onChange={(e) => handleChange('observacoes', e.target.value)} 
            placeholder="Observações..." 
          />
        </div>
      </div>

      {/* ============================================ */}
      {/* PREPARO DO PAVIMENTO */}
      {/* ============================================ */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>PREPARO DO PAVIMENTO</h2>
        
        <div style={styles.grid2}>
          <div style={styles.formGroup}>
            <label style={styles.label}>IRI (m/km) Pré-Reabilitação</label>
            <input 
              type="number" 
              style={styles.input} 
              value={data.iriPrerehabilitation || ''} 
              onChange={(e) => handleChange('iriPrerehabilitation', e.target.value)} 
              placeholder="Valor do IRI" 
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>AT (%) Pré-Reabilitação</label>
            <input 
              type="number" 
              style={styles.input} 
              value={data.atPrerehabilitation || ''} 
              onChange={(e) => handleChange('atPrerehabilitation', e.target.value)} 
              placeholder="Valor do AT" 
            />
          </div>
        </div>

        <div style={{ ...styles.grid2, marginTop: '16px' }}>
          <div>
            <SwitchComponent
              checked={data.fresagem || false}
              onChange={(checked) => handleChange('fresagem', checked)}
              label="FRESAGEM"
            />
            {data.fresagem && (
              <input 
                style={{ ...styles.input, marginTop: '8px' }} 
                placeholder="Espessura fresada (mm)" 
                value={data.espessuraFresagem || ''} 
                onChange={(e) => handleChange('espessuraFresagem', e.target.value)} 
              />
            )}
          </div>
          <SwitchComponent
            checked={data.intervencaoBase || false}
            onChange={(checked) => handleChange('intervencaoBase', checked)}
            label="INTERVENÇÃO NA BASE"
          />
          <SwitchComponent
            checked={data.sami || false}
            onChange={(checked) => handleChange('sami', checked)}
            label="SAMI"
          />
          <SwitchComponent
            checked={data.pinturaLigacao || false}
            onChange={(checked) => handleChange('pinturaLigacao', checked)}
            label="PINTURA DE LIGAÇÃO"
          />
          <SwitchComponent
            checked={data.imprimacao || false}
            onChange={(checked) => handleChange('imprimacao', checked)}
            label="IMPRIMAÇÃO"
          />
        </div>
      </div>

      {/* ============================================ */}
      {/* DATA DA ÚLTIMA ATUALIZAÇÃO */}
      {/* ============================================ */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>DATA DA ÚLTIMA ATUALIZAÇÃO</h2>
        
        <div style={styles.grid2}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Data da última atualização</label>
            <input 
              type="date" 
              style={styles.input} 
              value={data.dataUltimaAtualizacao || ''} 
              onChange={(e) => handleChange('dataUltimaAtualizacao', e.target.value)} 
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tempo em Serviço (meses)</label>
            <input 
              type="number" 
              style={styles.input} 
              value={data.tempoServicoMeses || ''} 
              onChange={(e) => handleChange('tempoServicoMeses', e.target.value)} 
              placeholder="Meses" 
            />
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* CARACTERÍSTICAS */}
      {/* ============================================ */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>CARACTERÍSTICAS</h2>
        
        <div style={styles.grid2}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Local (rodovia/avenida)</label>
            <input 
              style={styles.input} 
              value={data.local || ''} 
              onChange={(e) => handleChange('local', e.target.value)} 
              placeholder="Nome da via" 
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Município/Estado</label>
            <input 
              style={styles.input} 
              value={data.municipioEstado || ''} 
              onChange={(e) => handleChange('municipioEstado', e.target.value)} 
              placeholder="Cidade/UF" 
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Extensão (m)</label>
            <input 
              type="number" 
              style={styles.input} 
              value={data.extensao || ''} 
              onChange={(e) => handleChange('extensao', e.target.value)} 
              placeholder="Extensão em metros" 
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Velocidade Diretriz da Via (km/h)</label>
            <input 
              type="number" 
              style={styles.input} 
              value={data.velocidadeDiretriz || ''} 
              onChange={(e) => handleChange('velocidadeDiretriz', e.target.value)} 
              placeholder="Velocidade" 
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>km Inicial</label>
            <input 
              style={styles.input} 
              value={data.kmInicial || ''} 
              onChange={(e) => handleChange('kmInicial', e.target.value)} 
              placeholder="km inicial" 
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>km Final</label>
            <input 
              style={styles.input} 
              value={data.kmFinal || ''} 
              onChange={(e) => handleChange('kmFinal', e.target.value)} 
              placeholder="km final" 
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Início - Estaca</label>
            <input 
              style={styles.input} 
              value={data.inicioEstaca || ''} 
              onChange={(e) => handleChange('inicioEstaca', e.target.value)} 
              placeholder="Estaca" 
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Início - Metros</label>
            <input 
              style={styles.input} 
              value={data.inicioMetros || ''} 
              onChange={(e) => handleChange('inicioMetros', e.target.value)} 
              placeholder="Metros" 
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Fim - Estaca</label>
            <input 
              style={styles.input} 
              value={data.fimEstaca || ''} 
              onChange={(e) => handleChange('fimEstaca', e.target.value)} 
              placeholder="Estaca final" 
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Fim - Metros</label>
            <input 
              style={styles.input} 
              value={data.fimMetros || ''} 
              onChange={(e) => handleChange('fimMetros', e.target.value)} 
              placeholder="Metros finais" 
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Altitude Média (m) (NORTE/SUL / LESTE/OESTE)</label>
            <input 
              type="number" 
              style={styles.input} 
              value={data.altitudeMedia || ''} 
              onChange={(e) => handleChange('altitudeMedia', e.target.value)} 
              placeholder="Altitude" 
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Número de Faixas</label>
            <input 
              type="number" 
              style={styles.input} 
              value={data.numeroFaixas || ''} 
              onChange={(e) => handleChange('numeroFaixas', e.target.value)} 
              placeholder="Nº faixas" 
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Faixa Monitorada</label>
            <input 
              style={styles.input} 
              value={data.faixaMonitorada || ''} 
              onChange={(e) => handleChange('faixaMonitorada', e.target.value)} 
              placeholder="Faixa" 
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Largura da Faixa (m)</label>
            <input 
              type="number" 
              style={styles.input} 
              value={data.larguraFaixa || ''} 
              onChange={(e) => handleChange('larguraFaixa', e.target.value)} 
              placeholder="Largura" 
            />
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* COMPOSIÇÃO ESTRUTURAL */}
      {/* ============================================ */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>COMPOSIÇÃO ESTRUTURAL</h2>
        
        <div style={styles.grid2}>
          {data.structuralComposition.map((layer, index) => (
            <div key={layer.id} style={styles.subCard}>
              <div style={styles.formGroup}>
                <label style={styles.label}>{layer.layer} - Material</label>
                <input 
                  style={styles.input} 
                  value={layer.material || ''} 
                  onChange={(e) => handleStructuralCompositionChange(index, 'material', e.target.value)} 
                  placeholder="Material" 
                />
              </div>
              <div style={{ ...styles.formGroup, marginTop: '8px' }}>
                <label style={styles.label}>{layer.layer} - Espessura (mm)</label>
                <input 
                  type="number" 
                  style={styles.input} 
                  value={layer.thickness || ''} 
                  onChange={(e) => handleStructuralCompositionChange(index, 'thickness', e.target.value)} 
                  placeholder="Espessura" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// STEP 2 - LIGANTE ASFÁLTICO (antigo step3)
// ============================================

const Step2LiganteAsfaltico = () => {
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
// STEP 3 - CONCRETO ASFÁLTICO (antigo step4)
// ============================================

const Step3ConcretoAsfaltico = () => {
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
// STEP 4 - RESUMO (VERSÃO ORGANIZADA)
// ============================================

const Step4Resumo = () => {
  const store = useBinderAsphaltConcreteStore();
  const { step2Data, step3Data, step4Data } = store;

  const formatValue = (value: any): string => {
    if (value === undefined || value === null || value === '') return '—';
    if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
    return String(value);
  };

  const renderSummarySection = (title: string, data: Record<string, any>, fieldsToShow: string[], labels: Record<string, string>) => {
    const hasData = fieldsToShow.some(field => data[field] && data[field] !== '' && data[field] !== false);
    
    if (!hasData) return null;

    return (
      <div style={styles.summarySection}>
        <h3 style={styles.summarySubtitle}>{title}</h3>
        <div style={styles.summaryGrid}>
          {fieldsToShow.map((field) => {
            const value = data[field];
            if (value === undefined || value === null || value === '' || value === false) return null;
            return (
              <div key={field} style={styles.summaryItem}>
                <div style={styles.summaryLabel}>{labels[field] || field}:</div>
                <div style={styles.summaryValue}>{formatValue(value)}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Definição dos campos para cada seção
  const identificacaoFields = [
    'tipoSecao', 'faseMonitoramento', 'liberacaoTrafego',
    'utilizadaMedina', 'utilizadaLvec', 'dadosConfirmadosICT', 'observacoes'
  ];

  const identificacaoLabels = {
    tipoSecao: 'Tipo de Seção', faseMonitoramento: 'Fase de Monitoramento',
    liberacaoTrafego: 'Liberação ao Tráfego', utilizadaMedina: 'Utilizada no MeDiNa',
    utilizadaLvec: 'Utilizada no LVECD', dadosConfirmadosICT: 'Dados Confirmados pela ICT',
    observacoes: 'Observações'
  };

  const preparoFields = [
    'iriPrerehabilitation', 'atPrerehabilitation', 'fresagem', 'espessuraFresagem',
    'intervencaoBase', 'sami', 'pinturaLigacao', 'imprimacao'
  ];

  const preparoLabels = {
    iriPrerehabilitation: 'IRI Pré-Reabilitação (m/km)', atPrerehabilitation: 'AT Pré-Reabilitação (%)',
    fresagem: 'Fresagem', espessuraFresagem: 'Espessura Fresagem (mm)',
    intervencaoBase: 'Intervenção na Base', sami: 'SAMI',
    pinturaLigacao: 'Pintura de Ligação', imprimacao: 'Imprimação'
  };

  const atualizacaoFields = ['dataUltimaAtualizacao', 'tempoServicoMeses'];

  const atualizacaoLabels = {
    dataUltimaAtualizacao: 'Data da Última Atualização', tempoServicoMeses: 'Tempo em Serviço (meses)'
  };

  const caracteristicasFields = [
    'local', 'municipioEstado', 'extensao', 'velocidadeDiretriz',
    'kmInicial', 'kmFinal', 'inicioEstaca', 'inicioMetros', 'fimEstaca', 'fimMetros',
    'altitudeMedia', 'numeroFaixas', 'faixaMonitorada', 'larguraFaixa'
  ];

  const caracteristicasLabels = {
    local: 'Local', municipioEstado: 'Município/Estado', extensao: 'Extensão (m)',
    velocidadeDiretriz: 'Velocidade Diretriz (km/h)', kmInicial: 'km Inicial',
    kmFinal: 'km Final', inicioEstaca: 'Início - Estaca', inicioMetros: 'Início - Metros',
    fimEstaca: 'Fim - Estaca', fimMetros: 'Fim - Metros', altitudeMedia: 'Altitude Média (m)',
    numeroFaixas: 'Número de Faixas', faixaMonitorada: 'Faixa Monitorada', larguraFaixa: 'Largura da Faixa (m)'
  };

  const liganteFields = [
    'refinery', 'company', 'collectionDate', 'invoiceNumber', 'dataInvoice',
    'certificateNumber', 'certificateDate', 'capType', 'performanceGrade',
    'penetration', 'softeningPoint', 'elasticRecovery', 'observations'
  ];

  const liganteLabels = {
    refinery: 'Refinaria', company: 'Empresa Distribuidora', collectionDate: 'Data do Carregamento',
    invoiceNumber: 'Número da Nota Fiscal', dataInvoice: 'Data da Nota Fiscal',
    certificateNumber: 'Número do Certificado', certificateDate: 'Data do Certificado',
    capType: 'Tipo de CAP', performanceGrade: 'Performance Grade (PG)',
    penetration: 'Penetração (mm) - 25°C', softeningPoint: 'Ponto de Amolecimento (°C)',
    elasticRecovery: 'Recuperação Elástica (%)', observations: 'Observações'
  };

  const concretoFields = [
    'granulometricRange', 'tmn', 'asphaltTenor', 'specificMass', 'volumeVoids', 'abrasionLA', 'observations'
  ];

  const concretoLabels = {
    granulometricRange: 'Faixa Granulométrica', tmn: 'TMN (mm)', asphaltTenor: 'Teor de Asfalto (%)',
    specificMass: 'Massa Específica (g/cm³)', volumeVoids: 'Volume de Vazios (%)',
    abrasionLA: 'Abrasão Los Angeles (%)', observations: 'Observações'
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Resumo do Cadastro</h2>
      
      {/* IDENTIFICAÇÃO */}
      {renderSummarySection('🔖 IDENTIFICAÇÃO', step2Data, identificacaoFields, identificacaoLabels)}
      
      {/* PREPARO DO PAVIMENTO */}
      {renderSummarySection('🔧 PREPARO DO PAVIMENTO', step2Data, preparoFields, preparoLabels)}
      
      {/* DATA DA ÚLTIMA ATUALIZAÇÃO */}
      {renderSummarySection('📅 DATA DA ÚLTIMA ATUALIZAÇÃO', step2Data, atualizacaoFields, atualizacaoLabels)}
      
      {/* CARACTERÍSTICAS */}
      {renderSummarySection('📍 CARACTERÍSTICAS', step2Data, caracteristicasFields, caracteristicasLabels)}
      
      {/* COMPOSIÇÃO ESTRUTURAL */}
      {step2Data.structuralComposition && step2Data.structuralComposition.some(l => l.material || l.thickness) && (
        <div style={styles.summarySection}>
          <h3 style={styles.summarySubtitle}>🏗️ COMPOSIÇÃO ESTRUTURAL</h3>
          {step2Data.structuralComposition.map((layer, idx) => (
            (layer.material || layer.thickness) && (
              <div key={idx} style={styles.layerCard}>
                <div style={styles.summaryItem}>
                  <div style={styles.summaryLabel}>{layer.layer}:</div>
                  <div style={styles.summaryValue}>
                    {layer.material || '—'} {layer.thickness ? `(${layer.thickness} mm)` : ''}
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      )}
      
      {/* LIGANTE ASFÁLTICO */}
      {renderSummarySection('🛢️ LIGANTE ASFÁLTICO', step3Data, liganteFields, liganteLabels)}
      
      {/* CONCRETO ASFÁLTICO */}
      {renderSummarySection('🪨 CONCRETO ASFÁLTICO', step4Data, concretoFields, concretoLabels)}
      
      {/* Indicador de dados vazios */}
      {!step2Data.tipoSecao && !step3Data.refinery && !step4Data.granulometricRange && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          Nenhum dado cadastrado ainda. Preencha os formulários para ver o resumo.
        </div>
      )}
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
    { title: 'Pavimentação', content: <Step1PavimentData /> },
    { title: 'Ligante Asfáltico', content: <Step2LiganteAsfaltico /> },
    { title: 'Concreto Asfáltico', content: <Step3ConcretoAsfaltico /> },
    { title: 'Resumo', content: <Step4Resumo /> },
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

