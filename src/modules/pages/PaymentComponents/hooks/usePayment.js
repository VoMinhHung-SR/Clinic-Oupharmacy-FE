import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import UserContext from "../../../../lib/context/UserContext"
import { fetchMomoPaymentURL, fetchPrescriptionDetailBillCard, fetchBulkPayment } from "../../../common/components/card/BillCard/services"
import { fetchPrescriptionDetail } from "../../PrescriptionDetailComponents/services"
import moment from "moment/moment"
import { useTranslation } from "react-i18next"
import { TOAST_ERROR, TOAST_SUCCESS } from "../../../../lib/constants"
import { ConfirmAlert } from "../../../../config/sweetAlert2"
import createToastMessage from "../../../../lib/utils/createToastMessage"

const usePayment = () => {
    const {user} = useContext(UserContext)
    const {prescribingId} = useParams()
    const [diagnosisInfo, setDiagnosisInfo] = useState([])
    const [prescriptionDetail, setPrescriptionDetail] = useState({})
    const [loadingStates, setLoadingStates] = useState(true)
    const [flag, setFlag] = useState(false)
    const [isLoadingButton, setIsLoadingButton] = useState(false)

    const {t} = useTranslation(['payment','modal'])
    useEffect(() => {

        const loadDiagnosisInfo = async () => {
            const res = await fetchPrescriptionDetail(prescribingId)
            if (res.status === 200) {
                setDiagnosisInfo(res.data)
                
                if(res.data.prescribing_info.length > 0){
                    res.data.prescribing_info.forEach(prescribing => {
                        loadPrescriptionDetail(prescribing.id)
                    })
                }
            }
        }
        
        const loadPrescriptionDetail = async (prescribingId) => {
            try {
                const res = await fetchPrescriptionDetailBillCard(prescribingId)
                if (res.status === 200) {
                    setPrescriptionDetail(prev => {
                        const date = moment(res.data.created_date).format("YYYY-MM-DD");
                        return {
                            ...prev,
                            [date]: {
                                ...prev[date],
                                [prescribingId]: {
                                    ...res.data,
                                }
                            }
                        }
                    })
                }
            } catch (err) {
                console.error(`Error loading prescribing for diagnosis :`, err)
                setPrescriptionDetail(prev => ({
                    ...prev,
                    [prescribingId]: []
                }))
            } finally {
                setLoadingStates(false)
            }
        }

        if (user && prescribingId) {
            loadDiagnosisInfo()
        }
    }, [user, prescribingId, flag])

    const handlePayment = ({onSuccess, onError, momoWallet = false}) => {
        const diagnosisID = diagnosisInfo.id
        const onSubmit = async () => {
            try{  
                const response = await fetchBulkPayment({diagnosisID: diagnosisID})
                
                if (response.status === 201) {
                    setFlag(prev => !prev)
                    onSuccess && onSuccess()
                    createToastMessage({type: TOAST_SUCCESS, message: t('payment:paidCompleted')})
                } else {
                    onError && onError()
                    createToastMessage({type: TOAST_ERROR, message: t('payment:payFailed')})
                }
            }catch(err){
                onError && onError()
                createToastMessage({type: TOAST_ERROR, message: t('payment:payFailed')})
            }finally{
                setIsLoadingButton(false)
            }
        }
        const momoPayment = async () => {
            try{
                const res = await fetchMomoPaymentURL({diagnosisID: diagnosisID})
                if (res.status === 200) {
                    window.location.replace(res.data.payUrl);
                }
            }catch(err){
                createToastMessage({type: TOAST_ERROR, message: t('payment:payFailed')})
            }
        }
        return ConfirmAlert(t('payment:confirmCreateBill'),
            t('modal:noThrowBack'),t('modal:yes'),t('modal:cancel'),
        ()=>{
            setIsLoadingButton(true)
            if(momoWallet){
                momoPayment()
            }else {
                onSubmit()
            }
        }, () => { return; })
    }

    return {
        prescriptionDetail,
        isLoadingPrescriptionDetail: loadingStates,
        diagnosisInfo,
        handlePayment,
        isLoadingButton,
    }
}

export default usePayment