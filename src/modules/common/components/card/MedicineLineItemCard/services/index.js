import APIs, { endpoints } from "../../../../../../config/APIs"

export const fetchMedicineUnitByID = async (medicineUnitID) => {
    const res = await APIs.get(endpoints['medicine-units-detail'](parseInt(medicineUnitID)))
    return res;
}