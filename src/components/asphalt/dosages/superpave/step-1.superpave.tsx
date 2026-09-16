import DropDown, { DropDownOption } from '@/components/atoms/inputs/dropDown';
import { EssayPageProps } from '@/components/templates/essay';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, TextField } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useMemo } from 'react';

const EMPTY_OPTION: DropDownOption = { label: '', value: null as any };

const Superpave_Step1_GeneralData = ({
  nextDisabled,
  setNextDisabled,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const { generalData, setData } = useSuperpaveStore();

  const trafficVolumeOptions: DropDownOption[] = [
    { label: t('asphalt.dosages.superpave.low-traffic'), value: 'low' },
    { label: t('asphalt.dosages.superpave.medium-traffic'), value: 'medium' },
    { label: t('asphalt.dosages.superpave.medium-high-traffic'), value: 'medium-high' },
    { label: t('asphalt.dosages.superpave.high-traffic'), value: 'high' },
  ];

  const objectiveOptions: DropDownOption[] = [
    { label: t('asphalt.dosages.superpave.bearing-layer'), value: 'bearing' },
    { label: t('asphalt.dosages.superpave.bonding-layer'), value: 'bonding' },
  ];

  const dnitBandOptions: DropDownOption[] = useMemo(() => {
    if (generalData.objective === 'bonding')
      return [
        { label: 'A', value: 'A' },
        { label: 'B', value: 'B' },
      ];
    if (generalData.objective === 'bearing')
      return [
        { label: 'B', value: 'B' },
        { label: 'C', value: 'C' },
      ];
    return [];
  }, [generalData.objective]);

  const inputs = [
    { label: t('asphalt.project_name'), value: generalData.name, key: 'name', required: true },
    { label: t('asphalt.laboratory_name'), value: generalData.laboratory, key: 'laboratory', required: false },
    { label: t('asphalt.operator'), value: generalData.operator, key: 'operator', required: false },
    { label: t('asphalt.calculist'), value: generalData.calculist, key: 'calculist', required: false },
    {
      label: t('asphalt.choose_traffic_volume'),
      value: generalData.trafficVolume,
      key: 'trafficVolume',
      required: true,
    },
    { label: t('asphalt.choose_objective'), value: generalData.objective, key: 'objective', required: true },
    { label: t('asphalt.choose_dnit_track'), value: generalData.dnitBand, key: 'dnitBand', required: true },
    { label: t('asphalt.comments'), value: generalData.description, key: 'description', required: false },
  ];

  // Trocar o objetivo pode invalidar a faixa já escolhida (A/B vs B/C).
  useEffect(() => {
    if (!generalData.dnitBand) return;
    if (dnitBandOptions.length === 0) return;
    if (!dnitBandOptions.some((option) => option.value === generalData.dnitBand)) {
      setData({ step: 0, key: 'dnitBand', value: null });
    }
  }, [dnitBandOptions, generalData.dnitBand, setData]);

  // Validação em efeito, nunca durante o render.
  useEffect(() => {
    const allRequiredFilled = inputs.every(({ required, value }) => {
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

  const selectedOption = (options: DropDownOption[], value: unknown) =>
    options.find((option) => option.value === value) ?? EMPTY_OPTION;

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box
        sx={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr' },
          gap: '5px 20px',
        }}
      >
        {inputs.map((input) => {
          if (['name', 'laboratory', 'operator', 'calculist'].includes(input.key)) {
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
          }

          if (input.key === 'trafficVolume') {
            return (
              <DropDown
                key={input.key}
                variant="standard"
                label={input.label}
                options={trafficVolumeOptions}
                value={selectedOption(trafficVolumeOptions, generalData.trafficVolume)}
                callback={(value) => setData({ step: 0, key: input.key, value })}
                size="medium"
                required={input.required}
              />
            );
          }

          if (input.key === 'objective') {
            return (
              <DropDown
                key={input.key}
                variant="standard"
                label={input.label}
                options={objectiveOptions}
                value={selectedOption(objectiveOptions, generalData.objective)}
                callback={(value) => setData({ step: 0, key: input.key, value })}
                size="medium"
                required={input.required}
              />
            );
          }

          if (input.key === 'dnitBand') {
            if (dnitBandOptions.length === 0) return null;

            return (
              <DropDown
                key={input.key}
                variant="standard"
                label={input.label}
                options={dnitBandOptions}
                value={selectedOption(dnitBandOptions, generalData.dnitBand)}
                callback={(value) => setData({ step: 0, key: input.key, value })}
                size="medium"
                required={input.required}
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
  );
};

export default Superpave_Step1_GeneralData;
