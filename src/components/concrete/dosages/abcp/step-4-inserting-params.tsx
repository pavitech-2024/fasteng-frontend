import DropDown from "@/components/atoms/inputs/dropDown";
import InputEndAdornment from "@/components/atoms/inputs/input-endAdornment";
import { EssayPageProps } from "@/components/templates/essay"
import ABCP_SERVICE from "@/services/concrete/dosages/abcp/abcp.service"
import useABCPStore from "@/stores/concrete/abcp/abcp.store";
import { Box, TextField } from "@mui/material";
import { useEffect } from "react";

const ABCP_InsertingParams = ({ nextDisabled, setNextDisabled, abcp }: EssayPageProps & { abcp: ABCP_SERVICE }) => {

  const { insertParamsData, setData } = useABCPStore();

  const inputs = [
    {
      key: 'fck',
      value: insertParamsData.fck,
      label: 'Selecione o FCK desejado',
      type: 'number',
      adornment: '(Mpa)'
    },
    {
      key: 'reduction',
      value: insertParamsData.reduction,
      label: 'Informe o abatimento desejado',
      type: 'number',
      adornment: '(mm)'
    },
  ];

  const conditionOption = [
    {
      key: 'a',
      value: 4,
      label: 'Condição A - Sd = 4,0 Mpa',
    },
    {
      key: 'b',
      value: 5.5,
      label: 'Condição B - Sd = 5,5 Mpa',
    },
    {
      key: 'c',
      value: 7,
      label: 'Condição C - Sd = 7,0 Mpa',
    },
  ];

  useEffect(() => {
    if (Object.values(insertParamsData).some(value => value === null )) {
      setNextDisabled(true)
    } else {
      setNextDisabled(false)
    }
  }, [insertParamsData]);

  return (
    <Box
      sx={{
        display: 'grid',
        gap: '10px',
      }}
    >
      <Box
        sx={{
          p: '1rem',
          textAlign: 'center',
          border: '1px solid lightgray',
          borderRadius: '10px',
        }}
      >
        <DropDown 
          label={'Selecione a condição para a dosagem'} 
          sx={{ width: '100%', marginY: '20px' }}
          variant="standard"
          size="medium"
          options={conditionOption.map((opt) => {
            const { value, label } = opt;
            return {
              label,
              value
            }
          })} 
          callback={(value) => {
            setData({ step: 3, key: 'condition', value})
          }}
        />

        {inputs.map((input) => (
          <InputEndAdornment
            variant="standard"
            sx={{ marginY: '20px' }}
            fullWidth
            type={input.type}
            key={input.key}
            label={input.label}
            value={input.value}
            onChange={(e) => {
              setData({ step: 3, key: input.key, value: Number(e.target.value) });
            }}
            adornment={input.adornment}
          />
        ))}
      </Box>
    </Box>
  )
}

export default ABCP_InsertingParams