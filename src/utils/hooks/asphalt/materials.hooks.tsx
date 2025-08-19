import { useState, useEffect, useCallback } from 'react';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import useAuth from '@/contexts/auth';
import Rtcd_SERVICE from '@/services/asphalt/essays/rtcd/rtcd.service';
import Ddui_SERVICE from '@/services/asphalt/essays/ddui/ddui.service';
import Fwd_SERVICE from '@/services/asphalt/essays/fwd/fwd.service';
import Igg_SERVICE from '@/services/asphalt/essays/igg/igg.service';
import samplesService from '@/services/soils/soils-samples.service';
import concreteMaterialsService from '@/services/concrete/concrete-materials.service';

type EssayTypes = 'fwd' | 'igg' | 'rtcd' | 'ddui';
type FilterTypes = 'name' | 'type' | 'mix' | 'stretch';

export const useMaterials = (domain: 'asphalt' | 'soils' | 'concrete') => {
  const { user } = useAuth();

  const [materials, setMaterials] = useState<any[]>([]);
  const [fwdEssays, setFwdEssays] = useState<any[]>([]);
  const [iggEssays, setIggEssays] = useState<any[]>([]);
  const [rtcdEssays, setRtcdEssays] = useState<any[]>([]);
  const [dduiEssays, setDduiEssays] = useState<any[]>([]);

  const { deleteRtcdEssay } = new Rtcd_SERVICE();
  const { deleteDduiEssay } = new Ddui_SERVICE();
  const { deleteFwdEssay } = new Fwd_SERVICE();
  const { deleteIggEssay } = new Igg_SERVICE();

  const [loading, setLoading] = useState(false);

  const [materialToEdit, setMaterialToEdit] = useState<any | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const servicesMap = {
    asphalt: {
      getByUserId: (userId: string) => materialsService.getMaterialsByUserId(userId),
      deleteById: (id: string) => materialsService.deleteMaterial(id),
    },
    soils: {
      getByUserId: (userId: string) => samplesService.getSamplesByUserId(userId),
      deleteById: (id: string) => samplesService.deleteSample(id),
    },
    concrete: {
      getByUserId: (userId: string) => concreteMaterialsService.getMaterialsByUserId(userId),
      deleteById: (id: string) => concreteMaterialsService.deleteMaterial(id),
    },
  };

  const service = servicesMap[domain];

  const loadMaterials = useCallback(async () => {
    if (!user?._id) return;

    setLoading(true);
    try {
      const response = await service.getByUserId(user._id);

      if (domain === 'asphalt') {
        // asphalt retorna um objeto { materials, fwdEssays, iggEssays, rtcdEssays, dduiEssays }
        const data = response.data[0];
        setMaterials(data.materials);
        setFwdEssays(data.fwdEssays);
        setIggEssays(data.iggEssays);
        setRtcdEssays(data.rtcdEssays);
        setDduiEssays(data.dduiEssays);
      } else {
        // soils e concrete retornam só os materiais
        setMaterials(response.data);
      }
    } catch (err) {
      console.error(`Failed to load ${domain} materials:`, err);
    } finally {
      setLoading(false);
    }
  }, [domain, user?._id]);

  const handleDeleteMaterial = useCallback(
    async (id: string, filter?: FilterTypes, essayType?: EssayTypes) => {
      try {
        if (domain === 'asphalt') {
          switch (filter?.toLowerCase()) {
            case 'name':
            case 'type':
              await service.deleteById(id);
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
              console.warn('Unknown filter for asphalt deletion:', filter);
              break;
          }
        } else {
          // soils ou concrete
          await service.deleteById(id);
        }

        // Sempre recarrega materiais após delete
        await loadMaterials();
      } catch (error) {
        console.error(`Failed to delete ${domain} material:`, error);
      }
    },
    [domain, loadMaterials]
  );

  const addNewMaterial = useCallback(async () => {
    if (!user?._id) return;

    setLoading(true);
    try {
      const response = await service.getByUserId(user._id);

      if (domain === 'asphalt') {
        const data = response.data[0];
        setMaterials(data.materials);
        setFwdEssays(data.fwdEssays);
        setIggEssays(data.iggEssays);
        setRtcdEssays(data.rtcdEssays);
        setDduiEssays(data.dduiEssays);
      } else {
        setMaterials(response.data);
      }
    } catch (error) {
      console.error('Failed to load materials:', error);
    } finally {
      setLoading(false);
    }
  }, [domain, user?._id]);

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
    loadMaterials,
    handleDeleteMaterial,
    addNewMaterial,
    handleEditMaterial,
    materialToEdit,
    isEdit,
    setIsEdit,
    setMaterialToEdit,
    openModal,
    setOpenModal,
  };
};
