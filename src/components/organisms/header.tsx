import { Box, Typography } from '@mui/material';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface HeaderProps {
  title: string;
  subTitle?: string;
  link?: string;
  icon?: JSX.Element;
  image?: StaticImageData;
  children?: React.ReactNode | JSX.Element;
}

export const Header = ({ title, subTitle, link, icon, image, children }: HeaderProps) => {
  const { pathname } = useRouter();
  const isSuperpavePage = pathname.includes('superpave');

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: { mobile: '4vh 2vw', notebook: '3vh 3vw' },
        flexDirection: { notebook: 'row', mobile: 'column' },
      }}
    >
      {!isSuperpavePage && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: { mobile: '2vh', notebook: 0 },
            gap: { mobile: '1rem', notebook: '3rem' },
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
              }}
            >
              {title}
            </Typography>
            {subTitle && (
              <Typography
                sx={{
                  textTransform: 'uppercase',
                  fontSize: { mobile: '1.15rem', notebook: '1.5rem' },
                  lineHeight: { mobile: '1.15rem', notebook: '1.5rem' },
                  fontWeight: 500,
                }}
              >
                {link && link !== '' ? (
                  <Link
                    href={link}
                    target="standard"
                    download={link}
                    style={{
                      textDecoration: 'none',
                      color: '#F29134', //primary.main
                    }}
                  >
                    {subTitle}
                  </Link>
                ) : (
                  <Typography
                    style={{
                      textDecoration: 'none',
                      color: '#F29134', //primary.main
                      fontWeight: 500,
                      fontSize: '1.5rem',
                    }}
                  >
                    {subTitle}
                  </Typography>
                )}
              </Typography>
            )}
          </Box>
        </Box>
      )}

      {children}
    </Box>
  );
};

export default Header;
