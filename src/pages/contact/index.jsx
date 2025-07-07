import React, { useState } from 'react';
import { Box, Container, Typography, Grid,
    Card,
    CardContent,
    TextField,
    Button,
    Paper,
    CircularProgress
} from '@mui/material';
import {Phone, Email, LocationOn, AccessTime, Send} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Loading from '../../modules/common/components/Loading';
import { EMAIL_SUPPORT, TOAST_ERROR, TOAST_SUCCESS } from '../../lib/constants';
import MapGL from '../../modules/common/components/Mapbox';
import SuccessfulAlert from '../../config/sweetAlert2';
import { fetchContactAdmin } from '../../modules/pages/ContactComponents/services';
import SchemaModels from '../../lib/schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import createToastMessage from '../../lib/utils/createToastMessage';

const Contact = () => {
    const {t, tReady} = useTranslation(['contact', 'common']);

    const [isLoading, setIsLoading] = useState(false);
    const [viewport, setViewport] = useState({
        latitude: 10.816800580111298,
        longitude: 106.67855666909755,
        zoom: 16,
      });
    
    
    if (tReady) return <Box className="!ou-mt-2">
        <Loading/>
    </Box>;

    const {contactSchema} = SchemaModels();

    const methods = useForm({
        resolver: yupResolver(contactSchema)
    });

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            const response = await fetchContactAdmin(data);
            if(response.status === 200){
                SuccessfulAlert(t('contact:sendSuccess'), t('common:ok'), () => {
                    createToastMessage({message: t('contact:thanksDescription'), type: TOAST_SUCCESS});
                });
            }
        } catch (error) {
            createToastMessage({message: t('contact:sendFailed'), type: TOAST_ERROR});
        } finally {
            methods.reset();
            setIsLoading(false);
        }
    }
    const contactInfo = [
        {
            icon: <Phone sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: t('contact:phone'),
            content: '+84 382 590 839',
            subtitle: t('contact:workingHoursDescription')
        },
        {
            icon: <Email sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: t('contact:email'),
            content: EMAIL_SUPPORT,
            subtitle: t('contact:feedback')
        },
        {
            icon: <LocationOn sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: t('contact:address'),
            content: '371 Nguyễn Kiệm, Gò Vấp, TP.HCM',
            subtitle: t('common:Vietnam')
        },
        {
            icon: <AccessTime sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: t('contact:workingHours'),
            content: t('contact:workingSchedule'),
            subtitle: t('contact:workingHoursDescription')
        }
    ];

    return (
        <Box sx={{minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <Container maxWidth="lg" component={Paper} sx={{py: 4}}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography gutterBottom 
                    sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '2rem' }}>
                        {t('contact:contact')}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                        {t('contact:contactDescription')}
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {/* Contact Information */}
                    <Grid item xs={12} md={4}>
                       
                        <Box sx={{ mb: 4 }}>
                            {contactInfo.map((info, index) => (
                                <Card key={index} sx={{ mb: 2, boxShadow: 2 }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                            {info.icon}
                                            <Box>
                                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                    {info.title}
                                                </Typography>
                                                <Typography variant="body1" color="primary" sx={{ fontWeight: 'medium' }}>
                                                    {info.content}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {info.subtitle}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Grid>

                    {/* Contact Form */}
                    <Grid item xs={12} md={8}>
                        <Paper elevation={3} sx={{ p: 4 }}>
                            <Typography gutterBottom 
                            sx={{ fontSize: '1.5rem', mb: 3 }}>
                                {t('contact:send')}
                            </Typography>
                            
                            <form onSubmit={methods.handleSubmit(onSubmit)}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label={t('contact:name') + ' *'}
                                            name="name"
                                            {...methods.register('name')}
                                            variant="outlined"
                                            error={!!methods.formState.errors.name}
                                        />
                                        {methods.formState.errors.name && (
                                            <Typography variant="body2" color="error">
                                                {methods.formState.errors.name.message}
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label={t('contact:email') + ' *'}
                                            name="email"
                                            type="email"
                                            {...methods.register('email')}
                                            variant="outlined"
                                            error={!!methods.formState.errors.email}
                                        />
                                        {methods.formState.errors.email && (
                                            <Typography variant="body2" color="error">
                                                {methods.formState.errors.email.message}
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label={t('contact:phone')}
                                            name="phone"
                                            {...methods.register('phone')}
                                            variant="outlined"
                                            error={!!methods.formState.errors.phone}
                                        />
                                        {methods.formState.errors.phone && (
                                            <Typography variant="body2" color="error">
                                                {methods.formState.errors.phone.message}
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label={t('contact:subject')}
                                            name="subject"
                                            {...methods.register('subject')}
                                            variant="outlined"
                                            error={!!methods.formState.errors.subject}
                                        />
                                        {methods.formState.errors.subject && (
                                            <Typography variant="body2" color="error">
                                                {methods.formState.errors.subject.message}
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label={t('contact:message') + ' *'}
                                            name="message"
                                            {...methods.register('message')}
                                            multiline
                                            rows={6}
                                            variant="outlined"
                                            error={!!methods.formState.errors.message}
                                            />
                                        {methods.formState.errors.message && (
                                            <Typography variant="body2" color="error">
                                                {methods.formState.errors.message.message}
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                            startIcon={<Send />}
                                            sx={{ 
                                                py: 1.5, 
                                                px: 4, 
                                                fontSize: '1.1rem',
                                                fontWeight: 'bold'
                                            }}
                                            disabled={isLoading}
                                        >
                                                {isLoading ? <CircularProgress size={20} /> : t('contact:send')}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Map Section */}
                <Box sx={{ mt: 6 }}>
                    <Typography gutterBottom 
                    sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center', fontSize: '2rem' }}>
                        {t('contact:address')}
                    </Typography>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center', backgroundColor: '#e3f2fd' }}>
                        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                            📍  371 Nguyễn Kiệm, Gò Vấp, TP.HCM, Việt Nam
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            ({t('contact:workingHours')}: {t('contact:workingHoursDescription')})
                        </Typography>
                        <Box sx={{ 
                            height: 450, 
                            backgroundColor: '#f0f0f0', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            border: '2px solid #e0e0e0',
                            mt: 2, borderRadius: 2, overflow: 'hidden'
                        }}>
                            <Typography variant="h6" color="text.secondary" width={'100%'}>
                                <MapGL longitude={viewport.longitude} latitude={viewport.latitude} 
                                zoom={viewport.zoom}
                                style={{width: '100%', borderRadius: 2}}
                                />
                            </Typography>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
};

export default Contact;