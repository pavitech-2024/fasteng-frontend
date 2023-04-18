import { useState } from 'react';
import Box from '@mui/material/Box';
import { FormControl, Input, InputAdornment, InputLabel, TextField } from '@mui/material';
import DropDown, { DropDownOption } from '@/components/atoms/inputs/dropDown';
import { SampleData } from '@/interfaces/soils';
import ModalBase from '../../molecules/modals/modal';
import { toast } from 'react-toastify';
import samplesService from '@/services/soils/samplesService';

interface NewSampleModalProps {
  openModal: boolean;
  handleCloseModal: () => void;
  updateSamples: () => void;
}

export const NewSampleModal = ({ openModal, handleCloseModal, updateSamples }: NewSampleModalProps) => {
  const [sample, setSample] = useState<SampleData>({
    name: '',
    type: 'inorganicSoil',
    construction: null,
    snippet: null,
    provenance: null,
    stake: null,
    layer: null,
    depth: null,
    exd: null,
    collectionDate: null,
    description: null,
  });

  const types: DropDownOption[] = [
    { label: 'Solo Inorgânico', value: 'inorganicSoil' },
    { label: 'Solo Orgânico', value: 'organicSoil' },
    { label: 'Camada de Pavimento', value: 'pavementLayer' },
  ];

  const changeSample = (key: string, value: string) => {
    setSample({ ...sample, [key]: value });
  };

  const handleSubmitNewSample = async () => {
    try {
      if (sample.name === '') throw new Error('Nome não pode ser vazio!');

      await samplesService.createSample(sample);

      await updateSamples();
      handleCloseModal();
    } catch (error) {
      throw error;
    }
  };

  return (
    <ModalBase
      title="Cadastramento"
      open={openModal}
      leftButtonTitle="Cancelar"
      rightButtonTitle="Cadastrar"
      size="medium"
      onSubmit={() => {
        try {
          toast.promise(async () => await handleSubmitNewSample(), {
            pending: 'Cadastrando amostra...',
            success: 'Amostra cadastrada com sucesso!',
            error: 'Erro ao cadastrar amostra!',
          });
        } catch (error) {}
      }}
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
            overflowY: {
              mobile: 'scroll',
              notebook: 'hidden',
            },
            gap: {
              mobile: '.6rem .8rem',
              notebook: '1.2rem .8rem',
            },
          }}
        >
          <TextField
            label="Nome"
            variant="standard"
            value={sample.name}
            required
            onChange={(e) => changeSample('name', e.target.value)}
          />
          <DropDown
            sx={{ minWidth: '120px', bgcolor: 'white' }}
            defaultValue={types[0]}
            label="Tipo"
            variant="standard"
            key={sample.type}
            size="medium"
            options={types}
            callback={(value) => changeSample('type', value as string)}
          />
          <TextField
            label="Obra"
            variant="standard"
            value={sample.construction}
            onChange={(e) => changeSample('construction', e.target.value)}
          />
          <TextField
            label="Trecho"
            variant="standard"
            value={sample.snippet}
            onChange={(e) => changeSample('snippet', e.target.value)}
          />
          <TextField
            label="Lado E-X-D"
            variant="standard"
            value={sample.exd}
            onChange={(e) => changeSample('exd', e.target.value)}
          />
          <TextField
            label="Camada"
            variant="standard"
            value={sample.layer}
            onChange={(e) => changeSample('layer', e.target.value)}
          />
          <TextField
            label="Procedência"
            variant="standard"
            value={sample.provenance}
            onChange={(e) => changeSample('provenance', e.target.value)}
          />
          <TextField
            label="Estaca"
            variant="standard"
            value={sample.stake}
            onChange={(e) => changeSample('stake', e.target.value)}
          />
          <FormControl variant="standard">
            <InputLabel htmlFor="outlined-adornment-depth">Profundidade</InputLabel>
            <Input
              id="outlined-adornment-depth"
              endAdornment={<InputAdornment position="end">cm</InputAdornment>}
              value={sample.depth}
              onChange={(e) => changeSample('depth', e.target.value)}
              type="number"
            />
          </FormControl>
          <TextField
            label="Data da coleta"
            variant="standard"
            value={sample.collectionDate}
            onChange={(e) => changeSample('collectionDate', e.target.value)}
          />
        </Box>
        <TextField
          sx={{ mt: '.8rem' }}
          label="Observação"
          variant="standard"
          value={sample.description}
          onChange={(e) => changeSample('description', e.target.value)}
          fullWidth
        />
      </Box>
    </ModalBase>
  );
};

export default NewSampleModal;
