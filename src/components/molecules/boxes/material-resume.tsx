import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { Box, Fade, IconButton } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import useAuth from '@/contexts/auth';
import React, { ReactNode } from 'react';
import { CloseIcon, ArrowDownIcon } from '../../../assets';

interface MaterialResumeProps {
  data: MaterialResumeData;
}

export interface MaterialResumeData {
  name: string;
  type: string;
}

interface TextBoxProps {
  children: JSX.Element | ReactNode;
}

const MaterialResume = ({ data }: MaterialResumeProps) => {
  const TextBox = ({ children }: TextBoxProps) => (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'no-wrap',
        fontSize: { mobile: '.85rem', notebook: '1rem' },
        color: 'primaryTons.mainGray',
      }}
    >
      {children}
    </Box>
  );

  const router = useRouter();
  const { user } = useAuth();
  const [open, setOpen] = React.useState(true);

  const texts = [
    { label: t('authorName'), value: user.name },
    { label: t('asphalt.materialName'), value: data.name },
    { label: t('asphalt.materialType'), value: data.type },
  ];

  return (
    <FlexColumnBorder title={t('general data of essay')} open={open} generalData={true}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
          transform: { mobile: 'translate(10px, -60px)', notebook: 'translateY(-45px)' },
        }}
      >
        <IconButton size="large">
          {open ? (
            <CloseIcon onClick={() => setOpen((prev) => !prev)} />
          ) : (
            <ArrowDownIcon onClick={() => setOpen((prev) => !prev)} />
          )}
        </IconButton>
      </Box>
      {/* fade sem animaçao */}
      <Fade in={open} timeout={0} unmountOnExit>
        <Box
          sx={{
            display: 'flex',
            padding: { mobile: '10px', notebook: '15px' },
            mb: { mobile: '-55px', notebook: '-45px' },
            transform: { mobile: 'translateY(-70px)', notebook: 'translateY(-60px)' },
            alignItems: 'flex-start',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {texts.map((item, index) => (
            <TextBox key={index}>
              <span style={{ fontWeight: '700', marginRight: '5px' }}>{item.label}:</span>
              {item.value}
            </TextBox>
          ))}
        </Box>
      </Fade>
    </FlexColumnBorder>
  );
};

export default MaterialResume;
