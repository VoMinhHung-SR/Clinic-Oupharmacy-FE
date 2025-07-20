import { Box, Button, Container, Grid, Paper, Tooltip, Typography, Fade, Slide, Grow } from "@mui/material";
import { useTranslation } from "react-i18next";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useEffect } from "react";
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

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const { allConfig } = useSelector((state) => state.config);

  if(tReady)
    return <Box>
       <Helmet>
        <title>OUPharmacy</title>
      </Helmet>
      <Loading/>
  </Box>

  const services = [
    {
      icon: <MedicalServicesIcon />,
      title: t('home:emergencyServices'),
      description: t('home:scriptEmergencyServices'),
    },
    {
      icon: <PeopleIcon />,
      title: t('home:qualifiedDoctors'),
      description: t('home:scriptQualifiedDoctors'),
    },
    {
      icon: <FitnessCenterIcon />,
      title: t('home:outdoorsCheckup'),
      description: t('home:scriptOutdoorsCheckup'),
    },
    {
      icon: <SupportAgentIcon />,
      title: t('home:service24h'),
      description: t('home:scriptTwentyFourHoursService'),
    },
    {
      icon: <NotificationsActiveIcon />,
      title: t('home:messageAndNotification'),
      description: t('home:scriptMessageAndNotification'),
    },
    {
      icon: <MeetingRoomIcon />,
      title: t('home:waitingRoom'),
      description: t('home:scriptWaitingRoom'),
    },
  ];

  const contactInfo = [
    {
      icon: <LocationCityIcon />,
      title: t('home:address'),
      content: "371 Nguyễn Kiệm, Gò Vấp, Thành phố Hồ Chí Minh",
      link: null,
    },
    {
      icon: <PhoneIcon />,
      title: t('home:contactNumber'),
      content: "0382 590 839",
      link: "tel:0382590839",
    },
    {
      icon: <AlternateEmailIcon />,
      title: t('home:emailAddress'),
      content: "oupharmacymanagement@gmail.com",
      link: "mailto:oupharmacymanagement@gmail.com",
    },
    {
      icon: <PublicIcon />,
      title: t('home:website'),
      content: "OUPharmacy",
      link: "https://www.facebook.com/Shiray.h/",
    },
  ];

  return (
    <>
      <Helmet>
        <title>OUPharmacy</title>
      </Helmet>
      
      {/* Hero Section */}
      <section className="ou-relative ou-min-h-screen ou-flex ou-items-center ou-bg-gradient-to-br ou-from-blue-50 ou-to-blue-100 ou-overflow-hidden">
        <img 
          className="ou-w-full ou-h-screen ou-object-cover ou-brightness-70 ou-transition-all ou-duration-300"
          src="https://res.cloudinary.com/dl6artkyb/image/upload/v1681561779/OUPharmacy/bg_3.jpg_fj95tb.webp" 
          alt="OUPharmacy Hero"
        />
        <Fade in={isVisible} timeout={1000}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: { xs: '50%', md: '10%' },
            transform: { xs: 'translate(-50%, -50%)', md: 'translateY(-50%)' },
            textAlign: { xs: 'center', md: 'left' },
            color: 'white',
            zIndex: 2,
            width: { xs: '90%', md: '50%' },
            maxWidth: '800px',
          }}>
            <Typography variant="overline" sx={{ 
              fontWeight: 600, 
              textTransform: 'uppercase',
              fontSize: '1rem',
              letterSpacing: '2px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              marginBottom: 2,
            }}>
              {t('home:welcomeOUPharmacy')}
            </Typography>
            <Typography sx={{
              fontSize: { xs: '2.5rem', md: '3rem', lg: '4.3rem' },
              fontWeight: 700,
              color: '#1d4ed8',
              marginBottom: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}>
              {t('home:welcomeTitle')}
            </Typography>
            <Typography sx={{
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              marginBottom: 3,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            }}>
              {t('home:scriptWelcome')}
            </Typography>
            <Button 
              sx={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                padding: '12px 32px',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                },
              }}
              component={Link} 
              to='/booking'
              variant="contained"
            >
              {t('home:makeAnAppointMent')}
            </Button>
          </Box>
        </Fade>
      </section>

      {/* Services Section */}
      <section className="ou-py-20 ou-bg-slate-50">
        <Container maxWidth="lg">
          <Slide direction="up" in={isVisible} timeout={800}>
            <Typography sx={{
              fontSize: { xs: '2.5rem', md: '3rem' },
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: 4,
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {t('home:ourServices')}
            </Typography>
          </Slide>
          
          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Grow in={isVisible} timeout={800 + index * 200}>
                  <Paper sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    },
                  }} elevation={2}>
                    <Box sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                      <Box sx={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        color: 'white',
                        margin: '0 auto 16px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                      }}>
                        {service.icon}
                      </Box>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        mb: 2,
                        color: '#1e293b'
                      }}>
                        {service.title}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#64748b',
                        lineHeight: 1.6
                      }}>
                        {service.description}
                      </Typography>
                    </Box>
                  </Paper>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Banner 2 Section */}
      <section className="ou-relative ou-h-96">
        <img 
          className="ou-w-full ou-h-full ou-object-cover ou-brightness-60"
          src="https://res.cloudinary.com/dl6artkyb/image/upload/v1681593849/OUPharmacy/bg_2.jpg_vasoqe.webp" 
          alt="OUPharmacy Banner"
        />
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Fade in={isVisible} timeout={1200}>
            <Typography 
              variant="h3" 
              sx={{ 
                color: 'white',
                fontWeight: 700,
                textAlign: 'center',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              {t('home:title2')}
            </Typography>
          </Fade>
        </Box>
      </section>

      {/* Contact Section */}
      <section className="ou-py-20 ou-bg-white">
        <Container maxWidth="lg">
          <Slide direction="up" in={isVisible} timeout={1000}>
            <Typography sx={{
              fontSize: { xs: '2.5rem', md: '3rem' },
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: 4,
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {t('home:contactUs')}
            </Typography>
          </Slide>
          
          <Typography variant="body1" sx={{ 
            textAlign: 'center', 
            mb: 6,
            color: '#64748b',
            fontSize: '1.1rem',
            maxWidth: '600px',
            mx: 'auto'
          }}>
            {t('home:contactDescription')}
          </Typography>

          {/* Map and CTA */}
          <Grid container spacing={4} sx={{ mb: 8 }}>
            <Grid item xs={12} md={6}>
              <Grow in={isVisible} timeout={1200}>
                <Box sx={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                }}>
                  <MapGL 
                    longitude={viewport.longitude} 
                    latitude={viewport.latitude} 
                    zoom={viewport.zoom}
                  />
                </Box>
              </Grow>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                textAlign: 'center'
              }}>
                <Typography variant="h5" sx={{ 
                  mb: 3,
                  fontWeight: 600,
                  color: '#1e293b'
                }}>
                  {t('home:readyToContact')}
                </Typography>
                <Button
                  sx={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    padding: '12px 32px',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
                      background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                    },
                  }}
                  onClick={() => router("/contact")}
                  size="large"
                >
                  {t('home:getInTouch')}
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Contact Info Cards */}
          <Grid container spacing={3}>
            {contactInfo.map((contact, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Grow in={isVisible} timeout={1400 + index * 200}>
                  <Paper sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                    },
                  }} elevation={2}>
                    <Box sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                      <Box sx={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        color: 'white',
                        margin: '0 auto 16px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                      }}>
                        {contact.icon}
                      </Box>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        mb: 2,
                        color: '#1e293b'
                      }}>
                        {contact.title}
                      </Typography>
                      {contact.link ? (
                        <Typography 
                          component="a"
                          href={contact.link}
                          target={contact.link.startsWith('http') ? '_blank' : undefined}
                          sx={{ 
                            color: '#3b82f6',
                            textDecoration: 'none',
                            wordBreak: 'break-word',
                            '&:hover': {
                              textDecoration: 'underline'
                            }
                          }}
                        >
                          {contact.content}
                        </Typography>
                      ) : (
                        <Typography sx={{ 
                          color: '#64748b',
                          wordBreak: 'break-word'
                        }}>
                          {contact.content}
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>
    </>
  );
};

export default Home;
