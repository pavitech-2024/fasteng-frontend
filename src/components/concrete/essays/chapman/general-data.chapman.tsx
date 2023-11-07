import { useState, useEffect } from 'react';
import CHAPMAN_SERVICE from '../../../../services/concrete/essays/chapman/chapman.service';
import { EssayPageProps } from '../../../templates/essay';
import { ConcreteMaterial } from '../../../../interfaces/concrete';
import useAuth from '../../../../contexts/auth';
import useChapmanStore from '../../../../stores/concrete/chapman.store';
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

  useEffect(() => {
    toast.promise(
      async () => {
        const materials = await chapman.getMaterialsByUserId(user._id);

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
    { label: t('chapman.experimentName'), value: generalData.name, key: 'name', required: true },
    { label: t('chapman.material'), value: generalData.material, key: 'material', required: true },
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
              if (input.key === 'name') {
                return (
                  <TextField
                    key={input.key}
                    variant="standard"
                    label={input.label}
                    value={input.value}
                    required={input.required}
                    onChange={(e) => setData({ step: 0, key: input.key, value: e.target.value })}
                  />
                );
              } else if (input.key === 'material') {
                const defaultValue = {
                  label: '',
                  value: '',
                };

                let material;

                // se existir um material no store, seta ela como default

                if (input.value) {
                  material = materials.find((material) => material._id === input.value);
                }

                if (material) {
                  defaultValue.label = material.name + ' | ' + t(`${'concrete.materials.' + material.type}`);
                  defaultValue.value = material;
                }

                return (
                  <DropDown
                    key={input.key}
                    variant="standard"
                    label={input.label}
                    options={materials.map((material) => {
                      return { label: material.name + ' | ' + t(`${'concrete.materials.' + material.type}`), value: material };
                    })}
                    defaultValue={defaultValue}
                    required={input.required}
                    size="medium"
                    callback={(value) => setData({ step: 0, key: input.key, value: value })}
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

export default CHAPMAN_GeneralData;
