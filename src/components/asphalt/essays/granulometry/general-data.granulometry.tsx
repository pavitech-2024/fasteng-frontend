import DropDown from '@/components/atoms/inputs/dropDown';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import AsphaltGranulometry_SERVICE from '@/services/asphalt/essays/granulometry/granulometry.service';
import useAsphaltGranulometryStore from '@/stores/asphalt/granulometry/asphalt-granulometry.store';
import { Box, TextField } from '@mui/material';
import { t } from 'i18next';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const AsphaltGranulometry_GeneralData = ({
  nextDisabled,
  setNextDisabled,
  granulometry,
}: EssayPageProps & { granulometry: AsphaltGranulometry_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [materials, setMaterials] = useState<AsphaltMaterial[]>([]);
  const { user } = useAuth();
  const { generalData, setData } = useAsphaltGranulometryStore();
  const hasLoaded = useRef(false); // evita chamadas duplicadas

  useEffect(() => {
    if (hasLoaded.current) return; // garante execução única
    hasLoaded.current = true;

    toast.promise(
      (async () => {
        try {
          const response = await granulometry.getmaterialsByUserId(user._id);

          let materialsArray: AsphaltMaterial[] = [];

          // A resposta é um array que contém um objeto com a propriedade materials
          if (Array.isArray(response) && response.length > 0) {
            const firstItem = response[0];
            if (firstItem && typeof firstItem === 'object' && 'materials' in firstItem) {
              materialsArray = firstItem.materials || [];
            }
          }

          // Filtrar apenas os tipos desejados
          const filteredMaterials = materialsArray.filter(
            (material) =>
              material.type === 'coarseAggregate' ||
              material.type === 'fineAggregate' ||
              material.type === 'filler'
          );

          setMaterials(filteredMaterials);
        } catch (error) {
          throw error;
        } finally {
          setLoading(false);
        }
      })(),
      {
        pending: t('loading.materials.pending'),
        success: t('loading.materials.success'),
        error: t('loading.materials.error'),
      }
    );
  }, [granulometry, user._id, t]);

  useEffect(() => {
    const allRequiredFilled = [
      { required: true, value: generalData.name },
      { required: true, value: generalData.material },
    ].every(({ required, value }) => {
      if (!required) return true;
      if (value === null || value === undefined) return false;
      if (typeof value === 'string' && value.trim() === '') return false;
      if (typeof value === 'object' && Object.keys(value).length === 0) return false;
      return true;
    });

    if (allRequiredFilled && nextDisabled) {
      setNextDisabled(false);
    } else if (!allRequiredFilled && !nextDisabled) {
      setNextDisabled(true);
    }
  }, [generalData, nextDisabled, setNextDisabled]);

  const inputs = [
    { label: t('asphalt.experimentName'), value: generalData.name, key: 'name', required: true },
    { label: t('asphalt.material'), value: generalData.material, key: 'material', required: true },
    { label: t('asphalt.operator'), value: generalData.operator, key: 'operator', required: false },
    { label: t('asphalt.calculist'), value: generalData.calculist, key: 'calculist', required: false },
    { label: t('asphalt.comments'), value: generalData.description, key: 'description', required: false },
  ];

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
                    value={input.value || ''}
                    required={input.required}
                    onChange={(e) => setData({ step: 0, key: input.key, value: e.target.value })}
                  />
                );
              } else if (['material'].includes(input.key)) {
                const defaultValue = {
                  label: '',
                  value: null as any,
                };

                let material;

                if (input.value && typeof input.value === 'object' && '_id' in input.value) {
                  const materialValue = input.value as AsphaltMaterial;
                  material = materials.find((m) => m._id == materialValue._id);
                }

                if (material) {
                  defaultValue.label = material.name + ' | ' + t(`asphalt.materials.${material.type}`);
                  defaultValue.value = material;
                }

                return (
                  <DropDown
                    key={input.key}
                    variant="standard"
                    label={input.label}
                    options={materials.map((material: AsphaltMaterial) => ({
                      label: material.name + ' | ' + t(`asphalt.materials.${material.type}`),
                      value: material,
                    }))}
                    value={defaultValue}
                    callback={(value) => setData({ step: 0, key: input.key, value })}
                    size="medium"
                    required={input.required}
                    sx={{
                      '& .MuiSelect-select': {
                        padding: '8px 0 8px 0',
                      },
                    }}
                  />
                );
              }
              return null;
            })}
          </Box>
          <TextField
            variant="standard"
            fullWidth
            key={inputs[inputs.length - 1].key}
            label={inputs[inputs.length - 1].label}
            value={inputs[inputs.length - 1].value || ''}
            required={inputs[inputs.length - 1].required}
            onChange={(e) => setData({ step: 0, key: inputs[inputs.length - 1].key, value: e.target.value })}
            sx={{ mt: 2 }}
          />
        </Box>
      )}
    </div>
  );
};

export default AsphaltGranulometry_GeneralData;
