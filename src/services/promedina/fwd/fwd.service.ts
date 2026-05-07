import fwdAnalysisService from './fwdApi';
import useFWDStore from '@/stores/promedina/fwd/fwd.store';

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
  procResult: any;
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
  setProcResult: (result: any) => void;
  setProcError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActiveTab: (tab: number) => void;
  fetchAnalyses: () => Promise<void>;
  fetchAnalysis: (id: string) => Promise<any>;
  saveAnalysis: (asDraft?: boolean) => Promise<any>;
  updateAnalysis: () => Promise<any>;
  deleteAnalysis: (id: string) => Promise<boolean>;
  processAnalysis: () => Promise<any>;
  resetStore: () => void;
}

class FWD_SERVICE {
  userId: string = '';
  store_actions!: FWDStoreActions;

  get info() {
    return {
      key: 'fwd',
      icon: require('@/assets/asphalt/essays/FWD.png'), 
      title: 'ANÁLISE FWD - FALLING WEIGHT DEFLECTOMETER',
      path: '/promedina/fwd',
      backend_path: 'fwd-analysis',
      steps: 4,
      standard: {
        name: '',
        link: 'https://www.dnit.gov.br',
      },
      stepperData: [
        { step: 0, description: 'DADOS GERAIS', path: '/promedina/fwd/register?step=0' },
        { step: 1, description: 'GERENCIAR ANÁLISES', path: '/promedina/fwd/register?step=1' },
        { step: 2, description: 'RESULTADOS E GRÁFICOS', path: '/promedina/fwd/register?step=2' },
        { step: 3, description: 'RESUMO', path: '/promedina/fwd/register?step=3' },
      ],
    };
  }

  async handleNext(step: number, data: unknown): Promise<void> {
    const store = this.store_actions;

    switch (step) {
      case 0: {
        if (!store.analysisData.name) {
          store.setError('Nome da análise é obrigatório');
          throw new Error('Nome da análise é obrigatório');
        }

        if (store.samples.length > 0 && !store.editingId) {
          try {
            await store.saveAnalysis(true);
            store.setError(null);
          } catch (err: any) {
            store.setError(err?.response?.data?.message || 'Erro ao salvar análise');
            throw new Error('Erro ao salvar análise');
          }
        }
        break;
      }

      case 1: {
        if (!store.selectedAnalysis) {
          store.setError('Selecione uma análise para continuar');
          throw new Error('Selecione uma análise para continuar');
        }

        if (store.selectedAnalysis.samples?.length < 5) {
          store.setError('A análise selecionada possui menos de 5 amostras');
          throw new Error('A análise selecionada possui menos de 5 amostras');
        }
        break;
      }

      case 2: {
        if (!store.selectedAnalysis) {
          store.setError('Nenhuma análise selecionada');
          throw new Error('Nenhuma análise selecionada');
        }

        if (!store.procResult && store.selectedAnalysis.samples?.length >= 5) {
          try {
            await store.processAnalysis();
          } catch (err: any) {
            store.setProcError(err?.response?.data?.message || 'Erro ao processar análise');
            throw new Error('Erro ao processar análise');
          }
        }
        break;
      }

      case 3: {
        if (!store.selectedAnalysis) {
          store.setError('Nenhuma análise selecionada');
          throw new Error('Nenhuma análise selecionada');
        }

        if (store.procResult && store.editingId) {
          try {
            await fwdAnalysisService.updateAnalysis(store.editingId, {
              status: 'completed',
            } as any);
            store.fetchAnalyses();
          } catch (err: any) {
            console.error('Erro ao finalizar análise:', err);
          }
        }
        break;
      }

      default:
        break;
    }
  }
}

export default FWD_SERVICE;