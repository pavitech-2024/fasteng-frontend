import Api from '@/api';
import { SuperpaveDosageData } from '@/interfaces/asphalt/superpave';

const superpaveDosageService = {
  createSuperpaveDosage: (superpaveDosageData: SuperpaveDosageData) =>
    Api.post('asphalt/dosages/superpave', superpaveDosageData),
  deleteSuperpaveDosage: (superpaveDosageId: string) => Api.delete(`asphalt/dosages/superpave/${superpaveDosageId}`),
  getSuperpaveDosagesByUserId: (userId: string) => Api.get(`asphalt/dosages/superpave/all/${userId}`),
  getSuperpaveDosage: (dosageId: string) => Api.get(`asphalt/dosages/superpave/${dosageId}`),
};

export default superpaveDosageService;