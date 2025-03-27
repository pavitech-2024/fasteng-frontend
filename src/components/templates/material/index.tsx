import React from 'react';
import { Box } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { PageGenericContainer as Container } from '@/components/organisms/pageContainer';
import Header from '@/components/organisms/header';
import BodyEssay from '@/components/organisms/bodyEssay';
import { IMaterialService } from '@/interfaces/common/material';
import { AsphaltMaterial } from '@/interfaces/asphalt';

export interface MaterialTemplateProps {
  materialInfo: IMaterialService['info'];
  children: JSX.Element;
  data: AsphaltMaterial;
}

const MaterialTemplate = ({ materialInfo: { icon, key, standard }, children }: MaterialTemplateProps) => {
  const router = useRouter();
  const app = router.pathname.split('/')[1];

  return (
    <Container>
      <Header
        title={t(`${app}.materials.${key}`)}
        subTitle={standard?.name}
        image={icon}
        link={standard?.link}
      ></Header>

      <BodyEssay>
        <Box
          sx={{
            width: { mobile: '90%', notebook: '80%' },
            maxWidth: '2200px',
            padding: '2rem',
            borderRadius: '20px',
            bgcolor: 'primaryTons.white',
            border: '1px solid',
            borderColor: 'primaryTons.border',
          }}
        >
          {children}
        </Box>
      </BodyEssay>
    </Container>
  );
};

export default MaterialTemplate;
