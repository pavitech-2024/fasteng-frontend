import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  root: {
    --darkest: #121212;
    --darker: #212121;
    --dark: #383838;
    --background: #F2F2F2;
    --white: #FCFCFC;
    --border: #CFCFCF;
    --gray: #838383;
    --orange: #F29134;
    --button: #00A3FF;
    --disabledButton: #7CD0FF;
    --green: #43D16B;
    --red: #F23434;
  }

	* {
    font-family: 'Roboto', sans-serif;
	}

	body {
    margin: 0;
		padding: 0;
    box-sizing: border-box;
		background-color: var(--background);

    p, span, h1, h2, h3, h4, h5, h6, button, label, div, textarea, input {
      font-family: 'Roboto', sans-serif;
    }
  }

  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: relative;
  }

  a {
    text-decoration: none;
  }

  button {
    cursor: pointer;
  }
`
export default GlobalStyle
