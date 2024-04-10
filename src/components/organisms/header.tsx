import { Box, Typography } from '@mui/material';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

interface HeaderProps {
  title: string;
  subTitle?: string;
  link?: string;
  icon?: JSX.Element;
  image?: StaticImageData;
  children?: React.ReactNode | JSX.Element;
  sx?: { [key: string]: string | number | { [key: string]: string | number } };
}

export const Header = ({ title, subTitle, link, icon, image, children, sx }: HeaderProps) => {
  return (
    <Box
      style={sx}
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: { mobile: '4vh 2vw', notebook: '3vh 3vw' },
        flexDirection: { notebook: 'row', mobile: 'column' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: { mobile: '2vh', notebook: 0 },
        }}
      >
        {image && <Image alt="essay icon" src={image} width={90} height={90} />}
        {icon}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            marginRight: '2rem',
          }}
        >
          <Typography
            sx={{
              textTransform: 'uppercase',
              fontSize: { mobile: '1.65rem', notebook: '2rem' },
              lineHeight: { mobile: '1.65rem', notebook: '2rem' },
              color: 'primaryTons.darkGray',
              fontWeight: 700,
              textAlign: { mobile: 'center' } 
            }}
          >
            {title}
          </Typography>
          {link && (
            <Typography
              sx={{
                textTransform: 'uppercase',
                fontSize: { mobile: '1.15rem', notebook: '1.5rem' },
                lineHeight: { mobile: '1.15rem', notebook: '1.5rem' },
                fontWeight: 500,
              }}
            >
              <Link
                href={link}
                target="standard"
                style={{
                  textDecoration: 'none',
                  color: '#F29134', //primary.main
                }}
              >
                {subTitle}
              </Link>
            </Typography>
          )}
        </Box>
      </Box>

      {children}
    </Box>
  );
};

export default Header;
