import { useEffect, useState } from 'react';

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

  useEffect(() => {
    toast.promise(
      async () => {
        const materials = await coarseAggregate.getmaterialsByUserId(user._id);

        setMaterials(materials);
        setLoading(false);
      },
      {
        pending: t('loading.materials.pending'),
        success: t('loading.materials.success'),
        error: t('loading.materials.error'),
      }
    );
    // se não deixar o array vazio ele vai ficar fazendo requisições infinitas
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inputs = [
    { label: t('concrete.experimentName'), value: generalData.experimentName, key: 'experimentName', required: true },
    { label: t('concrete.material'), value: generalData.material, key: 'material', required: true },
  ];

  // verificar se todos os required estão preenchidos, se sim setNextDisabled(false)
  inputs.every(({ required, value }) => {
    if (!required) return true;

    if (value === null) return false;

    if (typeof value === 'string' && value.trim() === '') return false;

    return true;
  }) &&
    nextDisabled &&
    setNextDisabled(false);

  const defaultMaterial = {
    label: '',
    value: '',
  };

  let material;

  if (inputs[1].value) {
    material = materials.find((material) => material._id == inputs[1].value['_id']);
  }

  if (material) {
    defaultMaterial.label = material.name + ' | ' + t(`${'materials.' + material.type}`);
    defaultMaterial.value = material;
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
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
              value={inputs[0].value}
              required={inputs[0].required}
              onChange={(e) => setData({ step: 0, key: inputs[0].key, value: e.target.value })}
            />
            <DropDown
              key={inputs[1].key}
              variant="standard"
              label={inputs[1].label}
              options={materials.map((material: ConcreteMaterial) => {
                return { label: material.name + ' | ' + t(`${'materials.' + material.type}`), value: material };
              })}
              value={defaultMaterial}
              callback={(value) => setData({ step: 0, key: inputs[1].key, value })}
              size="medium"
              required={inputs[1].required}
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default CoarseAggregate_GeneralData;
