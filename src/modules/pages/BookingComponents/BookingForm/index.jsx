import { Avatar, Box, Button, Container, Divider, FormControl, Grid, InputLabel, OutlinedInput, Paper, TextField } from "@mui/material"
import moment from "moment"
import { CURRENT_DATE } from "../../../../lib/constants"
import DoctorAvailabilityTime from "../DoctorAvailabilityTime"
import Loading from "../../../common/components/Loading"
import { useTranslation } from "react-i18next"
import useDoctorAvailability from "../DoctorAvailabilityTime/hooks/useDoctorAvailability"
import clsx from "clsx"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useContext, useEffect, useState } from "react"
import CustomCollapseListItemButton from "../../../common/components/collapse/ListItemButton"
import BookingContext from "../../../../lib/context/BookingContext"
import StethoscopeIcon from "../../../../lib/icon/StethoscopeIcon"
import SchemaModels from "../../../../lib/schema"
import useCustomModal from "../../../../lib/hooks/useCustomModal"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import UserContext from "../../../../lib/context/UserContext"
import UpdateAddressInfo from "../../ProfileComponents/UpdateAddressInfo"
import useUpdateLocation from "../../ProfileComponents/hooks/useUpdateLocation"
import CloseIcon from '@mui/icons-material/Close';

const BookingForm = ({doctorInfo}) => {
    const {t , tReady} = useTranslation(['booking', 'yup-validate', 'modal', 'home', 'register'])

    const doctor = doctorInfo;
    const {patientSelected, actionUpState} = useContext(BookingContext)
    const {hasValidUserAddress} = useContext(UserContext)
    const {timeNotAvailable, isLoading, setDate, slideRight, 
        handleSlideChange, setDoctorID, onSubmit} = useDoctorAvailability();
    
    const { timeSlotSchema } = SchemaModels()
    const { handleCloseModal, handleOpenModal, isOpen } = useCustomModal();
    const { handleCloseModal: handleCloseAddressModal, handleOpenModal: handleOpenAddressModal, isOpen: isAddressModalOpen } = useCustomModal();
    const { onSubmit: onSubmitAddress } = useUpdateLocation()
    
    const [pendingBookingData, setPendingBookingData] = useState(null);

    useEffect(()=>{setDoctorID(doctor.user_display.id)},[doctor.user_display.id])

    const methods = useForm({
        mode:"obSubmit", 
        resolver: yupResolver(timeSlotSchema),
        defaultValues:{
            description:"",
            selectedDate:"",
            selectedTime: {},
            doctor: doctor.user_display.id ? doctor.user_display.id : "",
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

    // Handle address update and continue with booking
    const handleAddressSubmit = (data, setError, locationGeo, cityName, districtName) => {
        onSubmitAddress(data, setError, locationGeo, cityName, districtName, () => {
            handleCloseAddressModal();
            // Continue with pending booking after address is updated
            if (pendingBookingData) {
                onSubmit(pendingBookingData, patientSelected, () => {
                    methods.reset(); 
                    actionUpState();
                }, methods.setError);
                setPendingBookingData(null);
            }
        });
    };

    // Modified submit handler to check address first
    const handleBookingSubmit = (data) => {
        if (!hasValidUserAddress) {
            // Store booking data and show address modal
            setPendingBookingData(data);
            handleOpenAddressModal();
            return;
        }
        
        // Proceed with booking if address is valid
        onSubmit(data, patientSelected, () => {
            methods.reset(); 
            actionUpState();
        }, methods.setError);
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
            className="ou-py-2 ou-px-10 !ou-ml-auto"
            >
            {t('booking:continue')}
        </Button>         
    }

    const renderPatientInformationForm = (slideRight) => {
        if(!slideRight)
            return  (<>
                <CustomCollapseListItemButton isOpen={true} title={
                    <div className="ou-flex ou-items-center">
                        <Avatar className="ou-mr-3">
                            <StethoscopeIcon size={20}/>
                        </Avatar>
                        <div className="ou-flex ou-flex-col">
                            <div className="ou-flex ou-items-center ou-gap-2">
                                <span className="ou-font-bold ou-text-blue-700">
                                    {doctor?.user_display?.first_name} {doctor?.user_display?.last_name}
                                </span>
                                <Tooltip title={t('booking:viewDoctorDetail')}>
                                    <span
                                        onClick={e => {
                                            e.stopPropagation();
                                            handleOpenModal();
                                        }}
                                        className="ou-cursor-pointer ou-text-blue-700 ou-pb-1"
                                    >
                                        <InfoOutlinedIcon fontSize="small" />
                                    </span>
                                </Tooltip>
                            </div>
                            <SpecializationTag specialization={doctor?.specializations}/>
                        </div>
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
                        <form onSubmit={methods.handleSubmit(handleBookingSubmit)} className="ou-m-auto ou-px-5"> 
                            {/* Patient Form required */}
                            {renderPatientInformationForm(slideRight)}
                            {/* Area button */}
                            <Grid item className="!ou-my-3 ou-flex ou-justify-end">
                                {!slideRight ?  disableButton() : 
                                    <Box className="ou-flex ou-justify-end ou-mb-3 ou-w-full">
                                            <Button variant="contained" 
                                                color="primary" 
                                                type="button" 
                                                onClick={handleSlideChange}
                                                className="ou-py-2 ou-px-10 !ou-mr-2"
                                                >
                                                {t('booking:goBack')}
                                            </Button> 
                                            <Button variant="contained" 
                                                color="success" 
                                                type="submit" 
                                                className="ou-py-2 ou-px-10"
                                                >
                                            {t('submit')}
                                        </Button>
                                    </Box>
                                }
                            </Grid>

                        </form>
                    </div>
                </Box>
            </Container>

            {/* Doctor Detail Modal */}
            {isOpen && (
                <DoctorDetailModal 
                    open={isOpen} 
                    onClose={handleCloseModal} 
                    doctor={doctor}
                />
            )}

            {/* Address Update Modal */}
            {isAddressModalOpen && (
                <div className={`ou-fixed ou-inset-0 ou-bg-black ou-bg-opacity-50 ou-flex ou-items-center ou-justify-center ou-z-50 ${isAddressModalOpen ? 'ou-block' : 'ou-hidden'}`}>
                    <div className="ou-bg-white ou-rounded-lg ou-shadow-lg ou-max-w-2xl ou-w-full ou-mx-4 ou-max-h-[90vh] ou-overflow-y-auto">
                        <div className="ou-p-6">
                            <div className="ou-flex ou-justify-between ou-items-center ou-mb-4">
                                <h2 className="ou-text-xl ou-text-gray-800">
                                    {t('register:updateAddressInfo')}
                                </h2>
                                <button 
                                    onClick={handleCloseAddressModal}
                                    className="ou-text-gray-500 hover:ou-text-gray-700 ou-text-2xl"
                                >
                                    <CloseIcon />
                                </button>
                            </div>
                            
                            <div className="ou-mb-4">
                                <p className="ou-text-gray-600 ou-text-sm">
                                    {t('booking:addressRequiredForBooking')}
                                </p>
                            </div>
                            
                            <UpdateAddressInfo onSubmit={handleAddressSubmit}/>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

const SpecializationTag = ({specialization}) => {
    const {t} = useTranslation(['booking'])
    if(!specialization)
        return <></>
    return (
        <div className="ou-flex ou-flex-wrap ou-gap-2 ou-mt-1">
            {specialization.map((s, index) =>  
                <span key={`sp_tags`+index} className="ou-bg-blue-50 ou-text-blue-700 ou-px-2 ou-py-1 ou-rounded ou-text-xs
                ou-shadow-sm">{s.name}</span>
            )}
        </div>
    )
}

const DoctorDetailModal = ({ open, onClose, doctor }) => {
    const { t } = useTranslation(['booking', 'common']);

    return (
        <div className={`ou-fixed ou-inset-0 ou-bg-black ou-bg-opacity-50 ou-flex ou-items-center ou-justify-center ou-z-50 ${open ? 'ou-block' : 'ou-hidden'}`}>
            <div className="ou-bg-white ou-rounded-lg ou-shadow-lg ou-max-w-lg ou-w-full ou-mx-4 ou-max-h-[90vh] ou-overflow-y-auto">
                <div className="ou-p-6">
                    <div className="ou-flex ou-justify-between ou-items-center ou-mb-4">
                        <h2 className="ou-text-xl ou-text-gray-800">
                            {t('booking:doctorInfo')}
                        </h2>
                        <button 
                            onClick={onClose}
                            className="ou-text-gray-500 hover:ou-text-gray-700 ou-text-2xl"
                        >
                            ×
                        </button>
                    </div>
                    
                    <div className="ou-flex ou-items-center ou-mb-4">
                        <Avatar className="ou-mr-4 ou-w-16 ou-h-16">
                            <StethoscopeIcon size={32}/>
                        </Avatar>
                        <div>
                            <h3 className="ou-text-lg ou-font-semibold ou-text-blue-700">
                                {t('Dr')} {doctor?.user_display?.first_name} {doctor?.user_display?.last_name}
                            </h3>
                            <p className="ou-text-gray-600">{doctor?.user_display?.email}</p>
                        </div>
                    </div>

                    {doctor?.specializations && doctor.specializations.length > 0 && (
                        <div className="ou-mb-4">
                            <h4 className="ou-text-gray-800 ou-mb-2">{t('booking:specializations')}</h4>
                            <div className="ou-flex ou-flex-wrap ou-gap-2">
                                {doctor.specializations.map((spec, index) => (
                                    <span key={index} className="ou-bg-blue-50 ou-text-blue-700 ou-px-3 ou-py-1 ou-rounded ou-text-sm">
                                        {spec.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {doctor?.description && (
                        <div className="ou-mb-4">
                            <h4 className="ou-text-gray-800 ou-mb-2">{t('booking:description')}</h4>
                            <p className="ou-text-gray-600 ou-text-sm">{doctor.description}</p>
                        </div>
                    )}

                    <div className="ou-flex ou-justify-end ou-gap-2">
                        <Button 
                            variant="outlined" 
                            onClick={onClose}
                            className="ou-px-4"
                        >
                            {t('common:close')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingForm