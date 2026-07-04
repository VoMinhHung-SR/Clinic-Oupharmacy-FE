import { authApi, endpoints } from "../../../../config/APIs"

export const updateProfile = async (userID, data) => {
    const res = await authApi().patch(endpoints['user-detail'](userID), data)
    return res;
}

export const changeAvatar = async (userID, data) => {
    const res = await authApi().patch(endpoints['change-avatar'](userID), data);
    return res;
}

export const fetchUserAddresses = async () => {
    const res = await authApi().get(endpoints['user-addresses']);
    return res;
}

export const createUserAddress = async (data) => {
    const res = await authApi().post(endpoints['user-addresses'], data);
    return res;
}

export const updateUserAddress = async (addressId, data) => {
    const res = await authApi().patch(endpoints['user-address-detail'](addressId), data);
    return res;
}

export const deleteUserAddress = async (addressId) => {
    const res = await authApi().delete(endpoints['user-address-detail'](addressId));
    return res;
}

export const setDefaultUserAddress = async (addressId) => {
    const res = await authApi().patch(endpoints['user-address-detail'](addressId), { is_default: true });
    return res;
}