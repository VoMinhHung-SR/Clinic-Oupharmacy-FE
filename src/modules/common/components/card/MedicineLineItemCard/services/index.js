import APIs, { endpoints } from "../../../../../../config/APIs"
import { normalizeStoreVariant } from "../../../../../../lib/adapters/storeProduct"

export const fetchMedicineUnitByID = async (medicineUnitID) => {
    const res = await APIs.get(endpoints['product-variant-detail'](parseInt(medicineUnitID)))
    if (res?.data) {
        res.data = normalizeStoreVariant(res.data)
    }
    return res;
}