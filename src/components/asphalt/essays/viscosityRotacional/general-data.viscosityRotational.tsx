import DropDown from '@/components/atoms/inputs/dropDown';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import ViscosityRotational_SERVICE from '@/services/asphalt/essays/viscosityRotational/viscosityRotational.service';
import useViscosityRotationalStore from '@/stores/asphalt/viscosityRotational/viscosityRotational.store';

import { Box, TextField } from '@mui/material';
import { t } from 'i18next';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ViscosityRotational_GeneralData = ({
  nextDisabled,
  setNextDisabled,
  viscosityRotational,
}: EssayPageProps & { viscosityRotational: ViscosityRotational_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [materials, setMaterials] = useState<AsphaltMaterial[]>([]);
  const { user } = useAuth();
  const { generalData, setData } = useViscosityRotationalStore();

  useEffect(() => {
    toast.promise(
      async () => {
        const data = await viscosityRotational.getmaterialsByUserId(user._id);

        const materials = data[0].materials.filter((e) => e.type === 'asphaltBinder' || e.type === 'CAP');

        setMaterials(materials);
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
    { label: t('asphalt.experimentName'), value: generalData.name, key: 'name', required: true },
    { label: t('asphalt.material'), value: generalData.material, key: 'material', required: true },
    { label: t('asphalt.operator'), value: generalData.operator, key: 'operator', required: false },
    { label: t('asphalt.calculist'), value: generalData.calculist, key: 'calculist', required: false },
    { label: t('asphalt.materials.comments'), value: generalData.description, key: 'description', required: false },
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
    <div>
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
                      return {
                        label: material.name + ' | ' + t(`${'asphalt.materials.' + material.type}`),
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
    </div>
  );
};

export default ViscosityRotational_GeneralData;
