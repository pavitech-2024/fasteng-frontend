import * as React from 'react';
import Box from '@mui/material/Box';
import { FormControl, FormHelperText, InputAdornment, OutlinedInput, TextField } from '@mui/material';
import { useState } from 'react';

export const NewEssayModal = () => {
  const [name, setName] = useState<string>('')
  //const [type, setType] = useState<string>('')
  const [construction, setConstruction] = useState<string>('')
  const [excerpt, setExcerpt] = useState<string>('')
  const [stake, setStaket] = useState<string>('')
  const [provenance, setProvenance] = useState<string>('')
  const [sideEXD, setSideEXD] = useState<string>('')
  const [depth, setDepth] = useState<number>(0)
  const [layer, setLayer] = useState<string>('')
  const [collectionDate, setCollectionDate] = useState<string>('')
  const [observation, setObservation] = useState<string>('')

  const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  // const handleType = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setType(event.target.value);
  // };

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
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px'}}>
        <Box>
          <TextField id="outlined-search" label="Nome" type="search" value={name} onChange={handleName} />
          <TextField id="outlined-search" label="Obra" type="search" value={construction} onChange={handleConstruction} />
          <TextField id="outlined-search" label="Trecho" type="search"  value={excerpt} onChange={handleExcerpt} />
          <TextField id="outlined-search" label="Lado E-X-D" type="search" value={sideEXD} onChange={handleSideEXD} />
          <TextField id="outlined-search" label="Camada" type="search" value={layer} onChange={handleLayer} />
        </Box>
        <Box>
          {/** Tipo com dropdown */}
          <TextField id="outlined-search" label="Procedência" type="search" value={provenance} onChange={handleProvenance} />
          <TextField id="outlined-search" label="Estaca" type="search" value={stake} onChange={handleStaket} />
          <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
            <OutlinedInput
              id="outlined-adornment-weight"
              endAdornment={<InputAdornment position="end">kg</InputAdornment>}
              aria-describedby="outlined-weight-helper-text"
              value={depth} onChange={handleDepth}
              type='number'
              inputProps={{
                'aria-label': 'Profundidade',
              }}
            />
            <FormHelperText id="outlined-weight-helper-text">Weight</FormHelperText>
          </FormControl>
          <TextField id="outlined-search" label="Data da coleta" type="search" value={collectionDate} onChange={handleCollectionDate} />
        </Box>
      </Box>
      <TextField id="outlined-search" label="Observação" type="search" value={observation} onChange={handleObservation} />
    </Box>
  );
}

