// src/services/promedina/igg/igg-view.service.ts
import Api from '@/api';

const iggAnalysisService = {
  saveAnalysis: (analysisData: any) =>
    Api.post(`promedina/igg/igg-analysis/save`, analysisData),
    
  getAnalyses: (page = 1, limit = 10) =>
    Api.get(`promedina/igg/igg-analysis/all?limit=${limit}&page=${page}`),
    
  getAnalysis: (analysisId: string) =>
    Api.get(`promedina/igg/igg-analysis/${analysisId}`),
    
  updateAnalysis: (analysisId: string, analysisData: any) =>
    Api.put(`promedina/igg/igg-analysis/${analysisId}`, analysisData),
    
  deleteAnalysis: (analysisId: string) =>
    Api.delete(`promedina/igg/igg-analysis/${analysisId}`),
    
  processAnalysis: (analysisId: string) =>
    Api.post(`promedina/igg/igg-analysis/${analysisId}/process`),
};

export default iggAnalysisService;