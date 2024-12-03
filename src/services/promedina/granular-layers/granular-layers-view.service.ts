import Api from '@/api';
import { SampleData } from '@/interfaces/soils';
import { GranularLayersData } from '@/stores/promedina/granular-layers/granular-layers.store';

const samplesService = {
  createSample: (sampleData: SampleData) => Api.post('promedina/granular-layers/granular-layers-samples', sampleData),
  saveSample: (sampleData: GranularLayersData) =>
    Api.post(`promedina/granular-layers/granular-layers-samples/save`, sampleData),
  deleteSample: (sampleId: string) => Api.delete(`promedina/granular-layers/granular-layers-samples/${sampleId}`),
  getSamples: () => Api.get(`promedina/granular-layers/granular-layers-samples/all`),
  updateSample: (sampleId: string, sampleData: GranularLayersData) =>
    Api.put(`promedina/granular-layers/granular-layers-samples/${sampleId}`, sampleData),
  getFilteredSamples: (params: any, page: number, limit: number, need_count: boolean) =>
    Api.get(
      `promedina/granular-layers/granular-layers-samples/filter?filter=${params}&limit=${limit}&need_count=${need_count}&page=${page}`
    ),
  getSample: (sampleId: string) => Api.get(`promedina/granular-layers/granular-layers-samples/${sampleId}`),
};

export default samplesService;
