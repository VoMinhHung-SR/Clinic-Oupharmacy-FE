import APIs, { authMediaApi, endpoints } from "../../../../config/APIs"
import { ROLE_USER } from "../../../../lib/constants";

export const fetchUserRoles = async () => {
    const res = await APIs.get(endpoints['roles'])
    return res;
}

export const fetchCreateUser = async (userData) => {
    const res = await authMediaApi().post(endpoints["users"], userData);
    return res;
}

export const fetchDistrictsByCity = async (cityId) => {
    const res = await APIs.get(`${endpoints['city-detail'](cityId)}get-districts/`)
    return res;
}

export const fetchCreateUserRole = async () => {
    const res = await APIs.post(endpoints['roles'], {name: ROLE_USER})
    return res;
}