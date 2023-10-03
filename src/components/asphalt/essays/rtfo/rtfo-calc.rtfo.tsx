import { EssayPageProps } from "@/components/templates/essay";
import useRtfoStore from "@/stores/asphalt/rtfo/rtfo.store";
import { Box, Button } from "@mui/material";
import { t } from "i18next";
import { useState } from "react";
import { toast } from "react-toastify";

const Rtfo_Calc = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { rtfoCalc: data, setData } = useRtfoStore();

  const [inputFields, setInputFields] = useState(data.points || [0]); // Inicialize com o valor existente ou vazio

  const handleErase = () => {
    try {
      if (inputFields.length > 1) {
        const newInputFields = [...inputFields];
        newInputFields.pop();
        setInputFields(newInputFields);
        setData({ step: 1, key: 'points', value: newInputFields });
      } else {
        throw new Error(t('compression.error.minValue'));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAdd = () => {
    const newInputFields = [...inputFields, 0];
    setInputFields(newInputFields);
    setData({ step: 1, key: 'points', value: newInputFields });
    setNextDisabled(true);
  };

  if (nextDisabled) {
    const hasValueGreaterThanZero = inputFields.some((value) => value > 0);

    if (hasValueGreaterThanZero && data.points !== null) {
      setNextDisabled(false);
    }
  }

  const ExpansionToolbar = () => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem', flexWrap: 'wrap' }}>
        <Button sx={{ color: 'secondaryTons.red' }} onClick={handleErase}>
          {t('erase')}
        </Button>
        <Button sx={{ color: 'secondaryTons.green' }} onClick={handleAdd}>
          {t('add')}
        </Button>
      </Box>
    );
  };

  return (
    <Box sx={{ width: '50%', marginX: 'auto' }}>
      {/* {inputFields.map((input, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            width: '50%',
            marginX: 'auto',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <InputEndAdornment
            fullWidth
            value={input}
            required={false}
            onChange={(e) => {
              const newInputFields = [...inputFields];
              newInputFields[index] = Number(e.target.value);
              setInputFields(newInputFields);
              setData({ step: 1, key: 'points', value: newInputFields });
            }}
            adornment="dmm"
            type="number"
            inputProps={{ min: 0 }}
          />
        </Box>
      ))} */}

      <ExpansionToolbar />
    </Box>
  );
};

export default Rtfo_Calc;