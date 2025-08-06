import { authApi, endpoints } from "../../../../config/APIs"

// To get diagnosis info  
// {    id, 
//      examination{userCreate, patient}, 
//      sign, 
//      diagnosed, 
//      userDotor...
//  }
export const fetchPrescriptionDetail = async (prescribingId) => {
    const res = await authApi().get(endpoints['prescription'](prescribingId));
    return res;
}

export const fetchMedicalRecords = async (patientID) => {
    const res = await authApi().post(endpoints['get-medical-records'],{patientId: patientID})
    return res;
}

// export const fetchPrescriptionDetail = async (prescribingId) => {
//     const res = await authApi().get(endpoints['get-prescription-detail'](prescribingId));
//     return res;
// }