import Api from '@/api';
import { SampleData } from '@/interfaces/soils';

const samplesService = {
  createSample: (sampleData: SampleData) => Api.post('soils/samples', sampleData),
  deleteSample: (sampleId: string) => Api.delete(`soils/samples/${sampleId}`),
  getSamplesByUserId: (userId: string) => Api.get(`soils/samples/all/${userId}`),
  getSample: (sampleId: string) => Api.get(`soils/samples/${sampleId}`),
  editSample: (sampleId: string, sampleData: SampleData) => Api.put(`soils/samples/${sampleId}`, sampleData),
};

export default samplesService;
