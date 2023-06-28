import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { Box, Fade, IconButton } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import useAuth from '@/contexts/auth';
import React, { ReactNode } from 'react';
import { CloseIcon, ArrowDownIcon } from '../../../assets';

interface ExperimentResumeProps {
  data: ExperimentResumeData;
}

export interface ExperimentResumeData {
  experimentName: string;
  materials: {
    name: string;
    type: string;
  }[];
}

interface TextBoxProps {
  children: JSX.Element | ReactNode;
}

const ExperimentResume = ({ data }: ExperimentResumeProps) => {
  const TextBox = ({ children }: TextBoxProps) => (
    <Box sx={{ display: 'flex', flexWrap: 'no-wrap', fontSize: { mobile: '14px', notebook: '16.5px' } }}>
      {children}
    </Box>
  );

  const router = useRouter();
  const app = router.pathname.split('/')[1];
  const { user } = useAuth();
  const [open, setOpen] = React.useState(true);

  const texts = [
    { label: t('authorName'), value: user.name },
    { label: t('cbr.experimentName'), value: data.experimentName },
  ];

  data.materials.forEach((item) => {
    texts.push({ label: t(`${app === 'soils' ? 'sample' : 'material'}`), value: item.name });
    texts.push({
      label: t('asphalt.materials.type'),
      value: t(`${app === 'soils' ? 'samples' : 'materials'}.${item.type}`),
    });
  });
  return (
    <FlexColumnBorder
      title={t('general data of essay')}
      sx={{ height: !open && '30px' }}
      sx_title={{
        transform: {
          mobile: !open ? 'translateY(0px)' : 'translateY(calc(-20px - 14.25px))',
          notebook: !open ? 'translateY(0px)' : 'translateY(calc(-20px - 7.5px))',
        },
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'end', transform: 'translateY(-35px)' }}>
        <IconButton>
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
            padding: { mobile: '10px', notebook: '0 0 0 2.5rem' },
            alignItems: 'flex-start',
            flexDirection: 'column',
            gap: '10px',
            transform: 'translateY(-30px)',
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

export default ExperimentResume;