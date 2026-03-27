import { authApi, endpoints } from "../../../../../../config/APIs"
import { normalizeStoreVariantResponse, normalizePrescriptionDetailItem } from "../../../../../../lib/adapters/storeProduct"

// To: get arraylist medicineUnit[{medicineUnitObj},{medicineUnitObj}]
// this served for autocompled field
export const fetchMedicinesUnit = async (query) =>{
    const res = await authApi().get(`${endpoints['product-variants']}${query}`)
    if (res?.data) {
        res.data = normalizeStoreVariantResponse(res.data)
    }
    return res;
}

export const fetchCreatePrescribing = async (prescribingData) =>{
    const res = await authApi().post(endpoints['prescribing'],prescribingData)
    return res
}
export const fetchAddPrescriptionDetail = async (data) => {
    const res = await authApi().post(endpoints['prescription-detail'], data)
    return res;
}

export const fetchGetPrescriptionDetailById = async (prescribingId) => {
    const res = await authApi().get(endpoints['get-prescription-detail'](prescribingId));
    if (Array.isArray(res?.data)) {
        res.data = res.data.map(normalizePrescriptionDetailItem)
    }
    return res;
}