import { authApi, endpoints } from "../../../../../../config/APIs"

// To: get arraylist medicineUnit[{medicineUnitObj},{medicineUnitObj}]
// this served for autocompled field
export const fetchMedicinesUnit = async (query) =>{
    const res = await authApi().get(`${endpoints['medicine-units']}${query}`)
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
    return res;
}