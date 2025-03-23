import { authApi, endpoints } from "../../../../config/APIs"

// To get array list diagnosis sheet ready to create prescription
// [{
//    diagnosisObject: sign, diagnosed, examination{examinationInfo...}
// }]
export const fetchDiagnosisList = async (query) => {
    const res = await authApi().get(`${endpoints['diagnosis']}`+`${query}`)
    return res;
 }