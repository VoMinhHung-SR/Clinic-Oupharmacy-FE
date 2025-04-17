import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import { fetchDiagnosisByExaminationID, fetchPrescribingByDiagnosis } from "../services"
import UserContext from "../../../../lib/context/UserContext"
import { fetchExaminationDetail } from "../../ExaminationDetailComponents/services"

const usePayment = () => {
    const {user} = useContext(UserContext)
    const {examinationId} = useParams()
    const [isLoadingPrescriptionDetail, setIsLoadingPrescriptionDetail] = useState(true)
    const [examinationDetail, setExaminationDetail] = useState(null)
    const [diagnosisInfo, setDiagnosisInfo] = useState([])
    const [prescribingList, setPrescribingList] = useState({})

    useEffect(() => {
        const loadDiagnosis = async () => {
            try {
                const res = await fetchExaminationDetail(examinationId)
                if (res.status === 200) {
                    if (res.data === null) {
                        setExaminationDetail(null)
                    } else {
                        setExaminationDetail(res.data)
                        if (res.data.diagnosis_info && Array.isArray(res.data.diagnosis_info)) {
                            setDiagnosisInfo(res.data.diagnosis_info)

                            res.data.diagnosis_info.forEach(diagnosis => {
                                loadPrescribing(diagnosis.id)
                            })
                        }
                    }
                }
            } catch (err) {
                setExaminationDetail(null)
                console.error('Error loading examination:', err)
            } finally {
                setIsLoadingPrescriptionDetail(false)
            }
        }

        const loadPrescribing = async (diagnosisId) => {
            try {
                const res = await fetchPrescribingByDiagnosis(diagnosisId)
                if (res.status === 200) {
                    setPrescribingList(prev => ({
                        ...prev,
                        [diagnosisId]: res.data
                    }))
                }
            } catch (err) {
                console.error(`Error loading prescribing for diagnosis ${diagnosisId}:`, err)
                setPrescribingList(prev => ({
                    ...prev,
                    [diagnosisId]: []
                }))
            }
        }

        if (user && examinationId) {
            loadDiagnosis()
        }
    }, [user, examinationId])

    const getPrescribingByDiagnosisId = (diagnosisId) => {
        return prescribingList[diagnosisId] || []
    }

    return {
        prescribingList,
        getPrescribingByDiagnosisId,
        isLoadingPrescriptionDetail,
        user,
        examinationDetail,
        examinationId,
        diagnosisInfo
    }
}

export default usePayment