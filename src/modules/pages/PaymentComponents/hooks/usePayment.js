import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import { fetchDiagnosisByExaminationID, fetchPrescribingByDiagnosis } from "../services"
import UserContext from "../../../../lib/context/UserContext"
import { fetchExaminationDetail } from "../../ExaminationDetailComponents/services"
import { fetchPrescriptionDetailBillCard } from "../../../common/components/card/BillCard/services"
import { fetchPrescriptionDetail } from "../../PrescriptionDetailComponents/services"

const usePayment = () => {
    const {user} = useContext(UserContext)
    const {prescribingId} = useParams()
    const [diagnosisInfo, setDiagnosisInfo] = useState([])
    const [prescriptionDetail, setPrescriptionDetail] = useState({})
    const [loadingStates, setLoadingStates] = useState(true)

    useEffect(() => {

        const loadDiagnosisInfo = async () => {
            const res = await fetchPrescriptionDetail(prescribingId)
            if (res.status === 200) {
                setDiagnosisInfo(res.data)
                
                if(res.data.prescribing_info.length > 0){
                    res.data.prescribing_info.forEach(prescribing => {
                        loadPrescriptionDetail(prescribing.id)
                    })
                }
            }
        }
        
        const loadPrescriptionDetail = async (prescribingId) => {
            try {
                const res = await fetchPrescriptionDetailBillCard(prescribingId)
                if (res.status === 200) {
                    setPrescriptionDetail(prev => ({
                        ...prev,
                        [prescribingId]: res.data
                    }))
                }
            } catch (err) {
                console.error(`Error loading prescribing for diagnosis ${diagnosisId}:`, err)
                setPrescriptionDetail(prev => ({
                    ...prev,
                    [prescribingId]: []
                }))
            } finally {
                setLoadingStates(false)
            }
        }

        if (user && prescribingId) {
            loadDiagnosisInfo()
        }
    }, [user, prescribingId])

    // const getPrescribingByDiagnosisId = (prescribingId) => {
    //     return setPrescriptionDetail[prescribingId] || []
    // }

    // const isPrescribingLoading = (prescribingId) => {
    //     return loadingStates === true
    // }

    return {
        prescriptionDetail,
        // getPrescribingByDiagnosisId,
        isLoadingPrescriptionDetail: loadingStates,
        // isPrescribingLoading,
        // user,
        // prescribingId,
        diagnosisInfo,
    }
}

export default usePayment