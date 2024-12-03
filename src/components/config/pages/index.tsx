import Head from 'next/head';
import { useRouter } from 'next/router';

import { useState, useEffect } from 'react';

import useAuth from '@/contexts/auth';

import Topbar from './topbar';
import Navbar from './navbar';

import { Box } from '@mui/material';

import 'react-toastify/dist/ReactToastify.css';

import favicon from '../../../../public/favicon.ico';

interface PagesProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

const Pages = (props: PagesProps) => {
  const { title, description, children } = props;
  const Router = useRouter();
  const { user } = useAuth();

  const GetComponent = () => {
    const [OpenSidebar, setOpenSidebar] = useState<boolean>(false);

    const navbar =
      Router.pathname.includes('asphalt/') ||
      Router.pathname.includes('soils/') ||
      Router.pathname.includes('/concrete/') ||
      Router.pathname.includes('settings');

    useEffect(() => {
      setOpenSidebar(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Router.pathname]);

    if (Router.pathname === '/') return children;

    if (user && Router.pathname !== '/')
      return (
        <>
          <Topbar setOpenSidebar={setOpenSidebar} />
          {navbar && <Navbar open={OpenSidebar} app={Router.pathname.split('/')[1]} />}
          <Box>{children}</Box>
        </>
      );
  };

  return (
    <>
      <Head>
        <title>{title ? title : 'FastEng'}</title>
        {description && <meta name="description" content={description} />}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href={favicon.src} type="image/x-icon" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
      </Head>
      <main>{GetComponent()}</main>
    </>
  );
};

export default Pages;
