import Api from '@/api';
import { MarshallDosageData } from '@/interfaces/asphalt/marshall';

const marshallDosageService = {
  createMarshallDosage: (marshallDosageData: MarshallDosageData) =>
    Api.post('asphalt/dosages/marshall', marshallDosageData),

  deleteMarshallDosage: (marshallDosageId: string) => Api.delete(`asphalt/dosages/marshall/${marshallDosageId}`),

  getMarshallDosagesByUserId: (userId: string) => Api.get(`asphalt/dosages/marshall/all/${userId}`),

  getMarshallDosage: (dosageId: string) => Api.get(`asphalt/dosages/marshall/by-id/${dosageId}`),
};

export default marshallDosageService;
