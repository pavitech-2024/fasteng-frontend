import { Box, Container, Typography } from '@mui/material';
import PromedinaRoundedIcon from '../icons/promedina-roundedIcon';
import PromedinaTitleIcon from '../icons/promedinaTitleIcon';
import Link from 'next/dist/client/link';

export const PromedinaAnchor = () => {
  return (
    <Link href="/promedina">
      <Container sx={{ display: 'flex', flexDirection: 'column', marginTop: '0.5rem' }}>
        <Typography>Conheça também:</Typography>
        <Container sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
          <PromedinaRoundedIcon sx={{ marginRight: '-50px', justifyItems: 'center' }}/>
          <Box sx={{ backgroundColor: '#07B811', borderRadius: '30px', width: '220px' }}>
            <PromedinaTitleIcon />
          </Box>
        </Container>
      </Container>
    </Link>
  );
};
