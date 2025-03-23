import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import { userContext } from "../../../../App"
import { fetchPrescriptionDetail } from "../services"
import UserContext from "../../../../lib/context/UserContext"

const usePrescriptionDetail = () => {
    const {user} = useContext(UserContext)
    const { prescribingId } = useParams();
   
    const [prescriptionDetail, setPrescriptionDetail] = useState(null)
    const [isLoadingPrescriptionDetail, setIsLoadingPrescriptionDetail] = useState(true)
    useEffect(() => {
        const loadPrescriptionDetail = async () => {
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
        if(user){
            loadPrescriptionDetail()
        }
    }, [user])

    return{
        user,
        prescriptionDetail,
        isLoadingPrescriptionDetail
    }
}

export default usePrescriptionDetail