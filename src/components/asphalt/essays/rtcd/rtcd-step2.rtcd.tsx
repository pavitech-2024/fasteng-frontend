import DropDown from "@/components/atoms/inputs/dropDown";
import InputEndAdornment from "@/components/atoms/inputs/input-endAdornment";
import { EssayPageProps } from "@/components/templates/essay";
import useRtcdStore from "@/stores/asphalt/rtcd.store";
import { Box } from "@mui/material";
import { t } from "i18next";

const Rtcd_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
    const { rtcdStep2: data, setData } = useRtcdStore();
  
    const inputs = [
      {
        key: "sampleOrigin",
        label: t("asphalt.rtcd.sample-origin"),
        value: data.sampleOrigin,
      },
      {
        key: "pressSpecification",
        label: t("asphalt.rtcd.press-specification"),
        value: data.pressSpecification,
      },
      {
        key: "pressConstant",
        label: t("asphalt.rtcd.press-constant"),
        value: data.pressConstant,
      },
      {
        key: "sampleVoidVolume",
        label: t("asphalt.rtcd.sample-void-volume"),
        value: data.sampleVoidVolume,
      },
    ];
  
    if (nextDisabled) {
      const hasEmptyValues = data.dnitRange && data.pressConstant && data.pressSpecification && data.sampleOrigin && data.sampleVoidVolume !== null;
      if (hasEmptyValues) setNextDisabled(false);
    }
  
    return (
      <Box sx={{ width: '100%', marginX: 'auto' }}>
        {inputs.map((input) => (
          <Box
            key={input.key}
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
              variant="standard"
              fullWidth
              type="number"
              key={input.key}
              label={input.label}
              value={input.value}
              onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })} 
              adornment={input.key === 'sampleVoidVolume' ? "%" : ""}          
            />
          </Box>
        ))}
  
        <Box
          sx={{
            width: "100%"
          }}
        >
          <DropDown 
            label={"Faixa do DNIT"} 
            variant="standard"
            size="medium"
            sx={{
              display: 'flex',
              marginX: 'auto',
              width: "50%"
            }}
            options={[
              {value: "A", label: "A"},
              {value: "B", label: "B"},
              {value: "C", label: "C"},
              {value: "D", label: "D"},
              {value: "E", label: "E"},
            ]} 
            callback={(value) => setData({ step: 1, key: "dnitRange", value })}
          />
        </Box>
      </Box>
    );
  };
  
  export default Rtcd_Step2;