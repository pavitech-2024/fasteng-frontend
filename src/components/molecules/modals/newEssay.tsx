import * as React from 'react';
import Box from '@mui/material/Box';
import { FormControl, FormHelperText, InputAdornment, OutlinedInput, TextField } from '@mui/material';
import { useState } from 'react';
import DropDown, { DropDownOption } from '@/components/atoms/inputs/dropDown';

export const NewEssayModal = () => {
  const [name, setName] = useState<string>('')
  const [construction, setConstruction] = useState<string>('')
  const [excerpt, setExcerpt] = useState<string>('')
  const [stake, setStaket] = useState<string>('')
  const [provenance, setProvenance] = useState<string>('')
  const [sideEXD, setSideEXD] = useState<string>('')
  const [depth, setDepth] = useState<number>(0)
  const [layer, setLayer] = useState<string>('')
  const [collectionDate, setCollectionDate] = useState<string>('')
  const [observation, setObservation] = useState<string>('')
  const [typeValue, setTypeValue] = useState<string>('');
  const types: DropDownOption[] = [
    { label: 'Todos', value: '' },
    { label: 'Solo Inorgânico', value: 'inorganicSoil' },
    { label: 'Solo Orgânico', value: 'organicSoil' },
    { label: 'Camada de Pavimento', value: 'pavementLayer' },
  ];

  const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleConstruction = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConstruction(event.target.value);
  };

  const handleExcerpt = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExcerpt(event.target.value);
  };

  const handleStaket = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStaket(event.target.value);
  };

  const handleSideEXD = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSideEXD(event.target.value);
  };

  const handleLayer = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLayer(event.target.value);
  };

  const handleProvenance = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProvenance(event.target.value);
  };

  const handleDepth = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDepth(+event.target.value);
  };

  const handleCollectionDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCollectionDate(event.target.value);
  };

  const handleObservation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setObservation(event.target.value);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: { mobile: 'column', notebook: 'row' }, gap: '5rem' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <TextField id="outlined-search" label="Nome" type="search" value={name} onChange={handleName} />
          <TextField id="outlined-search" label="Obra" type="search" value={construction} onChange={handleConstruction} sx={{ marginY: '1rem' }} />
          <TextField id="outlined-search" label="Trecho" type="search"  value={excerpt} onChange={handleExcerpt} />
          <TextField id="outlined-search" label="Lado E-X-D" type="search" value={sideEXD} onChange={handleSideEXD} sx={{ marginY: '1rem' }} />
          <TextField id="outlined-search" label="Camada" type="search" value={layer} onChange={handleLayer} />
          <TextField id="outlined-search" label="Observação" type="search" value={observation} onChange={handleObservation} sx={{ maxWidth: '25ch', marginY: '1rem' }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <DropDown
            sx={{ width: '25ch', maxWidth: '350px', minWidth: '120px', bgcolor: 'white' }}
            label={'Tipo'}
            key={typeValue}
            size="medium" options={types} callback={setTypeValue}
            />
          <TextField id="outlined-search" label="Procedência" type="search" value={provenance} onChange={handleProvenance} sx={{ marginY: '1rem' }} />
          <TextField id="outlined-search" label="Estaca" type="search" value={stake} onChange={handleStaket} />
          <FormControl sx={{ maxWidth: '25ch', marginY: '1rem' }} variant="outlined">
            <OutlinedInput
              id="outlined-adornment-weight"
              endAdornment={<InputAdornment position="end">cm</InputAdornment>}
              aria-describedby="outlined-weight-helper-text"
              value={depth} onChange={handleDepth}
              placeholder='Profundidade'
              type='number'
              inputProps={{
                'aria-label': 'Profundidade',
              }}
            />
            <FormHelperText id="outlined-weight-helper-text">Profundidade</FormHelperText>
          </FormControl>
          <TextField id="outlined-search" label="Data da coleta" type="search" value={collectionDate} onChange={handleCollectionDate} />
        </Box>
      </Box>
    </Box>
  );
}

