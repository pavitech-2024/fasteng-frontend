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
  onCancel?: (event?: any, reason?: string) => void;
  open: boolean;
  size: modalSize;
  onSubmit?: () => void;
  disableSubmit?: boolean;
  oneButton?: boolean;
  buttonSize?: 'small' | 'medium' | 'large';
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
  singleButtonTitle,
  buttonSize,
}: IModalBase) => {
  const getModalSize = (size: modalSize) => {
    switch (size) {
      case 'small': {
        return '27%';
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
    <Modal component="div" open={open} onClose={onCancel} disableScrollLock={false} sx={{ overflowY: 'scroll' }}>
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
          scrollbarWidth: 'thin',
          scrollbarColor: '#121212 #f1c40f',
          overflowY: {
            mobile: 'scroll',
            notebook: 'auto',
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
              size="small"
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
              size={buttonSize}
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
              size={buttonSize}
              onClick={onSubmit}
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
