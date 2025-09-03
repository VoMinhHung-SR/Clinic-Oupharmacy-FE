import { Alert, Avatar, Button, Collapse, Container, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, TextField, Divider, useTheme, useMediaQuery, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import BackdropLoading from "../../modules/common/components/BackdropLoading";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import useLogin from "../../modules/pages/LoginComponents/hooks/useLogin";
import { useForm } from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup"
import { useTranslation } from "react-i18next";
import Loading from "../../modules/common/components/Loading";
import { Helmet } from "react-helmet";
import HowToRegIcon from '@mui/icons-material/HowToReg';
import HomeIcon from '@mui/icons-material/Home';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

const Login = () =>{
    const {t, tReady} = useTranslation(['login', 'yup-validate'])
    const {onSubmit, openError, openBackdrop, setOpenError, loginSchema, showPassword, handleTogglePassword, handleGoogleLogin, handleFacebookLogin} = useLogin();
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    
    const router = useNavigate()
    const methods = useForm({
        mode:"onSubmit", 
        resolver: yupResolver(loginSchema),
        defaultValues:{
            username:"",
            password:"",
        } 
    })
    if(tReady)
        return <Box className="ou-mt-3">
            <Helmet>
                <title>Login</title>
            </Helmet>
            
            <Loading/>
        </Box>
    return (
        <>
         <Helmet>
          <title>{t('login:login')} - OUPharmacy</title>
        </Helmet>

        {openBackdrop === true && <BackdropLoading/>}
 
        <Box 
            sx={{
                width: '100%',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: { xs: 2, sm: 3, md: 4 },
                boxSizing: 'border-box'
            }}
        >
            <Container 
                component={Paper} 
                elevation={6} 
                sx={{ 
                    padding: { xs: 2, sm: 3, md: 4 },
                    width: { 
                        xs: '100%', 
                        sm: '90%', 
                        md: '70%', 
                        lg: '50%', 
                        xl: '30%' 
                    },
                    maxWidth: '500px',
                    borderRadius: 2
                }} 
                className="ou-rounded-lg"
            >
                <Box sx={{ margin: '12px auto', textAlign: 'center' }}>
                    <Avatar 
                        sx={{ 
                            width: { xs: '150px', sm: '180px', md: '200px' }, 
                            height: { xs: '40px', sm: '45px', md: '50px' }, 
                            margin: "auto" 
                        }} 
                        variant="square"
                        className="ou-object-fit-contain"
                        src="https://res.cloudinary.com/dl6artkyb/image/upload/v1666354515/OUPharmacy/Untitled-1_hdvtsk.png"
                    />
                </Box>

                <form onSubmit={methods.handleSubmit((data) => {onSubmit(data);})}>
                    <Grid item xs={12} sm={12} >
                        <Collapse in={openError}>
                            <Alert
                                action={
                                    <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setOpenError(false);
                                        }}
                                    >
                                        <CloseIcon fontSize="inherit" />
                                    </IconButton>
                                }
                                sx={{ mb: 2 }}
                                severity="error"
                            >
                                {t('incorrectInfo')}
                            </Alert>
                        </Collapse>
                    </Grid>
                    <Grid item xs={12} sm={12} sx={{ margin: { xs: "12px 0", sm: "16px 0" } }}>
                        <TextField
                            fullWidth
                            autoComplete="given-name"
                            autoFocus
                            id="username"
                            name="username"
                            type="text"
                            label= {t('username')}
                            error={methods.formState.errors.username}
                            {...methods.register("username")}
                        />
                        {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">{methods.formState.errors.username?.message}</p>) : <></>}
                    </Grid>
                    <Grid item xs={12} sx={{ margin: { xs: "12px 0", sm: "16px 0" } }}>
                        <FormControl variant="outlined" fullWidth>
                        {methods.formState.errors.password?.message ? (
                            <InputLabel className="!ou-text-red-600" htmlFor="outlined-adornment-password">
                                {t('password')}
                            </InputLabel>)
                            :<InputLabel htmlFor="outlined-adornment-password">{t('password')}</InputLabel>}
                            
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                label={t('password')}
                                error={methods.formState.errors.password?.message}
                                {...methods.register("password")}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleTogglePassword}
                                    edge="end"
                                    >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                }
                            />
                            {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">{methods.formState.errors.password?.message}</p>) : <></>}
                        </FormControl>
                    </Grid>
                    <Box sx={{ 
                        margin: "0 auto", 
                        textAlign: "center",
                        width: '100%'
                    }}>
                        <Button
                            type="submit"
                            className="!ou-bg-blue-600 !ou-text-white !ou-my-3"
                            sx={{
                                minWidth: { xs: '100%', sm: '200px' },
                                width: { xs: '100%', sm: 'auto' },
                                px: { xs: 2, sm: 5 }
                            }}
                        >
                            {t('login')}
                        </Button>
                        
                        {/* Social Login Section */}
                        <Box sx={{ mt: 3, mb: 2, width: "100%" }}>
                            <Divider sx={{ mb: 2 }}>
                                <span style={{ color: '#666', fontSize: '14px' }}>{t('login:orLoginWith')}</span>
                            </Divider>
                            
                            <Grid container spacing={2} justifyContent="center">
                                <Grid item xs={12} sm={12}>
                                    <Button 
                                        fullWidth
                                        variant="outlined"
                                        className="!ou-border-[#c23321] !ou-text-[#db4437]"
                                        startIcon={<GoogleIcon />}
                                        onClick={handleGoogleLogin}
                                    >
                                        Google
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                        
                      
                        <Divider sx={{ mb: 2 }}>
                            <span style={{ color: '#666', fontSize: '14px' }}>{t('login:or')}</span>
                        </Divider>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item xs={12} sm={6}>
                                <Tooltip title={t('login:register')} followCursor >
                                    <Button 
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => router('/register')}
                                    startIcon={<HowToRegIcon />}
                                    className="!ou-border-[#4b4343] !ou-text-[#4b4343]"
                                >
                                    {t('login:register')}
                                </Button>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Tooltip title={t('login:home')} followCursor>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        onClick={() => router('/')}
                                        startIcon={<HomeIcon />}
                                        sx={{
                                            borderColor: '#4267B2',
                                            color: '#4267B2',
                                            '&:hover': {
                                                borderColor: '#365899',
                                                backgroundColor: 'rgba(66, 103, 178, 0.04)'
                                            }
                                        }}
                                    >
                                        {t('login:home')}
                                    </Button>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Box>
                </form>
            </Container>
        </Box>
    </>
    )
}

export default Login