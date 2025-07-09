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
            title: t('about-us:value1.title'),
            description: t('about-us:value1.description')
        },
        {
            icon: <Star sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: t('about-us:value2.title'),
            description: t('about-us:value2.description')
        },
        {
            icon: <Science sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: t('about-us:value3.title'),
            description: t('about-us:value3.description')
        },
        {
            icon: <Security sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: t('about-us:value4.title'),
            description: t('about-us:value4.description')
        },
        {
            icon: <People sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: t('about-us:value5.title'),
            description: t('about-us:value5.description')
        },
        {
            icon: <Accessibility sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: t('about-us:value6.title'),
            description: t('about-us:value6.description')
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
        <>
            <Helmet>
                <title>About Us - OUPharmacy</title>
            </Helmet>
            
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #e3eafc 0%, #b6c8f9 100%)',
                    color: 'text.primary',
                    py: { xs: 4, md: 6 }
                }}
                >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}
                    >
                        {t('about-us:title')}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{ mb: 2, color: 'text.secondary' }}
                    >
                        {t('about-us:subtitle')}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ maxWidth: 600, mx: 'auto', opacity: 0.85, color: 'text.secondary' }}
                    >
                        {t('about-us:description')}
                    </Typography>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: 6 }}>
                {/* Mission & Vision */}
                <Grid container spacing={4} sx={{ mb: 8 }}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%', boxShadow: 3 }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Business sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                                    <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
                                        {t('about-us:mission')}
                                    </Typography>
                                </Box>
                                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                                    {t('about-us:missionDescription')}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%', boxShadow: 3 }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <EmojiEvents sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                                    <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
                                        {t('about-us:vision')}
                                    </Typography>
                                </Box>
                                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                                    {t('about-us:visionDescription')}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Values Section */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h3" component="h2" sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold' }}>
                        {t('about-us:values')}
                    </Typography>
                    <Typography variant="body1" sx={{ textAlign: 'center', mb: 6, color: 'text.secondary' }}>
                        {t('about-us:valuesDescription')}
                    </Typography>
                    <Grid container spacing={3}>
                        {values.map((value, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card sx={{ height: '100%', boxShadow: 2, '&:hover': { boxShadow: 4 } }}>
                                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                        <Box sx={{ mb: 3 }}>
                                            {value.icon}
                                        </Box>
                                        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            {value.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {value.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Story Section */}
                <Box sx={{ mb: 8 }}>
                    <Paper sx={{ p: 6, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                        <Typography variant="h3" component="h2" sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold' }}>
                            {t('about-us:story')}
                        </Typography>
                        <Typography variant="body1" sx={{ textAlign: 'center', lineHeight: 1.8, fontSize: '1.1rem' }}>
                            {t('about-us:storyDescription')}
                        </Typography>
                    </Paper>
                </Box>

                {/* Team Section */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h3" component="h2" sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold' }}>
                        {t('about-us:team')}
                    </Typography>
                    <Typography variant="body1" sx={{ textAlign: 'center', mb: 6, color: 'text.secondary' }}>
                        {t('about-us:teamDescription')}
                    </Typography>
                    <Grid container spacing={3}>
                        {teamMembers.map((member, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card sx={{ height: '100%', boxShadow: 2, '&:hover': { boxShadow: 4 } }}>
                                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                        <Box sx={{ mb: 3 }}>
                                            {member.icon}
                                        </Box>
                                        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            {member.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {member.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Facilities Section */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h3" component="h2" sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold' }}>
                        {t('about-us:facilities')}
                    </Typography>
                    <Typography variant="body1" sx={{ textAlign: 'center', mb: 6, color: 'text.secondary' }}>
                        {t('about-us:facilitiesDescription')}
                    </Typography>
                    <Grid container spacing={3}>
                        {facilities.map((facility, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Card sx={{ height: '100%', boxShadow: 2, '&:hover': { boxShadow: 4 } }}>
                                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                        <Box sx={{ mb: 3 }}>
                                            {facility.icon}
                                        </Box>
                                        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            {facility.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {facility.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Achievements Section */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h3" component="h2" sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold' }}>
                        {t('about-us:achievements')}
                    </Typography>
                    <Typography variant="body1" sx={{ textAlign: 'center', mb: 6, color: 'text.secondary' }}>
                        {t('about-us:achievementsDescription')}
                    </Typography>
                    <Grid container spacing={3}>
                        {achievements.map((achievement, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card sx={{ height: '100%', boxShadow: 2, '&:hover': { boxShadow: 4 } }}>
                                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                        <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                                            {achievement.number}
                                        </Typography>
                                        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            {achievement.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {achievement.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Call to Action */}
                <Box sx={{ 
                    textAlign: 'center', 
                    py: 6, 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 3,
                    color: 'white'
                }}>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {t('about-us:contactUs')}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
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
                                '&:hover': { borderColor: 'grey.300', bgcolor: 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            {t('about-us:learnMore')}
                        </Button>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default AboutUs;
