import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  HomeIcon,
  AddIcon,
  SearchIcon,
  MaterialsIcon,
  EssayIcon,
  MarshallIcon,
  SuperpaveIcon,
  ReportIcon,
  StandartsIcon,
  LibraryIcon,
  AbcpIcon,
} from '@/assets';

interface NavbarProps {
  open: boolean;
  app: string;
}

interface ItemProps {
  name: string;
  link: string;
  app: string;
  icon: JSX.Element;
  type: string;
  sub?: { name: string; link: string; icon: JSX.Element }[];
}

export default function Navbar({ open, app }: NavbarProps) {
  const Router = useRouter();
  const IconStyle = { color: 'white', fontSize: '1.5rem' };

  const Items: ItemProps[] = [
    { name: 'Início', link: '/home', app: 'common', icon: <HomeIcon sx={IconStyle} />, type: 'single' },
    //asphalt
    {
      name: 'Materiais',
      link: '/asphalt/materials',
      icon: <MaterialsIcon sx={IconStyle} />,
      app: 'asphalt',
      type: 'single',
    },
    { name: 'Ensaios', link: '/asphalt/essays', app: 'asphalt', icon: <EssayIcon sx={IconStyle} />, type: 'single' },
    {
      name: 'Dosagem Marshall',
      link: '/asphalt/dosage/marshall',
      app: 'asphalt',
      icon: <MarshallIcon sx={IconStyle} />,
      type: 'double',
      sub: [
        { name: 'Criar', link: '/dosage/marshall/new', icon: <AddIcon sx={IconStyle} /> },
        { name: 'Consultar', link: '/dosage/marshall/search', icon: <SearchIcon sx={IconStyle} /> },
      ],
    },
    {
      name: 'Dosagem Superpave',
      link: '/asphalt/dosage/superpave',
      app: 'asphalt',
      icon: <SuperpaveIcon sx={IconStyle} />,
      type: 'double',
      sub: [
        { name: 'Criar', link: '/dosage/superpave/new', icon: <AddIcon sx={IconStyle} /> },
        { name: 'Consultar', link: '/dosage/superpave/search', icon: <SearchIcon sx={IconStyle} /> },
      ],
    },
    {
      name: 'Normas',
      link: '/asphalt/standards',
      app: 'asphalt',
      icon: <StandartsIcon sx={IconStyle} />,
      type: 'single',
    },
    {
      name: 'Biblioteca',
      link: '/asphalt/library',
      app: 'asphalt',
      icon: <LibraryIcon sx={IconStyle} />,
      type: 'single',
    },
    //soils
    {
      name: 'Amostras',
      link: '/soils/materials',
      app: 'soils',
      icon: <MaterialsIcon sx={IconStyle} />,
      type: 'single',
    },
    { name: 'Ensaios', link: '/soils/essays', app: 'soils', icon: <EssayIcon sx={IconStyle} />, type: 'single' },
    { name: 'Normas', link: '/soils/standards', app: 'soils', icon: <StandartsIcon sx={IconStyle} />, type: 'single' },
    {
      name: 'Biblioteca',
      link: '/soils/library',
      app: 'soils',
      icon: <LibraryIcon sx={IconStyle} />,
      type: 'single',
    },

    //concrete
    {
      name: 'Materiais',
      link: '/concrete/materials',
      app: 'concrete',
      icon: <MaterialsIcon sx={IconStyle} />,
      type: 'single',
    },
    { name: 'Ensaios', link: '/concrete/essays', app: 'concrete', icon: <EssayIcon sx={IconStyle} />, type: 'single' },
    {
      name: 'Dosagem ABCP',
      link: '/concrete/dosage/abcp',
      app: 'concrete',
      icon: <AbcpIcon sx={IconStyle} />,
      type: 'double',
      sub: [
        { name: 'Criar', link: '/concrete/dosage/abcp/new', icon: <AddIcon sx={IconStyle} /> },
        { name: 'Consultar', link: '/concrete/dosage/abcp/search', icon: <SearchIcon sx={IconStyle} /> },
      ],
    },
    {
      name: 'Normas',
      link: '/concrete/standards',
      app: 'concrete',
      icon: <StandartsIcon sx={IconStyle} />,
      type: 'single',
    },
    {
      name: 'Biblioteca',
      link: '/concrete/library',
      app: 'concrete',
      icon: <LibraryIcon sx={IconStyle} />,
      type: 'single',
    },

    { name: 'Reportar', link: '/report', app: 'common', icon: <ReportIcon sx={IconStyle} />, type: 'single' },
  ].filter((item) => item.app === Router.pathname.split('/')[1] || item.app === 'common');

  return (
    <Box
      sx={{
        position: 'absolute',
        display: { mobile: `${open ? 'grid' : 'none'}`, tablet: `${open ? 'grid' : 'none'}`, notebook: 'grid' },
        gridTemplateRows: `repeat(${Items.length}, minmax(48px, max-content))`,
        alignItems: 'flex-start',
        pt: '2rem',
        width: `${open ? '225px' : '64px'}`,
        bgcolor: 'secondary.light',
        height: 'calc(100vh - calc(2rem + 56px))',
        transition: 'width 0.5s',
        ':hover': {
          width: '225px',
        },
        ':last-child': {
          position: 'absolute',
          bottom: 0,
        },
      }}
      component="nav"
    >
      {Items.map((item) => {
        const subLength = item.sub ? item.sub.length : 0;

        if (item.app === 'common' || item.app === app)
          return (
            <Box
              key={item.name}
              sx={{
                height: { mobile: `calc( 48px + (48px * ${subLength.toString()}) )`, notebook: '48px' },
                overflow: 'hidden',
                transition: 'height .4s ease-in-out',
                ':hover': {
                  height: item.type === 'double' ? `calc( 48px + (48px * ${subLength.toString()}) )` : '48px',
                },
              }}
            >
              <Link
                href={item.link}
                style={{
                  textDecoration: 'none',
                  position: item.name === 'Reportar' ? 'absolute' : 'relative',
                  bottom: item.name === 'Reportar' && '0',
                  width: item.name === 'Reportar' && '100%',
                }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1.75rem minmax(0,1fr)',
                    gap: '15px',
                    justifyItems: 'flex-start',
                    alignItems: 'center',
                    width: `${
                      Router.pathname.includes(item.link) ? 'calc(100% - 1.3125rem - 3px)' : 'calc(100% - 1.3125rem)'
                    }`,
                    pl: '1.3125rem',
                    height: '3rem',
                    transition: 'background .3s ease-in-out, border .1s',
                    overflow: 'hidden',
                    position: 'relative',
                    borderRight: `${Router.pathname.includes(item.link) && '3px solid'}`,
                    borderColor: 'primaryTons.darkerGray',
                    ':hover': { bgcolor: 'primaryTons.darkerGray' },
                  }}
                >
                  {item.icon}
                  <Typography
                    sx={{
                      fontSize: '.8125rem',
                      fontWeight: 700,
                      lineHeight: '.9375rem',
                      letterSpacing: '.03em',
                      whiteSpace: 'nowrap',
                      color: 'white',
                      transition: 'color .5s ease-in-out',
                    }}
                  >
                    {item.name}
                  </Typography>
                </Box>
              </Link>
              {item.type === 'double' &&
                item?.sub.map((subItem) => {
                  return (
                    <Link key={subItem.name} href={subItem.link} style={{ textDecoration: 'none' }}>
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '1.75rem minmax(0,1fr)',
                          gap: '15px',
                          justifyItems: 'flex-start',
                          alignItems: 'center',
                          width: `${
                            Router.pathname.includes(item.link)
                              ? 'calc(100% - 1.3125rem - 3px)'
                              : 'calc(100% - 1.3125rem)'
                          }`,
                          pl: '3.6125rem',
                          height: '3rem',
                          transition: 'background .3s ease-in-out, border .1s',
                          overflow: 'hidden',
                          position: 'relative',
                          borderRight: `${Router.pathname.includes(item.link) && '3px solid'}`,
                          borderColor: 'primaryTons.darkerGray',
                          ':hover': { bgcolor: 'primaryTons.darkerGray' },
                        }}
                      >
                        {subItem.icon}
                        <Typography
                          sx={{
                            fontSize: '.8125rem',
                            fontWeight: 700,
                            lineHeight: '.9375rem',
                            letterSpacing: '.03em',
                            whiteSpace: 'nowrap',
                            color: 'white',
                            transition: 'color .5s ease-in-out',
                          }}
                        >
                          {subItem.name}
                        </Typography>
                      </Box>
                    </Link>
                  );
                })}
            </Box>
          );
      })}
    </Box>
  );
}
