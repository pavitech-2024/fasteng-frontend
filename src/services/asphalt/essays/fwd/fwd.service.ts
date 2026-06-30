import { t } from 'i18next';
import fwdAnalysisService from './fwdApi';
import { ProcessResult } from '@/utils/fwdProcessing';
import FwdIcon from '@/assets/asphalt/essays/FWD.png';

export interface FWDStoreActions {
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
  samples: any[];
  selectedAnalysis: any;
  editingId: string | null;
  analyses: any[];
  drafts: any[];
  procResult: ProcessResult | null;
  procError: string | null;
  loading: boolean;
  error: string | null;
  activeTab: number;

  setAnalysisData: (data: any) => void;
  setSamples: (samples: any[]) => void;
  addSample: (sample: any) => void;
  removeSample: (index: number) => void;
  clearSamples: () => void;
  setSelectedAnalysis: (analysis: any) => void;
  setEditingId: (id: string | null) => void;
  setAnalyses: (analyses: any[]) => void;
  setDrafts: (drafts: any[]) => void;
  setProcResult: (result: ProcessResult | null) => void;
  setProcError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActiveTab: (tab: number) => void;
  fetchAnalyses: () => Promise<void>;
  fetchAnalysis: (id: string) => Promise<any>;
  saveAnalysis: (asDraft?: boolean) => Promise<any>;
  deleteAnalysis: (id: string) => Promise<boolean>;
  processAnalysisLocally: () => ProcessResult | null;
  resetStore: () => void;
}

class FWD_SERVICE {
  userId = '';
  store_actions!: FWDStoreActions;

  // ⭐ info como PROPRIEDADE (igual IGG)
  info = {
    key: 'fwd',
    icon: FwdIcon,
    title: t('pm.fwd-register'),
    path: '/asphalt/essays/fwd',
    steps: 4,
    backend_path: 'promedina/fwd/fwd-analysis',
    standard: {
      name: 'DNER-PRO 011/79',
      link: '',
    },
    stepperData: [
      { step: 0, description: 'DADOS GERAIS', path: 'analysisData' },
      { step: 1, description: 'GERENCIAR ANÁLISES', path: 'analyses' },
      { step: 2, description: 'RESULTADOS', path: 'results' },
      { step: 3, description: 'RESUMO', path: 'resume' },
    ],
  };

  // ⭐ handleNext como ARROW FUNCTION (igual IGG, evita bind)
  handleNext = async (step: number, data: unknown): Promise<void> => {
    try {
      switch (step) {
        case 0:
          await this.submitStep0(data);
          break;
        case 1:
          await this.submitStep1(data);
          break;
        case 2:
          await this.submitStep2(data);
          break;
        case 3:
          await this.submitStep3(data);
          break;
        default:
          throw new Error(t('errors.invalid-step'));
      }
    } catch (error) {
      throw error;
    }
  };

  // Step 0: Valida dados gerais e amostras
  submitStep0 = async (data: any): Promise<void> => {
    const store = this.store_actions;

    if (!store.analysisData.name) {
      store.setError('Nome da análise é obrigatório');
      throw new Error('Nome da análise é obrigatório');
    }

    // Salva como rascunho automaticamente se tiver amostras
    if (store.samples.length > 0 && !store.editingId) {
      try {
        await store.saveAnalysis(true);
        store.setError(null);
      } catch (err: any) {
        store.setError(err?.response?.data?.message || 'Erro ao salvar análise');
        throw new Error('Erro ao salvar análise');
      }
    }
  };

  // Step 1: Valida seleção de análise
  submitStep1 = async (data: any): Promise<void> => {
    const store = this.store_actions;

    if (!store.selectedAnalysis) {
      store.setError('Selecione uma análise para continuar');
      throw new Error('Selecione uma análise para continuar');
    }

    if (store.selectedAnalysis.samples?.length < 5) {
      store.setError('A análise selecionada possui menos de 5 amostras');
      throw new Error('A análise selecionada possui menos de 5 amostras');
    }

    // Carrega as amostras da análise selecionada
    if (store.selectedAnalysis.samples?.length > 0) {
      store.setSamples(store.selectedAnalysis.samples);
    }
  };

  // Step 2: Processa análise FWD (LOCALMENTE)
  submitStep2 = async (data: any): Promise<void> => {
    const store = this.store_actions;

    if (!store.selectedAnalysis) {
      store.setError('Nenhuma análise selecionada');
      throw new Error('Nenhuma análise selecionada');
    }

    // ⭐ Processa localmente se ainda não processou
    if (!store.procResult && store.selectedAnalysis.samples?.length >= 5) {
      try {
        const result = store.processAnalysisLocally();
        if (!result) {
          throw new Error('Falha ao processar análise');
        }
      } catch (err: any) {
        store.setProcError(err?.message || 'Erro ao processar análise');
        throw new Error('Erro ao processar análise');
      }
    }
  };

  // Step 3: Finaliza e salva
  submitStep3 = async (data: any): Promise<void> => {
    const store = this.store_actions;

    if (!store.selectedAnalysis) {
      store.setError('Nenhuma análise selecionada');
      throw new Error('Nenhuma análise selecionada');
    }

    // Atualiza status para completed
    if (store.procResult && store.editingId) {
      try {
        await fwdAnalysisService.updateAnalysis(store.editingId, {
          status: 'completed',
        } as any);
        await store.fetchAnalyses();
      } catch (err: any) {
        console.error('Erro ao finalizar análise:', err);
      }
    }
  };

  deleteFwdEssay = async (id: string): Promise<void> => {
    await fwdAnalysisService.deleteAnalysis(id);
  };
}


export default FWD_SERVICE;
