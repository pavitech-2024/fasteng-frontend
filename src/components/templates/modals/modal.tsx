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
  handleOpenModal: (value: boolean) => void;
  handleCloseModal: (value: boolean) => void;
  open: boolean;
  size: string;
}

export type modalSize = "small" | "medium" | "large";

export const ModalBase = ({ 
  title,
  children,
  leftButtonTitle,
  rightButtonTitle,
  handleCloseModal,
  size 
}: IModalBase) => {
  return (
    <div>
      <Modal
        open
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
          p: 4,
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          {children}
          <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingInline: '5'}}>
            <Button
            onClick={() => handleCloseModal}
            variant="contained"
            color="secondary"
            sx={{
              height: '40px',
              width: { mobile: '50%', notebook: '25%' },
              maxWidth: '220px',
              gap: '5px',
            }}
          >
            <Typography sx={{ fontSize: '.8rem', fontWeight: '700' }} color="white">
              {leftButtonTitle}
            </Typography>
          </Button>
          <Button
            onClick={() => 'toast e salvar dados'}
            variant="contained"
            color="primary"
            sx={{
              height: '40px',
              width: { mobile: '50%', notebook: '25%' },
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