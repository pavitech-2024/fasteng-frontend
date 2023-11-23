import { SampleData } from '@/interfaces/soils';
import Api from '@/api';

const samplesService = {
  createSample: (sampleData: SampleData) => Api.post('soils/samples', sampleData),
  deleteSample: (sampleId: string) => Api.delete(`promedina/granular-layers/granular-layers-samples/${sampleId}`),
  getSamples: () => Api.get(`promedina/granular-layers/granular-layers-samples/all`),
  getFilteredSamples: (params: any) =>
    Api.get(
      `promedina/granular-layers/granular-layers-samples/filter/?filter=${params}&limit=2&need_count=true&page=1`
    ),
};

export default samplesService;
