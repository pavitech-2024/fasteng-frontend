import { useState, useEffect } from 'react';
import { EssayPageProps } from '../../../templates/essay';
import { t } from 'i18next';
import Loading from '../../../molecules/loading';
import { Box, TextField } from '@mui/material';
import DropDown from '../../../atoms/inputs/dropDown';

const GranularLayers_step2 = ({
  nextDisabled,
  setNextDisabled,
  granularLayers,
}: EssayPageProps & { granularLayers: GRANULARLAYERS_SERVICE }) => {
  const { generalData, setData } = useGranularLayersStore();

  const inputs = [
    { label: t('pm.granularLayer.name'), value: generalData.name, key: 'name', required: true },
    { label: t('pm.granularLayer.zone'), value: generalData.material, key: 'zone', required: true },
    { label: t('pm.granularLayer.layer'), value: generalData.material, key: 'layer', required: true },
    { label: t('pm.granularLayer.cityState'), value: generalData.material, key: 'cityState', required: true },
    { label: t('pm.granularLayer.observations'), value: generalData.material, key: 'observations', required: false },
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
          })}
        </Box>
      </Box>
    </>
  );
};

export default GranularLayers_step2;
