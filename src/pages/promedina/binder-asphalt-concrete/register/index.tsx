import useAuth from '@/contexts/auth';
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Save, Delete, Add } from '@mui/icons-material';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';

// ============================================
// TEMA PRO-MEDINA (VERDE)
// ============================================

const proMedinaTheme = createTheme({
  palette: {
    primary: {
      main: '#07B811',
      light: '#4caf50',
      dark: '#05990e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1a237e',
      light: '#283593',
      dark: '#0d1757',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F2F2F2',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Segoe UI', sans-serif",
    h4: {
      fontWeight: 700,
      fontSize: '1.75rem',
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    body1: {
      fontSize: '0.9rem',
    },
    body2: {
      fontSize: '0.8rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'uppercase',
          fontWeight: 600,
          fontSize: '0.8rem',
        },
        containedPrimary: {
          background: '#07B811',
          boxShadow: 'none',
          '&:hover': {
            background: '#05990e',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: 'none',
          border: '1px solid #e0e0e0',
        },
      },
    },
  },
});

// ============================================
// STORE (ZUSTAND) - COMPLETO
// ============================================

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
  
  // ============================================
  // CAMPOS ANTIGOS - COMPATIBILIDADE
  // ============================================
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
  roadName: string;
  cityState: string;
  experimentalLength: string;
  guideSpeed: string;
  millingThickness: string;
  serviceTimeYears: string;
  serviceTimeMonths: string;
  localConfirmado: boolean;
  tipoTratamento: string;
  tipoEmulsao: string;
  taxaEmulsao: string;
  taxaAgregados: string;
  faixaGranulometrica: string;
  abrasaoLosAngeles: string;
  massaEspecifica: string;
  referenciaComercial: string;
  refinaria: string;
  empresaDistribuidora: string;
  dataCarregamento: string;
  numeroNotaFiscal: string;
  dataNotaFiscal: string;
  numeroCertificado: string;
  dataCertificado: string;
  viscosidade: string;
  peneiracao: string;
  residuo: string;
  cargaParticula: string;
  penetracao: string;
  recuperacaoElastica: string;
  pontoAmolecimento: string;
  binder_tipoCAP: string;
  binder_massaEspecifica: string;
  binder_resistenciaTracao: string;
  binder_teorAsfalto: string;
  binder_volumeVazios: string;
  binder_tmn: string;
  binder_abrasaoLA: string;
  binder_curvasMestras_a: string;
  binder_curvasMestras_b: string;
  binder_curvasMestras_d: string;
  binder_curvasMestras_g: string;
  binder_curvasMestras_a1: string;
  binder_curvasMestras_a2: string;
  binder_curvasMestras_a3: string;
  binder_parametroAlfa: string;
  binder_curvaDano_numAmostras: string;
  binder_curvaDano_potencia: string;
  binder_curvaDano_exponencial: string;
  binder_curvaDano_c10: string;
  binder_curvaDano_c12: string;
  binder_curvaDano_a: string;
  binder_curvaDano_b: string;
  binder_curvaDano_y: string;
  binder_curvaDano_delta: string;
  binder_curvaFadiga_numAmostras: string;
  binder_curvaFadiga_k1: string;
  binder_curvaFadiga_k2: string;
  binder_curvaFadiga_r2: string;
  capa_tipoCAP: string;
  capa_massaEspecifica: string;
  capa_resistenciaTracao: string;
  capa_teorAsfalto: string;
  capa_volumeVazios: string;
  capa_tmn: string;
  capa_abrasaoLA: string;
  capa_curvasMestras_a: string;
  capa_curvasMestras_b: string;
  capa_curvasMestras_d: string;
  capa_curvasMestras_g: string;
  capa_parametroAlfa: string;
  capa_curvaFadiga_numAmostras: string;
  capa_curvaFadiga_k1: string;
  capa_curvaFadiga_k2: string;
  capa_curvaFadiga_r2: string;
  ligante_original_penetracao: string;
  ligante_original_pontoAmolecimento: string;
  ligante_original_viscosidadeBrookfield: string;
  ligante_original_recuperacaoElastica: string;
  ligante_original_dsr: string;
  ligante_rtfot_dsr: string;
  ligante_rtfot_msnrJnr: string;
  ligante_rtfot_msnrJnrDiff: string;
  ligante_rtfot_las: string;
  ligante_pav_bbrModuloRigidez: string;
  ligante_pav_bbrCoeficienteAngular: string;
  ligante_obs_af: string;
  ligante_obs_ffl: string;
  ligante_obs_nf: string;
  [key: string]: any;
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
  [key: string]: any;
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
  [key: string]: any;
}

interface BinderAsphaltConcreteData {
  generalData: any;
  step2Data: Step2Data;
  step3Data: Step3Data;
  step4Data: Step4Data;
  _id?: string;
}

interface BinderAsphaltConcreteActions {
  setData: ({ step, key, value }: { step: number; key?: string; value: unknown }) => void;
  reset: () => void;
  clearStore: () => void;
}

