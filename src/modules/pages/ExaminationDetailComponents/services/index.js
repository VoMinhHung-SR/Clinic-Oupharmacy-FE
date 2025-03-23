import { authApi, endpoints } from "../../../../config/APIs"

export const fetchExaminationDetail = async (examinationID) => {
    const res = await authApi().get(endpoints['examination-detail'](examinationID))
    return res;
}