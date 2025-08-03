import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import SuccessfulAlert, { ConfirmAlert, ErrorAlert } from "../../../../../../config/sweetAlert2"
import { fetchAddBill, fetchMomoPaymentURL, fetchPrescriptionDetailBillCard, fetcZaloPayPaymentURL } from "../services"

const useBillCard = (prescribingID) => {
    const {t} = useTranslation(['payment','modal'])
    const [isLoading, setIsLoading] = useState(true)
    const [prescriptionDetail, setPrescriptionDetail] = useState([])
    const [isLoadingButton, setIsLoadingButton] = useState(false)
     
    useEffect(() => {
        const loadPrescriptionDetail = async () => {
            setIsLoading(true)
            try {
                const res = await fetchPrescriptionDetailBillCard(prescribingID)
                if (res.status === 200) {
                    setPrescriptionDetail(res.data)
                }
            } catch (err) {
                setPrescriptionDetail([])
            } finally {
                setIsLoading(false)
            }
        }
     
        if (prescribingID) {
            loadPrescriptionDetail()
        }
    }, [prescribingID])
    
    const onSubmit = (amount, prescribingID, callbackSuccess, callbackError) => {
        const handleOnSubmit = async () => {
            try {
                const res = await fetchAddBill({amount: amount, prescribing: prescribingID})
                if (res.status === 201) {
                    setIsLoadingButton(false)
                    callbackSuccess && callbackSuccess()
                    const updatedRes = await fetchPrescriptionDetailBillCard(prescribingID)
                    if (updatedRes.status === 200) {
                        setPrescriptionDetail(updatedRes.data)
                    }
                    return SuccessfulAlert({title: t('paidCompleted'), confirmButtonText: t('modal:ok')});                 
                }
            } catch (err) {
                setIsLoadingButton(false)
                callbackError && callbackError()
                return ErrorAlert(t('payFailed'), t('modal:errSomethingWentWrong'), t('modal:ok'))
            }
        }
        return ConfirmAlert(t('confirmCreateBill'),t('modal:noThrowBack'),t('modal:yes'),t('modal:cancel'),
        // this is callback function when user confirmed "Yes"
        ()=>{
            setIsLoadingButton(true)
            handleOnSubmit()
        }, () => { return; })
    }

    const momoPayment = (amount, prescribingID) =>{
        const addBill = async () => {
            try {
                const res = await fetchMomoPaymentURL({amount: amount, prescribing: prescribingID})
                if (res.status === 200) {
        
                    window.location.replace(res.data.payUrl);
                }
            } catch (err) {
                ErrorAlert(t('modal:createFailed'), t('modal:errSomethingWentWrong'), t('modal:ok'))
            }
        }
        return ConfirmAlert(t('confirmCreateBill'),t('modal:noThrowBack'),t('modal:yes'),t('modal:cancel'),
        // this is callback function when user confirmed "Yes"
        ()=>{
            addBill()
        }, () => { return; })
    }

    const zaloPayPayment = (amount, prescribingID) =>{
        const addBill = async () => {
            try {
                const res = await fetcZaloPayPaymentURL({amount: amount, prescribing: prescribingID})
                if (res.status === 200) {
                    window.location.replace(res.data.order_url);
                }
            } catch (err) {
                ErrorAlert(t('modal:createFailed'), t('modal:errSomethingWentWrong'), t('modal:ok'))
            }
        }
        return ConfirmAlert(t('confirmCreateBill'),t('modal:noThrowBack'),t('modal:yes'),t('modal:cancel'),
        // this is callback function when user confirmed "Yes"
        ()=>{
            addBill()
        }, () => { return; })
    }


    return {
        prescriptionDetail,
        isLoading,
        onSubmit, 
        isLoadingButton, 
        momoPayment,
        zaloPayPayment
    }

}
export default useBillCard