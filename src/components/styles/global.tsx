import { Button } from "@mui/material";

interface ButtonProps {
    text: string,
    disabled?: boolean,
    linkTo?: string,
    handleClick?: () => void
}

export const MainButton = (props: ButtonProps) => (
    <Button
        href={props.linkTo}
        variant="contained"
        onClick={props.handleClick}
        disabled={props.disabled}
        sx={{
            color: 'primaryTons.mainWhite',
            bgcolor: 'secondaryTons.main',
            fontSize: '1.2rem',
            lineHeight: '1.2rem',
            fontWeight: '700',
            height: '32px',
            width: '150px',
            borderRadius: '20px',
            boxShadow: 'unset',

            '&:hover': {
                bgcolor: '#F2A255',
                boxShadow: 'unset'
            },

            '@media screen and (max-width: 1024px)': {
                fontSize: '1rem',
                lineHeight: '1rem',
                height: '28px',
                width: '126px'
            }
        }}>
        {props.text}
    </Button>
)