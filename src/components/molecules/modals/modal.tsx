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
  singleButtonTitle?: string;
  onCancel: () => void;
  open: boolean;
  size: modalSize;
  onSubmit: () => void;
  disableSubmit?: boolean;
  oneButton?: boolean;
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
  oneButton = false,
  singleButtonTitle
}: IModalBase) => {
  const getModalSize = (size: modalSize) => {
    switch (size) {
      case 'small': {
        return '25%';
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
    <Modal open={open} onClose={onCancel} disableScrollLock={false} sx={{ overflowY: 'scroll' }}>
      <Box
        sx={{
          position: 'absolute' as const,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: {
            mobile: '85%',
            notebook: getModalSize(size),
          },
          bgcolor: 'primaryTons.white',
          boxShadow: 24,
          borderRadius: '10px',
          maxHeight: '80%',
          overflowY: {
            mobile: 'scroll',
            notebook: 'hidden',
          },
          p: {
            mobile: '1rem',
            notebook: '2rem',
          },
        }}
      >
        {/* title */}
        <Typography
          color="primaryTons.darkGray"
          sx={{
            fontWeight: '700',
            fontSize: { mobile: '1.35rem', notebook: '1.5rem' },
            lineHeight: { mobile: '1.35rem', notebook: '1.5rem' },
            m: { mobile: '10px 0', notebook: '0 0 1rem' },
          }}
        >
          {title.toUpperCase()}
        </Typography>

        {/* content */}
        {children}

        {/* buttons area */}
        {!oneButton ? (
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', pt: '1rem' }}>
            <Button
              onClick={onCancel}
              variant="outlined"
              color="primary"
              sx={{
                height: '32px',
                width: '135px',
                color: 'primary.main',
                fontSize: '.95rem',
                lineHeight: '1rem',
                fontWeight: 700,

                ':hover': {
                  bgcolor: '#F2A255',
                  color: 'primaryTons.white',
                },
              }}
            >
              {leftButtonTitle}
            </Button>
            <Button
              onClick={onSubmit}
              variant="contained"
              disabled={disableSubmit}
              sx={{
                height: '32px',
                width: '135px',
                bgcolor: 'primary.main',
                color: 'primaryTons.white',
                fontSize: '.95rem',
                lineHeight: '1rem',
                fontWeight: 700,

                ':hover': {
                  bgcolor: '#F2A255',
                },
              }}
            >
              {rightButtonTitle}
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', pt: '1rem' }}>
            <Button
              onClick={onCancel}
              variant="outlined"
              color="primary"
              sx={{
                height: '32px',
                width: '135px',
                color: 'primary.main',
                fontSize: '.95rem',
                lineHeight: '1rem',
                fontWeight: 700,

                ':hover': {
                  bgcolor: '#F2A255',
                  color: 'primaryTons.white',
                },
              }}
            >
              {singleButtonTitle}
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default ModalBase;
