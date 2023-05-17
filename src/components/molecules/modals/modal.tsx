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
    <Modal open={open} onClose={onCancel} disableScrollLock={false} sx={{ overflowY: 'scroll' }}>
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
            fontSize: { mobile: '1.25rem', notebook: '1.5rem' },
            lineHeight: { mobile: '1.25rem', notebook: '1.5rem' },
            marginBottom: '1rem'
          }}
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
            sx={{
              height: '33px',
              width: '135px',
              bgcolor: 'primary.main',
              color: 'primaryTons.white',
              boxShadow: 'none',
              borderRadius: '20px',
              fontSize: '.95rem',
              lineHeight: '.95rem',
              fontWeight: 700,

              ':hover': {
                boxShadow: 'unset',
                bgcolor: '#F2A255'
              }
            }}
          >
            {leftButtonTitle}
          </Button>
          <Button
            onClick={onSubmit}
            variant="contained"
            disabled={disableSubmit}
            sx={{
              height: '33px',
              width: '135px',
              bgcolor: 'primary.main',
              color: 'primaryTons.white',
              boxShadow: 'none',
              borderRadius: '20px',
              fontSize: '.95rem',
              lineHeight: '.95rem',
              fontWeight: 700,

              ':hover': {
                boxShadow: 'unset',
                bgcolor: '#F2A255'
              }
            }}
          >
            {rightButtonTitle}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalBase;
