import APIs, { authApi, endpoints } from "../../../../config/APIs";

export const fetchListPatients = async () => {
    const res = await authApi().get(`${endpoints['patient']}`);
    return res
}

export const fetchListUsers = async () => {
    const res = await authApi().get(`${endpoints['users']}`);
    return res
}