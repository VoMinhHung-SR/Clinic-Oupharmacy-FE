import { useContext, useEffect, useState } from "react"
import { fetchCheckWeeklySchedule, fetchCreateDoctorScheduleByWeek, fetchUpdateDoctorSchedule } from "../services"
import { useTranslation } from "react-i18next"
import { ConfirmAlert } from "../../../../config/sweetAlert2"
import { useSearchParams } from "react-router-dom"
import moment from "moment"
import UserContext from "../../../../lib/context/UserContext"
import { TOAST_SUCCESS } from "../../../../lib/constants"
import createToastMessage from "../../../../lib/utils/createToastMessage"

const useDoctorSchedule = () => {

    const {t} = useTranslation(['modal', 'doctor-schedule']);

    const {user} = useContext(UserContext);
    const [selectedYear] = useState(new Date().getFullYear());
    const [selectedWeek, setSelectedWeek] = useState(moment().isoWeek());
    const [isLoading, setIsLoading] = useState(false);
    const [flag, setFlag] = useState(false);
    const [existSchedule, setExistSchedule] = useState([]);

    const [q] = useSearchParams();

    useEffect(() => {
        const checkWeeklySchedule = async () => {
            try{
                setIsLoading(true);
                let query = q.toString();
                    
                let querySample = query 
                    ? `${query}&week=${selectedYear}-W${selectedWeek.toString().padStart(2, '0')}`
                    : `week=${selectedYear}-W${selectedWeek.toString().padStart(2, '0')}`;
                
                const res = await fetchCheckWeeklySchedule(querySample)
                if(res.status === 200){
                    setExistSchedule(res.data);
                }
            }catch(err){
                console.log(err)
            }finally {
                setIsLoading(false);
            }
        }
        checkWeeklySchedule();
    }, [selectedWeek, flag])

    const onSubmit = (data) => {
        const handleOnSubmit = async () => {
            try{
                setIsLoading(true);

                const existingSchedule = existSchedule[user.email];
                const weekStr = `week=${selectedYear}-W${selectedWeek.toString().padStart(2, '0')}`;
                let res;
                if (existingSchedule) {
                    res = await fetchUpdateDoctorSchedule(data, weekStr);
                } else {
                    res = await fetchCreateDoctorScheduleByWeek(data);
                }

                if(res.status === 200 || res.status === 201){
                    createToastMessage({type: TOAST_SUCCESS, message: existingSchedule 
                        ? t('modal:updateSuccess') 
                        : t('modal:createSuccess')})
                    setFlag(prev => !prev)
                }
            }catch (err) {
                console.log(err)
            } finally {
                setIsLoading(false);
            }
        }

        return ConfirmAlert(
            existSchedule[user.email]
                ? t('doctor-schedule:confirmUpdateSchedule')
                : t('doctor-schedule:confirmCreateSchedule'),
            t('modal:noThrowBack'), 
            t('modal:ok'),
            t('modal:cancel'), 
            () => {
                handleOnSubmit();
            }, 
            () => {}
        );
    }

    return{
        onSubmit, setSelectedWeek, existSchedule,
        selectedWeek, selectedYear, isLoading
    }
}
export default useDoctorSchedule