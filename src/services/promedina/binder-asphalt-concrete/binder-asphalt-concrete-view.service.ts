import Api from '@/api';
import { SampleData } from '@/interfaces/soils';
import { BinderAsphaltConcreteData } from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';

const samplesService = {
  createSample: (sampleData: SampleData) => Api.post('soils/samples', sampleData),
  saveSample: (sampleData: BinderAsphaltConcreteData) =>
    Api.post(`promedina/binder-asphalt-concrete/binder-asphalt-concrete-samples/save`, sampleData),
  deleteSample: (sampleId: string) =>
    Api.delete(`promedina/binder-asphalt-concrete/binder-asphalt-concrete-samples/${sampleId}`),
  getSamples: () => Api.get(`promedina/binder-asphalt-concrete/binder-asphalt-concrete-samples/all?limit=2&page=1`),
  updateSample: (sampleId: string, sampleData: BinderAsphaltConcreteData) =>
    Api.put(`promedina/binder-asphalt-concrete/binder-asphalt-concrete-samples/${sampleId}`, sampleData),
  getFilteredSamples: (params: any, page: number, limit: number, need_count: boolean) =>
    Api.get(
      `promedina/binder-asphalt-concrete/binder-asphalt-concrete-samples/filter/?filter=${params}&limit=${limit}&need_count=${need_count}&page=${page}`
    ),
  getSample: (sampleId: string) =>
    Api.get(`promedina/binder-asphalt-concrete/binder-asphalt-concrete-samples/${sampleId}`),
};

export default samplesService;
