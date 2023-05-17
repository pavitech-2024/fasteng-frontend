import { Container } from "@mui/material";

interface PageProps {
  children?: React.ReactNode | JSX.Element;
};

export const PageGenericContainer = ({ children }: PageProps) => (
  <Container
    sx={{
      position: 'absolute',
      zIndex: 2,
      top: '52px',
      left: { mobile: 0, notebook: '52px' },
      width: { mobile: '100vw', notebook: 'calc(100vw - 52px)' },
      padding: 0
    }}
  >
    {children}
  </Container>
);

export const PageWelcomeContainer = ({ children }: PageProps) => (
  <Container
    sx={{
      position: 'absolute',
      zIndex: 2,
      top: '52px',
      left: 0,
      width: '100vw',
      padding: 0
    }}
  >
    {children}
  </Container>
)