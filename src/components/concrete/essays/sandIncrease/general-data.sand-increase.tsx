import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import { t } from 'i18next';
import { useState, useEffect } from 'react';
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
  useEffect(() => {
    toast.promise(
      async () => {
        const data = await sandIncrease.getmaterialsByUserId(user._id);

        setMaterials(data[0].materials);
        setLoading(false);
      },
      {
        pending: t('loading.materials.pending'),
        success: t('loading.materials.success'),
        error: t('loading.materials.error'),
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              if (['name'].includes(input.key)) {
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

                // se existir um material no store, seta ela como default
                if (input.value) {
                  material = materials.find((material) => material._id == input.value['_id']);
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
                    options={materials.map((material: ConcreteMaterial) => {
                      return {
                        label: material.name + ' | ' + t(`${'concrete.materials.' + material.type}`),
                        value: material,
                      };
                    })}
                    value={defaultValue}
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

export default SandIncrease_GeneralData;
