import { EssayPageProps } from '@/components/templates/essay';
import { Box } from '@mui/material';

const Abrasion_Calc = ({}: // nextDisabled,
// setNextDisabled
EssayPageProps) => {
  //const { abrasionCalc: data, setData } = useAbrasionStore();

  // const handleErase = () => {
  //   try {
  //     if (inputFields.length > 1) {
  //       const newInputFields = [...inputFields];
  //       newInputFields.pop();
  //       setInputFields(newInputFields);
  //       setData({ step: 1, key: 'points', value: newInputFields });
  //     } else {
  //       throw new Error(t('compression.error.minValue'));
  //     }
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  // const handleAdd = () => {
  //   const newInputFields = [...inputFields, 0];
  //   setInputFields(newInputFields);
  //   setData({ step: 1, key: 'points', value: newInputFields });
  //   setNextDisabled(true);
  // };

  // if (nextDisabled) {
  //   const hasValueGreaterThanZero = inputFields.some((value) => value > 0);

  //   if (hasValueGreaterThanZero && data.points !== null) {
  //     setNextDisabled(false);
  //   }
  // }

  // const ExpansionToolbar = () => {
  //   return (
  //     <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem', flexWrap: 'wrap' }}>
  //       <Button sx={{ color: 'secondaryTons.red' }} onClick={handleErase}>
  //         {t('erase')}
  //       </Button>
  //       <Button sx={{ color: 'secondaryTons.green' }} onClick={handleAdd}>
  //         {t('add')}
  //       </Button>
  //     </Box>
  //   );
  // };

  return (
    <Box>
      {/* {inputFields.map((input, index) => (
        <Box key={index} sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
      ))}

      <ExpansionToolbar /> */}
    </Box>
  );
};

export default Abrasion_Calc;
