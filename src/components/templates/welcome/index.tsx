import { Box, Typography, Stepper, Step, StepLabel } from '@mui/material';
import Link from 'next/link';

export interface ButtonData {
  name: string;
  icon: JSX.Element;
  description: string;
}

interface WelcomeTemplateProps {
  app: string;
  title: string;
  icon: JSX.Element;
  buttonsData: ButtonData[];
}

const WelcomeTemplate = ({ title, app, buttonsData}: WelcomeTemplateProps) => {

  const titleStyle = {
    fontWeight: '700',
    fontSize: '36px',
    textTransform: 'uppercase',
    };

  return (
    <Box /* div principal da pagina */
      sx={{
        display: 'flex',
        flexDirection: {
          mobile: 'column',
          notebook: 'row',
        },
        justifyContent: 'center',
        width: '100%',
        paddingTop: {
          mobile: '2rem',
          notebook: '4rem'
        }
      }}
    >
      <Box
        sx={{
          /* div da coluna da esquerda*/ width: '65%',
          textAlign: 'center',
        }}
      >
        <Box /* div do titulo + imagem*/ sx={{
          display: 'flex',
          width: '100%',
          paddingBottom: '2rem'
        }} 
        >
        <Typography variant='h2' color='primary' sx={{...titleStyle, span: {color: '#000'}}}><span>Bem-vindo à página de </span>{title}</Typography>
        </Box>
        <Box
          /* div da tabela como funciona */ sx={{
            bgcolor: '#fff',
            borderRadius: '10px',
            width: '55%',
            marginLeft: '5%',
            paddingBottom: '2rem'
          }}
        >
          <Typography
            variant="h6"
            sx={{
              marginBottom: '1.5rem',
              paddingTop: '1rem',
            }}
          >
            Como funciona?
          </Typography>
          <Stepper activeStep={0} alternativeLabel sx={{
          }}>
              <Step>
                <StepLabel>Cadastre um material</StepLabel>
              </Step>
              <Step>
                <StepLabel>Registe ensaios com o material um material</StepLabel>
              </Step>
              <Step>
                <StepLabel>Gere relatórios sobre os ensaios um material</StepLabel>
              </Step>
          </Stepper>
          <Box sx={{
            textAlign: 'left',
            marginLeft: '5%',
            paddingTop: '10%',
          }}>
            {buttonsData.map((button: ButtonData) => (
              <Typography 
                color='primary' 
                sx={{
                paddingBottom: '2rem', 
                span: {color: '#000'}, 
                fontSize: '20px'}}
                key={button.name}
              >
                {button.name}: 
                <span>* {button.description} *</span>
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
      <Box /* div da segunda coluna */ sx={{
        width: '35%'
      }}>
        {buttonsData.map((button: ButtonData) => (
          <Link key={button.name} href={`/${app}/materiais`} 
          style={{textDecoration: 'none'}}>
            <Box
              sx={{
                width: '300px',
                height: '80px',
                paddingBottom: '2rem',
                ':hover': {
                  cursor: 'pointer',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: '100%',
                  width: '100%',
                }}
              >
                <Box
                  /* div da imagem */ sx={{
                    width: '30%',
                    bgcolor: 'orange',
                    borderRadius: '20px 0 0 20px',
                    height: '100%',
                  }}
                >
                  {button.icon}
                </Box>
                <Box
                  /* div do subtitulo */ sx={{
                    width: '70%',
                    height: '100%',
                    borderRadius: '0 20px 20px 0',
                    bgcolor: '#000',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography>{button.name}</Typography>
                </Box>
              </Box>
            </Box>
          </Link>
        ))}
      </Box>
    </Box>
  );
};

export default WelcomeTemplate;
