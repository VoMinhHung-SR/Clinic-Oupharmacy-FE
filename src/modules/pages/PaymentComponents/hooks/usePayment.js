import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import { userContext } from "../../../../App"
import { fetchDiagnosisByExaminationID, fetchPrescribingByDiagnosis } from "../services"
import UserContext from "../../../../lib/context/UserContext"

const usePayment = () => {
    const {user} = useContext(UserContext)
    const {examinationId} = useParams()
    const [isLoadingPrescriptionDetail, setIsloadingPrescriptionDetail] = useState(true)
    const [examinationDetail, setExaminationDetail] = useState([])

    const [prescribing, setPrescribing] = useState([])

    useEffect(()=>{
        const loadDiagnosis = async () => {
            try {
                const res = await fetchDiagnosisByExaminationID(examinationId)
                if (res.status === 200) {
                    if(res.data === null){
                        setExaminationDetail([])
                    }else{
                        setExaminationDetail(res.data)
                        loadPrescribing(res.data.id)
                    }
                }
            } catch (err) {
                setExaminationDetail([])
                console.error(err)
            }finally {
                setIsloadingPrescriptionDetail(false)
                
            }
        }
        const loadPrescribing = async (diagnosisId) => {
            try {
                const res = await fetchPrescribingByDiagnosis(diagnosisId)
                if (res.status === 200) {
                    setPrescribing(res.data)
                }
            } catch (err) {
                if(err.status === 500)
                    setPrescribing([])
            }
        }
        if(user){
            loadDiagnosis()
        }
    },[ examinationId])
    return{
        prescribing,
        isLoadingPrescriptionDetail,
        user,
        examinationDetail,
        examinationId,
    }
}
export default usePayment