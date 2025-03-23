import { useContext, useEffect, useReducer, useState } from "react";
import { fetchGetPatients, fetchPatientExist } from "../services";
import * as Yup from 'yup';
import { useTranslation } from "react-i18next";
import { REGEX_EMAIL } from "../../../../lib/constants";
import UserContext from "../../../../lib/context/UserContext";

const useBooking = () => {
    const {t} = useTranslation('yup-validate')
    const {user} = useContext(UserContext)

    const [formEmail, setFormEmail] = useState('');
    const [patientID, setPatientID] = useState(-1);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [isFormEmailOpen, setIsFormEmailOpen] = useState(true)
    const [checkPatientExist, setCheckPatientExist] = useState(false);

    const [patientList, setPatientList] = useState([])
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

    // Called when form dont have errors
    const handleOpenFormEmail = () =>{
        setIsFormEmailOpen(true)
    }
    const checkPatientExistSchema = Yup.object().shape({
        email: Yup.string()
            .required(t('yupEmailRequired'))
            .max(254, t('yupEmailMaxLength'))
            .matches(REGEX_EMAIL, t('yupEmailInvalid'))
            .trim()
    });

    const checkEmail = async (email) => {
        setFormEmail(email)
        setOpenBackdrop(true);
        const res = await fetchPatientExist(email);
        // handle when user onSubmit > 2 times
        if(res.status === 200){
            setCheckPatientExist(true);
            setPatientID(res.data.id);
        }
        // handled in services
        if (res === -1){
            setPatientID(-1);
            setCheckPatientExist(false);
        }

        setOpenBackdrop(false);
        setIsFormEmailOpen(false);
    }

    return {
        patientID, patientList,
        isFormEmailOpen,
        setIsFormEmailOpen,
        handleOpenFormEmail,
        checkEmail,
        isLoading,
        openBackdrop,
        checkPatientExist,
        formEmail,
        setCheckPatientExist,
        checkPatientExistSchema
    }
}

export default useBooking