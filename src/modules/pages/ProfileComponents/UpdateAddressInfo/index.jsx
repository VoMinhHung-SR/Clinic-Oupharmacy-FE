import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete, Box, Button, FormControl, Grid, TextField, createFilterOptions } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import useUpdateLocation from "../hooks/useUpdateLocation";
import useAddressInfo from "../../RegisterComponents/hooks/useAddressInfo";
import clsx from "clsx";

const UpdateAddressInfo = (props) => {
    const { t, tReady } = useTranslation(['register', 'common', 'yup-validate']);
    const { locationData, user, locationSchema, onSubmit } = useUpdateLocation()
 
    const methods = useForm({
        mode: 'onSubmit',
        resolver: yupResolver(locationSchema),
        defaultValues: {
            location:{
                address: "",
                city: -1 ,
                district: -1
            }
          }
      })

      const isFormDirty = methods.formState.isDirty;


      const {districts, setDistrictName, setAddressInput, setCityId, setCityName, cityName, districtName,
        handleGetPlaceByID, handleSetLocation, listPlace, setSelectedOption, locationGeo} = useAddressInfo()
      const { allConfig } = useSelector((state) => state.config);
  
       // Filter Options for address
      const filterAddressOptions = createFilterOptions({
          matchFrom: 'start',
          stringify: (option) => option ? option.description : "",
      })
  
  
      // Filter Options for city and wards
      const filterOptions = createFilterOptions({
          matchFrom: 'start',
          stringify: (option) => option.name,
      });
    return <form
      onSubmit={methods.handleSubmit((data) => {
        onSubmit(data, methods.setError,locationGeo, props.callBackSuccess, cityName, districtName);
      })}
     
    >
      
        <Grid container justifyContent="flex">
            <Grid item xs={6} className={clsx('ou-pr-2 !ou-mt-4')} >
                <FormControl fullWidth >
                    <Autocomplete
                        id="city"
                        options={allConfig.cityOptions}
                        getOptionLabel={(option) => option.name}
                        filterOptions={filterOptions}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        noOptionsText={t('noCityFound')}
                        onChange={(event, value) => {
                            methods.setValue('location.district', ' ')
                            setCityId(value.id)
                            setCityName(value.name)
                            methods.setValue("location.city", value.id)
                            methods.clearErrors('location.city')
                        }}
                        renderInput={(params) => <TextField {...params} 
                            label={t('city')} 
                            error={methods.formState.errors.location?.city}
                            name="location.city"
                            />}
                    />
                        {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">{methods.formState.errors.location?.city?.message}</p>) : <></>}
                </FormControl>
            </Grid>
            <Grid item xs={6} className="!ou-mt-4 ou-pl-2" >
                <FormControl fullWidth >
                    <Autocomplete
                        id="district"
                        options={districts}
                        getOptionLabel={(option) => option.name}
                        filterOptions={filterOptions}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        noOptionsText={t('noDistrictFound')}
                        onChange={(event, value) => {
                            setDistrictName(value.name)
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
        </Grid>
         <Grid item xs={12} className="!ou-mt-4">
            <FormControl fullWidth >
            <Autocomplete
                freeSolo
                id="location.address"
                options={listPlace ? listPlace : []}
                getOptionLabel={(option) => option ? option.description : ""}
                filterOptions={filterAddressOptions}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                noOptionsText={"No Option"}
                onInputChange={(event, value) => {
                    setAddressInput(value);
                    setSelectedOption(null); // reset selected option when user types a new value
                }}
                onChange={(event, value) => {
                    if (value) {
                        handleGetPlaceByID(value.place_id)
                        setSelectedOption(value);
                    } else {
                        setSelectedOption(null);
                        handleSetLocation();
                    }
                }}
                getOptionSelected={(option, value) => option?.id === value?.id}
                renderInput={(params) => (
                    <>
                        <TextField
                        {...params}
                        label={t('address')}
                        error={methods.formState.errors.location?.address}
                        name="location.address"
                        {...methods.register('location.address')}
                        />                 
                    </>
                    )}
                />

                {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">{methods.formState.errors.location?.address?.message}</p>) : <></>}
                    
            </FormControl>
            <Grid container justifyContent="flex" className="ou-my-3">
            <Grid item xs={12}>
                
                <Box sx={{ textAlign: 'right' }}>
                    <Button className="!ou-min-w-[150px] !ou-mt-3" disabled={!isFormDirty} variant="contained" color="success" type="submit">
                    {t('register:update')}
                    </Button>
                </Box>
                
            </Grid>
            </Grid>
        </Grid>
    </form>

}

export default UpdateAddressInfo