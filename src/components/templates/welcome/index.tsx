import { Box, ImageListItem, ListItem, ListItemText, Typography } from '@mui/material';

interface WelcomeTemplateProps {
  title: string;
}

const WelcomeTemplate = ({ title }: WelcomeTemplateProps) => {
  return (
    <Box /* div principal da pagina */
      sx={{
        marginTop: '6rem',
        display: 'grid',
        gridTemplateColumns: '65% 35%',
        gridColumnGap: '5%',
        width: '100%'
      }}
    >
      <Box sx={{ /* div da coluna da esquerda*/
        textAlign: 'center',
      }}>
        <Box /* div do titulo + imagem*/ sx={{
          paddingBottom: '2rem',
          width: '100%'
        }}>
        <Typography variant='h3' sx={{
          fontWeight: '700',
          fontSize: '36px',
          textTransform: 'uppercase'
        }}>Bem vindo á página de {title}</Typography>
        <ImageListItem></ImageListItem>
        </Box>
        <Box /* div da tabela como funciona */ sx={{
          bgcolor: '#fff',
          margin: '0 8rem',
          borderRadius: '10px'
        }}>
          <Typography variant='h6' sx={{
            marginBottom: '1.5rem',
          }}>Como funciona?</Typography>
          <Typography variant='h6'>1----------------2-------------------3</Typography>
          <ListItem sx={{
            display: 'block'
          }}>
            <ListItemText sx={{
              marginTop: '5rem',
            }}>
              <Typography variant='h6' sx={{
                fontSize: '20px',
                marginBottom: '3rem',
              }}>Materiais: * Descrição sobre materiais *</Typography>
            </ListItemText>
            <ListItemText>
              <Typography variant='h6' sx={{
                fontSize: '20px',
                marginBottom: '3rem',
              }}>Ensaios: * Descrição sobre ensaios *</Typography>
            </ListItemText>
            <ListItemText>
              <Typography variant='h6' sx={{
                fontSize: '20px',
                marginBottom: '3rem',
              }}>Dosagem Marshall: * Descrição sobre Marshall *</Typography>
            </ListItemText>
            <ListItemText>
              <Typography variant='h6' sx={{
                fontSize: '20px',
                marginBottom: '3rem',
              }}>Dosagem Superpave: * Descrição sobre Superpave *</Typography>
            </ListItemText>
            <ListItemText>
              <Typography variant='h6' sx={{
                fontSize: '20px',
                marginBottom: '3rem',
              }}>Normas: * Descrição sobre normas *</Typography>
            </ListItemText>
            <ListItemText>
              <Typography variant='h6' sx={{
                fontSize: '20px',
                marginBottom: '3rem',
              }}>Biblioteca: * Descrição sobre biblioteca *</Typography>
            </ListItemText>
          </ListItem>
        </Box>
      </Box>
      <Box /* div da segunda coluna */ sx={{
        display: 'grid',
        gridTemplateColumns: '30% 70%',
        height: '100%',
        marginRight: '5rem',
      }}>
        <Box /* div da imagem */ sx={{
          bgcolor: 'orange',
          borderRadius: '20px 0 0 20px',
          height: '6rem'
        }}>
          <Typography></Typography>
        </Box>
        <Box /* div do subtitulo */ sx={{
          borderRadius: '0 20px 20px 0',
          bgcolor: '#000',
          color: '#fff',
          textAlign: 'center',
          height: '6rem'
        }}>
          <Typography>Materiais</Typography>
        </Box>
        <Box /* div da imagem */ sx={{
          bgcolor: 'orange',
          borderRadius: '20px 0 0 20px',
          height: '6rem'
        }}>
          <Typography></Typography>
        </Box>
        <Box /* div do subtitulo */ sx={{
          borderRadius: '0 20px 20px 0',
          bgcolor: '#000',
          color: '#fff',
          textAlign: 'center',
          height: '6rem'
        }}>
          <Typography>Materiais</Typography>
        </Box>
        <Box /* div da imagem */ sx={{
          bgcolor: 'orange',
          borderRadius: '20px 0 0 20px',
          height: '6rem'
        }}>
          <Typography></Typography>
        </Box>
        <Box /* div do subtitulo */ sx={{
          borderRadius: '0 20px 20px 0',
          bgcolor: '#000',
          color: '#fff',
          textAlign: 'center',
          height: '6rem'
        }}>
          <Typography>Materiais</Typography>
          
        </Box>
        <Box /* div da imagem */ sx={{
          bgcolor: 'orange',
          borderRadius: '20px 0 0 20px',
          height: '6rem'
        }}>
          <Typography></Typography>
        </Box>
        <Box /* div do subtitulo */ sx={{
          borderRadius: '0 20px 20px 0',
          bgcolor: '#000',
          color: '#fff',
          textAlign: 'center',
          height: '6rem'
        }}>
          <Typography>Materiais</Typography>
        </Box>
        <Box /* div da imagem */ sx={{
          bgcolor: 'orange',
          borderRadius: '20px 0 0 20px',
          height: '6rem'
        }}>
          <Typography></Typography>
        </Box>
        <Box /* div do subtitulo */ sx={{
          borderRadius: '0 20px 20px 0',
          bgcolor: '#000',
          color: '#fff',
          textAlign: 'center',
          height: '6rem'
        }}>
          <Typography>Materiais</Typography>
        </Box>
        <Box /* div da imagem */ sx={{
          bgcolor: 'orange',
          borderRadius: '20px 0 0 20px',
          height: '6rem'
        }}>
          <Typography></Typography>
        </Box>
        <Box /* div do subtitulo */ sx={{
          borderRadius: '0 20px 20px 0',
          bgcolor: '#000',
          color: '#fff',
          textAlign: 'center',
          height: '6rem'
        }}>
          <Typography>Materiais</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default WelcomeTemplate;
