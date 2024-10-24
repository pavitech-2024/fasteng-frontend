import DropDown from '@/components/atoms/inputs/dropDown';
import { EssayPageProps } from '@/components/templates/essay';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import Rtcd_SERVICE from '@/services/asphalt/essays/rtcd/rtcd.service';
import useRtcdStore from '@/stores/asphalt/rtcd/rtcd.store';
import { Box, TextField } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';

const Rtcd_GeneralData = ({ nextDisabled, setNextDisabled }: EssayPageProps & { rtcd: Rtcd_SERVICE }) => {
  const [materials, setMaterials] = useState<AsphaltMaterial[]>([]);
  const { generalData, setData } = useRtcdStore();

  const inputs = [
    { label: t('asphalt.experimentName'), value: generalData.name, key: 'name', required: true },
    { label: t('asphalt.operator'), value: generalData.operator, key: 'operator', required: false },
    { label: t('asphalt.calculist'), value: generalData.calculist, key: 'calculist', required: false },
    { label: t('asphalt.materials.comments'), value: generalData.description, key: 'description', required: false },
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
    <div>
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
                    return {
                      label: material.name + ' | ' + t(`${'asphalt.materials.' + material.type}`),
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
    </div>
  );
};

export default Rtcd_GeneralData;
