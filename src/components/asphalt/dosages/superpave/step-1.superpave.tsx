import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import { EssayPageProps } from '../../../templates/essay/index';
import { useState } from 'react';
import useAuth from '@/contexts/auth';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { t } from 'i18next';
import Loading from '@/components/molecules/loading';
import { Box, TextField } from '@mui/material';
import DropDown, { DropDownOption } from '@/components/atoms/inputs/dropDown';

const Superpave_Step1 = ({
  nextDisabled,
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const { generalData, setData } = useSuperpaveStore();

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

  // Função para verificar se todos os campos obrigatórios estão preenchidos
  const allRequiredFieldsFilled = inputs.every(({ required, value }) => {
    if (!required) return true;

    if (value === null || (typeof value === 'string' && value.trim() === '')) {
      return false;
    }

    return true;
  });

  // Atualizar o estado nextDisabled com base na verificação
  if (allRequiredFieldsFilled && nextDisabled) {
    setNextDisabled(false);
  } else if (!allRequiredFieldsFilled && !nextDisabled) {
    setNextDisabled(true);
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
                    value={input.value}
                    required={input.required}
                    onChange={(e) => setData({ step: 0, key: input.key, value: e.target.value })}
                  />
                );
              } else if (['trafficVolume'].includes(input.key)) {
                return (
                  <DropDown
                    key={input.key}
                    variant="standard"
                    label={input.label}
                    options={trafficVolumeOptions}
                    callback={(value) => setData({ step: 0, key: input.key, value })}
                    value={{ label: generalData.trafficVolume, value: generalData.trafficVolume }}
                    size="medium"
                    required={input.required}
                  />
                );
              } else if (['objective'].includes(input.key)) {
                return (
                  <DropDown
                    key={input.key}
                    variant="standard"
                    label={input.label}
                    options={objectiveOptions}
                    callback={(value) => setData({ step: 0, key: input.key, value })}
                    value={{ label: generalData.objective, value: generalData.objective }}
                    size="medium"
                    required={input.required}
                  />
                );
              } else if (['dnitBand'].includes(input.key)) {
                if (generalData.objective) {
                  const trackOptions: DropDownOption[] = [];
                  if (generalData.objective === 'bonding') {
                    trackOptions.push({ label: 'A', value: 'A' });
                    trackOptions.push({ label: 'B', value: 'B' });
                  } else if (generalData.objective === 'bearing') {
                    trackOptions.push({ label: 'B', value: 'B' });
                    trackOptions.push({ label: 'C', value: 'C' });
                  }
                  return (
                    <DropDown
                      key={input.key}
                      variant="standard"
                      label={input.label}
                      options={trackOptions}
                      callback={(value) => setData({ step: 0, key: input.key, value })}
                      value={{ label: generalData.dnitBand, value: generalData.dnitBand }}
                      size="medium"
                      required={input.required}
                    />
                  );
                }
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

export default Superpave_Step1;
