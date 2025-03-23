import APIs, { authApi, endpoints } from "../../../../config/APIs"

export const fetchCategoryList = async () => {
    const res = await APIs.get(endpoints['categories'])
    return res
}

export const fetchCreateCategory = async (name) => {
    const res = await authApi().post(endpoints['categories'], {name})
    return res
}

export const fetchUpdateCategory = async (id,name) => {
    const res = await authApi().patch(endpoints['category-detail'](id), {name})
    return res
}

export const fetchDeleteCategory = async (id) => {
    const res = await authApi().delete(endpoints['category-detail'](id))
    return res
}