import { createGlobalStyle } from 'styled-components';

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
  return (
    <>
      <header>
        <title>{title ? title : 'FastEng'}</title>
        {description && <meta name="description" content={description} />}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="../../../public/favicon.ico" type="image/x-icon" />
      </header>
      <main>
        <GlobalStyle />
        {children}
      </main>
    </>
  );
};

export default PageConfig;
