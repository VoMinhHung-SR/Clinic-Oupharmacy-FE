import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import SuccessfulAlert, { ConfirmAlert, ErrorAlert } from '../../../../../config/sweetAlert2';
import { REGEX_ADDRESS, REGEX_EMAIL, REGEX_NAME, REGEX_NOTE, REGEX_PHONE_NUMBER, TOAST_ERROR, TOAST_SUCCESS } from '../../../../../lib/constants';
import { fetchExamDateData, fetchUpdateExamination } from '../services';
import useDebounce from '../../../../../lib/hooks/useDebounce';
import { fetchCreateTimeSlot, fetchDeleteTimeSlot, fetchGetDoctorAvailability } from '../../services';
import createToastMessage from '../../../../../lib/utils/createToastMessage';


const useFormAddExamination = () => {
    const {t} = useTranslation(['yup-validate','modal', 'booking']);

    const [openBackdrop, setOpenBackdrop] = useState(false)

    const [date, setDate] = useState('');
    const [doctor, setDoctor] = useState(null);
    const [examinations, setExaminations] = useState([]);
    const [timeNotAvailable, setTimeNotAvailable] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const formAddExaminationSchema = Yup.object().shape({
        description: Yup.string().trim()
            .required(t('yupDescriptionRequired'))
            .max(254, t('yupDescriptionMaxLength'))
            .matches(REGEX_NOTE, t('yupDescriptionInvalid')),

        doctor: Yup.string().required(t('required')),
        
        selectedTime: Yup.string()
            .required(t('yupCreatedTimeRequired')),

        selectedDate: Yup.string()
            .required(t('yupCreatedDateRequired'))
           
    });


    const debouncedValue = useDebounce(date,500)
    const debouncedValueDoctor = useDebounce(doctor, 500)

    useEffect(() => {
        const getExaminationData = async (date) => {
          try {
            const res = await fetchExamDateData(date);
            if (res.status === 200) {
              setExaminations(res.data.examinations);
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
            getExaminationData(debouncedValue);
        }
      }, [debouncedValue, debouncedValueDoctor]);

    const onUpdateSubmit = async (examinationID, patientID, data, callback, timeSlotID) => {
        if(data === undefined)
            return ErrorAlert(t('modal:errSomethingWentWrong'), t('modal:pleaseTryAgain'), t('modal:ok'));

        const deleteCurrentDoctorWorkingTime = async (timeSlotID) =>{
            try{
                const res = await fetchDeleteTimeSlot(timeSlotID)
                if(res.status === 204)
                    return createDoctorWorkingTime()
            }catch (err){
                return ErrorAlert("Da co loi xay ra",  "", "OKE")
            }
        } 

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
            setOpenBackdrop(true)     
            const examinationData = {
                patient: patientID,
                description: data.description,
                created_date: new Date(data.selectedDate),
                time_slot: timeSlot
            }
            const resExamination = await fetchUpdateExamination(examinationID, examinationData);
            if(resExamination.status === 200){
                createToastMessage({message:t('modal:updateSuccess'), type:TOAST_SUCCESS})
                callback();
            }
            else{
                setOpenBackdrop(false)
                return  createToastMessage({message:t('modal:updateFailed'), type:TOAST_ERROR})
            }
            if(resExamination.status === 500){
                setOpenBackdrop(false)
                return createToastMessage({message:t('modal:updateFailed'), type:TOAST_ERROR})
            }
            setOpenBackdrop(false)
        }
        
        if(timeSlotID){
            return deleteCurrentDoctorWorkingTime(timeSlotID)
        }
        else 
           return createDoctorWorkingTime()
    }

    return {
        openBackdrop, examinations, setDate, date, formAddExaminationSchema,
        setDoctor, doctor, timeNotAvailable, isLoading, onUpdateSubmit
        
    }
}
export default useFormAddExamination;