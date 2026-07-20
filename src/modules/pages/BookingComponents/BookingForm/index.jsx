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
import { useContext, useEffect, useMemo } from "react"
import CustomCollapseListItemButton from "../../../common/components/collapse/ListItemButton"
import BookingContext from "../../../../lib/context/BookingContext"
import StethoscopeIcon from "../../../../lib/icon/StethoscopeIcon"
import SchemaModels from "../../../../lib/schema"
import useCustomModal from "../../../../lib/hooks/useCustomModal"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import {
    countAvailableBookingSlots,
    hasSelectedBookingTime,
} from "../bookingSlotUtils"

const BookingForm = ({doctorInfo}) => {
    const {t , tReady} = useTranslation(['booking', 'yup-validate', 'modal', 'home', 'common'])

    const doctor = doctorInfo;
    const {patientSelected, actionUpState} = useContext(BookingContext)
    const {timeNotAvailable, isLoading, setDate,
        setDoctorID, onSubmit} = useDoctorAvailability();
    
    const { timeSlotSchema } = SchemaModels()
    const { handleCloseModal, handleOpenModal, isOpen } = useCustomModal();

    useEffect(()=>{setDoctorID(doctor.user_display.id)},[doctor.user_display.id])

    const methods = useForm({
        mode:"onChange", 
        resolver: yupResolver(timeSlotSchema),
        defaultValues:{
            description:"",
            selectedDate:"",
            selectedTime: {},
            doctor: doctor.user_display.id ? doctor.user_display.id : "",
        }
    })

    const selectedDate = methods.watch("selectedDate")
    const selectedTime = methods.watch("selectedTime")
    const availableSlotCount = useMemo(
        () => countAvailableBookingSlots(timeNotAvailable),
        [timeNotAvailable]
    )
    const canSubmit =
        Boolean(selectedDate) &&
        hasSelectedBookingTime(selectedTime) &&
        availableSlotCount > 0 &&
        !isLoading

    const handleDateChange = (event) => {
        const nextDate = event.target.value;
        const minDate = moment(CURRENT_DATE).add(0, 'days').format('YYYY-MM-DD');
        const maxDate = moment(CURRENT_DATE).add(30, 'days').format('YYYY-MM-DD');

        if (nextDate < minDate || nextDate > maxDate) {
            return methods.setError("selectedDate", {
                type: "manual",
                message: t('yup-validate:yupCreatedDateMustBeInRange', {minDate: minDate, maxDate: maxDate})
            });
        } else {
            methods.clearErrors("selectedDate");
        }

        setDate(nextDate);
        methods.setValue("selectedDate", nextDate);
        methods.setValue("selectedTime", {});
        methods.trigger("selectedDate");
    };

    const handleBookingSubmit = (data) => {
        if (!hasSelectedBookingTime(data.selectedTime) || countAvailableBookingSlots(timeNotAvailable) === 0) {
            return methods.setError("selectedTime", {
                type: "manual",
                message: t('booking:noSlotsAvailable'),
            })
        }
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

    return (
        <>
            <Container className="!ou-py-4">
                <Box className="ou-flex ou-py-4" component={Paper} elevation={4} >           
                    <div className="ou-w-[100%]">
                        <form onSubmit={methods.handleSubmit(handleBookingSubmit)} className="ou-m-auto ou-px-5"> 
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
                                            value={selectedDate || ""}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputProps={{
                                                min: moment(CURRENT_DATE).add(0, 'days').format('YYYY-MM-DD'),
                                                max: moment(CURRENT_DATE).add(30, 'days').format('YYYY-MM-DD'),
                                            }}
                                            onChange={handleDateChange}
                                        />
                                        {methods.formState.errors?.selectedDate ? (
                                            <p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                                                {methods.formState.errors.selectedDate?.message}
                                            </p>
                                        ) : null}
                                        
                                        {(doctor && timeNotAvailable && selectedDate) && (
                                            <Grid item xs={12} className={clsx("!ou-mt-6")}>
                                             <DoctorAvailabilityTime 
                                                schedule={timeNotAvailable} 
                                                onChange={(selectedTimeData) => {
                                                    methods.setValue('selectedTime', selectedTimeData, { shouldValidate: true });
                                                    methods.clearErrors("selectedTime");
                                                }}
                                                isLoading={isLoading}
                                                defaultValue={selectedTime}
                                                />
                                            {!isLoading && availableSlotCount === 0 && (
                                                <p className="ou-text-sm ou-text-amber-700 ou-mt-3 ou-mx-[14px]">
                                                    {t('booking:noSlotsAvailable')}
                                                </p>
                                            )}
                                            {methods.formState.errors?.selectedTime?.message ? (
                                                <p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                                                    {methods.formState.errors.selectedTime.message}
                                                </p>
                                            ) : null}
                                        </Grid>)}

                                        <FormControl fullWidth className="!ou-mt-6">
                                            <InputLabel htmlFor="description">{t('booking:descriptionOptional')}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                multiline
                                                rows={2}
                                                id="description"
                                                name="description"
                                                type="text"
                                                label={t('booking:descriptionOptional')}
                                                error={Boolean(methods.formState.errors.description)}
                                                {...methods.register("description")}
                                            />
                                            {methods.formState.errors?.description ? (
                                                <p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                                                    {methods.formState.errors.description?.message}
                                                </p>
                                            ) : null}
                                        </FormControl>
                                    </Grid>
                                    </>
                                }
                            />
                            <Grid item className="!ou-my-3 ou-flex ou-justify-end">
                                <Button
                                    variant="contained"
                                    color="success"
                                    type="submit"
                                    disabled={!canSubmit}
                                    className="ou-py-2 ou-px-10"
                                >
                                    {t('submit')}
                                </Button>
                            </Grid>

                        </form>
                    </div>
                </Box>
            </Container>

            {isOpen && (
                <DoctorDetailModal 
                    open={isOpen} 
                    onClose={handleCloseModal} 
                    doctor={doctor}
                />
            )}
        </>
    )
}

const SpecializationTag = ({specialization}) => {
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
