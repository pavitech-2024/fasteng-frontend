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
        endIcon={nextText === t('footer.next') ? <NextIcon /> : <SaveIcon />}
        variant="contained"
        disabled={nextDisabled}
        onClick={handleNextClick}
        sx={{
          bgcolor: 'secondaryTons.blue',
          color: 'primaryTons.white',
          height: '32px',
          width: '140px',
          fontSize: '1rem',

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
        {nextText}
      </Button>
    </Box>
  );
};

export default Footer;
