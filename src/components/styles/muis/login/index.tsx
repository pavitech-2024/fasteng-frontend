import { Button } from "@mui/material";

export const AboutButton = () => (
    <Button
        variant="contained"
        sx={{
            color: 'secondaryTons.main',
            bgcolor: 'primaryTons.darkGray',
            fontSize: '1.2rem',
            lineHeight: '1.2rem',
            fontWeight: '700',
            height: '32px',
            width: '150px',
            borderRadius: '20px',
            boxShadow: 'unset',
            border: '1px solid #F2A255',

            '&:hover': {
                bgcolor: 'primaryTons.darkerGray',
                border: '1px solid secondaryTons.main',
                boxShadow: 'unset'
            },

            '@media screen and (max-width: 1024px)': {
                fontSize: '1rem',
                lineHeight: '1rem',
                height: '28px',
                width: '126px'
            }
        }}>
            Saiba mais
    </Button>
)