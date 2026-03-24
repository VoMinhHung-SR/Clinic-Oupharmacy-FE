export const calculateAmount = (data, wage) => {
    let totalAmount = wage;
    data.forEach(d => {
         const unit = d?.medicine_unit || {}
         const unitPrice = Number(unit.price_value ?? unit.price ?? 0)
         totalAmount = totalAmount + d.quantity * unitPrice
    });
    return totalAmount;
}