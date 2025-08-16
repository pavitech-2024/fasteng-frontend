import { Box, Button } from '@mui/material';
import { PreviousIcon, NextIcon, SaveIcon } from '@/assets';
import { t } from 'i18next';

interface FooterProps {
  previousText: string;
  previousDisabled: boolean;
  handlePreviousClick: () => void;
  nextText: string;
  nextDisabled: boolean;
  handleNextClick: () => void;
}

export const Footer = ({
  previousText,
  previousDisabled,
  handlePreviousClick,
  nextText,
  nextDisabled,
  handleNextClick,
}: FooterProps) => {

  const isDosage = window.location.pathname.includes('dosages/');
  const buttonText = isDosage ? t('footer.newDosage') : t('footer.newEssay');

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: { mobile: '4vh 4vw', notebook: '3vh 6vw' },
      }}
    >
      <Button
        startIcon={<PreviousIcon />}
        variant="contained"
        disabled={previousDisabled}
        onClick={handlePreviousClick}
        sx={{
          bgcolor: 'secondaryTons.blue',
          color: 'primaryTons.white',
          height: '32px',
          width: '140px',
          fontSize: '1rem',
          alignItems: 'center',

          ':hover': {
            transition: 'all 0.1s ease-in-out',
            bgcolor: 'secondaryTons.blueDisabled',
          },

          ':active': {
            transition: 'all 0.1s ease-in-out',
            bgcolor: 'secondaryTons.blueClick',
          },
        }}
      >
        {previousText}
      </Button>

      <Button
        endIcon={
          nextText === t('footer.next') ? <NextIcon /> : nextText === buttonText ? <></> : <SaveIcon />
        }
        variant="contained"
        disabled={nextDisabled}
        onClick={handleNextClick}
        sx={{
          bgcolor: (nextText === buttonText) || (isDosage && buttonText === 'Nova dosagem') ? 'secondaryTons.orange' : 'secondaryTons.blue',
          color: 'primaryTons.white',
          height: '32px',
          width: isDosage ? 'fit-content' : '140px',
          fontSize: '1rem',

          ':hover': {
            transition: 'all 0.1s ease-in-out',
            bgcolor: nextText === buttonText ? 'primary.main opacity: 0.8' : 'secondaryTons.blueDisabled',
          },

          ':active': {
            transition: 'all 0.1s ease-in-out',
            bgcolor: 'secondaryTons.blueClick',
          },
        }}
      >
        {nextText}
      </Button>
    </Box>
  );
};

export default Footer;
