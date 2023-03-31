import { Box, Typography } from '@mui/material';

interface HeaderProps {
  title: string;
  children: React.ReactNode | JSX.Element;
}

export const Header = ({ title, children }: HeaderProps) => {
  return (
    <Box
      sx={{
        width: { mobile: '100%', tablet: 'calc(100% - 12rem)' },
        height: '2rem',
        mb: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: { mobile: 0, tablet: '0 6rem' },
        flexDirection: { notebook: 'row', mobile: 'column' },
        gap: '15px',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          textTransform: 'uppercase',
          fontSize: { notebook: '24px' },
          color: 'secondary.light',
          fontWeight: '600',
          whiteSpace: 'nowrap',
          letterSpacing: '0.1rem',
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
};

export default Header;
