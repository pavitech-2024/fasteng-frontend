import Loading from "@/components/molecules/loading";
import { EssayPageProps } from "@/components/templates/essay";
import useAuth from "@/contexts/auth";
import Marshall_SERVICE from "@/services/asphalt/dosages/marshall/marshall.service";
import useMarshallStore from "@/stores/asphalt/marshall/marshall.store";
import { Box } from "@mui/material";
import { useState } from "react";

const Marshall_Step9 = ({ nextDisabled, setNextDisabled, marshall }: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { materialSelectionData } = useMarshallStore();

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

        </Box>
      )}
    </>
  );
};

export default Marshall_Step9;