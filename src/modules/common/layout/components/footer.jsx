import { Avatar, Container, Grid, Stack, Typography, IconButton, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useTranslation } from 'react-i18next';
import IconFaceBook from '../../../../lib/assets/iconFaceBook';
import { EMAIL_SUPPORT } from '../../../../lib/constants';


const Footer = () => {
    const {t, tReady} = useTranslation(["home"]);

    if(tReady)
        return <Box></Box>

    return(
        <footer style={{
            background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)',
            color: '#fff',
            padding: '48px 0 16px 0',
            }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                <Grid item xs={12} md={3}>
                    <Stack spacing={2}>
                    <Avatar
                    sx={{ width: '200px', height: '50px' }}
                    display={{xs:"flex", sm:"block"}}
                    variant="square"
                    src="https://res.cloudinary.com/dl6artkyb/image/upload/v1666357910/OUPharmacy/bg_Oupharmacy_3x4_jicpdp.png"
                    />
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {t('home:quote')}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        {/* <IconButton><FacebookIcon /></IconButton> */}
                    </Stack>
                    </Stack>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Typography variant="h6" sx={{ mb: 1, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>{t('home:aboutUs')}</Typography>
                    <Stack spacing={1}>
                    <Link to="/about-us" style={{ fontSize: '1rem', color: '#fff' }}>{t('home:introduce')}</Link>
                    <Link to="#">{t('home:businessLicense')}</Link>
                    </Stack>
                </Grid>
                
                <Grid item xs={12} md={3}>
                    <Typography variant="h6" sx={{ mb: 1 }}>{t('categories')}</Typography>
                    <Stack spacing={1}>
                    <Link to="#">{t('prescriptionDrugs')}</Link>
                    <Link to="#">{t('otcDrugs')}</Link>
                    <Link to="#">{t('functionalFoods')}</Link>
                    </Stack>
                </Grid>
                {/* Cột 4: Liên hệ */}
                <Grid item xs={12} md={3}>
                    <Typography variant="h6" sx={{ mb: 1 }}>{t('home:contactUs')}</Typography>
                    <Stack spacing={1}>
                    <Typography>{t('home:hotline')}: 0382590839</Typography>
                    <Typography>{t('home:emailAddress')}:
                        <a href={`mailto:${EMAIL_SUPPORT}`} style={{color: '#fff'}}>
                            {" "} {t('home:team')}
                        </a>
                    </Typography>
                    </Stack>
                    <Typography sx={{ mt: 2, fontSize: { xs: '0.93rem', md: '1rem' }, opacity: 0.7 }}>
                    {t('home:operatingTime')}<br />
                    ({t('home:workingSchedule')})<br />
                    {t('home:onlineConsultation')}
                    </Typography>
                </Grid>
                </Grid>
                <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
                <Typography align="center" sx={{ fontSize: 13, opacity: 0.7 }}>
                ©  {new Date().getFullYear()} {t('home:copyright')}
                </Typography>
            </Container>
        </footer>
    )
}
export default Footer