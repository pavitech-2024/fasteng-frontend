import Head from 'next/head';
import { createGlobalStyle } from 'styled-components';
import useAuth from '@/contexts/auth';
import Topbar from './topbar';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Navbar from './navbar';
import { Box } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';

interface PagesProps {
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
		background-color: #F2F2F2;
		height: 100%;
    overflow-x: hidden;

    p, span, h1, h2, h3, h4, h5, h6, button, label, div, textarea, input{
      font-family: 'Roboto', sans-serif;
    }
  }

  body::-webkit-scrollbar {
    width: 12px;
  }

  body::-webkit-scrollbar-track {
    background: #FCFCFC;
  }

  body::-webkit-scrollbar-thumb {
    background-color: #121212;
    border-radius: 20px;
    border: 2px solid #F2F2F2;
  }

  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: relative;
  }
`;

const Pages = (props: PagesProps) => {
  const { title, description, children } = props;
  const Router = useRouter();
  const { user } = useAuth();

  const GetComponent = () => {
    const [OpenSidebar, setOpenSidebar] = useState<boolean>(false);

    const navbar =
      Router.pathname.includes('asphalt') || Router.pathname.includes('soils') || Router.pathname.includes('concrete');

    if (Router.pathname === '/') return children;

    if (user && Router.pathname !== '/')
      return (
        <>
          <Topbar setOpenSidebar={setOpenSidebar} />
          {navbar && <Navbar open={OpenSidebar} app={Router.pathname.split('/')[1]} />}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: '90vw',
                height: '83vh',
                padding: '5vh 5vw'
              }}
            >
              {children}
            </Box>
          </Box>
        </>
      );
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

export default Pages;
