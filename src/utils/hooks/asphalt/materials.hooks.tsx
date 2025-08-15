import { useState, useEffect, useCallback } from 'react';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import useAuth from '@/contexts/auth';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import Rtcd_SERVICE from '@/services/asphalt/essays/rtcd/rtcd.service';
import Ddui_SERVICE from '@/services/asphalt/essays/ddui/ddui.service';
import Fwd_SERVICE from '@/services/asphalt/essays/fwd/fwd.service';
import Igg_SERVICE from '@/services/asphalt/essays/igg/igg.service';

type EssayTypes = 'fwd' | 'igg' | 'rtcd' | 'ddui';
type FilterTypes = 'name' | 'type' | 'mix' | 'stretch';

/**
 * Custom hook to manage the state and loading of materials and essays from the backend.
 *
 * @return {Object} An object containing the materials, essays, loading state, and functions to load, delete, add, and edit materials.
 */
export default function useMaterials() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<AsphaltMaterial[]>([]);
  const [fwdEssays, setFwdEssays] = useState([]);
  const [iggEssays, setIggEssays] = useState([]);
  const [rtcdEssays, setRtcdEssays] = useState([]);
  const [dduiEssays, setDduiEssays] = useState([]);
  const [loading, setLoading] = useState(true);

  const { deleteRtcdEssay } = new Rtcd_SERVICE();
  const { deleteDduiEssay } = new Ddui_SERVICE();
  const { deleteFwdEssay } = new Fwd_SERVICE();
  const { deleteIggEssay } = new Igg_SERVICE();

  // Estados para edição de material
  const [materialToEdit, setMaterialToEdit] = useState<AsphaltMaterial | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  /**
   * Load materials from the backend.
   *
   * @return {Promise<void>} Promise that resolves when the materials are loaded.
   */
  const loadMaterials = useCallback(async () => {
    if (!user?._id) return;

    setLoading(true);
    try {
      const response = await materialsService.getMaterialsByUserId(user._id);
      const data = response.data[0];
      setMaterials(data.materials);
      setFwdEssays(data.fwdEssays);
      setIggEssays(data.iggEssays);
      setRtcdEssays(data.rtcdEssays);
      setDduiEssays(data.dduiEssays);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  /**
   * Deletes a material or essay based on the provided parameters.
   *
   * @param {string} id - The ID of the material or essay to be deleted.
   * @param {FilterTypes} filter - The type of filter used to identify the material or essay.
   * @param {EssayTypes} [essayType] - The type of essay if the filter is 'mix'.
   * @return {Promise<void>} A promise that resolves when the material or essay is deleted and the materials are reloaded.
   */
  const handleDeleteMaterial = useCallback(
    async (id: string, filter: FilterTypes, essayType?: EssayTypes) => {
      try {
        switch (filter.toLowerCase()) {
          case 'name':
          case 'type':
            await materialsService.deleteMaterial(id);
            break;
          case 'mix':
            if (essayType === 'rtcd') await deleteRtcdEssay(id);
            else if (essayType === 'ddui') await deleteDduiEssay(id);
            break;
          case 'stretch':
            if (essayType === 'fwd') await deleteFwdEssay(id);
            else if (essayType === 'igg') await deleteIggEssay(id);
            break;
          default:
            break;
        }
        await loadMaterials(); // Recarrega os materiais após delete
      } catch (error) {
        console.error('Failed to delete material:', error);
      }
    },
    [loadMaterials]
  );

  /**
   * Adds a new material to the list of materials.
   *
   * @return {Promise<void>} A promise that resolves when the materials are reloaded.
   */
  const addNewMaterial = useCallback(async () => {
    setLoading(true);
    try {
      const response = await materialsService.getMaterialsByUserId(user._id);
      const data = response.data[0];
      setMaterials(data.materials);
      setFwdEssays(data.fwdEssays);
      setIggEssays(data.iggEssays);
      setRtcdEssays(data.rtcdEssays);
      setDduiEssays(data.dduiEssays);
    } catch (error) {
      console.error('Failed to load materials:', error);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  /**
   * Prepares the material to be edited.
   *
   * @param {string} materialId - The ID of the material to be edited.
   * @return {void} This function does not return anything.
   */
  const handleEditMaterial = useCallback(
    (materialId: string) => {
      try {
        const selectedMaterial = materials.find((m) => m._id === materialId) || null;
        setMaterialToEdit(selectedMaterial);
        setIsEdit(true);
        setOpenModal(true);
      } catch (error) {
        console.error('Failed to get the selected material to edit:', error);
      }
    },
    [materials]
  );

  useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);

  return {
    materials,
    fwdEssays,
    iggEssays,
    rtcdEssays,
    dduiEssays,
    loading,
    materialToEdit,
    isEdit,
    openModal,
    setIsEdit,
    setMaterialToEdit,
    loadMaterials,
    handleDeleteMaterial,
    addNewMaterial,
    handleEditMaterial,
    setOpenModal
  };
}
