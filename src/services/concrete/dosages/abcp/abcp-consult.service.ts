import Api from '@/api';
import { AbcpDosageData } from '@/interfaces/concrete/abcp';

const abcpDosageService = {
  createAbcpDosage: (abcpDosageData: AbcpDosageData) => Api.post('concrete/dosages/abcp', abcpDosageData),
  deleteAbcpDosage: (abcpDosageId: string) => Api.delete(`concrete/dosages/abcp/${abcpDosageId}`),
  getAbcpDosagesByUserId: (userId: string) => Api.get(`concrete/dosages/abcp/all/${userId}`),
  getAbcpDosage: (dosageId: string) => Api.get(`concrete/dosages/abcp/${dosageId}`),
};

export default abcpDosageService;