const stepVariant = { 0: 'generalData', 1: 'step2Data', 2: 'step3Data', 3: 'step4Data' };

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
    tipoSecao: '',
    faseMonitoramento: '',
    liberacaoTrafego: '',
    utilizadaMedina: false,
    utilizadaLvec: false,
    dadosConfirmadosICT: false,
    observacoes: '',
    iriPrerehabilitation: '',
    atPrerehabilitation: '',
    fresagem: false,
    espessuraFresagem: '',
    intervencaoBase: false,
    sami: false,
    pinturaLigacao: false,
    imprimacao: false,
    dataUltimaAtualizacao: '',
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
    structuralComposition: [
      { id: 0, layer: 'Capa', material: '', thickness: '' },
      { id: 1, layer: 'Binder', material: '', thickness: '' },
      { id: 2, layer: 'TSD', material: '', thickness: '' },
      { id: 3, layer: 'Base', material: '', thickness: '' },
      { id: 4, layer: 'Sub-base', material: '', thickness: '' },
      { id: 5, layer: 'Reforço do Subleito', material: '', thickness: '' },
    ],
    // Campos antigos
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
// STEP 1 - PAVIMENTAÇÃO (COMPLETO)
// ============================================

const Step1PavimentData = () => {
  const store = useBinderAsphaltConcreteStore();
  const step = 1;
  const data = store.step2Data;

  const simNaoOptions = [
    { value: 'Sim', label: 'SIM' },
    { value: 'Não', label: 'NÃO' },
  ];

  const tipoSecaoOptions = [
    { value: 'Pavimento Novo', label: 'PAVIMENTO NOVO' },
    { value: 'Reabilitacao', label: 'REABILITAÇÃO' },
  ];

  const faseMonitoramentoOptions = [
    { value: 'Pre-Execucao', label: 'PRÉ-EXECUÇÃO' },
    { value: 'Execucao', label: 'EXECUÇÃO' },
    { value: 'Pos-Execucao', label: 'PÓS-EXECUÇÃO' },
  ];

  const tipoCamadaOptions = [
    { value: 'Capa', label: 'CAPA' },
    { value: 'Binder', label: 'BINDER' },
    { value: 'TSD', label: 'TSD' },
    { value: 'Base', label: 'BASE' },
    { value: 'Sub-base', label: 'SUB-BASE' },
    { value: 'Reforço do Subleito', label: 'REFORÇO DO SUBLEITO' },
  ];

  const handleChange = (key: string, value: any) => {
    store.setData({ step, key, value });
  };

  const renderTextField = (key: string, label: string, value: any, type = 'text', multiline = false) => (
    <TextField
      variant="standard"
      type={type}
      label={label}
      value={value || ''}
      multiline={multiline}
      rows={multiline ? 3 : 1}
      InputLabelProps={type === 'date' ? { shrink: true } : undefined}
      onChange={(e) => handleChange(key, e.target.value)}
      InputProps={{
        inputProps: { style: { textTransform: 'uppercase' } }
      }}
      sx={{ width: 'calc(50% - 10px)' }}
    />
  );

  const renderSelect = (key: string, label: string, value: any, options: { value: string; label: string }[]) => (
    <FormControl variant="standard" sx={{ width: 'calc(50% - 10px)' }}>
      <InputLabel sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{label}</InputLabel>
      <Select
        value={value || ''}
        label={label}
        onChange={(e) => handleChange(key, e.target.value)}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const renderSwitch = (key: string, label: string, value: boolean) => (
    <FormControlLabel
      control={
        <Switch
          checked={value || false}
          onChange={(e) => handleChange(key, e.target.checked)}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: '#07B811',
              '&:hover': { backgroundColor: 'rgba(7, 184, 17, 0.08)' },
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: '#07B811',
            },
          }}
        />
      }
      label={label}
      sx={{ width: 'calc(50% - 10px)' }}
    />
  );

  // Funções para composição estrutural
  const adicionarCamada = () => {
    const camadasAtuais = [...data.structuralComposition];
    const novaCamada = { id: Date.now(), layer: '', material: '', thickness: '' };
    handleChange('structuralComposition', [...camadasAtuais, novaCamada]);
  };

  const removerCamada = (index: number) => {
    const camadasAtuais = [...data.structuralComposition];
    camadasAtuais.splice(index, 1);
    handleChange('structuralComposition', camadasAtuais);
  };

  const atualizarCamada = (index: number, campo: string, valor: string) => {
    const camadasAtuais = [...data.structuralComposition];
    camadasAtuais[index] = { ...camadasAtuais[index], [campo]: valor };
    handleChange('structuralComposition', camadasAtuais);
  };

  return (
    <Stack spacing={3}>
      {/* CARD 1: IDENTIFICAÇÃO */}
      <FlexColumnBorder title="IDENTIFICAÇÃO" open={true} theme="#07B811">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', mb: 2 }}>
          {renderSelect('tipoSecao', 'TIPO DE SEÇÃO', data.tipoSecao, tipoSecaoOptions)}
          {renderSelect('faseMonitoramento', 'FASE DE MONITORAMENTO', data.faseMonitoramento, faseMonitoramentoOptions)}
          {renderTextField('liberacaoTrafego', 'LIBERAÇÃO AO TRÁFEGO', data.liberacaoTrafego, 'date')}
          {renderSwitch('utilizadaMedina', 'UTILIZADA NA CALIBRAÇÃO DO MeDiNa', data.utilizadaMedina)}
          {renderSwitch('utilizadaLvec', 'UTILIZADA NA CALIBRAÇÃO DO LVECD', data.utilizadaLvec)}
          {renderSwitch('dadosConfirmadosICT', 'DADOS CONFIRMADOS PELA ICT', data.dadosConfirmadosICT)}
          {renderTextField('observacoes', 'OBSERVAÇÕES', data.observacoes, 'text', true)}
          
          {/* Campos antigos de compatibilidade */}
          {renderTextField('identification', 'INSTITUIÇÃO + NÚMERO DO TRECHO', data.identification)}
          {renderSelect('sectionType', 'TIPO DE SEÇÃO (ANTIGO)', data.sectionType, tipoSecaoOptions)}
          {renderSelect('monitoringPhase', 'FASE DE MONITORAMENTO (ANTIGO)', data.monitoringPhase, faseMonitoramentoOptions)}
          {renderTextField('trafficLiberation', 'LIBERAÇÃO AO TRÁFEGO (ANTIGO)', data.trafficLiberation, 'date')}
          {renderTextField('observation', 'OBSERVAÇÕES (ANTIGO)', data.observation, 'text', true)}
        </Box>
      </FlexColumnBorder>

      {/* CARD 2: PREPARO DO PAVIMENTO */}
      <FlexColumnBorder title="PREPARO DO PAVIMENTO" open={true} theme="#07B811">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', mb: 2 }}>
          {renderTextField('iriPrerehabilitation', 'IRI (m/km) Pré-Reabilitação', data.iriPrerehabilitation, 'number')}
          {renderTextField('atPrerehabilitation', 'AT (%) Pré-Reabilitação', data.atPrerehabilitation, 'number')}
          {renderSwitch('fresagem', 'FRESAGEM', data.fresagem)}
          {data.fresagem && renderTextField('espessuraFresagem', 'ESPESSURA FRESADA (mm)', data.espessuraFresagem, 'number')}
          {renderSwitch('intervencaoBase', 'INTERVENÇÃO NA BASE', data.intervencaoBase)}
          {renderSwitch('sami', 'SAMI', data.sami)}
          {renderSwitch('pinturaLigacao', 'PINTURA DE LIGAÇÃO', data.pinturaLigacao)}
          {renderSwitch('imprimacao', 'IMPRIMAÇÃO', data.imprimacao)}
          
          {/* Campos antigos */}
          {renderSelect('milling', 'FRESAGEM (ANTIGO)', data.milling, simNaoOptions)}
          {data.milling === 'Sim' && renderTextField('millingThickness', 'ESPESSURA FRESADA (mm) ANTIGO', data.millingThickness, 'number')}
          {renderSelect('interventionAtTheBase', 'INTERVENÇÃO NA BASE (ANTIGO)', data.interventionAtTheBase, simNaoOptions)}
          {renderSelect('bondingPaint', 'PINTURA DE LIGAÇÃO (ANTIGO)', data.bondingPaint, simNaoOptions)}
          {renderSelect('priming', 'IMPRIMAÇÃO (ANTIGO)', data.priming, simNaoOptions)}
        </Box>
      </FlexColumnBorder>

      {/* CARD 3: DATA DA ÚLTIMA ATUALIZAÇÃO */}
      <FlexColumnBorder title="DATA DA ÚLTIMA ATUALIZAÇÃO" open={true} theme="#07B811">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', mb: 2 }}>
          {renderTextField('dataUltimaAtualizacao', 'DATA DA ÚLTIMA ATUALIZAÇÃO', data.dataUltimaAtualizacao, 'date')}
          {renderTextField('tempoServicoMeses', 'TEMPO EM SERVIÇO (meses)', data.tempoServicoMeses, 'number')}
          
          {/* Campos antigos */}
          {renderTextField('lastUpdate', 'DATA DA ÚLTIMA ATUALIZAÇÃO (ANTIGO)', data.lastUpdate, 'date')}
          {renderTextField('serviceTimeYears', 'TEMPO EM SERVIÇO (anos)', data.serviceTimeYears, 'number')}
          {renderTextField('serviceTimeMonths', 'TEMPO EM SERVIÇO (meses) ANTIGO', data.serviceTimeMonths, 'number')}
        </Box>
      </FlexColumnBorder>

      {/* CARD 4: CARACTERÍSTICAS */}
      <FlexColumnBorder title="CARACTERÍSTICAS" open={true} theme="#07B811">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', mb: 2 }}>
          {renderTextField('local', 'LOCAL (rodovia/avenida)', data.local)}
          {renderTextField('municipioEstado', 'MUNICÍPIO/ESTADO', data.municipioEstado)}
          {renderTextField('extensao', 'EXTENSÃO (m)', data.extensao, 'number')}
          {renderTextField('velocidadeDiretriz', 'VELOCIDADE DIRETRIZ (km/h)', data.velocidadeDiretriz, 'number')}
          {renderTextField('kmInicial', 'KM INICIAL', data.kmInicial)}
          {renderTextField('kmFinal', 'KM FINAL', data.kmFinal)}
          {renderTextField('inicioEstaca', 'INÍCIO - ESTACA', data.inicioEstaca)}
          {renderTextField('inicioMetros', 'INÍCIO - METROS', data.inicioMetros, 'number')}
          {renderTextField('fimEstaca', 'FIM - ESTACA', data.fimEstaca)}
          {renderTextField('fimMetros', 'FIM - METROS', data.fimMetros, 'number')}
          {renderTextField('altitudeMedia', 'ALTITUDE MÉDIA (m)', data.altitudeMedia, 'number')}
          {renderTextField('numeroFaixas', 'NÚMERO DE FAIXAS', data.numeroFaixas, 'number')}
          {renderTextField('faixaMonitorada', 'FAIXA MONITORADA', data.faixaMonitorada)}
          {renderTextField('larguraFaixa', 'LARGURA DA FAIXA (m)', data.larguraFaixa, 'number')}
          
          {/* Campos antigos */}
          {renderTextField('roadName', 'LOCAL (rodovia/avenida) ANTIGO', data.roadName)}
          {renderTextField('cityState', 'MUNICÍPIO/ESTADO (ANTIGO)', data.cityState)}
          {renderTextField('experimentalLength', 'EXTENSÃO (m) ANTIGO', data.experimentalLength, 'number')}
          {renderTextField('guideSpeed', 'VELOCIDADE DIRETRIZ (km/h) ANTIGO', data.guideSpeed, 'number')}
          {renderTextField('initialStakeMeters', 'ESTACA INICIAL (m)', data.initialStakeMeters, 'number')}
          {renderTextField('finalStakeMeters', 'ESTACA FINAL (m)', data.finalStakeMeters, 'number')}
          {renderTextField('latitudeI', 'LATITUDE INICIAL', data.latitudeI)}
          {renderTextField('longitudeI', 'LONGITUDE INICIAL', data.longitudeI)}
          {renderTextField('latitudeF', 'LATITUDE FINAL', data.latitudeF)}
          {renderTextField('longitudeF', 'LONGITUDE FINAL', data.longitudeF)}
          {renderTextField('averageAltitude', 'ALTITUDE MÉDIA (m) ANTIGO', data.averageAltitude, 'number')}
          {renderTextField('numberOfTracks', 'NÚMERO DE FAIXAS (ANTIGO)', data.numberOfTracks, 'number')}
          {renderTextField('monitoredTrack', 'FAIXA MONITORADA (ANTIGO)', data.monitoredTrack)}
          {renderTextField('trackWidth', 'LARGURA DA FAIXA (m) ANTIGO', data.trackWidth, 'number')}
          {renderSwitch('localConfirmado', 'LOCAL CONFIRMADO', data.localConfirmado)}
        </Box>
      </FlexColumnBorder>

      {/* CARD 5: COMPOSIÇÃO ESTRUTURAL */}
      <FlexColumnBorder title="COMPOSIÇÃO ESTRUTURAL" open={true} theme="#07B811">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 2fr 1fr 50px',
            gap: '10px',
            fontWeight: 'bold',
            borderBottom: '2px solid #07B811',
            pb: 1,
            textTransform: 'uppercase'
          }}>
            <Box>CAMADA</Box>
            <Box>MATERIAL</Box>
            <Box>ESPESSURA (mm)</Box>
            <Box>AÇÕES</Box>
          </Box>

          {data.structuralComposition.map((camada, index) => (
            <Box key={camada.id} sx={{ 
              display: 'grid', 
              gridTemplateColumns: '2fr 2fr 1fr 50px',
              gap: '10px',
              alignItems: 'center'
            }}>
              <Select
                variant="standard"
                value={camada.layer || ''}
                onChange={(e) => atualizarCamada(index, 'layer', e.target.value)}
                displayEmpty
                sx={{ textTransform: 'uppercase' }}
              >
                <MenuItem value="" disabled>SELECIONE A CAMADA</MenuItem>
                {tipoCamadaOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>

              <TextField
                variant="standard"
                placeholder="MATERIAL"
                value={camada.material || ''}
                onChange={(e) => atualizarCamada(index, 'material', e.target.value)}
                InputProps={{ inputProps: { style: { textTransform: 'uppercase' } } }}
              />

              <TextField
                variant="standard"
                type="number"
                placeholder="ESPESSURA"
                value={camada.thickness || ''}
                onChange={(e) => atualizarCamada(index, 'thickness', e.target.value)}
              />

              <IconButton onClick={() => removerCamada(index)} color="error" size="small">
                <Delete />
              </IconButton>
            </Box>
          ))}

          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={adicionarCamada}
            sx={{
              borderColor: '#07B811',
              color: '#07B811',
              textTransform: 'uppercase',
              mt: 1,
              '&:hover': {
                borderColor: '#05990e',
                backgroundColor: 'rgba(7, 184, 17, 0.04)'
              }
            }}
          >
            ADICIONAR CAMADA
          </Button>
        </Box>
      </FlexColumnBorder>

      {/* CARD 6: IMAGENS */}
      <FlexColumnBorder title="IMAGENS" open={true} theme="#07B811">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', mb: 2 }}>
          {renderTextField('images', 'URL DA IMAGEM', data.images)}
          {renderTextField('imagesDate', 'DATA DAS IMAGENS', data.imagesDate, 'date')}
        </Box>
      </FlexColumnBorder>
    </Stack>
  );
};

