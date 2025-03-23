import { Box, Button, Container, Grid, Paper, Tooltip, Typography, makeStyles } from "@mui/material";
import { useTranslation } from "react-i18next";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState } from "react";
import MapGL from "../modules/common/components/Mapbox";
import { useNavigate } from "react-router";
import useConversationList from "../modules/pages/ConversationListComponents/hooks/useConversationList";
import { useSelector } from 'react-redux'; 
import { Link } from "react-router-dom";
import PhoneIcon from '@mui/icons-material/Phone';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PublicIcon from '@mui/icons-material/Public';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PeopleIcon from '@mui/icons-material/People';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import Loading from "../modules/common/components/Loading";
import { Helmet } from "react-helmet";
import { APP_ENV } from "../lib/constants";

const Home = () => {
  const { t, tReady } = useTranslation(["home", "common"]);
  const { user } = useConversationList();

  const router = useNavigate();
  const [viewport, setViewport] = useState({
    latitude: 10.816800580111298,
    longitude: 106.67855666909755,
    zoom: 16,
  });


  const { allConfig } = useSelector((state) => state.config);

  if(tReady)
    return <Box>
       <Helmet>
        <title>OUPharmacy</title>
      </Helmet>
      <Loading/>
  </Box>

  return (
    <>
    <Helmet>
      <title>OUPharmacy</title>
    </Helmet>
    {/* Banner 1 section */}
    <section>
      <Box>
          <Box className="!ou-relative">
            <img className="!ou-w-full ou-h-[100vh] ou-object-cover"  
            src="https://res.cloudinary.com/dl6artkyb/image/upload/v1681561779/OUPharmacy/bg_3.jpg_fj95tb.webp" alt="banner">


            </img>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: { xs: "50%", sm: '5%', md: '10%', lg:"15%", xl:"20%" },
              transform: {xs: "translate(-50%, -50%)", sm: 'translateY(-50%)'},
              maxWidth: { xs: '100%', sm:"60%", md: '600px' },
              textAlign: {xs: 'center', sm:"left"}
            }}>
              <Typography variant="overline" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                {t('home:welcomeOUPharmacy')}
              </Typography>
              <h1 className="ou-text-blue-600 ou-text-3xl md:ou-text-7xl ou-font-bold">
                  {t('home:welcomeTitle')}
              </h1>
              <Typography variant="body1" sx={{ mt: 3 }}>
                {t('home:scriptWelcome')}
              </Typography>
              <Button variant="contained" sx={{ 
                mt: 3,
                bgcolor: 'blue.600', 
                px: 5, 
                py: 2, 
                borderRadius: 'full', 
                color: 'white' }} component={Link} to='/booking'>
                  {t('home:makeAnAppointMent')}
              </Button>
          </Box>
        
          </Box>

        </Box>

      </section>
      {/* Services section */}
      <section className="ou-mb-10">
          <Box className="ou-text-center !ou-py-10" component={Container}>
          <h3 className="  ou-text-3xl ou-font-semibold ou-pb-10">{t('home:ourServices')}</h3>


          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Paper style={{height: '100%'}}>
              <Box className="ou-bg-slate-100  ou-h-full ou-p-5">
                  <p className="ou-my-5">
                    <span className="ou-p-5 ou-rounded-full ou-bg-white">
                      <MedicalServicesIcon className="ou-text-blue-600"  sx={{width:"24px", height:"24px"}}/>
                    </span>
                  </p>  
                  <h3 className="ou-my-5 ou-mt-8">{t('home:emergencyServices')}</h3>
                  <p className="ou-text-slate-400 ou-mb-5">{t('home:scriptEmergencyServices')}</p>
                </Box>
                
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper style={{height: '100%'}}>
                <Box className="ou-bg-slate-100 ou-p-5 ou-h-full">
                    <p className="ou-my-5">
                      <span className="ou-p-5 ou-rounded-full ou-bg-white">
                        <PeopleIcon className="ou-text-blue-600"  sx={{width:"24px", height:"24px"}}/>
                      </span>
                    </p>  
                    <h3 className="ou-my-5 ou-mt-8">{t('home:qualifiedDoctors')}</h3>
                    <span className="ou-text-slate-400 ou-mb-5 ">{t('home:scriptQualifiedDoctors')}</span>
                  </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper style={{height: '100%'}}>
                <Box className="ou-bg-slate-100   ou-h-full ou-p-5">
                    <p className="ou-my-5">
                      <span className="ou-p-5 ou-rounded-full ou-bg-white">
                        <FitnessCenterIcon className="ou-text-blue-600"  sx={{width:"24px", height:"24px"}}/>
                      </span>
                    </p>  
                    <h3 className="ou-my-5 ou-mt-8">{t('home:outdoorsCheckup')}</h3>
                    <span className="ou-text-slate-400 ou-mb-5">{t('home:scriptOutdoorsCheckup')}</span>
                  </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper style={{height: '100%'}}>  
              <Box className="ou-bg-slate-100   ou-h-full ou-p-5">
                  <p className="ou-my-5">
                    <span className="ou-p-5 ou-rounded-full ou-bg-white ou-m-auto">
                      <SupportAgentIcon className="!ou-text-blue-600"  sx={{width:"24px", height:"24px"}} />
                    </span>
                  </p>  
                  <h3 className="ou-my-5 ou-mt-8">{t('home:service24h')}</h3>
                  <span className="ou-text-slate-400 ou-mb-5">{t('home:scriptTwentyFourHoursService')}</span>
                </Box>
              </Paper>

            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper style={{height: '100%'}}>  
              <Box className="ou-bg-slate-100   ou-h-full ou-p-5">
                  <p className="ou-my-5">
                    <span className="ou-p-5 ou-rounded-full ou-bg-white ou-m-auto">
                      <NotificationsActiveIcon className="!ou-text-blue-600"  sx={{width:"24px", height:"24px"}} />
                    </span>
                  </p>  
                  <h3 className="ou-my-5 ou-mt-8">{t('home:messageAndNotification')}</h3>
                  <span className="ou-text-slate-400 ou-mb-5">{t('home:scriptMessageAndNotification')}</span>
                </Box>
              </Paper>
              
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper style={{height: '100%'}}>  
              <Box className="ou-bg-slate-100   ou-h-full ou-p-5">
                  <p className="ou-my-5">
                    <span className="ou-p-5 ou-rounded-full ou-bg-white ou-m-auto">
                      <MeetingRoomIcon className="!ou-text-blue-600"  sx={{width:"24px", height:"24px"}} />
                    </span>
                  </p>  
                  <h3 className="ou-my-5 ou-mt-8">{t('home:waitingRoom')}</h3>
                  <span className="ou-text-slate-400 ou-mb-5">{t('home:scriptWaitingRoom')}</span>
                </Box>
              </Paper>
              
            </Grid>
          </Grid>
      </Box>
       
      </section>

      {/* Banner 2 section */}
      <section>
        <Box className="!ou-relative">
          <img 
          className="ou-h-[400px] ou-w-full ou-object-cover" 
          src="https://res.cloudinary.com/dl6artkyb/image/upload/v1681593849/OUPharmacy/bg_2.jpg_vasoqe.webp" alt="banner2">
          </img>
          <div className="ou-absolute ou-top-1/2 ou-left-1/2 -ou-translate-y-1/2 -ou-translate-x-1/2 ou-text-center">
            <h3 className=" ou-text-blue-600  ou-text-3xl ou-font-bold">{t('home:title2')}</h3>
          </div>
        </Box>
      </section>

      {/* Contact section */}
      <section className="ou-yb-10">
   
      {/* Map area */}
      <Box className="ou-text-center !ou-py-10" component={Container}>
        <h3 className=" ou-text-3xl ou-font-semibold">{t('home:contactUs')}</h3>
        <p className="ou-py-5 ou-mb-5">{t('home:contactDescription')}</p>
        <Grid container spacing={3} className="ou-mb-10">
            <Grid item xs={12} sm={12} md={6}>
              <Paper style={{height: '100%'}}>
              <Box
              component={Paper} elevation={5}
                className=" ou-rounded  ou-min-w-[300px]"
              >
                <MapGL longitude={viewport.longitude} latitude={viewport.latitude} zoom={viewport.zoom}/>
              </Box>
                
              </Paper>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Box
                style={{height: '100%'}}
                className="ou-items-center ou-justify-center 
                           ou-grid place-content-center"
              >
                <Button
                  className="!ou-p-2 !ou-px-5 !ou-bg-blue-600 !ou-text-white ou-max-w-[200px]"
                  onClick={() => router("/booking")}
                >
                   {t('home:makeAnAppointMent')}
                </Button>
              </Box>
            </Grid>
          
          </Grid>

          {/* Contact area */}
          <Box className="ou-py-10">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper style={{height: '100%'}}>
              <Box className="ou-bg-slate-100  ou-h-full ou-p-5">
                  <p className="ou-my-5">
                    <span className="ou-p-5 ou-rounded-full ou-bg-white">
                      <LocationCityIcon className="ou-text-blue-600"  sx={{width:"24px", height:"24px"}}/>
                    </span>
                  </p>  
                  <h3 className="ou-my-5 ou-mt-8">{t('home:address')}</h3>
                  <p className="ou-text-slate-400 ou-mb-5">371 Nguyễn Kiệm, Gò Vấp, Thành phố Hồ Chí Minh</p>
                </Box>
                
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper style={{height: '100%'}}>
                <Box className="ou-bg-slate-100 ou-p-5 ou-h-full">
                    <p className="ou-my-5">
                      <span className="ou-p-5 ou-rounded-full ou-bg-white">
                        <PhoneIcon className="ou-text-blue-600"  sx={{width:"24px", height:"24px"}}/>
                      </span>
                    </p>  
                    <h3 className="ou-my-5 ou-mt-8">{t('home:contactNumber')}</h3>
                    <span className="ou-text-slate-400 ou-mb-5 ">0382 590 839</span>
                  </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper style={{height: '100%'}}>
                <Box className="ou-bg-slate-100   ou-h-full ou-p-5">
                    <p className="ou-my-5">
                      <span className="ou-p-5 ou-rounded-full ou-bg-white">
                        <AlternateEmailIcon className="ou-text-blue-600"  sx={{width:"24px", height:"24px"}}/>
                      </span>
                    </p>  
                    <h3 className="ou-my-5 ou-mt-8">{t('home:emailAddress')}</h3>
                    <span className="ou-text-slate-400 ou-mb-5"><a href="mailto:oupharmacymanagement@gmail.com" className="ou-break-words">oupharmacymanagement@gmail.com</a></span>
                  </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper style={{height: '100%'}}>  
              <Box className="ou-bg-slate-100   ou-h-full ou-p-5">
                  <p className="ou-my-5">
                    <span className="ou-p-5 ou-rounded-full ou-bg-white ou-m-auto">
                      <PublicIcon className="!ou-text-blue-600"  sx={{width:"24px", height:"24px"}} />
                    </span>
                  </p>  
                  <h3 className="ou-my-5 ou-mt-8">{t('home:website')}</h3>
                  <span className="ou-text-slate-400 ou-mb-5"><a href="https://www.facebook.com/Shiray.h/" target="_blank" className="ou-break-words">OUPharmacy</a></span>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          </Box>
        
      </Box>
    
      </section>
     
    </>
  );
};
export default Home;
