import { EssayPageProps } from "@/components/templates/essay";
import { Box } from "@mui/material";

const Compression_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  // const { results: compression_results, generalData } = useCompressionStore();
  // const { user } = useAuth(); 

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      teste
    </Box>
  )
}

export default Compression_Results;