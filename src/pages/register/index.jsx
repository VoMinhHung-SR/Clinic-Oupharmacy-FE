import { Autocomplete, Box, Button, Container, FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Paper, Select, TextField, Tooltip, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import useRegister from "../../modules/pages/RegisterComponents/hooks/useRegister";
import {yupResolver} from "@hookform/resolvers/yup"
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux'; 
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import useAddressInfo from "../../modules/pages/RegisterComponents/hooks/useAddressInfo";
import { Helmet } from "react-helmet";
import { CURRENT_DATE } from "../../lib/constants";
import moment from "moment";
import SchemaModels from "../../lib/schema";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AddressAutocomplete from '../../modules/pages/RegisterComponents/components/AddressAutocomplete';

const Register = () => {
    const {t, tReady} = useTranslation(['register', 'common', "yup-validate"]) 

    const {imageUrl, setImageUrl, openBackdrop, dob, setDOB, isLoadingUserRole,
        selectedImage, setSelectedImage, userRoleID, gender, setGender ,onSubmit
    } = useRegister();

    const {registerSchema} = SchemaModels()

    const {districts, setCityId, listPlace, location: locationGeo,
         handleInputChange, handleChange} = useAddressInfo()
    
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)
    
    const methods = useForm({
        mode:"onSubmit", 
        resolver: yupResolver(registerSchema),
        defaultValues:{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            dob:"",
            phoneNumber: "",
            location: {
                address: "",
                city: -1,
                district: -1
            }
            
        }
    })
    
    useEffect(() => {
        if (selectedImage) {
            setImageUrl(URL.createObjectURL(selectedImage));
        }

    }, [selectedImage]);

    const { allConfig } = useSelector((state) => state.config);

    const filterOptions = (options, state) => {
        return options.filter(option => {
            const label = typeof option === 'string'
                ? option
                : (option && typeof option.description === 'string' ? option.description : '');
            return label.toLowerCase().includes(state.inputValue.toLowerCase());
        });
    };

    if (tReady && isLoadingUserRole)
        return <Box sx={{ minHeight: "300px" }}>
            <Helmet>
                <title>Register</title>
            </Helmet>
            <Box className='ou-p-5'>
                <Loading></Loading>
            </Box>
        </Box>

    return (
        <>
            <Helmet>
                <title>{t('register:register')}</title>
            </Helmet>

            {openBackdrop === true ?
                (<BackdropLoading></BackdropLoading>)
                : <></>
            }

            <div style={{ "width": "100%"
            }}>
                <Container style={{ "padding": "50px" }}>
                    <Box component={Paper} elevation={6}  className="ou-w-[80%] ou-m-auto ou-rounded">
                        <form onSubmit={methods.handleSubmit((data) => {
                            onSubmit(data, methods.setError, locationGeo);
                        })} 
                        className="ou-m-auto ou-px-8 ou-py-4 "
                        >
                            <h1 className="ou-text-center ou-text-2xl ou-py-2 ou-uppercase">{t('registerUser')}</h1>
                            <Grid container justifyContent="flex" className="ou-mt-6" >
                                <Grid item xs={4} className="ou-pr-2" >
                                    <TextField
                                        fullWidth
                                        autoComplete="given-name"
                                        autoFocus
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        label={<>{t('firstName')}<span style={{color: 'red'}}>*</span></>}
                                        error={methods.formState.errors.firstName}
                                        {...methods.register("firstName")}
                                    />
                                    {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">{methods.formState.errors.firstName?.message}</p>) : <></>}
                                </Grid>
                                <Grid item xs={4} className="ou-pr-2">
                                    <TextField
                                        fullWidth
                                        autoComplete="given-name"
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        label={<>{t('lastName')}<span style={{color: 'red'}}>*</span></>}
                                        error={methods.formState.errors.lastName}
                                        {...methods.register("lastName")} />
                                        {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">{methods.formState.errors.lastName?.message}</p>) : <></>}
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        autoComplete="given-name"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        type="text"
                                        label={<>{t('phoneNumber')}<span style={{color: 'red'}}>*</span></>}
                                        error={methods.formState.errors.phoneNumber}
                                        {...methods.register("phoneNumber")} />
                                        {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">{methods.formState.errors.phoneNumber?.message}</p>) : <></>}
                                </Grid>
                            </Grid>

                            <Grid container justifyContent="flex"  className="ou-mt-4 ou-items-center">
                                <Grid item xs={6} className="ou-pr-2">
                                    <TextField
                                            fullWidth
                                            autoComplete="given-name"
                                            id="email"
                                            name="email"
                                            type="text"
                                            label={<>{t('email')}<span style={{color: 'red'}}>*</span></>}
                                            error={methods.formState.errors.email}
                                            {...methods.register("email")}
                                        />
                                        {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">{methods.formState.errors.email?.message}</p>) : <></>}


                                </Grid>
                                < Grid item xs={6} className="ou-flex ou-flex-1 ou-w-full">
                                    <Box className="!ou-pr-2 ou-min-w-[70%]" >
                                        <TextField
                                            id="date"
                                            className="!ou-w-full"
                                            label={t('dateOfBirth')}
                                            type="date"
                                            name="dob"
                                            error={methods.formState.errors.dob}
                                            onChange={(evt) => setDOB(evt.target.value)}
                                            sx={{ width: 220 }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputProps={{
                                                max:  moment(CURRENT_DATE).format('YYYY-MM-DD')
                                              }}
                                            {...methods.register("dob")}
                                        />
                                        {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">{methods.formState.errors.dob?.message}</p>) : <></>}

                                    </Box>

                                    <FormControl className="!ou-min-w-[30%]">
                                        <InputLabel id="demo-simple-select-label">{t('gender')}</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={gender}
                                            label={t('gender')}
                                            onChange={(evt) => setGender(evt.target.value)}
                                            defaultValue={0}
                                        >
                                            <MenuItem value={0}>{t('male')}</MenuItem>
                                            <MenuItem value={1}>{t('female')}</MenuItem>
                                            <MenuItem value={2}>{t('secret')}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                               
                            </Grid>

                            <Grid container justifyContent="flex" className="ou-mt-4 ou-items-center">
                            <Grid item xs={6} className="ou-pr-1">
                                    <FormControl fullWidth variant="outlined" error={!!methods.formState.errors.password}>
                                        <InputLabel htmlFor="password">
                                            {t('password')}<span style={{color: 'red'}}>*</span>
                                        </InputLabel>
                                        <OutlinedInput
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            label={t('password')}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    >
                                                    {showPassword   ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                                }
                                            {...methods.register("password")}
                                        />
                                        <FormHelperText>
                                            {methods.formState.errors.password?.message}
                                        </FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} className="ou-pl-1">
                                    <FormControl fullWidth variant="outlined" error={!!methods.formState.errors.confirmPassword}>
                                        <InputLabel htmlFor="confirmPassword">
                                            {t('confirmPassword')}<span style={{color: 'red'}}>*</span>
                                        </InputLabel>
                                            <OutlinedInput
                                            fullWidth
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPass ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                                                    edge="end"
                                                    >
                                                    {showConfirmPass   ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                                }
                                            label={<>{t('confirmPassword')}<span style={{color: 'red'}}>*</span></>}
                                            error={methods.formState.errors.confirmPassword}
                                           
                                            {...methods.register("confirmPassword")}
                                            />  
                                        {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                                            {methods.formState.errors.confirmPassword?.message}</p>) : <></>}
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <h2 className="ou-text-center ou-text-2xl ou-pt-8 ou-pb-3 ou-uppercase">{t('addressInfo')}</h2>
                            <Typography className="ou-text-center !ou-text-sm ou-pb-3">({t('correctAddress')})</Typography>
                            <Grid container justifyContent="flex">
                                
                                <Grid item xs={4} className={clsx('ou-pr-2 !ou-mt-4')} >
                                    <FormControl fullWidth >
                                        <Autocomplete
                                            id="city"
                                            options={allConfig.cityOptions}
                                            getOptionLabel={(option) => option.name}
                                            filterOptions={filterOptions}
                                            isOptionEqualToValue={(option, value) => {
                                                if (!option || !value) return false;
                                                if (typeof option === 'string' && typeof value === 'string') return option === value;
                                                if (typeof option === 'object' && typeof value === 'string') return option.description === value;
                                                if (typeof option === 'string' && typeof value === 'object') return option === value.description;
                                                return option?.id === value?.id || option?.description === value?.description;
                                            }}
                                            noOptionsText={t('noCityFound')}
                                            onChange={(event, value) => {
                                                methods.setValue('location.district', ' ')
                                                setCityId(value.id)
                                                methods.setValue("location.city",value.id)
                                                methods.clearErrors('location.city')
                                            }}
                                            renderInput={(params) => <TextField {...params} label={t('city')} 
                
                                                error={methods.formState.errors.location?.city}
                                                name="location.city"
                                                />}
                                        />
                                           {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">{methods.formState.errors.location?.city?.message}</p>) : <></>}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={8} className="!ou-mt-4 ou-pl-2" >
                                    <FormControl fullWidth >
                                        <Autocomplete
                                            id="district"
                                            options={districts}
                                            getOptionLabel={(option) => option.name}
                                            filterOptions={filterOptions}
                                            isOptionEqualToValue={(option, value) => {
                                                if (!option || !value) return false;
                                                if (typeof option === 'string' && typeof value === 'string') return option === value;
                                                if (typeof option === 'object' && typeof value === 'string') return option.description === value;
                                                if (typeof option === 'string' && typeof value === 'object') return option === value.description;
                                                return option?.id === value?.id || option?.description === value?.description;
                                            }}
                                            noOptionsText={t('noDistrictFound')}
                                            onChange={(event, value) => {
                                                
                                                methods.setValue("location.district",value.id)
                                                methods.clearErrors('location.district')
                                            }}
                                            renderInput={(params) => <TextField {...params} 
                                                label={t('district')}
                                                error={methods.formState.errors.location?.district}
                                                name="location.district"
                                            />}
                                        />
                                        {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">{methods.formState.errors.location?.district?.message}</p>) : <></>}
                                       
                                    </FormControl>
                                </Grid>
                            {/* address */}
                            <Grid item xs={12} className="!ou-mt-4">
                            <FormControl fullWidth>
                                <Controller
                                    name="location.address"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <AddressAutocomplete
                                            value={field.value || ''}
                                            options={listPlace}
                                            loading={isLoadingUserRole}
                                            onInputChange={(e, value, reason) => {
                                                field.onChange(value);
                                                if (reason === 'input') {
                                                    handleInputChange(e, value);
                                                }
                                            }}
                                            onChange={(e, value) => {
                                                field.onChange(value ? (value.description || value) : '');
                                                handleChange(e, value);
                                            }}
                                            filterOptions={filterOptions}
                                            error={methods.formState.errors.location?.address}
                                        />
                                    )}
                                />
                                {methods.formState.errors.location?.address && (
                                    <p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                                        {methods.formState.errors.location?.address?.message}
                                    </p>
                                )}
                            </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container justifyContent="flex" className="ou-my-3">
                                <Grid item xs={12}>
                                        <Box style={{ "margin": "5px" }} >
                                            <input accept="image/*" type="file" id="select-image" style={{ display: 'none' }}
                                                onChange={(e) => {
                                                    setSelectedImage(e.target.files[0]);
                                                }}
                                            />
                              
                                            <label htmlFor="select-image">
                                                <Button className="!ou-min-w-[150px]"  variant="contained" color="primary" component="span">
                                                    {t('uploadAvatar')}
                                                </Button>
                                            </label>
                                    
                                            {imageUrl && selectedImage && (
                                                <Box className="ou-my-4 ou-border-solid" textAlign="center">
                                                    <img src={imageUrl} alt={selectedImage.name} height="250px" width={250} className="ou-mx-auto"/>
                                                </Box>
                                            )}
                                        </Box>
                                    {userRoleID === -1 ? (
                                        <Box className="ou-p-5 ou-text-center">
                                            <div className="ou-text-red-700 ou-text-xl">{t("common:refresh")}</div>
                                            <div></div>
                                        </Box>
                                        
                                    ): (
                                        <Box sx={{textAlign:"right"}}>
                                            <Button className="!ou-min-w-[150px]" variant="contained" color="success" type="submit" >{t('submit')}</Button>
                                        </Box>
                                    )}
                                    
                                </Grid>
                                  
                            </Grid>
                          

                            </form>

                                <Grid container>
                                    <Grid item sx={{ margin: "0 auto", mb: 2 }}>
                                        <Typography
                                            variant="subtitle1"
                                            gutterBottom
                                            component={Link}
                                            to="/"
                                            style={{ textDecoration: "inherit" }}
                                            color="grey.700"
                                        >
                                            {t('common:backToHomepage')}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container justifyContent="flex-end">
                                    <Grid item sx={{ margin: "0 auto", mb: 4 }}>
                                        <Link
                                            to="/login/"
                                            style={{ textDecoration: "inherit", color: "#1976d2" }}
                                        >
                                        {t('common:haveAnCount')}
                                        </Link>
                                    </Grid>
                                </Grid>
                        </Box>
                        
                    
                    </Container>
                   
                </div>

            </>
        )

}

export default Register