// ============================================
// STEP 2 - LIGANTE ASFÁLTICO (COMPLETO)
// ============================================

const Step2LiganteAsfaltico = () => {
  const store = useBinderAsphaltConcreteStore();
  const step = 2;
  const data = store.step3Data;

  const handleChange = (key: string, value: any) => {
    store.setData({ step, key, value });
  };

  const renderTextField = (key: string, label: string, value: any, type = 'text') => (
    <TextField
      variant="standard"
      type={type}
      label={label}
      value={value || ''}
      InputLabelProps={type === 'date' ? { shrink: true } : undefined}
      onChange={(e) => handleChange(key, e.target.value)}
      InputProps={{ inputProps: { style: { textTransform: 'uppercase' } } }}
      sx={{ width: 'calc(33.33% - 14px)' }}
    />
  );

  return (
    <FlexColumnBorder title="LIGANTE ASFÁLTICO - REVESTIMENTO" open={true} theme="#07B811">
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', mb: 2 }}>
        {renderTextField('refinery', 'REFINARIA', data.refinery)}
        {renderTextField('company', 'EMPRESA DISTRIBUIDORA', data.company)}
        {renderTextField('collectionDate', 'DATA DO CARREGAMENTO', data.collectionDate, 'date')}
        {renderTextField('invoiceNumber', 'NÚMERO DA NOTA FISCAL', data.invoiceNumber)}
        {renderTextField('dataInvoice', 'DATA DA NOTA FISCAL', data.dataInvoice, 'date')}
        {renderTextField('certificateNumber', 'NÚMERO DO CERTIFICADO', data.certificateNumber)}
        {renderTextField('certificateDate', 'DATA DO CERTIFICADO', data.certificateDate, 'date')}
        {renderTextField('capType', 'TIPO DE CAP', data.capType)}
        {renderTextField('performanceGrade', 'PERFORMANCE GRADE (PG)', data.performanceGrade)}
        {renderTextField('penetration', 'PENETRAÇÃO (mm) - 25°C', data.penetration, 'number')}
        {renderTextField('softeningPoint', 'PONTO DE AMOLECIMENTO (°C)', data.softeningPoint, 'number')}
        {renderTextField('elasticRecovery', 'RECUPERAÇÃO ELÁSTICA (%)', data.elasticRecovery, 'number')}
        {renderTextField('vb_sp21_20', 'VB SP21 20°C', data.vb_sp21_20, 'number')}
        {renderTextField('vb_sp21_50', 'VB SP21 50°C', data.vb_sp21_50, 'number')}
        {renderTextField('vb_sp21_100', 'VB SP21 100°C', data.vb_sp21_100, 'number')}
      </Box>
      <TextField
        variant="standard"
        multiline
        rows={3}
        label="OBSERVAÇÕES"
        value={data.observations || ''}
        onChange={(e) => handleChange('observations', e.target.value)}
        InputProps={{ inputProps: { style: { textTransform: 'uppercase' } } }}
        fullWidth
      />
    </FlexColumnBorder>
  );
};

