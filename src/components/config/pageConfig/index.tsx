import Head from 'next/head';
import { createGlobalStyle } from 'styled-components';
import useAuth from '@/contexts/auth';
import Topbar from './topbar';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Navbar from './navbar';
import { Box } from '@mui/material';

interface PageConfigProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

const GlobalStyle = createGlobalStyle`
	* {
		margin: 0;
		padding: 0;
	}
	body {
		background-color: #F4F5F7;
		height: 100%;
    overflow-x: hidden;
    p, span, h1, h2, h3, h4, h5, h6, button, label, div, textarea, input{
      font-family: 'Work Sans ', sans-serif;
    }
  }
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: relative;
  }
`;

const PageConfig = (props: PageConfigProps) => {
  const { title, description, children } = props;
  const Router = useRouter();
  const { user } = useAuth();

  const GetComponent = () => {
    const [OpenSidebar, setOpenSidebar] = useState<boolean>(false);

    const navbar =
      Router.pathname.includes('asphalt') || Router.pathname.includes('soils') || Router.pathname.includes('concrete');

    if (Router.pathname === '/') {
      return children;
    }

    if (user && Router.pathname !== '/') {
      return (
        <>
          <Topbar setOpenSidebar={setOpenSidebar} />
          {navbar && <Navbar open={OpenSidebar} type={Router.pathname.split('/')[1]} />}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                padding: { mobile: '1rem 2rem 1rem 2rem', notebook: '3rem 8rem 3rem 8rem' },
                width: '100%',
                background: 'red',
              }}
              maxWidth="ultrawide"
            >
              {children}
            </Box>
          </Box>
        </>
      );
    }
  };

  return (
    <>
      <Head>
        <title>{title ? title : 'FastEng'}</title>
        {description && <meta name="description" content={description} />}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="@public/favicon.ico" type="image/x-icon" />
      </Head>
      <main>
        <GlobalStyle />
        {GetComponent()}
      </main>
    </>
  );
};

export default PageConfig;
