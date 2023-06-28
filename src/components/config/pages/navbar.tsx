import { Box, TextField, Typography } from '@mui/material';
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
import ModalBase from '@/components/molecules/modals/modal';
import { ChangeEvent, useState } from 'react';
import Cookies from 'js-cookie';

interface NavbarProps {
  open: boolean;
  app: string;
};

interface ItemProps {
  name: string;
  link: string;
  app: string;
  icon: JSX.Element;
  type: string;
  sub?: { name: string; link: string; icon: JSX.Element }[];
};

// interface IReportErrorModalInputs {
//   label: string,
//   value: string,
// };

export default function Navbar({ open, app }: NavbarProps) {
  const Router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const IconStyle = { color: 'primaryTons.white', fontSize: '1.5rem' };
  const [modalValues, setModalValues] = useState({
    subject: '',
    contact: '',
    body: '',
    sender: ''
  });

  const getModalInput = () => {
    const modalInputs = [
      {
        label: 'Assunto',
        key: 'subject',
        value: modalValues.subject,
      },
      {
        label: 'Contato',
        key: 'contact',
        value: modalValues.contact
      },
      {
        label: 'Nome',
        key: 'sender',
        value: modalValues.sender
      },
      {
        label: 'Texto',
        key: 'body',
        value: modalValues.body
      },
    ];

    return modalInputs;
  };

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

    {
      name: t('navbar.report'),
      link: '/report',
      app: 'common',
      icon: <ReportIcon sx={IconStyle} />,
      type: 'single'
    },
  ].filter((item) => item.app === Router.pathname.split('/')[1] || item.app === 'common');

  const handleModal = (e) => {
    e.preventDefault()
    setOpenModal(!openModal ? true : false)
  };

  const handleReportErrorChange = (event: ChangeEvent<HTMLTextAreaElement>, key: string) => {
    console.log("🚀 ~ file: navbar.tsx:214 ~ handleReportErrorChange ~ key:", key)
    event.preventDefault();
    const input = event.target.value;
    setModalValues({...modalValues, [key]: input})
  };

  const handleSubmit = async () => {
    const cookies = Cookies.get();
    const token = cookies['fasteng.token'];

    try {
      const response = await fetch('/api/report-error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify(modalValues)
      });

      if (response.status === 200) {
        console.log('Email enviado com sucesso');
      } else {
        console.log('Ocorreu um erro ao enviar o email');
      }
    } catch (error) {
      console.log('Ocorreu um erro ao enviar o email:', error.message);
    };
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        zIndex: 99,
        display: { mobile: `${open ? 'flex' : 'none'}`, notebook: 'flex' },
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: `${open ? '225px' : '52px'}`,
        pt: { mobile: '52px', notebook: '0' },
        mt: '-52px',
        bgcolor: 'primaryTons.mainGray',
        height: '100vh',
        transition: 'width 0.5s',

        ':hover': {
          width: '225px',
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
                height: '52px',
                width: 'inherit',
                overflow: 'hidden',
                transition: 'height .4s ease-in-out',
                ':hover': {
                  height: item.type === 'double' ? `calc(52px + (52px * ${subLength.toString()}))` : '52px',
                },
              }}
            >
              <Link
                href={item.link}
                style={{
                  textDecoration: 'none',
                  position: item.name === t('navbar.report') ? 'absolute' : 'static',
                  bottom: item.name === t('navbar.report') && '0',
                  width: '100%',
                }}
                onClick={ item.name === t('navbar.report') ? handleModal : undefined }
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyItems: 'start',
                    alignItems: 'center',
                    width: '100%',
                    height: '52px',
                    transition: 'background .3s ease-in-out, border .1s',
                    overflow: 'hidden',
                    borderRight: `${Router.pathname.includes(item.link) && '3px solid'}`,
                    borderColor: 'primary.main',
                    ':hover': { bgcolor: 'primary.main' },
                  }}
                >
                  <Box sx={{ width: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                  </Box>
                  <Typography
                    sx={{
                      width: 'calc(100% - 52px)',
                      height: '52px',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '.8125rem',
                      fontWeight: 700,
                      lineHeight: '.9375rem',
                      whiteSpace: 'nowrap',
                      color: 'primaryTons.white',
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
                          display: 'flex',
                          bgcolor: 'primaryTons.lightGray',
                          justifyItems: 'flex-start',
                          alignItems: 'center',
                          width: '100%',
                          pl: '15%',
                          height: '52px',
                          transition: 'background .3s ease-in-out, border .1s',
                          overflow: 'hidden',
                          borderRight: `${Router.pathname.includes(item.link) && '3px solid'}`,
                          borderColor: 'primaryTons.darkGray',
                          ':hover': { bgcolor: 'primary.main' },
                        }}
                      >
                        <Box sx={{ width: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {subItem.icon}
                        </Box>
                        <Typography
                          sx={{
                            fontSize: '.8125rem',
                            fontWeight: 700,
                            lineHeight: '.9375rem',
                            whiteSpace: 'nowrap',
                            color: 'primaryTons.white',
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

      <ModalBase 
        title={''} 
        leftButtonTitle={'cancelar'} 
        rightButtonTitle={'enviar'} 
        onCancel={() => setOpenModal(false) } 
        open={openModal} 
        size={'small'} 
        onSubmit={handleSubmit}
      >
        <Box sx={{ mb: '1rem' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box 
              sx={{ 
                display: 'flex',
              }}
            >
              {getModalInput().map((input) => (
                input.label !== 'texto' ? (
                  <Box
                    sx={{ flex: 1, padding: '10px' }} key={input.label}
                  >
                    <TextField
                      label={input.label}
                      variant="standard"
                      value={input.value}
                      required
                      onChange={(event: ChangeEvent<HTMLTextAreaElement>) => handleReportErrorChange(event, input.key)}
                    />
                  </Box>
                ) : (
                  null
                )
              ))}
            </Box>
            <Box
              sx={{ display: 'flex', width: '-webkit-fill-available' }}
            >
              {getModalInput().map((input) => (
                input.label === 'texto' ? (
                  <Box
                    sx={{ padding: '10px' }}
                    key={input.label}
                  >
                    <TextField
                      label={input.label}
                      variant="standard"
                      value={input.value}
                      required
                      onChange={(event: ChangeEvent<HTMLTextAreaElement>) => handleReportErrorChange(event, input.key)}
                      sx={{ width: '100%' }}
                      multiline
                      rows={4}
                    />
                  </Box>
                ) : (
                  null
                )
              ))}
            </Box>
          </Box>
        </Box>
      </ModalBase>
    </Box>
  );
}