// ============================================
// STEP 3 - CONCRETO ASFÁLTICO (COMPLETO)
// ============================================

const Step3ConcretoAsfaltico = () => {
  const store = useBinderAsphaltConcreteStore();
  const step = 3;
  const data = store.step4Data;

  const handleChange = (key: string, value: any) => {
    store.setData({ step, key, value });
  };

  const renderTextField = (key: string, label: string, value: any, type = 'text') => (
    <TextField
      variant="standard"
      type={type}
      label={label}
      value={value || ''}
      onChange={(e) => handleChange(key, e.target.value)}
      InputProps={{ inputProps: { style: { textTransform: 'uppercase' } } }}
      sx={{ width: 'calc(33.33% - 14px)' }}
    />
  );

  return (
    <FlexColumnBorder title="CONCRETO ASFÁLTICO" open={true} theme="#07B811">
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', mb: 2 }}>
        {renderTextField('granulometricRange', 'FAIXA GRANULOMÉTRICA', data.granulometricRange)}
        {renderTextField('tmn', 'TAMANHO MÁXIMO NOMINAL (mm)', data.tmn, 'number')}
        {renderTextField('asphaltTenor', 'TEOR DE ASFALTO (%)', data.asphaltTenor, 'number')}
        {renderTextField('specificMass', 'MASSA ESPECÍFICA (g/cm³)', data.specificMass, 'number')}
        {renderTextField('volumeVoids', 'VOLUME DE VAZIOS (%)', data.volumeVoids, 'number')}
        {renderTextField('abrasionLA', 'ABRASÃO LOS ANGELES (%)', data.abrasionLA, 'number')}
        {renderTextField('rt', 'RT (RESISTÊNCIA À TRAÇÃO)', data.rt, 'number')}
        {renderTextField('flowNumber', 'FLOW NUMBER', data.flowNumber, 'number')}
        {renderTextField('mr', 'MÓDULO DE RESILIÊNCIA (MPa)', data.mr, 'number')}
        {renderTextField('fatigueCurve_n_cps', 'CURVA DE FADIGA - N (CPS)', data.fatigueCurve_n_cps, 'number')}
        {renderTextField('fatigueCurve_k1', 'CURVA DE FADIGA - K1', data.fatigueCurve_k1, 'number')}
        {renderTextField('fatigueCurve_k2', 'CURVA DE FADIGA - K2', data.fatigueCurve_k2, 'number')}
        {renderTextField('fatigueCurve_r2', 'CURVA DE FADIGA - R²', data.fatigueCurve_r2, 'number')}
      </Box>
      <TextField
        variant="standard"
        multiline
        rows={3}
        label="OBSERVAÇÕES"
        value={data.observations || ''}
        onChange={(e) => handleChange('observations', e.target.value)}
        InputProps={{ inputProps: { style: { textTransform: 'uppercase' } } }}
        fullWidth
      />
    </FlexColumnBorder>
  );
};

