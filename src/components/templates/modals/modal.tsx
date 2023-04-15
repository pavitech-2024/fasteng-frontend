import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

interface IModalBase {
  title: string;
  children: JSX.Element | React.ReactNode;
  leftButtonTitle: string;
  rightButtonTitle: string;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
  open: boolean;
  size: string;
  onOk: () => void;
}

export type modalSize = "small" | "medium" | "large";

// const getModalSize = (size: modalSize) => {
//   switch (size) {
//     case "small": {
//       return '20%';
//     }
//     case "medium": {
//       return '40%';
//     }
//     case "large": {
//       return '60%';
//     }
//   }
// };

export const ModalBase = ({ 
  open,
  title,
  children,
  leftButtonTitle,
  rightButtonTitle,
  handleCloseModal,
  size,
  onOk 
}: IModalBase) => {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute' as const,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: {size},
          bgcolor: 'white',
          boxShadow: 24,
          maxHeight: '80%',
          overflowY: 'scroll',
          overflow: 'hidden',
          p: 4,
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h1" sx={{ padding: '1rem', fontWeight: '700', fontSize: '30px',  marginBottom: '1rem' }}>
            {title}
          </Typography>
          {children}
          <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: '1rem'}}>
            <Button
            onClick={handleCloseModal}
            variant="contained"
            color="secondary"
            sx={{
              height: '40px',
              width: { mobile: '40%', notebook: '25%' },
              maxWidth: '220px',
              gap: '5px',
            }}
          >
            <Typography sx={{ fontSize: '.8rem', fontWeight: '700' }} color="white">
              {leftButtonTitle}
            </Typography>
          </Button>
          <Button
            onClick={onOk}
            variant="contained"
            color="primary"
            sx={{
              height: '40px',
              width: { mobile: '40%', notebook: '25%' },
              maxWidth: '220px',
              gap: '5px',
            }}
          >
            <Typography sx={{ fontSize: '.8rem', fontWeight: '700' }} color="white">
            {rightButtonTitle}
            </Typography>
          </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}