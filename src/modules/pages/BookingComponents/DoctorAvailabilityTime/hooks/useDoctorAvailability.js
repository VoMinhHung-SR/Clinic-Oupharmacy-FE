import { useEffect, useState } from "react"
import { fetchCreateTimeSlot, fetchGetDoctorAvailability } from "../../services";
import useDebounce from "../../../../../lib/hooks/useDebounce";
import moment from "moment";
import { fetchCreateExamination, fetchCreateOrUpdatePatient, fetchExamDateData } from "../../FormAddExamination/services";
import { TOAST_SUCCESS } from "../../../../../lib/constants";
import { useTranslation } from "react-i18next";
import { ConfirmAlert, ErrorAlert } from "../../../../../config/sweetAlert2";
import createToastMessage from "../../../../../lib/utils/createToastMessage";

const useDoctorAvailability = () => {
    const {t} = useTranslation(['yup-validate','modal', 'booking']);
    const [timeNotAvailable, setTimeNotAvailable] = useState([])

    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [doctorID, setDoctorID] = useState(null);
    const [flag, setFlag] = useState(false)

    const debouncedValue = useDebounce(date,500)
    const debouncedValueDoctor = useDebounce(doctorID, 500)

    const [isLoading, setIsLoading] = useState(false)

    const [examinationDateData, setExaminationDateData] = useState([]);
    const [slideRight, setSlideRight] = useState(false)    


    const handleSlideChange= () => setSlideRight(!slideRight);

    const handleTimeChange = (date, time) => {

        const timeFormatted = new Date(time);
        
        const selectedDate = moment(date).format('YYYY-MM-DD');
        const selectedTime = moment(timeFormatted).format('HH:mm:ss');

        return new Date(`${selectedDate}T${selectedTime}`)
    };


    const shouldDisableTime = (time) => {
        const selectedDate = moment(debouncedValue).format('YYYY-MM-DD');
        const disabledTimesFromData = examinationDateData
            .filter((e) => e.created_date.includes(selectedDate))
            .map((e) => moment(e.created_date).format('HH:mm:ss'));

        const isDisabledRange = (time.hour() >= 0 && time.hour() < 7) || (time.hour() > 17 && time.hour() <= 23);

        return (
            disabledTimesFromData.includes(time.format('HH:mm:ss')) || isDisabledRange
        );
    };

    const handleChangeFlag = () => setFlag(!flag);

    useEffect(()=> {
        const getExaminationDateData = async (date) => {
            try {
              const res = await fetchExamDateData(date);
              if (res.status === 200) {
                setExaminationDateData(res.data.examinations);
              }
            } catch (error) {
              console.error(error);
            }finally {
              setIsLoading(false)
            }
          };

        const getDoctorAvailability = async (date, doctor) => {
            try{
                const res = await fetchGetDoctorAvailability(date, parseInt(doctor))
                if (res.status === 200){
                    setTimeNotAvailable(res.data)
                }
            } catch( err){
                console.log(err)
            }finally {
                setIsLoading(false)
              }
        }
        if(debouncedValueDoctor && debouncedValue){
            setIsLoading(true)
            getDoctorAvailability(debouncedValue, debouncedValueDoctor)
        }
        if (debouncedValue) {
            setIsLoading(true)
            getExaminationDateData(debouncedValue);
        }
    },[debouncedValue, debouncedValueDoctor, flag])



    
    const onSubmit = async (data, patientData ,callbackSuccess, callbackFail) => {
        if(data === undefined)
            return ErrorAlert(t('modal:errSomethingWentWrong'), t('modal:pleaseTryAgain'), t('modal:ok'));
        
        if(!patientData)
            return ErrorAlert(t('modal:errSomethingWentWrong'), t('modal:pleaseTryAgain'), t('modal:ok'));
            

        const createDoctorWorkingTime = async () => {
            try{
                const { start, end, scheduleID } = data.selectedTime;
                const requestData = {
                    schedule: parseInt(scheduleID),
                    start_time: start,
                    end_time: end
                };
                
                const res = await fetchCreateTimeSlot(requestData)
                
                if(res.status === 201){
                    handleOnSubmit(res.data.id)
                }
            }catch(err){
                console.log(err)
            }

        }

        const handleOnSubmit = async (timeSlot) => {
            // Update done or created patient info
            const res = await fetchCreateOrUpdatePatient(patientData.id, patientData);
         
            if(res.status === 200 || res.status === 201){
                const examinationData = {
                    patient: res.data.id,
                    description: data.description,
                    created_date: new Date(data.selectedDate),
                    time_slot: timeSlot
                }
                const resExamination = await fetchCreateExamination(examinationData);
                if(resExamination.status === 201){
                    createToastMessage({message:t('modal:createSuccess'), type:TOAST_SUCCESS})
                    callbackSuccess();
                    setSlideRight(false);
                    handleChangeFlag();
                }
                else{
                    return ErrorAlert(t('modal:errSomethingWentWrong'), t('modal:pleaseTryAgain'), t('modal:ok'));
                }
                if(resExamination.status === 500){
                    return ErrorAlert(t('modal:errSomethingWentWrong'), t('modal:pleaseTryAgain'), t('modal:ok'));
                }
            }
            else{
                return ErrorAlert(t('modal:errSomethingWentWrong'), t('modal:pleaseTryAgain'), t('modal:ok'));
            }
        }
        
        return ConfirmAlert(t('booking:confirmBooking'),t('modal:noThrowBack'),t('modal:yes'),t('modal:cancel'),
        ()=>{
            createDoctorWorkingTime()
        }, () => { return; })
    }


    return {
        setDoctorID, doctorID, timeNotAvailable, onSubmit,
        isLoading, setDate, date, handleTimeChange,
        setTime, time, shouldDisableTime,
        slideRight, handleSlideChange
    }
}

export default useDoctorAvailability