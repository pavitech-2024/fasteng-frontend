import { NewSieves } from '@/components/asphalt/essays/granulometry/step2.granulometry';
import ModalBase from '@/components/molecules/modals/modal';
import { AllSieves, Sieve } from '@/interfaces/common';
import { Box, Button, Typography } from '@mui/material';

interface IAddSieveModal {
  addSieveModalIsOpen: boolean;
  setCloseModal: (isClose: boolean) => void;
  newSieves: NewSieves;
}

const AddSieveModal = ({addSieveModalIsOpen, newSieves, setCloseModal}: IAddSieveModal) => {
  console.log("🚀 ~ AddSieveModal ~ newSieves:", newSieves)
  console.log("🚀 ~ sieves ~ AllSieves:", AllSieves)

  const sievesArray = [];

  const sieves = Object.entries(newSieves).map(([key, value]) => {
    const index = AllSieves.findIndex((sieve) => sieve.label === value.label);
    console.log("🚀 ~ sieves ~ index:", index)
    if (index !== -1 && key === 'higher' && AllSieves[index + 1].label !== value.label) {
      console.log("🚀 ~ sieves ~ value.label:", value.label)
      console.log("🚀 ~ sieves ~ AllSieves[index + 1].label:", AllSieves[index + 1].label)
      return {
        label: value.label,
        value: value.value
      };
    } else if (index !== -1 && key === 'lower' && AllSieves[index - 1].label !== value.label) {
      return {
        label: value.label,
        value: value.value
      };
    } else {
      return [];
    }
  }).flat();

  console.log("🚀 ~ sieves ~ sieves:", sieves)

  return (
    <ModalBase
      title={'Onde deseja adicionar uma nova peneira?'}
      leftButtonTitle={'Cancelar'}
      rightButtonTitle={'Confirmar'}
      open={addSieveModalIsOpen}
      size={'medium'}
      onCancel={() => setCloseModal(false)}
    >
      <Box>
        <Typography><b>Peneira selecionada:</b> {newSieves.baseSieve.label}</Typography>
      </Box>
    </ModalBase>
  );
};

export default AddSieveModal;
