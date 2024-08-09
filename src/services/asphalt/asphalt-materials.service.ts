import Api from '@/api';
import { AsphaltMaterialData } from '@/interfaces/asphalt';

const materialsService = {
  createMaterial: (materialData: AsphaltMaterialData) => Api.post('asphalt/materials', materialData),
  deleteMaterial: (materialId: string) => Api.delete(`asphalt/materials/${materialId}`),
  getMaterialsByUserId: (userId: string) => Api.get(`asphalt/materials/all/${userId}`),
  getMaterial: (materialId: string) => Api.get(`asphalt/materials/${materialId}`),
  getMaterials: (ids: string[]) => Api.get(`asphalt/materials/selected/${ids}`)
};

export default materialsService;