// ============================================
// STEP 4 - RESUMO (COMPLETO)
// ============================================

const Step4Resumo = () => {
  const store = useBinderAsphaltConcreteStore();
  const { step2Data, step3Data, step4Data } = store;

  const formatValue = (value: any): string => {
    if (value === undefined || value === null || value === '') return '—';
    if (typeof value === 'boolean') return value ? 'SIM' : 'NÃO';
    return String(value).toUpperCase();
  };

  const renderSection = (title: string, data: Record<string, any>, fields: { key: string; label: string }[]) => {
    const hasData = fields.some(f => data[f.key] && data[f.key] !== '');
    if (!hasData) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#07B811', mb: 1, borderBottom: '2px solid #07B811', pb: 0.5 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px' }}>
          {fields.map(({ key, label }) => {
            const value = data[key];
            if (value === undefined || value === null || value === '') return null;
            return (
              <Box key={key} sx={{ width: 'calc(50% - 10px)', display: 'flex', borderBottom: '1px solid #f0f0f0', py: 0.5 }}>
                <Typography variant="body2" sx={{ width: 250, fontWeight: 500, color: '#666' }}>{label}:</Typography>
                <Typography variant="body2" sx={{ flex: 1, color: '#333', fontWeight: 'bold' }}>{formatValue(value)}</Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  };

  // Definição dos campos para cada seção
  const identificacaoFields = [
    { key: 'tipoSecao', label: 'TIPO DE SEÇÃO' },
    { key: 'faseMonitoramento', label: 'FASE DE MONITORAMENTO' },
    { key: 'liberacaoTrafego', label: 'LIBERAÇÃO AO TRÁFEGO' },
    { key: 'utilizadaMedina', label: 'UTILIZADA NO MeDiNa' },
    { key: 'utilizadaLvec', label: 'UTILIZADA NO LVECD' },
    { key: 'dadosConfirmadosICT', label: 'DADOS CONFIRMADOS PELA ICT' },
    { key: 'observacoes', label: 'OBSERVAÇÕES' },
    { key: 'identification', label: 'INSTITUIÇÃO + NÚMERO DO TRECHO' },
    { key: 'monitoringPhase', label: 'FASE DE MONITORAMENTO (ANTIGO)' },
    { key: 'observation', label: 'OBSERVAÇÕES (ANTIGO)' },
  ];

  const preparoFields = [
    { key: 'iriPrerehabilitation', label: 'IRI PRÉ-REABILITAÇÃO (m/km)' },
    { key: 'atPrerehabilitation', label: 'AT PRÉ-REABILITAÇÃO (%)' },
    { key: 'fresagem', label: 'FRESAGEM' },
    { key: 'espessuraFresagem', label: 'ESPESSURA FRESAGEM (mm)' },
    { key: 'intervencaoBase', label: 'INTERVENÇÃO NA BASE' },
    { key: 'sami', label: 'SAMI' },
    { key: 'pinturaLigacao', label: 'PINTURA DE LIGAÇÃO' },
    { key: 'imprimacao', label: 'IMPRIMAÇÃO' },
    { key: 'milling', label: 'FRESAGEM (ANTIGO)' },
    { key: 'millingThickness', label: 'ESPESSURA FRESADA (mm) ANTIGO' },
    { key: 'interventionAtTheBase', label: 'INTERVENÇÃO NA BASE (ANTIGO)' },
    { key: 'bondingPaint', label: 'PINTURA DE LIGAÇÃO (ANTIGO)' },
    { key: 'priming', label: 'IMPRIMAÇÃO (ANTIGO)' },
  ];

  const atualizacaoFields = [
    { key: 'dataUltimaAtualizacao', label: 'DATA DA ÚLTIMA ATUALIZAÇÃO' },
    { key: 'tempoServicoMeses', label: 'TEMPO EM SERVIÇO (meses)' },
    { key: 'lastUpdate', label: 'DATA DA ÚLTIMA ATUALIZAÇÃO (ANTIGO)' },
    { key: 'serviceTimeYears', label: 'TEMPO EM SERVIÇO (anos)' },
    { key: 'serviceTimeMonths', label: 'TEMPO EM SERVIÇO (meses) ANTIGO' },
  ];

  const caracteristicasFields = [
    { key: 'local', label: 'LOCAL' },
    { key: 'municipioEstado', label: 'MUNICÍPIO/ESTADO' },
    { key: 'extensao', label: 'EXTENSÃO (m)' },
    { key: 'velocidadeDiretriz', label: 'VELOCIDADE DIRETRIZ (km/h)' },
    { key: 'kmInicial', label: 'KM INICIAL' },
    { key: 'kmFinal', label: 'KM FINAL' },
    { key: 'inicioEstaca', label: 'INÍCIO - ESTACA' },
    { key: 'inicioMetros', label: 'INÍCIO - METROS' },
    { key: 'fimEstaca', label: 'FIM - ESTACA' },
    { key: 'fimMetros', label: 'FIM - METROS' },
    { key: 'altitudeMedia', label: 'ALTITUDE MÉDIA (m)' },
    { key: 'numeroFaixas', label: 'NÚMERO DE FAIXAS' },
    { key: 'faixaMonitorada', label: 'FAIXA MONITORADA' },
    { key: 'larguraFaixa', label: 'LARGURA DA FAIXA (m)' },
    { key: 'roadName', label: 'LOCAL (ANTIGO)' },
    { key: 'cityState', label: 'MUNICÍPIO/ESTADO (ANTIGO)' },
    { key: 'experimentalLength', label: 'EXTENSÃO (m) ANTIGO' },
    { key: 'guideSpeed', label: 'VELOCIDADE DIRETRIZ (km/h) ANTIGO' },
    { key: 'averageAltitude', label: 'ALTITUDE MÉDIA (m) ANTIGO' },
    { key: 'numberOfTracks', label: 'NÚMERO DE FAIXAS (ANTIGO)' },
    { key: 'monitoredTrack', label: 'FAIXA MONITORADA (ANTIGO)' },
    { key: 'trackWidth', label: 'LARGURA DA FAIXA (m) ANTIGO' },
    { key: 'localConfirmado', label: 'LOCAL CONFIRMADO' },
  ];

  const liganteFields = [
    { key: 'refinery', label: 'REFINARIA' },
    { key: 'company', label: 'EMPRESA DISTRIBUIDORA' },
    { key: 'collectionDate', label: 'DATA DO CARREGAMENTO' },
    { key: 'invoiceNumber', label: 'NÚMERO DA NOTA FISCAL' },
    { key: 'dataInvoice', label: 'DATA DA NOTA FISCAL' },
    { key: 'certificateNumber', label: 'NÚMERO DO CERTIFICADO' },
    { key: 'certificateDate', label: 'DATA DO CERTIFICADO' },
    { key: 'capType', label: 'TIPO DE CAP' },
    { key: 'performanceGrade', label: 'PERFORMANCE GRADE (PG)' },
    { key: 'penetration', label: 'PENETRAÇÃO (mm) - 25°C' },
    { key: 'softeningPoint', label: 'PONTO DE AMOLECIMENTO (°C)' },
    { key: 'elasticRecovery', label: 'RECUPERAÇÃO ELÁSTICA (%)' },
    { key: 'vb_sp21_20', label: 'VB SP21 20°C' },
    { key: 'vb_sp21_50', label: 'VB SP21 50°C' },
    { key: 'vb_sp21_100', label: 'VB SP21 100°C' },
    { key: 'observations', label: 'OBSERVAÇÕES' },
  ];

  const concretoFields = [
    { key: 'granulometricRange', label: 'FAIXA GRANULOMÉTRICA' },
    { key: 'tmn', label: 'TMN (mm)' },
    { key: 'asphaltTenor', label: 'TEOR DE ASFALTO (%)' },
    { key: 'specificMass', label: 'MASSA ESPECÍFICA (g/cm³)' },
    { key: 'volumeVoids', label: 'VOLUME DE VAZIOS (%)' },
    { key: 'abrasionLA', label: 'ABRASÃO LOS ANGELES (%)' },
    { key: 'rt', label: 'RT (RESISTÊNCIA À TRAÇÃO)' },
    { key: 'flowNumber', label: 'FLOW NUMBER' },
    { key: 'mr', label: 'MÓDULO DE RESILIÊNCIA (MPa)' },
    { key: 'fatigueCurve_n_cps', label: 'CURVA DE FADIGA - N (CPS)' },
    { key: 'fatigueCurve_k1', label: 'CURVA DE FADIGA - K1' },
    { key: 'fatigueCurve_k2', label: 'CURVA DE FADIGA - K2' },
    { key: 'fatigueCurve_r2', label: 'CURVA DE FADIGA - R²' },
    { key: 'observations', label: 'OBSERVAÇÕES' },
  ];

  const hasAnyData = step2Data?.tipoSecao || step2Data?.identification || step3Data?.refinery || step4Data?.granulometricRange;

  return (
    <FlexColumnBorder title="RESUMO DO CADASTRO" open={true} theme="#07B811">
      {!hasAnyData ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="body1" color="text.secondary">NENHUM DADO CADASTRADO AINDA.</Typography>
          <Typography variant="body2" color="text.secondary">PREENCHA OS FORMULÁRIOS PARA VER O RESUMO.</Typography>
        </Box>
      ) : (
        <>
          {renderSection('🔖 IDENTIFICAÇÃO', step2Data || {}, identificacaoFields)}
          {renderSection('🔧 PREPARO DO PAVIMENTO', step2Data || {}, preparoFields)}
          {renderSection('📅 DATA DA ÚLTIMA ATUALIZAÇÃO', step2Data || {}, atualizacaoFields)}
          {renderSection('📍 CARACTERÍSTICAS', step2Data || {}, caracteristicasFields)}
          
          {step2Data?.structuralComposition && step2Data.structuralComposition.some(l => l.material || l.thickness) && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#07B811', mb: 1, borderBottom: '2px solid #07B811', pb: 0.5 }}>
                🏗️ COMPOSIÇÃO ESTRUTURAL
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {step2Data.structuralComposition.map((layer, idx) => (
                  (layer.material || layer.thickness) && (
                    <Paper key={idx} sx={{ p: 1.5, bgcolor: '#f5f5f5', borderLeft: `3px solid #07B811`, flex: '1 1 200px' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1a237e' }}>{layer.layer?.toUpperCase()}</Typography>
                      <Typography variant="body2">{layer.material?.toUpperCase() || '—'} {layer.thickness ? `(${layer.thickness} mm)` : ''}</Typography>
                    </Paper>
                  )
                ))}
              </Box>
            </Box>
          )}
          
          {step2Data?.images && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#07B811', mb: 1, borderBottom: '2px solid #07B811', pb: 0.5 }}>
                🖼️ IMAGENS
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <Typography variant="body2">URL: {step2Data.images}</Typography>
                {step2Data.imagesDate && <Typography variant="body2">DATA: {step2Data.imagesDate}</Typography>}
              </Box>
            </Box>
          )}
          
          {renderSection('🛢️ LIGANTE ASFÁLTICO', step3Data || {}, liganteFields)}
          {renderSection('🪨 CONCRETO ASFÁLTICO', step4Data || {}, concretoFields)}
        </>
      )}
    </FlexColumnBorder>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const BinderAsphaltConcrete = () => {
  const { user } = useAuth();
  const store = useBinderAsphaltConcreteStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [loading, setLoading] = useState(false);

  const steps = [
    { title: 'PAVIMENTAÇÃO', content: <Step1PavimentData /> },
    { title: 'LIGANTE ASFÁLTICO', content: <Step2LiganteAsfaltico /> },
    { title: 'CONCRETO ASFÁLTICO', content: <Step3ConcretoAsfaltico /> },
    { title: 'RESUMO', content: <Step4Resumo /> },
  ];

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        console.log('Dados salvos:', store);
        setSnackbar({ open: true, message: 'CADASTRO SALVO COM SUCESSO!', severity: 'success' });
        setLoading(false);
      }, 500);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <ThemeProvider theme={proMedinaTheme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#F2F2F2' }}>
        <AppBar position="static" elevation={0} sx={{ bgcolor: '#07B811' }}>
          <Toolbar sx={{ justifyContent: 'space-between', py: 0.5, minHeight: '48px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 32, height: 32, bgcolor: '#ffffff', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#07B811', fontWeight: 'bold', fontSize: '0.9rem' }}>CA</Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>PRO-MEDINA</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem' }}>CONCRETO ASFÁLTICO</Typography>
              </Box>
            </Box>
            <Button variant="contained" size="small" startIcon={<Save />} onClick={next} disabled={loading} sx={{ bgcolor: '#ffffff', color: '#07B811', fontSize: '0.7rem', '&:hover': { bgcolor: '#f0f0f0' } }}>
              {loading ? <CircularProgress size={20} sx={{ color: '#07B811' }} /> : (currentStep === steps.length - 1 ? 'SALVAR' : 'PRÓXIMO')}
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth={false} sx={{ py: 3, maxWidth: '1400px', margin: '0 auto' }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>CADASTRO DE PAVIMENTAÇÃO</Typography>
            <Typography variant="body1" sx={{ color: '#666', fontWeight: 400 }}>Concreto Asfáltico - Ligante e Composição Estrutural</Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Stepper activeStep={currentStep} alternativeLabel connector={null}>
              {steps.map((step, index) => (
                <Step key={step.title}>
                  <StepLabel StepIconProps={{ sx: { fontSize: '1.2rem', '&.Mui-active': { color: '#07B811' }, '&.Mui-completed': { color: '#07B811' } } }}>
                    <Typography variant="body2" sx={{ fontWeight: currentStep === index ? 600 : 400, color: currentStep === index ? '#07B811' : '#999', fontSize: '0.8rem' }}>{step.title}</Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
            <Box sx={{ p: 3 }}>
              {steps[currentStep].content}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button variant="outlined" onClick={prev} disabled={currentStep === 0} sx={{ visibility: currentStep === 0 ? 'hidden' : 'visible', borderColor: '#07B811', color: '#07B811', '&:hover': { borderColor: '#05990e', backgroundColor: 'rgba(7, 184, 17, 0.04)' } }}>
                  ANTERIOR
                </Button>
                <Button variant="contained" onClick={next} disabled={loading} sx={{ px: 4, bgcolor: '#07B811', '&:hover': { bgcolor: '#05990e' } }}>
                  {loading ? <CircularProgress size={20} color="inherit" /> : (currentStep === steps.length - 1 ? 'SALVAR' : 'PRÓXIMO')}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default BinderAsphaltConcrete;