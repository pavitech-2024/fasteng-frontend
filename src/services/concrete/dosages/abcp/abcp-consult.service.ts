import Api from '@/api';
import { AcpDosageData } from '@/interfaces/concrete/abcp';

const abcpDosageService = {
  createAbcpDosage: (abcpDosageData: AcpDosageData) => Api.post('concrete/materials', abcpDosageData),
  deleteAbcpDosage: (abcpDosageId: string) => Api.delete(`concrete/materials/${abcpDosageId}`),
  getAbcpDosagesByUserId: (userId: string) => Api.get(`concrete/dosages/abcp/all/${userId}`),
  getAbcpDosage: (dosageId: string) => Api.get(`concrete/dosages/abcp/${dosageId}`),
};

export default abcpDosageService;
