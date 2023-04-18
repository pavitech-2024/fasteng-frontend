import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

type modalSize = 'small' | 'medium' | 'large';
interface IModalBase {
  title: string;
  children: JSX.Element | React.ReactNode;
  leftButtonTitle: string;
  rightButtonTitle: string;
  onCancel: () => void;
  open: boolean;
  size: modalSize;
  onSubmit: () => void;
  disableSubmit?: boolean;
}

const ModalBase = ({
  open,
  title,
  children,
  leftButtonTitle,
  rightButtonTitle,
  onCancel,
  size,
  onSubmit,
  disableSubmit,
}: IModalBase) => {
  const getModalSize = (size: modalSize) => {
    switch (size) {
      case 'small': {
        return '20%';
      }
      case 'medium': {
        return '40%';
      }
      case 'large': {
        return '60%';
      }
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={onCancel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute' as const,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: {
              mobile: '80%',
              notebook: getModalSize(size),
            },
            bgcolor: 'white',
            boxShadow: 24,
            maxHeight: '80%',
            overflowY: 'scroll',
            overflow: 'hidden',
            p: {
              mobile: '1rem',
              notebook: '2rem',
            },
          }}
        >
          {/* title */}
          <Typography
            variant="h6"
            color="secondary.light"
            sx={{ fontWeight: '700', fontSize: '18px', marginBottom: '1rem' }}
          >
            {title.toUpperCase()}
          </Typography>
          {/* content */}
          {children}

          {/* buttons area */}
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: '1rem' }}>
            <Button
              onClick={onCancel}
              variant="contained"
              color="secondary"
              sx={{
                height: '40px',
                width: { mobile: '40%', notebook: '25%' },
                maxWidth: '220px',
                gap: '5px',
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    mobile: '.65rem',
                    notebook: '.8rem',
                  },
                  fontWeight: '700',
                }}
                color="white"
              >
                {leftButtonTitle}
              </Typography>
            </Button>
            <Button
              onClick={onSubmit}
              variant="contained"
              color="primary"
              disabled={disableSubmit}
              sx={{
                height: '40px',
                width: { mobile: '40%', notebook: '25%' },
                maxWidth: '220px',
                gap: '5px',
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    mobile: '.65rem',
                    notebook: '.8rem',
                  },
                  fontWeight: '700',
                }}
                color="white"
              >
                {rightButtonTitle}
              </Typography>
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalBase;
