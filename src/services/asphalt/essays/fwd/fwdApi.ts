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
  status: 'active' | 'completed' | 'draft';
  userId?: string;
}

export interface FWDAnalysis extends FWDAnalysisData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

const BASE_PATH = 'fwd-analysis';

const fwdAnalysisService = {
  createAnalysis: (analysisData: FWDAnalysisData) => Api.post(`${BASE_PATH}/save`, analysisData),

  getAnalyses: () => Api.get(`${BASE_PATH}/all`),

  getAnalysis: (analysisId: string) => Api.get(`${BASE_PATH}/${analysisId}`),

  updateAnalysis: (analysisId: string, analysisData: Partial<FWDAnalysisData>) =>
    Api.put(`${BASE_PATH}/${analysisId}`, analysisData),

  deleteAnalysis: (analysisId: string) => Api.delete(`${BASE_PATH}/${analysisId}`),

  processAnalysis: (analysisId: string) => Api.post(`${BASE_PATH}/${analysisId}/process`),

  getFilteredAnalyses: (params: any, page = 1, limit = 10, need_count = true) => {
    const filterParams = JSON.stringify(params);

    return Api.get(`${BASE_PATH}/filter/?filter=${filterParams}&limit=${limit}&need_count=${need_count}&page=${page}`);
  },
};
export default fwdAnalysisService;
