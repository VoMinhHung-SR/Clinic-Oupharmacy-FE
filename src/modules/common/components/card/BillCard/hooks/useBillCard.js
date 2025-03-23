import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import SuccessfulAlert, { ConfirmAlert, ErrorAlert } from "../../../../../../config/sweetAlert2"
import { fetchReceipt } from "../../../../../pages/PaymentComponents/services"
import { fetchAddBill, fetchMomoPaymentURL, fetchPrescriptionDetailBillCard, fetcZaloPayPaymentURL } from "../services"

const useBillCard = (prescribingID) => {
    const {t} = useTranslation(['payment','modal'])
    const [isLoadingPrescriptionDetail, setIsLoadingPrescriptionDetail] = useState(true)
    const [prescriptionDetail, setPrescriptionDetail] = useState([])
    const [receipt, setReceipt] = useState(false)
    const [flag, setFlag] = useState(false)
    const [isLoadingButton, setIsLoadingButton] = useState(false)
     
    const handleChangeFlag = () => {
        setFlag(!flag)
    }

    useEffect(()=>{
        const loadPrescriptionDetail = async () =>{
            try{
                const res = await fetchPrescriptionDetailBillCard(prescribingID)
                if (res.status === 200){
                    setIsLoadingPrescriptionDetail(false)
                    setPrescriptionDetail(res.data)
                }
            }catch(err){
                setIsLoadingPrescriptionDetail(false)
                setPrescriptionDetail([])
            }
        }
        const loadReceipt = async () => {
            try {
                const res = await fetchReceipt(prescribingID)
                if (res.status === 200) {
                    setReceipt(true)
                    console.log(res.data)
                }
            } catch (err) {
                if(err.status === 500)
                    setReceipt(false)
            }
        }
        if(prescribingID){
            loadPrescriptionDetail()
            loadReceipt()
        }
    },[flag, prescribingID])
    const onSubmit = (amount, prescribingID) => {
        const handleOnSubmit = async () => {
            try {
                const res = await fetchAddBill({amount: amount, prescribing: prescribingID})
                if (res.status === 201) {
                    handleChangeFlag();
                    setIsLoadingButton(false)
                    return SuccessfulAlert(t('paidCompleted'), t('modal:ok'))                 
                }
            } catch (err) {
                setIsLoadingButton(false)
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
        prescriptionDetail,isLoadingPrescriptionDetail,
        onSubmit, isLoadingButton, momoPayment, receipt,zaloPayPayment
    }

}
export default useBillCard