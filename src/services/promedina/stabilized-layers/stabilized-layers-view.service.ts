import Api from '@/api';
import { SampleData } from '@/interfaces/soils';

const samplesService = {
  createSample: (sampleData: SampleData) => Api.post('soils/samples', sampleData),
  deleteSample: (sampleId: string) => Api.delete(`promedina/stabilized-layers/stabilized-layers-samples/${sampleId}`),
  getSamples: () => Api.get(`promedina/stabilized-layers/stabilized-layers-samples/all?limit=2&page=1`),
  getFilteredSamples: (params: any, page: number) =>
    Api.get(
      `promedina/stabilized-layers/stabilized-layers-samples/filter/?filter=${params}&limit=2&need_count=true&page=${page}`
    ),
};

export default samplesService;