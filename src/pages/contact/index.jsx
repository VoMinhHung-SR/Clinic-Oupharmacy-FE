import React, { useState } from 'react';
import { 
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    TextField,
    Button,
    Paper,
    IconButton,
    Alert,
    Snackbar
} from '@mui/material';
import {Phone, Email, LocationOn, AccessTime, Send} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Loading from '../../modules/common/components/Loading';
import { EMAIL_SUPPORT } from '../../lib/constants';
import MapGL from '../../modules/common/components/Mapbox';

const Contact = () => {
    const {t, tReady} = useTranslation(['contact', 'common']);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [severity, setSeverity] = useState('success');

    const [viewport, setViewport] = useState({
        latitude: 10.816800580111298,
        longitude: 106.67855666909755,
        zoom: 16,
      });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    if (tReady) return <Box className="!ou-mt-2">
        <Loading/>
    </Box>;


    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate form
        if (!formData.name || !formData.email || !formData.message) {
            setSnackbarMessage('Vui lòng điền đầy đủ thông tin bắt buộc');
            setSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setSnackbarMessage('Email không hợp lệ');
            setSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        // Simulate form submission
        console.log('Form submitted:', formData);
        
        // Show success message
        setSnackbarMessage('Tin nhắn đã được gửi thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.');
        setSeverity('success');
        setOpenSnackbar(true);
        
        // Reset form
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        });
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

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
                    <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
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
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                {t('contact:send')}
                            </Typography>
                            
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label={t('contact:name')}
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label={t('contact:email')}
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label={t('contact:phone')}
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label={t('contact:subject')}
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label={t('contact:message')}
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            multiline
                                            rows={6}
                                            variant="outlined"
                                        />
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
                                        >
                                                {t('contact:send')}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Map Section */}
                <Box sx={{ mt: 6 }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
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

            {/* Snackbar for notifications */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Contact;