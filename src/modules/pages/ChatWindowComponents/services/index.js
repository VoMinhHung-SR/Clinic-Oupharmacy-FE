import { authApi, endpoints } from "../../../../config/APIs"

export const fetchRecipientInbox = async (userId) => {
    const res = authApi().get(endpoints['user-detail'](userId))
    return res;
}