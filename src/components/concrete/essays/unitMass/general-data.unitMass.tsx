/* eslint-disable @typescript-eslint/no-unused-vars */
import { EssayPageProps } from '@/components/templates/essay';
import UNITMASS_SERVICE from '@/services/concrete/essays/unitMass/unitMass.service';
import useUnitMassStore from '@/stores/concrete/unitMass/unitMass.store';
import { Box, TextField } from '@mui/material';
import { t } from 'i18next';
import DropDown from '@/components/atoms/inputs/dropDown';
import React, { useEffect, useState, useRef } from 'react';
import { ConcreteMaterial } from '@/interfaces/concrete';
import concreteMaterialService from '@/services/concrete/concrete-materials.service';
import { toast } from 'react-toastify';
import useAuth from '@/contexts/auth';
import Loading from '@/components/molecules/loading';

const UnitMass_GeneralData = ({
  nextDisabled,
  setNextDisabled,
  unitMass,
}: EssayPageProps & { unitMass: UNITMASS_SERVICE }) => {
  const { generalData, setData } = useUnitMassStore();
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const [materials, setMaterials] = useState<ConcreteMaterial[]>([]);
  const hasLoaded = useRef(false);

  // 🔥 CORREÇÃO: Carrega materiais corretamente (sem data[0].materials)
  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const loadMaterials = async () => {
      const loadingToast = toast.loading(t('loading.samples.pending'));
      
      try {
        setLoading(true);
        const data = await unitMass.getmaterialsByUserId(user._id);
        
        
        // 🔥 CORREÇÃO: Verifica se data já é o array diretamente
        if (Array.isArray(data)) {
          setMaterials(data);
        } else if (data && data[0] && data[0].materials) {
          // Fallback para estrutura antiga
          setMaterials(data[0].materials);
        } else {
          setMaterials([]);
        }
        
        toast.update(loadingToast, {
          render: t('loading.samples.success'),
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      } catch (error) {
        console.error('Erro ao carregar materiais:', error);
        toast.update(loadingToast, {
          render: t('loading.samples.error'),
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
        setMaterials([]);
      } finally {
        setLoading(false);
      }
    };

    loadMaterials();
  }, [user._id, unitMass]);

  const methodOptions = [
    { label: t('unitMass.method.A'), value: 'A', key: 'method' },
    { label: t('unitMass.method.B'), value: 'B', key: 'method' },
    { label: t('unitMass.method.C'), value: 'C', key: 'method' },
  ];

  // 🔥 Verificação de campos preenchidos
  useEffect(() => {
    const isFilled = generalData.experimentName && generalData.method && generalData.material;
    if (isFilled && nextDisabled) {
      setNextDisabled(false);
    } else if (!isFilled && !nextDisabled) {
      setNextDisabled(true);
    }
  }, [generalData.experimentName, generalData.method, generalData.material, nextDisabled, setNextDisabled]);

  // 🔥 Encontra o material selecionado para o dropdown
  const selectedMaterial = generalData.material?.name 
    ? materials.find((m) => m.name === generalData.material?.name || m._id === generalData.material?._id)
    : null;

  if (loading) {
    return <Loading />;
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr' },
          gap: '5px 20px',
        }}
      >
        {/* Nome do experimento */}
        <TextField
          variant="standard"
          key="experimentName"
          label={t('unitMass.experimentName')}
          value={generalData.experimentName || ''}
          required
          onChange={(e) => setData({ step: 0, key: 'experimentName', value: e.target.value })}
          size="medium"
        />
        
        {/* Material escolhido - 🔥 CORREÇÃO COMPLETA */}
        {materials && materials.length > 0 ? (
          <DropDown
            key="material"
            variant="standard"
            label={t('unitMass.material')}
            options={materials.map((material: ConcreteMaterial) => ({
              label: `${material.name} | ${t('concrete.materials.' + material.type)}`,
              value: material,
            }))}
            value={selectedMaterial ? {
              label: `${selectedMaterial.name} | ${t('concrete.materials.' + selectedMaterial.type)}`,
              value: selectedMaterial,
            } : { label: '', value: null }}
            callback={(value) => setData({ step: 0, key: 'material', value })}
            size="medium"
            required
          />
        ) : (
          <TextField
            variant="standard"
            label={t('unitMass.material')}
            value="Nenhum material encontrado"
            disabled
            error
            helperText="Cadastre materiais primeiro"
          />
        )}
        
        {/* Método escolhido */}
        <DropDown
          key="method"
          variant="standard"
          label={t('unitMass.method')}
          options={methodOptions.map((method) => ({ label: method.label, value: method.value }))}
          value={methodOptions.find((option) => option.value === generalData.method) || { label: '', value: null }}
          callback={(value: string) => setData({ step: 0, key: 'method', value })}
          size="medium"
          required
        />
      </Box>
    </Box>
  );
};

export default UnitMass_GeneralData;