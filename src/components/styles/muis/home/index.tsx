import { Card, Box } from "@mui/material";
import { NextPage } from "next";

interface Props {
    element: {
        name: string;
        icon: JSX.Element;
        link: string;
    };
    onClick: () => Promise<boolean>;
}

export const CardApp: NextPage<Props> = ({ element, onClick }) => (
    <Card
        onClick={onClick}
        sx={{
            width: { mobile: '300px', notebook: '220px', desktop: '260px', containerMargin: '300px' },
            height: { mobile: '90px', notebook: '240px', desktop: '280px', containerMargin: '320px' },
            borderRadius: '20px',
            boxShadow: 'none',
            display: 'flex',
            flexDirection: { mobile: 'row', notebook: 'column' },
            cursor: 'pointer',
            backgroundColor: 'white'
        }}
    >
        <Box
            sx={{
                backgroundColor: 'primaryTons.darkerGray',
                height: { mobile: '100%', notebook: '75%' },
                width: { mobile: '90px', notebook: '100%' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Box
                    sx={{
                        height: {
                            mobile: '55px',
                            notebook: '120px',
                            desktop: '140px',
                            containerMargin: '160px' },
                        width: 'auto'
                    }}>
                    {element.icon}
                </Box>
        </Box>
        <Box
            sx={{
                backgroundColor: 'secondaryTons.main',
                height: { mobile: '100%', notebook: '25%' },
                width: { mobile: 'calc(210px - 8vw)', notebook: 'calc(100% - 4vw)' },
                display: 'flex',
                textAlign: { mobile: 'left', notebook: 'center' },
                justifyContent: { mobile: 'start', notebook: 'center' },
                alignItems: 'center',
                padding: { mobile: '0 4vw', notebook: '0 2vw' },
                fontSize: {
                    mobile: '1.25rem',
                    notebook: '1.35rem',
                    desktop: '1.45rem',
                    containerMargin: '1.8rem' },
                fontWeight: '700',
                color: 'primaryTons.mainWhite',
                lineHeight: {
                    mobile: 'auto',
                    notebook: '1.35rem',
                    desktop: '1.5rem',
                    containerMargin: '2rem' },
            }}>
                {element.name}
        </Box>
    </Card>
)