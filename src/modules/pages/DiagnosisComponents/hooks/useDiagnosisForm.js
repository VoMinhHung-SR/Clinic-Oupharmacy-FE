import { useState } from "react";
import { useTranslation } from "react-i18next";
import SuccessfulAlert, { ConfirmAlert, ErrorAlert } from "../../../../config/sweetAlert2";
import { fetchCreateDiagnosis } from "../services";
import * as Yup from "yup";
import { REGEX_NOTE } from "../../../../lib/constants";
const useDiagnosisForm = () => {
    const {t} = useTranslation(['yup-validate', 'diagnosis', 'modal'])
    const [isLoadingButton, setIsLoadingButton] = useState(false)

    const diagnosisSchema = Yup.object().shape({
        sign: Yup.string().trim()
            .required(t('yupSignRequired'))
            .max(254,t('yupSignMaxLength'))
            .matches(REGEX_NOTE, t('yupSignInvalid')),
        diagnosed: Yup.string().trim()
            .required(t('yupDiagnosedRequired'))
            .max(254, t('yupDiagnosedMaxLength'))
            .matches(REGEX_NOTE, t('yupDiagnosedInvalid')),
    
    });

    const onSubmit = (data, examinationID, userID, patientId ,callback) =>{
        const handleOnSubmit = async () => {
            try{
                const prescriptionData = {
                    sign: data.sign,
                    diagnosed: data.diagnosed,
                    examination: parseInt(examinationID),
                    user: userID,
                    patient: patientId
                }
                const res = await fetchCreateDiagnosis(prescriptionData)
                if (res.status === 201){
                    callback()
                    SuccessfulAlert({title: t('modal:createSuccess'), confirmButtonText: t("modal:ok")})
                }
            }catch(err){
                ErrorAlert(t('modal:createFailed'), t('modal:pleaseDoubleCheck'), t("modal:ok"))
            }
            setIsLoadingButton(false)
        }
        return ConfirmAlert(t('diagnosis:confirmCreateDiagnosis'),t('modal:noThrowBack'), 
        t("modal:yes"),t("modal:cancel"),
        // this is callback function when user confirmed "Yes"
        ()=>{
            setIsLoadingButton(true)
            handleOnSubmit()
        }, ()=> {return;})

    }
    return {
        isLoadingButton,
        onSubmit,
        diagnosisSchema
    }
}
export default useDiagnosisForm