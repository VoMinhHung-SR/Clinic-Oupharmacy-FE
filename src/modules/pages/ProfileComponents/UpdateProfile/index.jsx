import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { Helmet } from 'react-helmet';
import useRegister from '../../RegisterComponents/hooks/useRegister';
import { CURRENT_DATE } from '../../../../lib/constants';
import useUpdateProfile from '../hooks/useUpdateProfile';

const UpdateProfile = ({ userID ,email, firstName, lastName, dob, phoneNumber, gender, handleOnSuccess }) => {
  const { t, tReady } = useTranslation(['register', 'common', 'yup-validate']);
  const {onSubmit, updateSchema}  = useUpdateProfile()
  
  const formattedDOB = moment(dob).format('YYYY-MM-DD');
  
  const methods = useForm({
      mode: 'onSubmit',
      resolver: yupResolver(updateSchema),
      defaultValues: {
          firstName: firstName ? firstName : '',
          lastName: lastName ? lastName : '',
          email: email ? email : '',
          dob: dob ? formattedDOB : '',
          phoneNumber: phoneNumber ? phoneNumber : ''
        }
    });


  const isFormDirty = methods.formState.isDirty;


  if (tReady)
    return (
      <Box sx={{ minHeight: '300px' }}>
        <Helmet>
          <title>Profile</title>
        </Helmet>
        <Box className="ou-p-5">
          <Loading></Loading>
        </Box>
      </Box>
    );
   
  return (
    <Box className=" ou-m-auto ou-rounded !ou-h-full">
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <form
        onSubmit={methods.handleSubmit((data) => {
          onSubmit(data, methods.setError, userID, () => {handleOnSuccess(), methods.reset({ isDirty: false });});
        })}
        className="ou-m-auto ou-px-8 ou-py-4  !ou-h-full"
      >
        <h1 className="ou-text-center ou-text-2xl ou-py-2 ou-uppercase ou-font-semibold">{t('register:updateInformation')}</h1>
        <Grid container justifyContent="flex" className="ou-mt-6">
          <Grid item xs={4} className="ou-pr-2">
            <TextField
              fullWidth
              autoComplete="given-name"
              autoFocus
              id="firstName"
              name="firstName"
              type="text"
              label={t('firstName')}
              error={methods.formState.errors.firstName}
              helperText={methods.formState.errors.firstName ? methods.formState.errors.firstName.message : ''}
              {...methods.register('firstName')}
            />
          </Grid>
          <Grid item xs={4} className="ou-pr-2">
            <TextField
              fullWidth
              autoComplete="given-name"
              id="lastName"
              name="lastName"
              type="text"
              label={t('lastName')}
              error={methods.formState.errors.lastName}
              helperText={methods.formState.errors.lastName ? methods.formState.errors.lastName.message : ''}
              {...methods.register('lastName')}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              autoComplete="given-name"
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              label={t('phoneNumber')}
              error={methods.formState.errors.phoneNumber}
              helperText={methods.formState.errors.phoneNumber ? methods.formState.errors.phoneNumber.message : ''}
              {...methods.register('phoneNumber')}
            />
          </Grid>
        </Grid>

        <Grid container justifyContent="flex" className="ou-mt-4 ou-items-center">
          <Grid item xs={6} className="ou-pr-2">
            <TextField
              fullWidth
              autoComplete="given-name"
              id="email"
              name="email"
              type="text"
              label={t('email')}
              error={methods.formState.errors.email}
              {...methods.register('email')}
            />
            {methods.formState.errors ? (
              <p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">{methods.formState.errors.email?.message}</p>
            ) : (
              <></>
            )}
          </Grid>
          <Grid item xs={6} className="ou-flex ou-flex-1 ou-w-full">
            <Box className="!ou-pr-2 ou-min-w-[70%]">
              <TextField
                id="date"
                className="!ou-w-full"
                label={t('dateOfBirth')}
                type="date"
                name="dob"
                error={methods.formState.errors.dob}
             
                sx={{ width: 220 }}
                InputLabelProps={{
                  shrink: true
                }}
                inputProps={{
                  max: moment(CURRENT_DATE).format('YYYY-MM-DD')
                }}
                {...methods.register('dob')}
              />
              {methods.formState.errors ? (
                <p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">{methods.formState.errors.dob?.message}</p>
              ) : (
                <></>
              )}
            </Box>

            <FormControl className="!ou-min-w-[30%]">
              <InputLabel id="demo-simple-select-label">{t('gender')}</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name='gender'
                label={t('gender')}
             
                defaultValue={parseInt(gender)}
                {...methods.register('gender')}
              >
                <MenuItem value={0}>{t('male')}</MenuItem>
                <MenuItem value={1}>{t('female')}</MenuItem>
                <MenuItem value={2}>{t('secret')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container justifyContent="flex" className="ou-my-3">
          <Grid item xs={12}>
 
              <Box sx={{ textAlign: 'right' }}>
                <Button className="!ou-min-w-[150px] !ou-mt-3" 
                  disabled={!isFormDirty} variant="contained" color="success" type="submit">
                  {t('register:update')}
                </Button>
              </Box>
       
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default UpdateProfile;