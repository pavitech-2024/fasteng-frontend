import InputEndAdornment from "@/components/atoms/inputs/input-endAdornment";
import Loading from "@/components/molecules/loading";
import { EssayPageProps } from "@/components/templates/essay";
import useAuth from "@/contexts/auth";
import Marshall_SERVICE from "@/services/asphalt/dosages/marshall/marshall.service";
import useMarshallStore from "@/stores/asphalt/marshall/marshall.store";
import { Box } from "@mui/material";
import { t } from "i18next";
import { useState } from "react";

const Marshall_Step4 = ({ nextDisabled, setNextDisabled, marshall }: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { materialSelectionData: data } = useMarshallStore();

  const { user } = useAuth();

  nextDisabled &&
    setNextDisabled(false);
  
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <Box key={'initial_binder'}>
          {/* <InputEndAdornment
            label={t('marshall.initial-binder')}
            value={data.bottom}
            onChange={(e) => setData({ step: 1, key: 'bottom', value: Number(e.target.value) })}
            adornment={'g'}
            type="number"
            inputProps={{ min: 0 }}
            required
          /> */}
        </Box>
        </Box>
      )}
    </>
  );
};

export default Marshall_Step4;