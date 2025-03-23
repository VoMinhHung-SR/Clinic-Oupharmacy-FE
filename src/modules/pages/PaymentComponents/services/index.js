import { authApi, endpoints } from "../../../../config/APIs"

// To get diagnosis info  
// diagnosisObj= {id, examination{ userCreate, patient}, sign, diagnosed, userDotor...}
export const fetchDiagnosisByExaminationID = async (examinationID) => {
    const res = await authApi().get(endpoints['get-diagnosis'](examinationID))
    return res;
}
// To get status of prescribing sheet  
// If does have the bill => then show the button for user trigger create
export const fetchReceipt = async (prescribingID) =>{
    const res = await authApi().post(endpoints['receipt'],{
        prescribing: parseInt(prescribingID)
    });
    return res;
}

// To get all the prescribing
// [ { presbingObj }, {...} ]
//
// prescbingObj: {id, created_Date, {diagnosis}, {userDoctor} }
//
export const fetchPrescribingByDiagnosis = async (diagnosisId) => {
    const res = await authApi().post(endpoints['get-pres-by-diagnosis'], {
        diagnosis: parseInt(diagnosisId)
    });
    return res;
}