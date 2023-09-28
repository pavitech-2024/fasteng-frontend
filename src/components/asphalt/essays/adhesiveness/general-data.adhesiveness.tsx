import DropDown from '@/components/atoms/inputs/dropDown';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import ADHESIVENESS_SERVICE from '@/services/asphalt/essays/adhesiveness/adhesiveness.service';
import useAdhesivenessStore from '@/stores/asphalt/adhesiveness.store';
import { Box, TextField } from '@mui/material';
import { t } from 'i18next';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ADHESIVENESS_GeneralData = ({
  nextDisabled,
  setNextDisabled,
  adhesiveness,
}: EssayPageProps & { adhesiveness: ADHESIVENESS_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [materials, setMaterials] = useState<AsphaltMaterial[]>([]);
  const { user } = useAuth();
  const { generalData, setData } = useAdhesivenessStore();

  useEffect(() => {
    toast.promise(
      async () => {
        const materials = await adhesiveness.getMaterialsByUserId(user._id);

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
    { label: t('adhesiveness.experimentName'), value: generalData.name, key: 'name', required: true },
    { label: t('adhesiveness.material'), value: generalData.material, key: 'material', required: true },
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
              gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr' },
              gap: '5px 20px',
            }}
          >
            {inputs.map((input) => {
              if (['name', 'operator', 'calculist'].includes(input.key)) {
                return (
                  <TextField
                    variant="standard"
                    key={input.key}
                    label={input.label}
                    value={input.value}
                    required={input.required}
                    onChange={(e) => setData({ step: 0, key: input.key, value: e.target.value })}
                  />
                );
              } else if (['material'].includes(input.key)) {
                const defaultValue = {
                  label: '',
                  value: '',
                };

                let material;

                // se existir uma material no store, seta ela como default
                if (input.value) {
                  material = materials.find((material) => material._id == input.value['_id']);
                }

                if (material) {
                  defaultValue.label = material.name + ' | ' + t(`${'materials.' + material.type}`);
                  defaultValue.value = material;
                }

                return (
                  <DropDown
                    key={input.key}
                    variant="standard"
                    label={input.label}
                    options={materials.map((material: AsphaltMaterial) => {
                      return { label: material.name + ' | ' + t(`${'materials.' + material.type}`), value: material };
                    })}
                    defaultValue={defaultValue}
                    callback={(value) => setData({ step: 0, key: input.key, value })}
                    size="medium"
                    required={input.required}
                  />
                );
              }
            })}
          </Box>
        </Box>
      )}
    </>
  );
};

export default ADHESIVENESS_GeneralData;
