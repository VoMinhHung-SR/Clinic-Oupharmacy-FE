import { authApi, endpoints } from "../../../../config/APIs";

export const fetchContactAdmin = async (data) => {
    const res = authApi().post(endpoints['contact-admin'], data);
    return res;
}