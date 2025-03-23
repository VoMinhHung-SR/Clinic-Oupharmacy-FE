import { useTranslation } from "react-i18next"
import { fetchCreateOrUpdatePatient } from "../../modules/pages/BookingComponents/FormAddExamination/services"
import { TOAST_SUCCESS } from "../constants"
import createToastMessage from "../utils/createToastMessage"
import { useContext, useEffect, useState } from "react"
import { fetchGetPatients } from "../../modules/pages/BookingComponents/services"
import UserContext from "../context/UserContext"

const usePatient = () => {
    const {t} = useTranslation(['yup-validate', 'booking'])
    const {user} = useContext(UserContext)

    const [patientList, setPatientList] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        try{
            const getPatients = async (userID) => {
                const res = await fetchGetPatients(userID)
                if(res.status === 200){
                    setPatientList(res.data)
                }
            }

            if (user){
                setIsLoading(true)
                getPatients(user.id)
            }
        }catch (err){
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }, [user])

    const createOrUpdatePatient = async (userID, patientID, data, setError, callbackSuccess) => {
        try{
            const dataSubmit = {
                "first_name": data.firstName,
                "last_name": data.lastName,
                "phone_number": data.phoneNumber,
                "email":  data.email,
                "gender":   data.gender,
                "date_of_birth": data.dateOfBirth,
                "address": data.address,
                "user": userID
            }
            const res = await fetchCreateOrUpdatePatient(patientID,dataSubmit)
    
            if(res.status === 201 || res.status === 200){
                callbackSuccess(res.data)
                return createToastMessage({message: patientID ? t('booking:patientUpdatedSuccess') 
                    : t('booking:patientCreatedSuccess'), type: TOAST_SUCCESS})
            }
        } catch (err) {
            if (err.response && err.response.status === 400) {
                const errorData = err.response.data;
                if (errorData.email) {
                    setError("email", {
                        type: "manual",
                        message: errorData.email[0] 
                    });
                }
            } else {
                console.error("An unexpected error occurred:", err.message);
            }
        }
    }

    return{
        createOrUpdatePatient, patientList, isLoading
    }
}

export default usePatient