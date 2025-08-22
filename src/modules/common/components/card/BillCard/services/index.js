import { authApi, endpoints } from "../../../../../../config/APIs"

// To: get all of medicine unit in the prescribing sheet
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
export const fetchMomoPaymentURL = async ({diagnosisID}) => {
    const res = await authApi().post(endpoints['momoPayUrl'],{
        diagnosisID: diagnosisID
    })
    return res;
}

export const fetcZaloPayPaymentURL = async ({totalAmount, diagnosisID}) => {
    const res = await authApi().post(endpoints['zaloPayUrl'],{
        totalAmount: totalAmount,
        diagnosisID: diagnosisID
    })
    return res;
}

// To: create bills for multiple prescribing of a diagnosis
export const fetchBulkPayment = async ({diagnosisID}) => {
    const res = await authApi().post(endpoints['bulkPayment'],{
        diagnosisID: diagnosisID
    })
    return res;
}