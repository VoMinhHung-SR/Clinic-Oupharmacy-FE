import { Avatar, Box, Button, Container, Divider, FormControl, Grid, InputAdornment, InputLabel, MenuItem, OutlinedInput, Paper, Select, TextField } from "@mui/material"
import moment from "moment"
import { CURRENT_DATE } from "../../../../lib/constants"
import DoctorAvailabilityTime from "../DoctorAvailabilityTime"
import Loading from "../../../common/components/Loading"
import { useTranslation } from "react-i18next"
import useDoctorAvailability from "../DoctorAvailabilityTime/hooks/useDoctorAvailability"
import clsx from "clsx"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useContext, useEffect } from "react"
import CustomCollapseListItemButton from "../../../common/components/collapse/ListItemButton"
import BookingContext from "../../../../lib/context/BookingContext"
import StethoscopeIcon from "../../../../lib/icon/StethoscopeIcon"
import SchemaModels from "../../../../lib/schema"
const BookingForm = ({doctorInfo}) => {
    const {t , tReady} = useTranslation(['booking', 'yup-validate', 'modal', 'home'])

    const doctor = doctorInfo;
    const {patientSelected, actionUpState} = useContext(BookingContext)
    const {timeNotAvailable, isLoading, setDate, slideRight, 
        handleSlideChange, setDoctorID, onSubmit} = useDoctorAvailability();
    
    const { timeSlotSchema } = SchemaModels()

    useEffect(()=>{setDoctorID(doctor.id)},[doctor.id])

    const methods = useForm({
        mode:"obSubmit", 
        resolver: yupResolver(timeSlotSchema),
        defaultValues:{
            description:"",
            selectedDate:"",
            selectedTime: {},
            doctor: doctor.id ? doctor.id : "",
        }
    })

    const handleDateChange = (event) => {
        const selectedDate = event.target.value;
        const minDate = moment(CURRENT_DATE).add(0, 'days').format('YYYY-MM-DD');
        const maxDate = moment(CURRENT_DATE).add(30, 'days').format('YYYY-MM-DD');

        if (selectedDate < minDate || selectedDate > maxDate) {
            return methods.setError("selectedDate", {
                type: "manual",
                message: t('yup-validate:yupCreatedDateMustBeInRange', {minDate: minDate, maxDate: maxDate})
            });
        } else {
            methods.clearErrors("selectedDate");
        }

        setDate(selectedDate);
        methods.setValue("selectedDate", selectedDate);
        methods.trigger("selectedDate");
    };
    
    if (tReady)
        return <Box sx={{ minHeight: "300px" }}>
        <Box className='ou-p-5'>
            <Loading></Loading>
        </Box>
    </Box>;

    const disableButton = () => {
        return <Button variant="contained" 
            color="primary" 
            type="button" 
            onClick={handleSlideChange}
            disabled={(!methods.getValues('selectedDate') || !methods.getValues('selectedTime')) && true }
            style={{"padding": "6px 40px", "marginLeft":"auto"}}
            >
            {t('booking:continue')}
        </Button>         
    }

    const renderPatientInformationForm = (slideRight) => {
        if(!slideRight)
            return  (<>
                <CustomCollapseListItemButton isOpen={true} title={
                    <div className="ou-flex ou-items-center">
                        <Box className="ou-mr-2">
                            <Avatar>
                                <StethoscopeIcon size={20}/>
                            </Avatar>
                        </Box>
        
                        <p className="ou-w-full ou-text-blue-700 ou-font-bold">
                            {doctor?.user_display?.first_name} {doctor?.user_display?.last_name}
                        </p>
                        <Box className="ou-mr-2">
                            <SpecializationTag specialization={doctor?.specializations}/>
                        </Box>
                    </div>} 
                    loading={isLoading}
                    content={
                        <>
                        <Divider />
                        <Grid item className="!ou-mt-6 !ou-mb-3">
                            <TextField
                                fullWidth
                                id="selectedDate"
                                name="selectedDate"
                                type="date"
                                label={t('createdDate')}
                                value={methods.getValues("selectedDate") ? methods.getValues("selectedDate") : ""}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    min: moment(CURRENT_DATE).add(0, 'days').format('YYYY-MM-DD'),
                                    max: moment(CURRENT_DATE).add(30, 'days').format('YYYY-MM-DD'),
                                }}
                                onChange={handleDateChange}
                            />
                                {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                                    {methods.formState.errors.selectedDate?.message}</p>) : <></>}
                                
                                {(doctor && timeNotAvailable && methods.getValues('selectedDate')) && (
                                    <Grid item xs={12} className={clsx("!ou-mt-6")}>
                                     <DoctorAvailabilityTime 
                                        schedule={timeNotAvailable} 
                                        onChange={(selectedTimeData) => {
                                            methods.setValue('selectedTime', selectedTimeData);
                                            methods.trigger("selectedTime");
                                        }}
                                        isLoading={isLoading}
                                        defaultValue={methods.getValues('selectedTime')}
                                        />
                                </Grid>)}
                        </Grid>
                        </>
                        
                    }
                />                    
            </>)
        return (<>
            <div className="ou-flex ou-justify-center ou-items-center ou-py-2 ou-px-4">
                <div className="ou-mr-2">
                    <Avatar></Avatar>
                </div>
                <p className="ou-w-full ou-text-blue-700 ou-font-bold ou-text-left">{doctor?.user_display?.first_name} {doctor?.user_display?.last_name}</p>
                <Divider />
            </div>
            <h5 className="ou-text-center ou-text-xl ou-py-2 ou-mt-2">{t('home:makeAnAppointMent')}</h5>
            <Grid item xs={12} className="!ou-p-4" >
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
        </>)
    }

    return (
        <>
            <Container className="!ou-py-4">
                <Box className="ou-flex ou-py-4" component={Paper} elevation={4} >           
                    <div className="ou-w-[100%]">
                        <form onSubmit={methods.handleSubmit((data)=> onSubmit(data, patientSelected,() => {
                            methods.reset(); actionUpState();},
                            methods.setError()))
                        } className="ou-m-auto ou-px-5"> 
                            {/* Patient Form required */}
                            {renderPatientInformationForm(slideRight)}
                            {/* Area button */}
                
                            <Grid item className="ou-flex !ou-mb-3">
                                {!slideRight ?  disableButton(): <>
                                    <Button variant="contained" 
                                        color="primary" 
                                        type="button" 
                                        onClick={handleSlideChange}
                                        style={{"padding": "6px 40px", "marginRight": "8px", "marginLeft":"auto"}}
                                        >
                                        {t('booking:goBack')}
                                    </Button> 
                                    <Button variant="contained" 
                                    color="success" 
                                    type="submit" 
                                    style={{"padding": "6px 40px"}}
                                    >
                                    {t('submit')}
                                </Button>
                                </>}
                            </Grid>
                        </form>
                    </div>
                </Box>
            </Container>
        </>
    )
}

const SpecializationTag = ({specialization}) => {
    const {t} = useTranslation(['booking'])
    if(!specialization)
        return <></>
    return (<div className="ou-flex ou-items-center ou-justify-end ou-w-full ou-ml-2 ou-gap-2">
        {specialization.map((s, index) =>  
            <Box key={`sp_tags`+index} className="ou-flex ou-items-center ou-justify-center 
             ou-bg-blue-100 ou-rounded ou-px-2 ou-py-1" >{s.name}</Box>
        )}
    </div>)
}


export default BookingForm