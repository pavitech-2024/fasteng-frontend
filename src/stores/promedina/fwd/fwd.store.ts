import { create } from 'zustand';
import fwdAnalysisService, { FWDData, FWDAnalysis } from '@/services/promedina/fwd/fwdApi';
import { processarSubtrechos, ProcessResult, Subtrecho } from '@/utils/fwdProcessing';

export type { FWDData, FWDAnalysis, ProcessResult, Subtrecho };

interface FWDState {
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
  samples: FWDData[];
  selectedAnalysis: FWDAnalysis | null;
  editingId: string | null;
  analyses: FWDAnalysis[];
  drafts: FWDAnalysis[];
  procResult: ProcessResult | null;
  procError: string | null;
  loading: boolean;
  error: string | null;
  activeTab: number;

  // Simple setters
  setAnalysisData: (data: Partial<FWDState['analysisData']>) => void;
  setSamples: (samples: FWDData[]) => void;
  addSample: (sample: FWDData) => void;
  removeSample: (index: number) => void;
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
  deleteAnalysis: (id: string) => Promise<boolean>;
  
  // ⭐ Processamento LOCAL (não chama API)
  processAnalysisLocally: () => ProcessResult | null;
  
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

  setAnalysisData: (data) =>
    set((state) => ({ analysisData: { ...state.analysisData, ...data } })),

  setSamples: (samples) => set({ samples }),
  addSample: (sample) => set((state) => ({ samples: [...state.samples, { ...sample }] })),
  removeSample: (index) => set((state) => ({ samples: state.samples.filter((_, i) => i !== index) })),
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
      set({ error: err.response?.data?.message || 'Erro ao carregar análises', loading: false });
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
      set({ error: err.response?.data?.message || 'Erro ao carregar análise', loading: false });
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

      set({ editingId: result._id, loading: false });
      await get().fetchAnalyses();
      return result;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Erro ao salvar análise', loading: false });
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
      set({ error: err.response?.data?.message || 'Erro ao deletar análise', loading: false });
      return false;
    }
  },

  // ⭐ PROCESSAMENTO LOCAL - Não chama API, usa a função processarSubtrechos diretamente
  processAnalysisLocally: () => {
    const { selectedAnalysis } = get();
    
    if (!selectedAnalysis) {
      set({ procError: 'Nenhuma análise selecionada' });
      return null;
    }

    if (!selectedAnalysis.samples || selectedAnalysis.samples.length < 5) {
      set({ procError: 'Mínimo de 5 amostras necessário para processamento' });
      return null;
    }

    set({ loading: true, procError: null });

    try {
      // ⭐ Chama a função local de processamento
      const result = processarSubtrechos(selectedAnalysis.samples);
      set({ procResult: result, loading: false });
      return result;
    } catch (err: any) {
      set({ procError: err.message || 'Erro ao processar análise', loading: false });
      return null;
    }
  },

  resetStore: () => set(initialState),
}));

export default useFWDStore;