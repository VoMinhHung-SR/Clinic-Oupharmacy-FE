import { useEffect, useState } from "react"
import { fetchMedicineUnitByID } from "./services"

 const MedicineLineItemCard = ({medicineUnitID, medicineLineItemData}) => {
    const [medicineUnitDetail, setMedicineUnitDetail] = useState('')
    useEffect( () => {
        const getMedicineUnitDetail = async (medicineUnitID) => {
            try{
                const res = await fetchMedicineUnitByID(medicineUnitID)
                setMedicineUnitDetail(res.data)
            }catch(err){
                console.log(err)
            }
        }

        if (medicineUnitID)
            getMedicineUnitDetail(medicineUnitID)
    }, [medicineUnitID])

    if (!medicineLineItemData)
        return 'rong'
    return (

       <div>co du lieu {medicineUnitDetail.id}</div>
    )
}
export default MedicineLineItemCard