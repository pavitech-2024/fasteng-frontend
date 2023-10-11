import { EssayPageProps } from "@/components/templates/essay";
import { Box } from "@mui/material";

const SofteningPoint_Calc = ({ 
  // nextDisabled, 
  // setNextDisabled 
}: EssayPageProps) => {
  // const { softeningPointCalc: data, setData } = useSofteningPointStore();

  // const inputs = [
  //   {
  //     key: 'sandLevel',
  //     label: t('softeningPoint.sand-level'),
  //     adornment: 'cm',
  //     value: data.sandLevel,
  //   },
  //   {
  //     key: 'clayLevel',
  //     label: t('softeningPoint.clay-level'),
  //     adornment: 'cm',
  //     value: data.clayLevel,
  //   },
  // ];

  // if (nextDisabled) {
  //   const hasEmptyValues = data.sandLevel && data.clayLevel !== null;
  //   if (hasEmptyValues) setNextDisabled(false);
  // }

  return (
    <Box sx={{ width: '100%', marginX: 'auto' }}>
      {/* {inputs.map((input, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '50%',
            marginX: 'auto',
            gap: '40px',
            alignItems: 'center',
          }}
        >
          <InputEndAdornment
            key={input.key}
            sx={{
              marginY: '10px',
            }}
            label={input.label}
            fullWidth
            value={input.value}
            required
            onChange={(e) => {
              setData({ step: 1, key: `${[input.key]}`, value: e.target.value });
            }}
            adornment={input.adornment}
            type="number"
            inputProps={{ min: 0 }}
          />
        </Box>
      ))} */}
    </Box>
  );
};

export default SofteningPoint_Calc;