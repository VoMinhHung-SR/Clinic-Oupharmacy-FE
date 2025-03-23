import { get } from "react-hook-form"
import { authApi, endpoints } from "../../../../../config/APIs"

export const fetchRecipients = async (query) => {
    const res = await authApi().get(`${endpoints['users']}?${query}`);
    return res
}