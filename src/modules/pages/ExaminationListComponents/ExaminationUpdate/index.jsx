import { Autocomplete, Box, Button, FormControl, Grid, InputLabel, OutlinedInput, Paper, TextField, Typography, createFilterOptions } from "@mui/material"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next";
import useFormAddExamination from "../../BookingComponents/FormAddExamination/hooks/useFormAddExamination";
import { useSelector } from "react-redux";
import Loading from "../../../common/components/Loading";
import DoctorAvailabilityTime from "../../BookingComponents/DoctorAvailabilityTime";
import { CURRENT_DATE } from "../../../../lib/constants";
import moment from "moment";
import clsx from "clsx";
import { useEffect } from "react";
import { formatSelectedTime } from "../../../../lib/utils/helper";
import PatientCard from "../../../common/components/card/PatientCard";

const ExaminationUpdate = ({examination, handleClose, onUpdateSuccess, ...props}) => {
    const {t , tReady} = useTranslation(['booking', 'yup-validate', 'modal', 'common'])
    const {onUpdateSubmit, setDoctor, timeNotAvailable,
        doctor,setDate, isLoading} = useFormAddExamination();

    const handleDateChange = (event) => {
        setDate(event.target.value);
        methods.setValue("selectedDate", event.target.value);
        methods.trigger("selectedDate");
    };
   useEffect(()=> { 
        if (examination?.schedule_appointment) {
            setDate(moment(examination?.schedule_appointment.day).format("YYYY-MM-DD"))
            setDoctor(examination.schedule_appointment.doctor_id)
        }
        
    },[examination])
    const methods = useForm({
        mode:"obSubmit", 
        defaultValues:{
            description: examination?.description || "",
            selectedDate:  moment(examination?.schedule_appointment?.day).format("YYYY-MM-DD") || "",
            selectedTime: formatSelectedTime(examination?.schedule_appointment?.start_time, examination?.schedule_appointment?.end_time) || "",
            doctor: examination?.schedule_appointment?.doctor_id || "",
            patient: examination?.patient?.id || ""
        }
    })

    const { allConfig } = useSelector((state) => state.config);

    const filterOptions = createFilterOptions({
        matchFrom: 'start',
        stringify: (option) => `${option?.user_display?.first_name} ${option?.user_display?.last_name}`,
    });

    if (tReady)
        return <Box sx={{ minHeight: "300px" }}>
        <Box className='ou-p-5'>
            <Loading></Loading>
        </Box>
    </Box>;


    return (
        <>
             <Box component={Paper} elevation={6}>
                <form onSubmit={methods.handleSubmit((data)=> 
                onUpdateSubmit(examination.id, examination?.patient?.id, data, ()=>{
                    methods.setError();
                    handleClose();
                    onUpdateSuccess();
                }, 
                examination?.schedule_appointment?.id))} 
                    className="ou-m-auto ou-py-6 ou-px-10">
                        <h3 className="ou-text-center ou-text-2xl">{t('updateBooking')}</h3>
                        <Grid container justifyContent="flex">
                            <Grid item xs={12} className="!ou-mt-6" >
                                <FormControl fullWidth >
                                    <InputLabel htmlFor="description">{t('description')}</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        autoComplete="given-name"
                                        autoFocus
                                        multiline
                                        rows={2}
                                        id="description"
                                        name="description"
                                        type="text"
                                        label={t('description')}
                                        error={methods.formState.errors.description}
                                        {...methods.register("description")}
                                    />
                                    {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">{methods.formState.errors.description?.message}</p>) : <></>}
                                </FormControl>
                            </Grid>

                            <Grid item xs={6} className="!ou-mt-6 ou-pr-2">
                                <TextField
                                fullWidth
                                id="selectedDate"
                                name="selectedDate"
                                type="date"
                                label={t('createdDate')}
                                {...methods.register("selectedDate")}
                                error={methods.formState.errors.selectedDate}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    min: moment(CURRENT_DATE).add(1, 'days').format('YYYY-MM-DD'),
                                    max: moment(CURRENT_DATE).add(30, 'days').format('YYYY-MM-DD')  ,
                                }}
                                onChange={handleDateChange}
                                />
                                {methods.formState.errors.selectedDate && (
                                <p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                                    {methods.formState.errors.selectedDate.message}
                                </p>
                                )}
                            </Grid>
                            <>
                                <Grid item xs={6} className={clsx("!ou-mt-6 ou-pl-2")}>  
                                    <Autocomplete
                                        id="doctor"
                                        options={allConfig.doctors}
                                        getOptionLabel={(option) => `${t('Dr')} ${option?.user_display?.first_name} ${option?.user_display?.last_name}`}
                                        filterOptions={filterOptions}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        defaultValue={allConfig.doctors.find((doctor) => doctor.id === examination?.schedule_appointment?.doctor_id)}
                                        noOptionsText={t('noDoctorFound')}
                                        onChange={(event, value) => {
                                            setDoctor(value.id)
                                            methods.setValue('doctor', value.id)
                                        }}
                                        renderInput={(params) => <TextField {...params} label={t('doctor')} 
            
                                            error={methods.formState.errors.doctor?.message}
                                            name="doctors"
                                        />}
                                    />
                                    {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                                        {methods.formState.errors.doctor?.message}</p>) : <></>}
                                
                            </Grid>

                            {(doctor && timeNotAvailable) && (<Grid item xs={12} className={clsx("!ou-mt-6 ou-pl-2")}>
                                <DoctorAvailabilityTime 
                                    schedule={timeNotAvailable} 
                                    selectedStartTime={methods.watch('selectedTime')?.start || examination?.schedule_appointment?.start_time}
                                    selectedEndTime={methods.watch('selectedTime')?.end || examination?.schedule_appointment?.end_time}
                                    defaultValue={methods.getValues('selectedTime')}
                                    onChange={(selectedTimeData) => {
                                        methods.setValue('selectedTime', selectedTimeData);
                                        methods.trigger("selectedTime");
                                    }}
                                    isLoading={isLoading}
                                />
                            </Grid>)}
                            
                            </>    
                        </Grid>

                        <h5 className="ou-text-center ou-mt-8 ou-mb-4 ou-text-2xl">{t('patientInfo')}</h5>
                        <PatientCard patientData={examination.patient} isSelected={true}/>
                      
                        <Grid container>
                            <Grid item sx={{ width: "100%"}}>
                                <Typography
                                    variant="subtitle1"
                                    gutterBottom
                                    className="ou-text-right"
                                    style={{ textDecoration: "inherit", margin:"40px auto 0px auto" }}
                                    color="grey.700"
                                >
                              
                                    <Button variant="contained" 
                                        color="success" 
                                        type="submit" 
                                        style={{"padding": "6px 40px"}}
                                        >
                                        {t('common:update')}
                                    </Button>
                                </Typography>
                            </Grid>
                        </Grid>
                    </form>
            </Box>
        </>
    )
}

export default ExaminationUpdate