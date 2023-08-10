import { Typography } from '@mui/material';

interface ResultSubTitleProps {
  title: string;
  sx?: { [key: string]: string | number };
}

const ResultSubTitle = ({ title, sx }: ResultSubTitleProps) => {
  return (
    <Typography
      sx={{
        width: 'fit-content',
        bgcolor: 'primaryTons.border',
        mb: { mobile: '2vh', notebook: '2vh' },
        paddingInline: '2vw 10vw',
        transform: {
          mobile: 'translate(-20px, -10px)',
          notebook: 'translateX(-20px)',
        },
        zIndex: 3,
        textTransform: 'uppercase',
        fontSize: { mobile: '1.15rem', notebook: '1.3rem' },
        lineHeight: { mobile: '2rem', notebook: '2.3rem' },
        color: 'primaryTons.lightGray',
        fontWeight: '700',
        whiteSpace: 'nowrap',
        mt: { notebook: 0, mobile: '1rem' },
        borderRadius: '0 10px 10px 0',
        borderBottom: '3px solid',
        borderColor: 'primary.main',
        ...sx,
      }}
      variant="h5"
    >
      {title}
    </Typography>
  );
};

export default ResultSubTitle;
