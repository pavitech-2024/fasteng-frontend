import { Box, Typography } from '@mui/material';

interface HeaderProps {
  title: string;
  subTitle?: string;
  icon?: JSX.Element;
  children?: React.ReactNode | JSX.Element;
}

export const Header = ({ title, subTitle, icon, children }: HeaderProps) => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: { mobile: '4vh 2vw', notebook: '3vh 3vw' },
        flexDirection: { notebook: 'row', mobile: 'column' }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'start',
          mb: { mobile: '2vh', notebook: 0 }
        }}
      >
        {icon}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography
            sx={{
              textTransform: 'uppercase',
              fontSize: { mobile: '1.65rem', notebook: '2rem' },
              color: 'primaryTons.darkGray',
              fontWeight: 700,
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              textTransform: 'uppercase',
              fontSize: { mobile: '1.15rem', notebook: '1.5rem' },
              color: 'primaryTons.darkGray',
              fontWeight: 500,
            }}
          >
            {subTitle}
          </Typography>
        </Box>
      </Box>

      {children}
    </Box>
  );
};

export default Header;
