import Api from '@/api';
import { SampleData } from '@/interfaces/soils';

const samplesService = {
  createSample: (sampleData: SampleData) => Api.post('soils/samples', sampleData),
  deleteSample: (sampleId: string) =>
    Api.delete(`promedina/binder-asphalt-concrete/binder-asphalt-concrete-samples/${sampleId}`),
  getSamples: () => Api.get(`promedina/binder-asphalt-concrete/binder-asphalt-concrete-samples/all`),
  getFilteredSamples: (params: any, page: number) =>
    Api.get(
      `promedina/binder-asphalt-concrete/binder-asphalt-concrete-samples/filter/?filter=${params}&limit=2&need_count=true&page=${page}`
    ),
  getSample: (sampleId: string) => Api.get(`promedina/binder-asphalt-concrete/binder-asphalt-concrete-samples/${sampleId}`),
};

export default samplesService;
