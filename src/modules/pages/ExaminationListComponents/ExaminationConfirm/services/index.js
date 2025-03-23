import APIs, { authApi, endpoints } from "../../../../../config/APIs"

// To: send email confirm form system to user.email (user created this examination)
export const fetchSendEmailConfirmExamination = async (examinationID) =>{
    const res = await APIs.post(endpoints['send-mail'](examinationID))
    return res
}
// To: get array list of examination have pagination
export const fetchExaminationListConfirm = async (query)=>{
    const res = await authApi().get(`${endpoints['examination']}${query}`)
    return res
}