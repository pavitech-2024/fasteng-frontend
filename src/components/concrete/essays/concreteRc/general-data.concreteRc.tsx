import DropDown from '@/components/atoms/inputs/dropDown';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import { ConcreteMaterial } from '@/interfaces/concrete';
import CONCRETE_RC_SERVICE from '@/services/concrete/essays/concreteRc/concreteRc.service';
import useConcreteRcStore from '@/stores/concrete/concreteRc/concreteRc.store';
import { Box, TextField } from '@mui/material';
import { t } from 'i18next';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ConcreteRc_GeneralData = ({
  nextDisabled,
  setNextDisabled,
  concreteRc,
}: EssayPageProps & { concreteRc: CONCRETE_RC_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [materials, setMaterials] = useState<ConcreteMaterial[]>([]);
  const { user } = useAuth();
  const { generalData, setData } = useConcreteRcStore();

  useEffect(() => {
    toast.promise(
      async () => {
        const materials = await concreteRc.getmaterialsByUserId(user._id);

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
    { label: t('concrete.experimentName'), value: generalData.name, key: 'name', required: true },
    // Todo-rc: é necessário selecionar um material?
    { label: t('concrete.material'), value: generalData.material, key: 'material', required: true },
    { label: t('concrete.operator'), value: generalData.operator, key: 'operator', required: false },
    { label: t('concrete.calculist'), value: generalData.calculist, key: 'calculist', required: false },
    { label: t('concrete.comments'), value: generalData.description, key: 'description', required: false },
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
                    defaultValue={defaultValue}
                    callback={(value) => setData({ step: 0, key: input.key, value })}
                    size="medium"
                    required={input.required}
                  />
                );
              }
            })}
          </Box>
          <TextField
            variant="standard"
            fullWidth
            key={inputs[inputs.length - 1].key}
            label={inputs[inputs.length - 1].label}
            value={inputs[inputs.length - 1].value}
            required={inputs[inputs.length - 1].required}
            onChange={(e) => setData({ step: 0, key: inputs[inputs.length - 1].key, value: e.target.value })}
          />
        </Box>
      )}
    </>
  );
};

export default ConcreteRc_GeneralData;
