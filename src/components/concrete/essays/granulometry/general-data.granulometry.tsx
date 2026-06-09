import { Box, TextField } from '@mui/material';
import { t } from 'i18next';
import DropDown from '@/components/atoms/inputs/dropDown';
import ConcreteGranulometry_SERVICE from '@/services/concrete/essays/granulometry/granulometry.service';
import Loading from '@/components/molecules/loading';
import { ConcreteMaterial } from '@/interfaces/concrete';
import { useEffect, useState, useRef } from 'react';
import useAuth from '@/contexts/auth';
import useConcreteGranulometryStore from '@/stores/concrete/granulometry/granulometry.store';
import { toast } from 'react-toastify';
import { EssayPageProps } from '@/components/templates/essay';

const ConcreteGranulometry_GeneralData = ({
  nextDisabled,
  setNextDisabled,
  granulometry,
}: EssayPageProps & { granulometry: ConcreteGranulometry_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [materials, setMaterials] = useState<ConcreteMaterial[]>([]);
  const { user } = useAuth();
  const { generalData, setData } = useConcreteGranulometryStore();
  const hasLoaded = useRef(false);

  // 🔥 CORREÇÃO: Carrega materiais corretamente
  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const loadMaterials = async () => {
      const loadingToast = toast.loading(t('loading.materials.pending'));
      
      try {
        setLoading(true);
        const data = await granulometry.getmaterialsByUserId(user._id);
        
        
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
  }, [user._id, granulometry]);

  const inputs = [
    { label: t('concrete.experimentName'), value: generalData.name, key: 'name', required: true },
    { label: t('concrete.material'), value: generalData.material, key: 'material', required: true },
    { label: t('concrete.operator'), value: generalData.operator, key: 'operator', required: false },
    { label: t('concrete.calculist'), value: generalData.calculist, key: 'calculist', required: false },
    { label: t('concrete.comments'), value: generalData.description, key: 'description', required: false },
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
  }, [generalData.name, generalData.material, generalData.operator, generalData.calculist, generalData.description, nextDisabled, setNextDisabled]);

  // 🔥 Encontra o material selecionado
  const selectedMaterial = generalData.material?._id
    ? materials.find((m) => m._id === generalData.material?._id)
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
        <TextField
          variant="standard"
          key="name"
          label={t('concrete.experimentName')}
          value={generalData.name || ''}
          required
          onChange={(e) => setData({ step: 0, key: 'name', value: e.target.value })}
        />
        
        {/* 🔥 DROPDOWN DE MATERIAL CORRIGIDO */}
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
        
        <TextField
          variant="standard"
          key="operator"
          label={t('concrete.operator')}
          value={generalData.operator || ''}
          onChange={(e) => setData({ step: 0, key: 'operator', value: e.target.value })}
        />
        
        <TextField
          variant="standard"
          key="calculist"
          label={t('concrete.calculist')}
          value={generalData.calculist || ''}
          onChange={(e) => setData({ step: 0, key: 'calculist', value: e.target.value })}
        />
      </Box>
      
      <TextField
        variant="standard"
        fullWidth
        key="description"
        label={t('concrete.comments')}
        value={generalData.description || ''}
        onChange={(e) => setData({ step: 0, key: 'description', value: e.target.value })}
        sx={{ mt: 2 }}
      />
    </Box>
  );
};

export default ConcreteGranulometry_GeneralData;