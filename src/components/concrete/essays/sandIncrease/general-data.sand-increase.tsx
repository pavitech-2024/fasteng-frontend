import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import { t } from 'i18next';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { Box, TextField } from '@mui/material';
import Loading from '@/components/molecules/loading';
import DropDown from '@/components/atoms/inputs/dropDown';
import { ConcreteMaterial } from '@/interfaces/concrete';
import SAND_INCREASE_SERVICE from '@/services/concrete/essays/sandIncrease/sandIncrease.service';
import useSandIncreaseStore from '@/stores/concrete/sandIncrease/sandIncrease.store';

const SandIncrease_GeneralData = ({
  nextDisabled,
  setNextDisabled,
  sandIncrease,
}: EssayPageProps & { sandIncrease: SAND_INCREASE_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [materials, setMaterials] = useState<ConcreteMaterial[]>([]);
  const { user } = useAuth();
  const { sandIncreaseGeneralData, setData } = useSandIncreaseStore();
  const hasLoaded = useRef(false);

  // 🔥 CORREÇÃO: Carrega materiais corretamente
  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const loadMaterials = async () => {
      const loadingToast = toast.loading(t('loading.materials.pending'));
      
      try {
        setLoading(true);
        const data = await sandIncrease.getmaterialsByUserId(user._id);
        
        
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
  }, [user._id, sandIncrease]);

  const inputs = [
    {
      label: t('concrete.experimentName'),
      value: sandIncreaseGeneralData.name,
      key: 'name',
      required: true,
    },
    {
      label: t('concrete.material'),
      value: sandIncreaseGeneralData.material,
      key: 'material',
      required: true,
    },
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
  }, [sandIncreaseGeneralData.name, sandIncreaseGeneralData.material, nextDisabled, setNextDisabled]);

  // 🔥 Encontra o material selecionado
  const selectedMaterial = sandIncreaseGeneralData.material?._id
    ? materials.find((m) => m._id === sandIncreaseGeneralData.material?._id)
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
          key="name"
          label={t('concrete.experimentName')}
          value={sandIncreaseGeneralData.name || ''}
          required
          onChange={(e) => setData({ step: 0, key: 'name', value: e.target.value })}
        />
        
        {/* Material - 🔥 CORREÇÃO */}
        {materials && materials.length > 0 ? (
          <DropDown
            key="material"
            variant="standard"
            label={t('concrete.material')}
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
            label={t('concrete.material')}
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

export default SandIncrease_GeneralData;