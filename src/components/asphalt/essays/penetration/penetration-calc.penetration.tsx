import { EssayPageProps } from '@/components/templates/essay';
import usePenetrationStore from '@/stores/asphalt/penetration/penetration.store';
import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';

const Penetration_Calc = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { penetrationCalc: data, setData } = usePenetrationStore();

  // if (
  //   nextDisabled &&
  //   data.resultMode != null &&
  //   data. != null &&
  //   data.table_data.every((row) => row.passant !== null && row.retained !== null)
  // )
  //   setNextDisabled(false);

  const [inputFields, setInputFields] = useState([{ value: '' }]);

  // Função para adicionar um novo campo de input
  const handleAddInput = () => {
    const newInputFields = [...inputFields, { value: '' }];
    setInputFields(newInputFields);
  };

  // Função para remover o campo de input na posição especificada
  const handleRemoveInput = (indexToRemove) => {
    const newInputFields = inputFields.filter((_, index) => index !== indexToRemove);
    setInputFields(newInputFields);
  };

  // Função para atualizar o valor do campo de input com base no índice
  const handleInputChange = (index, event) => {
    const newInputFields = [...inputFields];
    newInputFields[index].value = event.target.value;
    setInputFields(newInputFields);
  };

  return (
    <Box>
      {inputFields.map((input, index) => (
        <Box key={index} sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <TextField
            fullWidth
            label={`Input ${index + 1}`}
            variant="outlined"
            value={input.value}
            onChange={(event) => handleInputChange(index, event)}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleRemoveInput(index)}
          >
            Remover
          </Button>
        </Box>
      ))}

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddInput}
        sx={{ mt: '10px' }}
      >
        Adicionar
      </Button>
    </Box>
  )
};

export default Penetration_Calc;
