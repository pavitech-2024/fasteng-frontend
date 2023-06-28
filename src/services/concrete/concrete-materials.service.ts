import Api from "@/api";
import { ConcreteMaterialData } from "@/interfaces/concrete";

const concreteMaterialService = {
  createMaterial: (concreteMateriaData: ConcreteMaterialData) => Api.post('concrete/materials', concreteMateriaData),
  deleteMaterial: (concreteMaterialId: string) => Api.delete(`concrete/materials/${concreteMaterialId}`),
  getMaterialsByUserId: (userId: string) => Api.get(`concrete/materials/all/${userId}`),
};

export default concreteMaterialService;