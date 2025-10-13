// src/services/fwdAnalysisService.ts
import Api from '@/api';

export interface FWDData {
  stationNumber: number;
  d0: number;
  d20: number;
  d30: number;
  d45: number;
  d60: number;
  d90: number;
  d120: number;
  d150: number;
  d180: number;
  date?: string;
  airTemperature?: number;
  pavementTemperature?: number;
  appliedLoad?: number;
}

export interface FWDAnalysisData {
  name: string;
  description: string;
  samples: FWDData[];
  status: 'active' | 'completed';
  userId?: string;
}

export interface FWDAnalysis extends FWDAnalysisData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

const fwdAnalysisService = {
  // Criar análise FWD
  createAnalysis: (analysisData: FWDAnalysisData) =>
    Api.post('fwd-analysis/save', analysisData),

  // Buscar todas as análises FWD
  getAnalyses: () =>
    Api.get('fwd-analysis/all'),

  // Buscar análise específica
  getAnalysis: (analysisId: string) =>
    Api.get(`fwd-analysis/${analysisId}`),

  // Atualizar análise
  updateAnalysis: (analysisId: string, analysisData: Partial<FWDAnalysisData>) =>
    Api.put(`fwd-analysis/${analysisId}`, analysisData),

  // Deletar análise
  deleteAnalysis: (analysisId: string) =>
    Api.delete(`fwd-analysis/${analysisId}`),

  // Processar análise (subtrechos)
  processAnalysis: (analysisId: string) =>
    Api.post(`fwd-analysis/${analysisId}/process`),

  // Buscar análises com filtro
  getFilteredAnalyses: (params: any, page = 1, limit = 10, need_count = true) => {
    const filterParams = JSON.stringify(params);
    return Api.get(
      `fwd-analysis/filter/?filter=${filterParams}&limit=${limit}&need_count=${need_count}&page=${page}`
    );
  },
};

export default fwdAnalysisService;