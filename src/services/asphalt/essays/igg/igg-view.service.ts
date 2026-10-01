// src/services/promedina/igg/igg-view.service.ts
import Api from '@/api';

const iggAnalysisService = {
  saveAnalysis: (analysisData: any) =>
    Api.post(`asphalt/igg/igg-analysis/save`, analysisData),

  getAnalyses: (page = 1, limit = 10) =>
    Api.get(`asphalt/igg/igg-analysis/all?limit=${limit}&page=${page}`),

  getAnalysis: (analysisId: string) =>
    Api.get(`asphalt/igg/igg-analysis/${analysisId}`),

  updateAnalysis: (analysisId: string, analysisData: any) =>
    Api.put(`asphalt/igg/igg-analysis/${analysisId}`, analysisData),

  deleteAnalysis: (analysisId: string) =>
    Api.delete(`asphalt/igg/igg-analysis/${analysisId}`),

  processAnalysis: (analysisId: string) =>
    Api.post(`asphalt/igg/igg-analysis/${analysisId}/process`),
};

export default iggAnalysisService;