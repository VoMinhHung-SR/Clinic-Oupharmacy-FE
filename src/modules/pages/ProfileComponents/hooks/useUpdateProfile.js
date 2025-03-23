import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { REGEX_EMAIL, REGEX_NAME, REGEX_PHONE_NUMBER, TOAST_ERROR, TOAST_SUCCESS } from '../../../../lib/constants';
import createToastMessage from '../../../../lib/utils/createToastMessage';
import { useContext, useEffect, useState } from 'react';
import SuccessfulAlert, { ConfirmAlert } from '../../../../config/sweetAlert2';
import { useNavigate } from 'react-router';
import { updateProfile } from '../services';
import Cookies from 'js-cookie';
import { userContext } from '../../../../App';
import UserContext from '../../../../lib/context/UserContext';

const useUpdateProfile = () =>{
    const {t} = useTranslation(['yup-validate','modal'])
    const [openBackdrop, setOpenBackdrop] = useState(false);
    // const [user, dispatch] = useContext(userContext);
    const {user, dispatch , updateUser} = useContext(UserContext)
    const router = useNavigate('');


    const updateSchema = Yup.object().shape({
        firstName: Yup.string().trim()
            .required(t('yupFirstNameRequired'))
            .max(254, t('yupFirstNameMaxLength'))
            .matches(REGEX_NAME, t('yupFirstNameInvalid')),
        lastName: Yup.string().trim()
            .required((t('yupLastNameRequired')))
            .max(254,  t('yupLastNameMaxLength'))
            .matches(REGEX_NAME, t('yupLastNameInvalid')),
        email: Yup.string().trim()
            .required(t('yupEmailRequired'))
            .max(254, t('yupEmailMaxLength'))
            .matches(REGEX_EMAIL, t('yupEmailInvalid')),
        dob:  Yup.string().trim()
        .required(t('yupDOBRequired')), 
        phoneNumber: Yup.string().trim()
            .required(t('yupPhoneNumberRequired'))
            .matches(REGEX_PHONE_NUMBER, t('yupPhoneNumberInvalid')),
        
    });
    const onSubmit = (data, setError, userID, callBack) => {

        
 
        const handleUpdate = async (userID) => {
            try {
                let formData = new FormData()
                formData.append("first_name", data.firstName)
                formData.append("last_name", data.lastName)
                formData.append("email", data.email)
                formData.append("phone_number", data.phoneNumber)
                formData.append("date_of_birth", new Date(data.dob).toISOString())
                formData.append("gender", parseInt(data.gender))
              
                const res = await updateProfile(userID, formData)
               
                if (res.status === 200) {
                    updateUser(res.data)
                    createToastMessage({type:TOAST_SUCCESS, message:t("modal:updateSuccess")})
                    callBack()
                }
            } catch (err) {
                if (err.response) {
                    const data = err.response.data;
                    setOpenBackdrop(false)
                    if (data.email)
                        setError("email", {
                            type: "custom",
                            message: t('yupEmailExist'),
                        });
                    if (data.phone_number)
                        setError("phoneNumber", {
                            type: "custom",
                            message: t('yupPhoneNumberExist')
                        });
                    
                    createToastMessage({type:TOAST_ERROR, message:t("modal:updateFailed")})
                } 
                console.log(err)
            }

           
        }
        return ConfirmAlert(t('register:confirmToUpdateInformation'), "", t("modal:ok"),t("modal:cancel"), ()=>{
            setOpenBackdrop(true)
            handleUpdate(userID)
        }, ()=> {})
    }
    return {
        onSubmit, updateSchema
    }
}
export default useUpdateProfile