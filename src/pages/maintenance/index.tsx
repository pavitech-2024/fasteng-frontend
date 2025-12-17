
import { Container, Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import LogoBlack from "@/assets/fasteng/LogoBlack.png";
import {LoginImage} from "@/components/styles/styleds/login";

const Maintenance: NextPage = () => {
    const Router = useRouter();
    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'start',
                alignItems: 'center',
                height: 'calc(100vh - 52px)',
                width: '100vw',
                p: '3vh 0',
                mt: '52px',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: { mobile: '17.5%', notebook: '25%' },
                    maxHeight: '250px',
                }}
            >
                <LoginImage alt="LogoFasteng" src={LogoBlack} style={{ margin: '1vh 0' }} />
                <Box
                    sx={{
                        bgcolor: 'primaryTons.white',
                        borderRadius: '10px',
                        width: { mobile: '90vw', notebook: '500px', desktop: '550px' },
                        border: '1px solid',
                        borderColor: 'primaryTons.border',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        position: 'relative',
                        transition: '0.5s ease-out',
                    }}>

                <Typography
                sx={{
                fontSize: { desktop: '1.15rem', notebook: '1rem', mobile: '.85rem' },
                fontWeight: 400,
                color: 'primaryTons.darkGray',
                textAlign: 'center',
                maxWidth: '1395px',
                }}
                >
                {t('maintenance.text')}

                </Typography>
                </Box>
            <Box
                sx={{
                    display: 'flex',
                    gap: {
                        mobile: '20px 0',
                        notebook: '10px 20px',
                    },
                    justifyItems: 'center',
                    justifyContent: 'center',
                    flexDirection: { notebook: 'row', tablet: 'column', mobile: 'column' },
                    width: '100%',
                    minWidth: 'fit-content',
                    maxWidth: '1400px',
                    pt: '2vh',

                    '@media only screen and (min-width: 1024px)': {
                        width: '60%',
                    },
                }}
            >
            </Box>
            </Box>
        </Container>
    );
};

export default Maintenance;