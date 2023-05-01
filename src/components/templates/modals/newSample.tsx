import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { FormControl, Input, InputAdornment, InputLabel, TextField } from '@mui/material';
import DropDown, { DropDownOption } from '@/components/atoms/inputs/dropDown';
import { SampleData, Sample } from '@/interfaces/soils';
import ModalBase from '../../molecules/modals/modal';
import { toast } from 'react-toastify';
import samplesService from '@/services/soils/samplesService';
import { t } from 'i18next';

interface NewSampleModalProps {
  openModal: boolean;
  handleCloseModal: () => void;
  updateSamples: () => void;
  samples: Sample[];
}

export const NewSampleModal = ({ openModal, handleCloseModal, updateSamples, samples }: NewSampleModalProps) => {
  const [sample, setSample] = useState<SampleData>({
    name: '',
    type: null,
    description: {
      construction: null,
      snippet: null,
      provenance: null,
      stake: null,
      layer: null,
      depth: 0,
      exd: null,
      collectionDate: null,
      observation: null,
    },
  });

  useEffect(() => {
    if (!openModal) setSample({ ...sample, type: null });
  }, [openModal, sample]);

  const inputs = [
    { label: t('samples.name'), value: sample.name, key: 'name' },
    { label: t('samples.type'), value: sample.type, key: 'type' },
    { label: t('samples.construction'), value: sample.description.construction, key: 'construction' },
    { label: t('samples.snippet'), value: sample.description.snippet, key: 'snippet' },
    { label: t('samples.exd'), value: sample.description.exd, key: 'exd' },
    { label: t('samples.layer'), value: sample.description.layer, key: 'layer' },
    { label: t('samples.provenance'), value: sample.description.provenance, key: 'provenance' },
    { label: t('samples.stake'), value: sample.description.stake, key: 'stake' },
    { label: t('samples.depth'), value: sample.description.depth, key: 'depth' },
    { label: t('samples.collectionDate'), value: sample.description.collectionDate, key: 'collectionDate' },
  ];

  const types: DropDownOption[] = [
    { label: t('samples.inorganicSoil'), value: 'inorganicSoil' },
    { label: t('samples.organicSoil'), value: 'organicSoil' },
    { label: t('samples.pavementLayer'), value: 'pavementLayer' },
  ];

  const changeSample = (key: string, value: string) => {
    if (key === 'type' || key === 'name') setSample({ ...sample, [key]: value });
    else setSample({ ...sample, description: { ...sample.description, [key]: value } });
  };

  const handleSubmitNewSample = async () => {
    const createMaterialToast = toast.loading('Cadastrando amostra...', { autoClose: 5000 });
    try {
      if (sample.name === '') throw 'Nome não pode ser vazio!';
      if (sample.type === null) throw 'Tipo não pode ser vazio!';
      if (sample.description.depth < 0) throw 'Profundidade não pode ser negativa!';
      if (samples.find((s) => s.name === sample.name)) throw 'Já existe uma amostra com esse nome!';

      await samplesService.createSample(sample);

      await updateSamples();
      handleCloseModal();
      toast.update(createMaterialToast, {
        render: 'Amostra cadastrada com sucesso!',
        type: 'success',
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    } catch (error) {
      toast.update(createMaterialToast, {
        render: error,
        type: 'error',
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    }
  };

  return (
    <ModalBase
      title={t('samples.newSample')}
      open={openModal}
      leftButtonTitle={t('samples.cancel')}
      rightButtonTitle={t('samples.register')}
      size="medium"
      onSubmit={() => handleSubmitNewSample()}
      onCancel={handleCloseModal}
      disableSubmit={sample.name === ''}
    >
      <Box sx={{ mb: '1rem' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              mobile: '1fr',
              notebook: '1fr 1fr',
            },
            gap: {
              mobile: '.6rem .8rem',
              notebook: '1.2rem .8rem',
            },
          }}
        >
          {inputs.map((input) => {
            return (
              <>
                {input.key === 'type' && (
                  <DropDown
                    key={input.key}
                    sx={{ minWidth: '120px', bgcolor: 'white' }}
                    label={t('samples.type')}
                    variant="standard"
                    size="medium"
                    options={types}
                    callback={(value: string) => changeSample('type', value)}
                  />
                )}
                {input.key === 'depth' && (
                  <FormControl variant="standard" key={input.key}>
                    <InputLabel htmlFor="outlined-adornment-depth">{t('samples.depth')}</InputLabel>
                    <Input
                      id="outlined-adornment-depth"
                      endAdornment={<InputAdornment position="end">cm</InputAdornment>}
                      value={sample.description.depth}
                      onChange={(e) => changeSample('depth', e.target.value)}
                      type="number"
                      inputProps={{ min: 0 }}
                    />
                  </FormControl>
                )}
                {input.key !== 'depth' && input.key !== 'type' && (
                  <TextField
                    key={input.key}
                    label={input.label}
                    variant="standard"
                    value={input.value}
                    required={input.key === 'name'}
                    onChange={(e) => changeSample(input.key, e.target.value)}
                  />
                )}
              </>
            );
          })}
        </Box>
        <TextField
          sx={{ mt: '.8rem' }}
          label={t('samples.comments')}
          variant="standard"
          value={sample.description.observation}
          onChange={(e) => changeSample('observation', e.target.value)}
          fullWidth
        />
      </Box>
    </ModalBase>
  );
};

export default NewSampleModal;
