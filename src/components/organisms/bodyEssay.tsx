import { Box } from '@mui/material';

interface BodyEssayProps {
  children: React.ReactNode | JSX.Element;
}

export const BodyEssay = ({ children }: BodyEssayProps) => {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: {
          mobile: 'calc(100vh  - 16vh - 122px - 161.94px)',
          notebook: 'calc(100vh - 56px - 10vh - 137px)',
        },
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        pt: { mobile: 0, notebook: '2vh' },
      }}
    >
      {children}
    </Box>
  );
};

export default BodyEssay;
