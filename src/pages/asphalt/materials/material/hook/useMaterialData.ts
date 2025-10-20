
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { MaterialData, MaterialState, GranulometryEssay } from '@/pages/asphalt/materials/material/types/material.types';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import AsphaltGranulometry_SERVICE from '@/services/asphalt/essays/granulometry/granulometry.service';
import { t } from 'i18next';

export const useMaterialData = () => {
  const router = useRouter();
  const query = router.query;
  const id = query.id?.toString();

  const [loading, setLoading] = useState(true);
  const [material, setMaterial] = useState<MaterialData>();
  const [materialState, setMaterialState] = useState<MaterialState>({});
  const [materialType, setMaterialType] = useState('');
  const [granulometryEssays, setGranulometryEssays] = useState<GranulometryEssay[]>([]);

  // Buscar dados do material
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response = await materialsService.getMaterial(id);
        setMaterial(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load samples:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Buscar ensaios de granulometria
  useEffect(() => {
    const fetchGranulometryEssays = async () => {
      if (!material?.material?._id) return;

      try {
        const granulometryService = new AsphaltGranulometry_SERVICE();
        const response = await granulometryService.getEssaysByMaterialId(material.material._id);
        setGranulometryEssays(Array.isArray(response) ? response : response || []);
      } catch (error) {
        console.error('Erro ao buscar ensaios de granulometria:', error);
      }
    };

    fetchGranulometryEssays();
  }, [material]);

  // Processar dados dos ensaios
  useEffect(() => {
    if (!material?.essays || !material?.material?.type) return;

    const newState: MaterialState = {};
    const materialType = material.material.type;

    const essayConfigs = [
      { essayName: 'granulometry', materialTypes: ['coarseAggregate', 'fineAggregate', 'filler'], setter: 'granulometryData' },
      { essayName: 'specificMass', materialTypes: ['coarseAggregate', 'fineAggregate', 'filler'], setter: 'specificMassData' },
      { essayName: 'shapeIndex', materialTypes: ['coarseAggregate'], setter: 'shapeIndexData' },
      { essayName: 'elongatedParticles', materialTypes: ['coarseAggregate'], setter: 'elongatedParticlesData' },
      { essayName: 'adhesiveness', materialTypes: ['coarseAggregate'], setter: 'adhesivenessData' },
      { essayName: 'losAngelesAbrasion', materialTypes: ['coarseAggregate'], setter: 'losAngelesAbrasionData' },
      { essayName: 'sandEquivalent', materialTypes: ['fineAggregate', 'filler'], setter: 'sandEquivalentData' },
      { essayName: 'angularity', materialTypes: ['fineAggregate'], setter: 'angularityData' },
      { essayName: 'viscosityRotational', materialTypes: ['asphaltBinder', 'CAP'], setter: 'viscosityRotationalData' },
      { essayName: 'penetration', materialTypes: ['asphaltBinder', 'CAP'], setter: 'penetrationData' },
      { essayName: 'softeningPoint', materialTypes: ['asphaltBinder', 'CAP'], setter: 'softeningPointData' },
      { essayName: 'flashPoint', materialTypes: ['asphaltBinder', 'CAP'], setter: 'flashPointData' },
      { essayName: 'ductility', materialTypes: ['asphaltBinder', 'CAP'], setter: 'ductilityData' },
      { essayName: 'rtfo', materialTypes: ['asphaltBinder', 'CAP'], setter: 'rtfoData' },
      { essayName: 'elasticRecovery', materialTypes: ['CAP'], setter: 'elasticRecoveryData' },
    ];
/*
    essayConfigs.forEach(({ essayName, materialTypes, setter }) => {
      if (materialTypes.includes(materialType)) {
        const essay = material.essays.find(e => e.essayName === essayName);
        if (essay) {
          newState[setter as keyof MaterialState] = essay.data;
        }
      }
    });
    */
//sem grafico sobrepondo  
  essayConfigs.forEach(({ essayName, materialTypes, setter }) => {
  if (materialTypes.includes(materialType)) {
    const essay = material.essays.find(e => e.essayName === essayName);

    if (essay) {
      const essayData = (essay.data as any)[setter]; // acesso seguro dinâmico

      if (essayData) {
        newState[setter as keyof MaterialState] = essayData;
      }
    }
  }
}); 
    setMaterialState(newState);
  }, [material]);

  // Definir tipo do material traduzido
  useEffect(() => {
    if (!material?.material.type) return;

    const typeMap = {
      'CAP': t('asphalt.materials.cap'),
      'asphaltBinder': t('asphalt.materials.asphaltBinder'),
      'coarseAggregate': t('asphalt.materials.coarseAggregate'),
      'filler': t('asphalt.materials.filler'),
      'fineAggregate': t('asphalt.materials.fineAggregate'),
      'other': t('asphalt.materials.other'),
    };

    setMaterialType(typeMap[material.material.type as keyof typeof typeMap] || material.material.type);
  }, [material]);

  const hasContent = Object.values(materialState).some(Boolean);

  return {
    loading,
    material,
    materialState,
    materialType,
    granulometryEssays,
    hasContent,
  };
};