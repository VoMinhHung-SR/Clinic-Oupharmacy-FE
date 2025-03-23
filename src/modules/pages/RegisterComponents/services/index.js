import APIs, { authMediaApi, endpoints } from "../../../../config/APIs"
import { ROLE_USER } from "../../../../lib/constants";


// To get list object role info  
// {   id: int,
//     name: string
// }
export const fetchUserRoles = async () => {
    const res = await APIs.get(endpoints['roles'])
    return res;
}
// create a user with form register data
export const fetchCreateUser = async (userData) => {
    const res = await authMediaApi().post(endpoints["users"], userData);
    return res;
}

export const fetchDistrictsByCity = async (cityId) => {
    const res = await APIs.post(endpoints['districts-by-city'], {city: cityId})
    return res;
}

export const fetchCreateUserRole = async () => {
    const res = await APIs.post(endpoints['roles'], {name: ROLE_USER})
    return res;
}

export const fetchCreateLocation = async (locationData) => {
    const res = await APIs.post(endpoints['location'],locationData)
    return res;
}