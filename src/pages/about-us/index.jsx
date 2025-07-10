import React from 'react';
import { 
    Box, 
    Container, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    Paper,
    Button,
    Avatar,
    Chip
} from '@mui/material';
import { 
    MedicalServices,
    People,
    LocalHospital,
    SupportAgent,
    HealthAndSafety,
    EmojiEvents,
    Star,
    Favorite,
    TrendingUp,
    Security,
    Accessibility,
    Science,
    Business
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Loading from '../../modules/common/components/Loading';

const AboutUs = () => {
    const { t, tReady } = useTranslation(['about-us', 'common']);

    if (tReady) {
        return (
            <Box>
                <Loading />
            </Box>
        );
    }

    const values = [
        {
            icon: <Favorite sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: t('about-us:value1title'),
            description: t('about-us:value1Description')
        },
        {
            icon: <Star sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: t('about-us:value2title'),
            description: t('about-us:value2Description')
        },
        {
            icon: <Science sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: t('about-us:value3title'),
            description: t('about-us:value3Description')
        },
        {
            icon: <Security sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: t('about-us:value4title'),
            description: t('about-us:value4Description')
        },
        {
            icon: <People sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: t('about-us:value5title'),
            description: t('about-us:value5Description')
        },
        {
            icon: <Accessibility sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: t('about-us:value6title'),
            description: t('about-us:value6Description')
        }
    ];

    const teamMembers = [
        {
            icon: <MedicalServices sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: t('about-us:doctors'),
            description: t('about-us:doctorsDescription')
        },
        {
            icon: <LocalHospital sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: t('about-us:pharmacists'),
            description: t('about-us:pharmacistsDescription')
        },
        {
            icon: <HealthAndSafety sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: t('about-us:nurses'),
            description: t('about-us:nursesDescription')
        },
        {
            icon: <SupportAgent sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: t('about-us:support'),
            description: t('about-us:supportDescription')
        }
    ];

    const facilities = [
        {
            icon: <MedicalServices sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: t('about-us:modernEquipment'),
            description: t('about-us:modernEquipmentDescription')
        },
        {
            icon: <People sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: t('about-us:comfortableEnvironment'),
            description: t('about-us:comfortableEnvironmentDescription')
        },
        {
            icon: <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: t('about-us:digitalIntegration'),
            description: t('about-us:digitalIntegrationDescription')
        }
    ];

    const achievements = [
        {
            number: '10,000+',
            title: t('about-us:patientsServed'),
            description: t('about-us:patientsServedDescription')
        },
        {
            number: '15+',
            title: t('about-us:yearsExperience'),
            description: t('about-us:yearsExperienceDescription')
        },
        {
            number: '98%',
            title: t('about-us:satisfactionRate'),
            description: t('about-us:satisfactionRateDescription')
        },
        {
            number: '100%',
            title: t('about-us:certifications'),
            description: t('about-us:certificationsDescription')
        }
    ];

    return (
        <Box sx={{ background: '#fff', minHeight: '100vh', py: 5  }}>
            <Helmet>
                <title>About Us - OUPharmacy</title>
            </Helmet>
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #e3eafc 0%, #b6c8f9 100%)',
                    py: { xs: 3, md: 4 },
                    mb: 5, 
                    borderRadius: 2,
                    mx: { xs: 0, md: 3 }
                }}
            >
                <Container maxWidth="lg" >
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            gutterBottom
                            sx={{ fontWeight: 500, color: 'primary.main', mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}
                        >
                            {t('about-us:title')}
                        </Typography>
                        <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{ mb: 2, color: 'text.secondary', fontSize: { xs: '1.1rem', md: '1.25rem' } }}
                        >
                            {t('about-us:subtitle')}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ maxWidth: 600, mx: 'auto', opacity: 0.85, color: 'text.secondary', fontSize: { xs: '0.95rem', md: '1.05rem' } }}
                        >
                            {t('about-us:description')}
                        </Typography>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {/* Mission & Vision Section (bg #f7fafd) */}
                <Box sx={{ background: '#f7fafd', borderRadius: 2, boxShadow: 1, p: { xs: 2, md: 4 }, mb: 6 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Card sx={{ height: '100%', boxShadow: 0, background: 'transparent' }}>
                                <CardContent sx={{ p: 0 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Business sx={{ fontSize: 36, color: 'primary.main', mr: 2 }} />
                                        <Typography variant="h6" component="h2" sx={{ fontWeight: 600, fontSize: { xs: '1.2rem', md: '1.35rem' } }}>
                                            {t('about-us:mission')}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ lineHeight: 1.7, fontSize: { xs: '0.97rem', md: '1.05rem' } }}>
                                        {t('about-us:missionDescription')}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card sx={{ height: '100%', boxShadow: 0, background: 'transparent' }}>
                                <CardContent sx={{ p: 0 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <EmojiEvents sx={{ fontSize: 36, color: 'primary.main', mr: 2 }} />
                                        <Typography variant="h6" component="h2" sx={{ fontWeight: 600, fontSize: { xs: '1.2rem', md: '1.35rem' } }}>
                                            {t('about-us:vision')}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ lineHeight: 1.7, fontSize: { xs: '0.97rem', md: '1.05rem' } }}>
                                        {t('about-us:visionDescription')}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

                {/* Values Section (bg trắng) */}
                <Box sx={{ background: '#fff', borderRadius: 2, boxShadow: 1, p: { xs: 2, md: 4 }, mb: 6 }}>
                    <Typography variant="h5" component="h2" sx={{ textAlign: 'center', mb: 2, fontWeight: 600, fontSize: { xs: '1.5rem', md: '1.8rem' } }}>
                        {t('about-us:values')}
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: 'center', mb: 5, color: 'text.secondary', fontSize: { xs: '1rem', md: '1.08rem' } }}>
                        {t('about-us:valuesDescription')}
                    </Typography>
                    <Grid container spacing={3}>
                        {values.map((value, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card sx={{ height: '100%', boxShadow: 2, '&:hover': { boxShadow: 4 } }}>
                                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                        <Box sx={{ mb: 2 }}>
                                            {value.icon}
                                        </Box>
                                        <Typography variant="subtitle1" component="h3" gutterBottom sx={{ fontWeight: 500, fontSize: { xs: '1.05rem', md: '1.15rem' } }}>
                                            {value.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.93rem', md: '1rem' } }}>
                                            {value.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Story Section (bg #f7fafd) */}
                <Box sx={{ mb: 6, background: '#f7fafd', borderRadius: 2, boxShadow: 1, p: { xs: 2, md: 4 } }}>
                    <Paper sx={{
                        p: 5,
                        background: 'transparent',
                        boxShadow: 'none',
                        textAlign: 'center',
                    }}>
                        <Typography variant="h5" component="h2" sx={{ textAlign: 'center', mb: 2, fontWeight: 700, color: 'primary.main', fontSize: { xs: '1.3rem', md: '1.5rem' } }}>
                            {t('about-us:story')}
                        </Typography>
                        <Typography variant="body1" sx={{ textAlign: 'center', lineHeight: 1.7, fontSize: { xs: '1.08rem', md: '1.15rem' }, color: 'text.primary', fontWeight: 500 }}>
                            {t('about-us:storyDescription')}
                        </Typography>
                    </Paper>
                </Box>

                {/* Team Section (bg trắng) */}
                <Box sx={{ background: '#fff', borderRadius: 2, boxShadow: 1, p: { xs: 2, md: 4 }, mb: 6 }}>
                    <Typography variant="h5" component="h2" sx={{ textAlign: 'center', mb: 2, fontWeight: 600, fontSize: { xs: '1.5rem', md: '1.8rem' } }}>
                        {t('about-us:team')}
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: 'center', mb: 5, color: 'text.secondary', fontSize: { xs: '1rem', md: '1.08rem' } }}>
                        {t('about-us:teamDescription')}
                    </Typography>
                    <Grid container spacing={3}>
                        {teamMembers.map((member, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card sx={{ height: '100%', boxShadow: 2, '&:hover': { boxShadow: 4 } }}>
                                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                        <Box sx={{ mb: 2 }}>
                                            {member.icon}
                                        </Box>
                                        <Typography variant="subtitle1" component="h3" gutterBottom sx={{ fontWeight: 500, fontSize: { xs: '1.05rem', md: '1.15rem' } }}>
                                            {member.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.93rem', md: '1rem' } }}>
                                            {member.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Facilities Section (bg #f7fafd) */}
                <Box sx={{ background: '#f7fafd', borderRadius: 2, boxShadow: 1, p: { xs: 2, md: 4 }, mb: 6 }}>
                    <Typography variant="h5" component="h2" sx={{ textAlign: 'center', mb: 2, fontWeight: 600, fontSize: { xs: '1.5rem', md: '1.8rem' } }}>
                        {t('about-us:facilities')}
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: 'center', mb: 5, color: 'text.secondary', fontSize: { xs: '1rem', md: '1.08rem' } }}>
                        {t('about-us:facilitiesDescription')}
                    </Typography>
                    <Grid container spacing={3}>
                        {facilities.map((facility, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Card sx={{ height: '100%', boxShadow: 2, '&:hover': { boxShadow: 4 } }}>
                                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                        <Box sx={{ mb: 2 }}>
                                            {facility.icon}
                                        </Box>
                                        <Typography variant="subtitle1" component="h3" gutterBottom sx={{ fontWeight: 500, fontSize: { xs: '1.05rem', md: '1.15rem' } }}>
                                            {facility.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.93rem', md: '1rem' } }}>
                                            {facility.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Achievements Section (bg trắng) */}
                <Box sx={{ background: '#fff', borderRadius: 2, boxShadow: 1, p: { xs: 2, md: 4 }, mb: 6 }}>
                    <Typography variant="h5" component="h2" sx={{ textAlign: 'center', mb: 2, fontWeight: 600, fontSize: { xs: '1.5rem', md: '1.8rem' } }}>
                        {t('about-us:achievements')}
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: 'center', mb: 5, color: 'text.secondary', fontSize: { xs: '1rem', md: '1.08rem' } }}>
                        {t('about-us:achievementsDescription')}
                    </Typography>
                    <Grid container spacing={3}>
                        {achievements.map((achievement, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card sx={{ height: '100%', boxShadow: 2, '&:hover': { boxShadow: 4 } }}>
                                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                        <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: 'primary.main', mb: 2, fontSize: { xs: '1.2rem', md: '1.35rem' } }}>
                                            {achievement.number}
                                        </Typography>
                                        <Typography variant="subtitle1" component="h3" gutterBottom sx={{ fontWeight: 500, fontSize: { xs: '1.05rem', md: '1.15rem' } }}>
                                            {achievement.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.93rem', md: '1rem' } }}>
                                            {achievement.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Call to Action giữ gradient đậm như hiện tại */}
                <Box sx={{ 
                    textAlign: 'center', 
                    py: 5, 
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                    borderRadius: 3,
                    color: 'white',
                    boxShadow: '0 4px 24px 0 rgba(30,64,175,0.10)'
                }}>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 700, fontSize: { xs: '1.3rem', md: '1.5rem' }, color: 'white' }}>
                        {t('about-us:contactUs')}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto', fontSize: { xs: '1.08rem', md: '1.15rem' }, color: 'white', opacity: 0.95 }}>
                        {t('about-us:contactUsDescription')}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button 
                            variant="contained" 
                            size="large" 
                            component={Link} 
                            to="/booking"
                            sx={{ 
                                bgcolor: 'white', 
                                color: 'primary.main',
                                fontWeight: 700,
                                boxShadow: 2,
                                '&:hover': { bgcolor: 'grey.100' }
                            }}
                        >
                            {t('about-us:makeAppointment')}
                        </Button>
                        <Button 
                            variant="outlined" 
                            size="large" 
                            component={Link} 
                            to="/contact"
                            sx={{ 
                                borderColor: 'white', 
                                color: 'white',
                                fontWeight: 700,
                                '&:hover': { borderColor: 'grey.300', bgcolor: 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            {t('about-us:learnMore')}
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default AboutUs;
