import { EssayPageProps } from '../../../templates/essay';
import { Box } from '@mui/material';

const Sand_Increase_Results = ({ setNextDisabled, nextDisabled }: EssayPageProps) => {
  nextDisabled && setNextDisabled(false);
  //const { results: sand_increase_results, sandIncreaseGeneralData } = useSandIncreaseStore();
  //const { user } = useAuth();

  // pegando a quantidade de casas decimais do usuário
  // const {
  //   preferences: { decimal: user_decimal },
  // } = user;
  //const userId = user?._id;

  // const data = {
  //   // container "Resultados"
  //   container_results: [],
  //   //container_measured_pressure: [],
  // };

  // if (sand_increase_results) {
  //   // data container 1
    
  // }

  return <Box sx={{ display: 'flex', flexDirection: 'column' }}>teste</Box>;
};

export default Sand_Increase_Results;
