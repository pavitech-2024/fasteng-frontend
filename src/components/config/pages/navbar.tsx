import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { t } from 'i18next';
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
    { name: t('navbar.home'), link: '/home', app: 'common', icon: <HomeIcon sx={IconStyle} />, type: 'single' },
    //asphalt
    {
      name: t('navbar.materials'),
      link: '/asphalt/materials',
      icon: <MaterialsIcon sx={IconStyle} />,
      app: 'asphalt',
      type: 'single',
    },
    {
      name: t('navbar.essays'),
      link: '/asphalt/essays',
      app: 'asphalt',
      icon: <EssayIcon sx={IconStyle} />,
      type: 'single',
    },
    {
      name: t('navbar.marshall'),
      link: '/asphalt/dosage/marshall',
      app: 'asphalt',
      icon: <MarshallIcon sx={IconStyle} />,
      type: 'double',
      sub: [
        { name: t('navbar.new'), link: '/dosage/marshall/new', icon: <AddIcon sx={IconStyle} /> },
        { name: t('navbar.consult'), link: '/dosage/marshall/consult', icon: <SearchIcon sx={IconStyle} /> },
      ],
    },
    {
      name: t('navbar.superpave'),
      link: '/asphalt/dosage/superpave',
      app: 'asphalt',
      icon: <SuperpaveIcon sx={IconStyle} />,
      type: 'double',
      sub: [
        { name: t('navbar.new'), link: '/dosage/superpave/new', icon: <AddIcon sx={IconStyle} /> },
        { name: t('navbar.consult'), link: '/dosage/superpave/consult', icon: <SearchIcon sx={IconStyle} /> },
      ],
    },
    {
      name: t('navbar.standards'),
      link: '/asphalt/standards',
      app: 'asphalt',
      icon: <StandartsIcon sx={IconStyle} />,
      type: 'single',
    },
    {
      name: t('navbar.library'),
      link: '/asphalt/library',
      app: 'asphalt',
      icon: <LibraryIcon sx={IconStyle} />,
      type: 'single',
    },
    //soils
    {
      name: t('navbar.samples'),
      link: '/soils/samples',
      app: 'soils',
      icon: <MaterialsIcon sx={IconStyle} />,
      type: 'single',
    },
    {
      name: t('navbar.essays'),
      link: '/soils/essays',
      app: 'soils',
      icon: <EssayIcon sx={IconStyle} />,
      type: 'single',
    },
    {
      name: t('navbar.standards'),
      link: '/soils/standards',
      app: 'soils',
      icon: <StandartsIcon sx={IconStyle} />,
      type: 'single',
    },
    {
      name: t('navbar.library'),
      link: '/soils/library',
      app: 'soils',
      icon: <LibraryIcon sx={IconStyle} />,
      type: 'single',
    },

    //concrete
    {
      name: t('navbar.materials'),
      link: '/concrete/materials',
      app: 'concrete',
      icon: <MaterialsIcon sx={IconStyle} />,
      type: 'single',
    },
    {
      name: t('navbar.essays'),
      link: '/concrete/essays',
      app: 'concrete',
      icon: <EssayIcon sx={IconStyle} />,
      type: 'single',
    },
    {
      name: t('navbar.abcp'),
      link: '/concrete/dosage/abcp',
      app: 'concrete',
      icon: <AbcpIcon sx={IconStyle} />,
      type: 'double',
      sub: [
        { name: t('navbar.new'), link: '/concrete/dosage/abcp/new', icon: <AddIcon sx={IconStyle} /> },
        { name: t('navbar.consult'), link: '/concrete/dosage/abcp/consult', icon: <SearchIcon sx={IconStyle} /> },
      ],
    },
    {
      name: t('navbar.standards'),
      link: '/concrete/standards',
      app: 'concrete',
      icon: <StandartsIcon sx={IconStyle} />,
      type: 'single',
    },
    {
      name: t('navbar.library'),
      link: '/concrete/library',
      app: 'concrete',
      icon: <LibraryIcon sx={IconStyle} />,
      type: 'single',
    },

    { name: t('navbar.report'), link: '/report', app: 'common', icon: <ReportIcon sx={IconStyle} />, type: 'single' },
  ].filter((item) => item.app === Router.pathname.split('/')[1] || item.app === 'common');

  return (
    <Box
      sx={{
        position: 'absolute',
        zIndex: 99,
        display: { mobile: `${open ? 'grid' : 'none'}`, tablet: `${open ? 'grid' : 'none'}`, notebook: 'grid' },
        gridTemplateRows: `repeat(${Items.length}, minmax(48px, max-content))`,
        alignItems: 'flex-start',
        pt: '2rem',
        width: `${open ? '225px' : '64px'}`,
        bgcolor: 'primaryTons.darkGray',
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
                  position: item.name === t('navbar.report') ? 'absolute' : 'relative',
                  bottom: item.name === t('navbar.report') && '0',
                  width: item.name === t('navbar.report') && '100%',
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
                    ':hover': { bgcolor: 'secondaryTons.main' },
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
                          ':hover': { bgcolor: 'secondaryTons.main' },
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
