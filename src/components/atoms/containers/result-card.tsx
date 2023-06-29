import { Box, Container, Typography } from '@mui/material';

interface Result_CardContainerProps {
  title?: string;
  children: JSX.Element | React.ReactNode;
  hideBorder?: boolean;
  mt?: string;
}

export const Result_CardContainer = ({ title, children, hideBorder, mt }: Result_CardContainerProps) => {
  return (
    <Container
      sx={{
        border: hideBorder ? 'none' : '1px solid',
        transform: { mobile: 'translateY(-35px)', notebook: 'translateY(-15px)' },
        borderColor: 'primaryTons.border',
        padding: '10px',
        zIndex: 2,
        mt: mt || '1.5rem',
        borderRadius: '10px',
      }}
    >
      {title && (
        <Typography
          sx={{
            width: 'fit-content',
            bgcolor: 'primaryTons.lightGray',
            mb: { mobile: '2vh', notebook: '2vh' },
            paddingInline: '2vw 20vw',
            transform: {
              mobile: 'translate(-20px, -10px)',
              notebook: 'translateX(-20px)',
            },
            zIndex: 3,
            textTransform: 'uppercase',
            fontSize: { mobile: '1.15rem', notebook: '1.3rem' },
            lineHeight: { mobile: '2rem', notebook: '2.3rem' },
            color: 'primaryTons.white',
            fontWeight: '700',
            whiteSpace: 'nowrap',
            mt: { notebook: 0, mobile: '1rem' },
            borderRadius: '0 10px 10px 0',
            borderBottom: '3px solid',
            borderColor: 'primary.main'
          }}
          variant="h6"
        >
          {title}
        </Typography>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            mobile: 'repeat(auto-fill, 180px)',
            notebook: 'repeat(auto-fill, 230px)',
          },
          gridTemplateRows: 'repeat(auto-fill, 100px)',
          gap: '10px',
          placeContent: 'center',
        }}
      >
        {children}
      </Box>
    </Container>
  );
};

interface Result_CardProps {
  label: string;
  value: string;
  unity: string;
}

const Result_Card = ({ label, value, unity }: Result_CardProps) => {
  return (
    <Box
      sx={{
        width: {
          mobile: '180px',
          notebook: '230px',
        },
        height: '100px',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderColor: 'primaryTons.border',
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '50%',
          bgcolor: 'primaryTons.lightGray',
          textTransform: 'uppercase',
          fontWeight: '700',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '10px 10px 0px 0px',
          color: 'primaryTons.white',
          fontSize: { mobile: '12px', notebook: '1rem' },
        }}
      >
        {label}
      </Box>
      <Box
        sx={{
          width: '100%',
          height: '50%',
          bgcolor: 'primaryTons.white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '5px',
          borderRadius: '0 0 10px 10px',
          fontSize: { mobile: '12px', notebook: '1rem' },
        }}
      >
        {value}
        <span style={{ fontWeight: '700' }}> {`${unity}`} </span>
      </Box>
    </Box>
  );
};

export default Result_Card;