import { useEffect, useState, useRef } from 'react';

import { Box, TextField } from '@mui/material';
import { t } from 'i18next';
import DropDown from '@/components/atoms/inputs/dropDown';
import COARSE_AGGREGATE_SERVICE from '@/services/concrete/essays/coarseAggregate/coarseAggregate.service';
import Loading from '@/components/molecules/loading';
import { ConcreteMaterial } from '@/interfaces/concrete';
import useAuth from '@/contexts/auth';
import useCoarseAggregateStore from '@/stores/concrete/coarseAggregate/coarseAggregate.store';
import { toast } from 'react-toastify';
import { EssayPageProps } from '@/components/templates/essay';

const CoarseAggregate_GeneralData = ({
  nextDisabled,
  setNextDisabled,
  coarseAggregate,
}: EssayPageProps & { coarseAggregate: COARSE_AGGREGATE_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [materials, setMaterials] = useState<ConcreteMaterial[]>([]);
  const { user } = useAuth();
  const { generalData, setData } = useCoarseAggregateStore();
  const hasLoaded = useRef(false);

  // 🔥 CORREÇÃO: Carrega materiais corretamente
  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const loadMaterials = async () => {
      const loadingToast = toast.loading(t('loading.materials.pending'));
      
      try {
        setLoading(true);
        const data = await coarseAggregate.getmaterialsByUserId(user._id);
        
        console.log('📦 Materiais CoarseAggregate:', data);
        
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
          render: t('loading.materials.success'),
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      } catch (error) {
        console.error('Erro ao carregar materiais:', error);
        toast.update(loadingToast, {
          render: t('loading.materials.error'),
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
  }, [user._id, coarseAggregate]);

  const inputs = [
    { label: t('concrete.experimentName'), value: generalData.experimentName, key: 'experimentName', required: true },
    { label: t('concrete.material'), value: generalData.material, key: 'material', required: true },
  ];

  // 🔥 Verificação de campos preenchidos
  useEffect(() => {
    const allRequiredFilled = inputs.every(({ required, value }) => {
      if (!required) return true;
      if (value === null || value === undefined) return false;
      if (typeof value === 'string' && value.trim() === '') return false;
      return true;
    });

    if (allRequiredFilled && nextDisabled) {
      setNextDisabled(false);
    } else if (!allRequiredFilled && !nextDisabled) {
      setNextDisabled(true);
    }
  }, [generalData.experimentName, generalData.material, nextDisabled, setNextDisabled]);

  // 🔥 Encontra o material selecionado
  const selectedMaterial = generalData.material?._id
    ? materials.find((m) => m._id === generalData.material?._id)
    : null;

  const defaultMaterial = selectedMaterial ? {
    label: `${selectedMaterial.name} | ${t('materials.' + selectedMaterial.type)}`,
    value: selectedMaterial,
  } : { label: '', value: null };

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
          gridTemplateColumns: '1fr',
          gap: '5px 20px',
        }}
      >
        <TextField
          variant="standard"
          key={inputs[0].key}
          label={inputs[0].label}
          value={inputs[0].value || ''}
          required={inputs[0].required}
          onChange={(e) => setData({ step: 0, key: inputs[0].key, value: e.target.value })}
        />
        
        {/* 🔥 SÓ RENDERIZA O DROPDOWN SE TIVER MATERIAIS */}
        {materials && materials.length > 0 ? (
          <DropDown
            key={inputs[1].key}
            variant="standard"
            label={inputs[1].label}
            options={materials.map((material: ConcreteMaterial) => ({
              label: `${material.name} | ${t('materials.' + material.type)}`,
              value: material,
            }))}
            value={defaultMaterial}
            callback={(value) => setData({ step: 0, key: inputs[1].key, value })}
            size="medium"
            required={inputs[1].required}
          />
        ) : (
          <TextField
            variant="standard"
            label={inputs[1].label}
            value="Nenhum material encontrado"
            disabled
            error
            helperText="Cadastre materiais primeiro"
          />
        )}
      </Box>
    </Box>
  );
};

export default CoarseAggregate_GeneralData;