import { Box, ImageListItem, ListItem, ListItemText, Typography } from '@mui/material';
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

// const WelcomeTemplate = ({ title, icon, buttonsData }: WelcomeTemplateProps) => {
//   console.log(buttonsData, icon);

//   const titleStyle = {
//     fontWeight: '700',
//     fontSize: '36px',
//     textTransform: 'uppercase',
//   };
//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: {
//           mobile: 'column',
//           notebook: 'row',
//         },
//         justifyContent: 'center',
//         width: '100%',
//       }}
//     >
//       <Box sx={{ width: '65%', bgcolor: 'yellow' }}>
//         <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
//           <Typography variant="h1" sx={titleStyle}>
//             {`Bem vindo á página de `}
//           </Typography>
//           <Typography color="primary" sx={titleStyle}>
//             {title}
//           </Typography>
//           {icon}
//         </Box>
//         <Box sx={{ display: 'grid', gap: '10px', gridTemplateRows: '1fr' }}>
//           {buttonsData.map((buttonData) => {
//             return (
//               <Box key={buttonData.name}>
//                 <Typography>{buttonData.name}</Typography>
//                 {buttonData.icon}
//                 <Typography>{buttonData.description}</Typography>
//               </Box>
//             );
//           })}
//         </Box>
//       </Box>

//       <Box sx={{ width: '35%', bgcolor: 'red' }}></Box>
//     </Box>
//   );
// };

const WelcomeTemplate = ({ title, app, buttonsData }: WelcomeTemplateProps) => {
  return (
    <Box /* div principal da pagina */
      sx={{
        marginTop: '6rem',
        display: 'grid',
        gridTemplateColumns: '65% 35%',
        gridColumnGap: '5%',
        width: '100%',
      }}
    >
      <Box
        sx={{
          /* div da coluna da esquerda*/ textAlign: 'center',
        }}
      >
        <Box
          /* div do titulo + imagem*/ sx={{
            paddingBottom: '2rem',
            width: '100%',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: '700',
              fontSize: '36px',
              textTransform: 'uppercase',
            }}
          >
            Bem vindo á página de {title}
          </Typography>
          <ImageListItem></ImageListItem>
        </Box>
        <Box
          /* div da tabela como funciona */ sx={{
            bgcolor: '#fff',
            margin: '0 8rem',
            borderRadius: '10px',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              marginBottom: '1.5rem',
            }}
          >
            Como funciona?
          </Typography>
          <Typography variant="h6">1----------------2-------------------3</Typography>
          <ListItem
            sx={{
              display: 'block',
            }}
          >
            <ListItemText
              sx={{
                marginTop: '5rem',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontSize: '20px',
                  marginBottom: '3rem',
                }}
              >
                Materiais: * Descrição sobre materiais *
              </Typography>
            </ListItemText>
            <ListItemText>
              <Typography
                variant="h6"
                sx={{
                  fontSize: '20px',
                  marginBottom: '3rem',
                }}
              >
                Ensaios: * Descrição sobre ensaios *
              </Typography>
            </ListItemText>
            <ListItemText>
              <Typography
                variant="h6"
                sx={{
                  fontSize: '20px',
                  marginBottom: '3rem',
                }}
              >
                Dosagem Marshall: * Descrição sobre Marshall *
              </Typography>
            </ListItemText>
            <ListItemText>
              <Typography
                variant="h6"
                sx={{
                  fontSize: '20px',
                  marginBottom: '3rem',
                }}
              >
                Dosagem Superpave: * Descrição sobre Superpave *
              </Typography>
            </ListItemText>
            <ListItemText>
              <Typography
                variant="h6"
                sx={{
                  fontSize: '20px',
                  marginBottom: '3rem',
                }}
              >
                Normas: * Descrição sobre normas *
              </Typography>
            </ListItemText>
            <ListItemText>
              <Typography
                variant="h6"
                sx={{
                  fontSize: '20px',
                  marginBottom: '3rem',
                }}
              >
                Biblioteca: * Descrição sobre biblioteca *
              </Typography>
            </ListItemText>
          </ListItem>
        </Box>
      </Box>
      <Box /* div da segunda coluna */>
        <Link href={`/${app}/materiais`}>
          <Box
            sx={{
              width: '450px',
              height: '100px',
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
                {buttonsData[0].icon}
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
                <Typography>Materiais</Typography>
              </Box>
            </Box>
          </Box>
        </Link>
      </Box>
    </Box>
  );
};

export default WelcomeTemplate;
