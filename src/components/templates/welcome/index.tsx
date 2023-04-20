import { Box, Typography } from '@mui/material';

interface WelcomeTemplateProps {
  title: string;
}

const WelcomeTemplate = ({ title }: WelcomeTemplateProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: { mobile: 'center', notebook: 'flex-start' },
        alignItems: { mobile: 'center', notebook: 'flex-start' },
      }}
    >
      <Typography variant="h6">Bem vindo à pagina de {title}</Typography>
    </Box>
  );
};

export default WelcomeTemplate;
