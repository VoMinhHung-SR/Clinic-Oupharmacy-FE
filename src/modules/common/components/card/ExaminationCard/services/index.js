import APIs, { endpoints } from "../../../../../../config/APIs"

export const fetchSendEmailConfirmExamination = async (examinationID) =>{
    const res = await APIs.post(endpoints['send-mail'](examinationID))
    return res;
}