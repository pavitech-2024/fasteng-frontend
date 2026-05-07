import { create } from 'zustand';
import fwdAnalysisService, { FWDData, FWDAnalysis } from '@/services/promedina/fwd/fwdApi';

export type { FWDData, FWDAnalysis } from '@/services/promedina/fwd/fwdApi';

export interface Subtrecho {
  'Início (Estaca)': number;
  'Fim (Estaca)': number;
  'Comprimento (m)': number;
  'N Amostras': number;
  d0: number;
  d20: number;
  d30: number;
  d45: number;
  d60: number;
  d90: number;
  d120: number;
  d150: number;
  d180: number;
}

export interface ProcessResult {
  subtrechos: Subtrecho[];
  ordered: FWDData[];
  media_d0: number[];
  std_d0: number[];
  cv_d0: number[];
  quebra: boolean[];
}

interface FWDState {
  // Dados do formulário
  analysisData: {
    name: string;
    description: string;
    location: string;
    highway: string;
    layerType: string;
    cityState: string;
    speedLimit: string;
    notes: string;
  };

  // Amostras temporárias
  samples: FWDData[];

  // Análise selecionada
  selectedAnalysis: FWDAnalysis | null;

  // ID da análise sendo editada
  editingId: string | null;

  // Listas
  analyses: FWDAnalysis[];
  drafts: FWDAnalysis[];

  // Resultado do processamento
  procResult: ProcessResult | null;
  procError: string | null;
  loading: boolean;
  error: string | null;

  // Active tab
  activeTab: number;

  // Actions
  setAnalysisData: (data: Partial<FWDState['analysisData']>) => void;
  setSamples: (samples: FWDData[]) => void;
  addSample: (sample: FWDData) => void;
  removeSample: (id: number) => void;
  clearSamples: () => void;
  setSelectedAnalysis: (analysis: FWDAnalysis | null) => void;
  setEditingId: (id: string | null) => void;
  setAnalyses: (analyses: FWDAnalysis[]) => void;
  setDrafts: (drafts: FWDAnalysis[]) => void;
  setProcResult: (result: ProcessResult | null) => void;
  setProcError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActiveTab: (tab: number) => void;

  // Async actions
  fetchAnalyses: () => Promise<void>;
  fetchAnalysis: (id: string) => Promise<FWDAnalysis | null>;
  saveAnalysis: (asDraft?: boolean) => Promise<FWDAnalysis | null>;
  updateAnalysis: () => Promise<FWDAnalysis | null>;
  deleteAnalysis: (id: string) => Promise<boolean>;
  processAnalysis: () => Promise<ProcessResult | null>;
  resetStore: () => void;
}

const initialState = {
  analysisData: {
    name: '',
    description: '',
    location: '',
    highway: '',
    layerType: '',
    cityState: '',
    speedLimit: '',
    notes: '',
  },
  samples: [],
  selectedAnalysis: null,
  editingId: null,
  analyses: [],
  drafts: [],
  procResult: null,
  procError: null,
  loading: false,
  error: null,
  activeTab: 0,
};

const useFWDStore = create<FWDState>((set, get) => ({
  ...initialState,

  // Simple setters
  setAnalysisData: (data) =>
    set((state) => ({
      analysisData: { ...state.analysisData, ...data },
    })),

  setSamples: (samples) => set({ samples }),

  addSample: (sample) =>
    set((state) => ({
      samples: [...state.samples, { ...sample }],
    })),

  removeSample: (index: number) =>
    set((state) => ({
      samples: state.samples.filter((_, i) => i !== index),
    })),

  clearSamples: () => set({ samples: [] }),

  setSelectedAnalysis: (analysis) => set({ selectedAnalysis: analysis }),

  setEditingId: (id) => set({ editingId: id }),

  setAnalyses: (analyses) => set({ analyses }),

  setDrafts: (drafts) => set({ drafts }),

  setProcResult: (result) => set({ procResult: result }),

  setProcError: (error) => set({ procError: error }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setActiveTab: (activeTab) => set({ activeTab }),

  // Async actions
  fetchAnalyses: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fwdAnalysisService.getAnalyses();
      const allAnalyses: FWDAnalysis[] = response.data?.data || response.data || [];
      set({
        analyses: allAnalyses.filter(a => a.status !== 'draft'),
        drafts: allAnalyses.filter(a => a.status === 'draft'),
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Erro ao carregar análises',
        loading: false,
      });
    }
  },

  fetchAnalysis: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fwdAnalysisService.getAnalysis(id);
      const analysis: FWDAnalysis = response.data?.data || response.data;
      set({ selectedAnalysis: analysis, loading: false });
      return analysis;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Erro ao carregar análise',
        loading: false,
      });
      return null;
    }
  },

  saveAnalysis: async (asDraft = false) => {
    const { analysisData, samples, editingId } = get();

    if (!analysisData.name && !asDraft) {
      set({ error: 'Nome da análise é obrigatório' });
      return null;
    }
    if (samples.length < 5 && !asDraft) {
      set({ error: 'Mínimo de 5 amostras necessárias' });
      return null;
    }

    set({ loading: true, error: null });
    try {
      const data: any = {
        name: analysisData.name || 'Rascunho Sem Nome',
        description: analysisData.description,
        samples,
        status: asDraft ? 'draft' : 'active',
      };

      let result;
      if (editingId) {
        const response = await fwdAnalysisService.updateAnalysis(editingId, data);
        result = response.data?.data || response.data;
      } else {
        const response = await fwdAnalysisService.createAnalysis(data);
        result = response.data?.data || response.data;
      }

      set({
        editingId: result._id,
        loading: false,
        activeTab: asDraft ? 0 : 2,
      });

      await get().fetchAnalyses();
      return result;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Erro ao salvar análise',
        loading: false,
      });
      return null;
    }
  },

  updateAnalysis: async () => {
    const { analysisData, samples, editingId } = get();
    if (!editingId) return null;

    set({ loading: true, error: null });
    try {
      const data = {
        name: analysisData.name,
        description: analysisData.description,
        samples,
      };
      const response = await fwdAnalysisService.updateAnalysis(editingId, data);
      const result = response.data?.data || response.data;
      set({ loading: false });
      await get().fetchAnalyses();
      return result;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Erro ao atualizar análise',
        loading: false,
      });
      return null;
    }
  },

  deleteAnalysis: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await fwdAnalysisService.deleteAnalysis(id);
      set({ loading: false });
      await get().fetchAnalyses();
      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Erro ao deletar análise',
        loading: false,
      });
      return false;
    }
  },

  processAnalysis: async () => {
    const { selectedAnalysis } = get();
    if (!selectedAnalysis) {
      set({ procError: 'Selecione uma análise para processar' });
      return null;
    }

    set({ loading: true, procError: null });
    try {
      const response = await fwdAnalysisService.processAnalysis(selectedAnalysis._id);
      const result = response.data?.data || response.data;
      set({ procResult: result, loading: false });
      return result;
    } catch (err: any) {
      set({
        procError: err.response?.data?.message || 'Erro ao processar análise',
        loading: false,
      });
      return null;
    }
  },

  resetStore: () => set(initialState),
}));

export default useFWDStore;