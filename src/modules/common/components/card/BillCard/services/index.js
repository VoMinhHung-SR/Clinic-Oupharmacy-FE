import { authApi, endpoints } from "../../../../../../config/APIs"

// To: get all of medicine unit in the prescbing sheet
export const fetchPrescriptionDetailBillCard = async (prescribingID) => {
    const res = await authApi().get(endpoints['get-prescription-detail'](prescribingID))
    return res;
}

// To: create a bill with cash payment methods
export const fetchAddBill = async (prescriptionData) => {
    const res = await authApi().post(endpoints['bill'], {
        amount: prescriptionData.amount,
        prescribing: prescriptionData.prescribing
    })
    return res;
}

// To: create a bill with momo payment methods
export const fetchMomoPaymentURL = async (prescriptionData) => {
    const res = await authApi().post(endpoints['momoPayUrl'],{
        amount: prescriptionData.amount,
        prescribing: prescriptionData.prescribing
    })
    return res;
}

export const fetcZaloPayPaymentURL = async (prescriptionData) => {
    const res = await authApi().post(endpoints['zaloPayUrl'],{
        amount: prescriptionData.amount,
        prescribing: prescriptionData.prescribing
    })
    return res;
}