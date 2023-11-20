import Api from '@/api';
import { SampleData } from '@/interfaces/soils';

// const samplesService = {
//   createSample: (sampleData: SampleData) => Api.post('soils/samples', sampleData),
//   deleteSample: (sampleId: string) => Api.delete(`soils/samples/${sampleId}`),
//   getSamplesByUserId: (userId: string) => Api.get(`soils/samples/all/${userId}`),
// };

const samplesService = {
  createSample: (sampleData: SampleData) => Api.post('soils/samples', sampleData),
  deleteSample: (sampleId: string) => Api.delete(`soils/samples/${sampleId}`),
  getSamplesByUserId: () => Api.get(`promedina/granular-layers/granular-layers-samples/all`),
};

export default samplesService;
