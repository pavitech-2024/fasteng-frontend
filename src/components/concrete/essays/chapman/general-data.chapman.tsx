import { useState, useEffect, useRef } from 'react';
import CHAPMAN_SERVICE from '../../../../services/concrete/essays/chapman/chapman.service';
import { EssayPageProps } from '../../../templates/essay';
import { ConcreteMaterial } from '../../../../interfaces/concrete';
import useAuth from '../../../../contexts/auth';
import useChapmanStore from '../../../../stores/concrete/chapman/chapman.store';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import Loading from '../../../molecules/loading';
import { Box, TextField } from '@mui/material';
import DropDown from '../../../atoms/inputs/dropDown';

const CHAPMAN_GeneralData = ({
  nextDisabled,
  setNextDisabled,
  chapman,
}: EssayPageProps & { chapman: CHAPMAN_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [materials, setMaterials] = useState<ConcreteMaterial[]>([]);
  const { user } = useAuth();
  const { generalData, setData } = useChapmanStore();
  
  // 🔥 Use um ref para controlar se já carregou
  const hasLoaded = useRef(false);

  useEffect(() => {
    // 🔥 Só carrega uma vez
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const loadMaterials = async () => {
      try {
        setLoading(true);
        const data = await chapman.getmaterialsByUserId(user._id);
        
        if (Array.isArray(data)) {
          setMaterials(data);
          toast.success(t('loading.materials.success'));
        } else {
          setMaterials([]);
          toast.error('Estrutura de dados inesperada');
        }
      } catch (error) {
        console.error('Erro ao carregar materiais:', error);
        toast.error(t('loading.materials.error'));
      } finally {
        setLoading(false);
      }
    };

    loadMaterials();
  }, [user._id, chapman]); // Dependências corretas

  // 🔥 Verificação de preenchimento
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
  }, [generalData.name, generalData.material, nextDisabled, setNextDisabled]);

  const inputs = [
    { label: t('chapman.experimentName'), value: generalData.name, key: 'name', required: true },
    { label: t('chapman.material'), value: generalData.material, key: 'material', required: true },
  ];

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
          label={t('chapman.experimentName')}
          value={generalData.name || ''}
          required={true}
          onChange={(e) => setData({ step: 0, key: 'name', value: e.target.value })}
        />
        
        {materials && materials.length > 0 ? (
          <DropDown
            key={materials.length} // 🔥 Adiciona key para evitar re-render desnecessário
            variant="standard"
            label={t('chapman.material')}
            options={materials.map((material) => ({
              label: `${material.name} | ${t('concrete.materials.' + material.type)}`,
              value: material,
            }))}
            value={
              generalData.material?._id
                ? {
                    label: generalData.material.name + ' | ' + t('concrete.materials.' + generalData.material.type),
                    value: generalData.material,
                  }
                : { label: '', value: '' }
            }
            required={true}
            size="medium"
            callback={(value) => {
              console.log('📝 Material selecionado:', value);
              setData({ step: 0, key: 'material', value: value });
            }}
          />
        ) : (
          <TextField
            variant="standard"
            label={t('chapman.material')}
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

export default CHAPMAN_GeneralData;