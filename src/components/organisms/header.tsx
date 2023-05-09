import { Box, Typography } from '@mui/material';

interface HeaderProps {
  title: string;
  children?: React.ReactNode | JSX.Element;
  subHeader?: boolean;
  divider?: boolean;
}

export const Header = ({ title, children, subHeader, divider }: HeaderProps) => {
  return (
    <Box
      sx={{
        width: { mobile: '100%', notebook: 'calc(100% - 12rem)' },
        height: '2rem',
        mb: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: { mobile: 0, notebook: '0 6rem' },
        flexDirection: { notebook: 'row', mobile: 'column' },
        gap: '15px',
      }}
    >
      <Box
        sx={{
          width: '100%',
          borderBottom: divider && '.5px solid #121212',
          display: 'flex',
          justifyContent: { mobile: 'center', notebook: 'flex-start' },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textTransform: 'uppercase',
            fontSize: { mobile: subHeader ? '12px' : '15px', notebook: subHeader ? '20px' : '24px' },
            color: 'secondary.light',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            letterSpacing: '0.1rem',
            mt: { notebook: 0, mobile: '1rem' },
          }}
        >
          {title}
        </Typography>
      </Box>
      {children}
    </Box>
  );
};

export default Header;
