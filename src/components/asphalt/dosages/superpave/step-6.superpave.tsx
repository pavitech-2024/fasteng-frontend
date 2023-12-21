import Loading from "@/components/molecules/loading";
import { EssayPageProps } from "@/components/templates/essay";
import useAuth from "@/contexts/auth";
import Superpave_SERVICE from "@/services/asphalt/dosages/superpave/superpave.service";
import useSuperpaveStore from "@/stores/asphalt/superpave/superpave.store";
import { Box } from "@mui/material";
import { useState } from "react";

const Superpave_Step6 = ({ nextDisabled, setNextDisabled, superpave }: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { materialSelectionData } = useSuperpaveStore();

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

export default Superpave_Step6;