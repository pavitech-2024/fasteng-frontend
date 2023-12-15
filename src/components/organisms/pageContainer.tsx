import { Container } from '@mui/material';

interface PageProps {
  children?: React.ReactNode | JSX.Element;
}

export const PageGenericContainer = ({ children }: PageProps) => (
  <Container
    sx={{
      mt: '52px',
      ml: { mobile: 0, notebook: '52px' },
      width: { mobile: '100vw', notebook: 'calc(100vw - 52px)' },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
    {children}
  </Container>
);

export const PageWelcomeContainer = ({ children }: PageProps) => (
  <Container
    sx={{
      mt: '52px',
      width: '100vw',
    }}
  >
    {children}
  </Container>
);

export const VideoContainer = ({ children }: PageProps) => {
  return (
    <Container
      sx={{
        mt: '52px',
        ml: { mobile: 0, notebook: '52px' },
        width: { mobile: '100%', notebook: 'calc(100% - 52px)' }, // Adjust the width as needed
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center', // Center the content vertically
      }}
    >
      {children}
    </Container>
  );
};