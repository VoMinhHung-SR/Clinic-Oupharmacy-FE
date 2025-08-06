import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import { fetchPrescriptionDetail } from "../services"
import UserContext from "../../../../lib/context/UserContext"

const usePrescriptionDetail = () => {
    const {user} = useContext(UserContext)
    const { prescribingId } = useParams();
   
    const [prescriptionDetail, setPrescriptionDetail] = useState(null)
    const [isLoadingPrescriptionDetail, setIsLoadingPrescriptionDetail] = useState(true)

    const loadPrescriptionDetailByDiagnosisId = async () => {
        try {
            const res = await fetchPrescriptionDetail(prescribingId)
            if (res.status === 200) {
                setPrescriptionDetail(res.data)
                setIsLoadingPrescriptionDetail(false)
            }
        } catch (err) {
            setIsLoadingPrescriptionDetail(false)
            setPrescriptionDetail(null)
            console.log(err)
        }
    }

    useEffect(() => {
        if(user){
            loadPrescriptionDetailByDiagnosisId()
        }
    }, [user])

    return{
        user,
        prescriptionDetail,
        isLoadingPrescriptionDetail,
        refetch: loadPrescriptionDetailByDiagnosisId
    }
}

export default usePrescriptionDetail