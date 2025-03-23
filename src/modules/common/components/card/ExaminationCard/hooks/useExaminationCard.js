import { doc, serverTimestamp, setDoc } from "firebase/firestore"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { db } from "../../../../../../config/firebase"
import SuccessfulAlert, { ConfirmAlert, ErrorAlert } from "../../../../../../config/sweetAlert2"
import { APP_ENV, STATUS_BOOKING_CONFIRMED, TOAST_SUCCESS } from "../../../../../../lib/constants"
import { fetchSendEmailConfirmExamination } from "../services"
import createToastMessage from "../../../../../../lib/utils/createToastMessage"

const useExaminationCard = () =>{
    const {t} = useTranslation(['examinations','modal'])
    
    // const [flag, setFlag] = useState(false)
    const [isLoadingButton, setIsLoadingButton] = useState(false)
    const [isBackdropLoading, setIsBackDropLoading] = useState(false)
    const handleSendEmailConfirm = (userID, examinationID, avatar, callback)=>{
        const sendEmail = async ()=>{
            try{
                const res = await fetchSendEmailConfirmExamination(examinationID)
                if (res.status === 200){
                    callback()
                    createNotificationRealtime(userID, examinationID, avatar)
                    createToastMessage({message:t('sendMailSuccessed'),type:TOAST_SUCCESS})
                }else 
                    if (res.status === 400){ 
                        callback()
                        ErrorAlert(t('modal:errSomethingWentWrong'),t('modal:pleaseTryAgain'), t('modal:ok'))
                    } 
            }catch(err){
                createToastMessage({message:t('modal:updateFailed'),type:TOAST_ERROR})
            }finally{
                setIsLoadingButton(false)
                setIsBackDropLoading(false)
            }
        }
        return ConfirmAlert(t('confirmSendEmail'),t('modal:noThrowBack'),t('modal:yes'),t('modal:cancel'),
            // this is callback function when user confirmed "Yes"
            ()=>{
                setIsLoadingButton(true)
                setIsBackDropLoading(true)
                sendEmail()
        },()=>{return;})
    }

    const createNotificationRealtime  = async (userID, examinationID, avatar) => {
        try{
            await setDoc(doc(db,`${APP_ENV}_notifications`, examinationID.toString()),{
                "is_commit": false,
                "is_active": true,
                "booking_id": examinationID,
                'content': STATUS_BOOKING_CONFIRMED,
                "recipient_id": userID,
                "avatar": avatar,
                "sent_at" : serverTimestamp()
            },{merge:true})
        }catch(err){
            console.log(err)
        }
    }
    return{
        isLoadingButton, isBackdropLoading,
        handleSendEmailConfirm
    }
}
export default useExaminationCard