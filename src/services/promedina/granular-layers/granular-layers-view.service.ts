import Api from '@/api';
import { SampleData } from '@/interfaces/soils';

const samplesService = {
  createSample: (sampleData: SampleData) => Api.post('soils/samples', sampleData),
  deleteSample: (sampleId: string) => Api.delete(`promedina/granular-layers/granular-layers-samples/${sampleId}`),
  getSamples: () => Api.get(`promedina/granular-layers/granular-layers-samples/all`),
  getFilteredSamples: (params: any, page: number) =>
    Api.get(
      `promedina/granular-layers/granular-layers-samples/filter/?filter=${params}&limit=2&need_count=true&page=${page}`
    ),
};

export default samplesService;
