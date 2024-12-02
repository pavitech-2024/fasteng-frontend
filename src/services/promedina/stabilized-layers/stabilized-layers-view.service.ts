import Api from '@/api';
import { SampleData } from '@/interfaces/soils';
import { StabilizedLayersData } from '@/stores/promedina/stabilized-layers/stabilized-layers.store';

const samplesService = {
  createSample: (sampleData: SampleData) => Api.post('soils/samples', sampleData),
  saveSample: (sampleData: StabilizedLayersData) =>
    Api.post(`promedina/stabilized-layers/stabilized-layers-samples/save`, sampleData),
  deleteSample: (sampleId: string) => Api.delete(`promedina/stabilized-layers/stabilized-layers-samples/${sampleId}`),
  getSamples: () => Api.get(`promedina/stabilized-layers/stabilized-layers-samples/all?limit=2&page=1`),
  updateSample: (sampleId: string, sampleData: StabilizedLayersData) =>
    Api.put(`promedina/stabilized-layers/stabilized-layers-samples/${sampleId}`, sampleData),
  getFilteredSamples: (params: any, page: number, limit: number, need_count: boolean) =>
    Api.get(
      `promedina/stabilized-layers/stabilized-layers-samples/filter/?filter=${params}&limit=${limit}&need_count=${true}&page=${page}`
    ),
  getSample: (sampleId: string) => Api.get(`promedina/stabilized-layers/stabilized-layers-samples/${sampleId}`),
};

export default samplesService;
