import { Avatar, Container, Grid, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useTranslation } from 'react-i18next';
import IconFaceBook from '../../../../lib/assets/iconFaceBook';


const Footer = () => {
    const {t, tReady} = useTranslation(["home"]);

    if(tReady)
        return <Box></Box>

    return(
        <>
            
            <footer id="footer">
                <div style={{ backgroundColor: '#1E40AF', color: 'white', padding: '50px' }}>
                    <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={12} md={3}>
                        <div className="ou-justify-center ou-flex">
                            <Avatar
                            sx={{ width: '200px', height: '50px' }}
                            display={{xs:"flex", sm:"block"}}
                            variant="square"
                            src="https://res.cloudinary.com/dl6artkyb/image/upload/v1666357910/OUPharmacy/bg_Oupharmacy_3x4_jicpdp.png"
                            />
                      
                        </div>
                        <p className='ou-mt-5 ou-text-center'>
                            '{t('quote')}'
                        </p>

                        </Grid>
                        <Grid item xs={12} sm={4} md={3}>
                        <div className="ou-text-left">
                            <h4 className="ou-text-green-500 ou-uppercase">{t('aboutUs')}</h4>
                            <Stack direction="column" spacing={1}>
                            <Link to="#">{t('introduce')}</Link>
                            <Link to="#">{t('businessLicense')}</Link>
                            </Stack>
                        </div>
                        <div className="ou-text-left" style={{ marginTop: '20px' }}>
                            <h4 className="ou-text-green-500 ou-uppercase">{t('categories')}</h4>
                            <Stack direction="column" spacing={1}>
                            <Link to="#">{t('prescriptionDrugs')}</Link>
                            <Link to="#">{t('otcDrugs')}</Link>
                            <Link to="#">{t('functionalFoods')}</Link>
                            </Stack>
                        </div>
                        </Grid>
                        <Grid item xs={12} sm={4} md={3}>
                        <div className="ou-text-left">
                            <h4 className="ou-text-green-500 ou-uppercase">
                            {t('pharmacySystem')}
                            </h4>
                            <Stack direction="column" spacing={1}>
                            <Link to="#">{t('drugSystem')}</Link>
                            <Link to="#">{t('pharmacyRules')}</Link>
                            <Link to="#">{t('serviceQuality')}</Link>
                            <Link to="#">{t('returnPolicy')}</Link>
                            <Link to="#">{t('warrantyPolicy')}</Link>
                            </Stack>
                        </div>
                        <div className="ou-text-left" style={{ marginTop: '20px' }}>
                            <h4 className="ou-text-green-500 ou-uppercase">{t('terms')}</h4>
                            <Stack direction="column" spacing={1}>
                            <Link to="#">{t('security')}</Link>
                            <Link to="#">{t('support')}</Link>
                            <Link to="#">{t('privacy')}</Link>
                            </Stack>
                        </div>
                        </Grid>
                                    
                        <Grid item  xs={12} sm={4} md={3}>
                            <div className='ou-text-left '>
                                <h4 className='ou-text-green-500 ou-uppercase '>{t('contactUs')}</h4>
                                <Stack direction="row"  style={{ "flexDirection":"column"}} className='ou-mt-2'>
                                    <Link className='ou-my-0.5' to="#">{t('hotline')}: 0382590839</Link>
                                    <Link className='ou-my-0.5' to="#">{t('support')}</Link>
                                </Stack> 
                            </div>

                            <div className='ou-text-left ou-mt-5'>
                                <h4 className='ou-text-green-500 ou-uppercase '>{t('operatingTime')}</h4>
                                <Stack direction="row"  style={{ "flexDirection":"column"}} className='ou-mt-2'>
                                    <Link className='ou-my-0.5' to="#">{t('examinationSchedule')}</Link>
                                    <Link className='ou-my-0.5' to="#">{t('onlineConsultation')}: 24/24</Link>
                                </Stack> 
                            </div>
                         
                        </Grid>
                    </Grid>
                  
                </Container>
                
            </div>

        </footer>            
                
        </>
         
    )
}
export default Footer