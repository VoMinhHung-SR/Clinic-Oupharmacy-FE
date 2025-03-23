import { authApi, endpoints } from "../../../../../config/APIs"

// To: create or update a patient with patientData and patientId
export const fetchCreateOrUpdatePatient = async (patientId = -1, patientData) => {
    // Update when patientID !== -1
    if(patientId !== -1 ){
        const res = await authApi().patch(endpoints['patient-detail'](patientId), patientData)
        return res;
    }
    // Create New Patient)
    const res = await authApi().post(endpoints['patient'], patientData)
    return res;
}
// To: create examination by examination data was declared in formAddExaminationSchema
export const fetchCreateExamination = async (examinationData) => {
    const res = await authApi().post(endpoints['examination'], examinationData)
    return res;
}

export const fetchUpdateExamination = async (eID, examinationData) => {
    const res = await authApi().patch(endpoints['examination-detail'](eID), examinationData)
    return res;
}

export const fetchExamDateData = async (date) => {
    const res = await authApi().post(endpoints['get-total-exams'], { date: date });
    return res;
}
