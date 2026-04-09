import { resolvePrescriptionDetailUnitPrice } from "../../../../../../lib/adapters/storeProduct"

export const calculateAmount = (data, wage) => {
    let totalAmount = wage;
    data.forEach(d => {
         const unitPrice = resolvePrescriptionDetailUnitPrice(d)
         totalAmount = totalAmount + d.quantity * unitPrice
    });
    return totalAmount;
}