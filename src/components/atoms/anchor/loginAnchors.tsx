/* eslint-disable @next/next/no-img-element */
import { Box } from '@mui/material';
import lep from '../../../assets/logos/lep.jpg';
import jbr from '../../../assets/logos/jbr.jpg';
import Image from 'next/image';
import Link from '@mui/material/Link';

export const LepAnchor = () => {
  return (
    <Box>
      <Link
        href="https://lepufcg.com.br/"
        sx={{
          padding: '1rem',
          textAlign: 'start',
          position: 'absolute',
          bottom: 0,
          right: 50,
        }}
      >
        <Image
          style={{
            borderRadius: '100%',
            width: '50px',
            height: '50px',
          }}
          width={60}
          height={60}
          alt="LEP"
          src={lep}
        />
      </Link>
    </Box>
  );
};

export const JbrAnchor = () => {
  return (
    <Box>
      <Link
        href="https://www.jbr.eng.br/site/"
        style={{ padding: '1rem', textAlign: 'end', position: 'absolute', bottom: 0, right: 0 }}
      >
        <Image
          style={{
            borderRadius: '100%',
            width: '50px',
            height: '50px',
          }}
          width={40}
          height={40}
          alt="JBR"
          src={jbr}
        />
      </Link>
    </Box>
  );
};