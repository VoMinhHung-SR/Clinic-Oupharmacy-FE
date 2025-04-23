import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import { fetchDiagnosisByExaminationID, fetchPrescribingByDiagnosis } from "../services"
import UserContext from "../../../../lib/context/UserContext"
import { fetchExaminationDetail } from "../../ExaminationDetailComponents/services"

const usePayment = () => {
    const {user} = useContext(UserContext)
    const {examinationId} = useParams()
    const [examinationDetail, setExaminationDetail] = useState(null)
    const [diagnosisInfo, setDiagnosisInfo] = useState([])
    const [prescribingList, setPrescribingList] = useState({})
    const [loadingStates, setLoadingStates] = useState({
        examination: true,
        prescriptions: {}
    })

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
                            const initialLoadingStates = {}
                            res.data.diagnosis_info.forEach(diagnosis => {
                                initialLoadingStates[diagnosis.id] = true
                                loadPrescribing(diagnosis.id)
                            })
                            setLoadingStates(prev => ({
                                ...prev,
                                examination: false,
                                prescriptions: initialLoadingStates
                            }))
                        }
                    }
                }
            } catch (err) {
                setExaminationDetail(null)
                console.error('Error loading examination:', err)
                setLoadingStates(prev => ({
                    ...prev,
                    examination: false
                }))
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
            } finally {
                setLoadingStates(prev => ({
                    ...prev,
                    prescriptions: {
                        ...prev.prescriptions,
                        [diagnosisId]: false
                    }
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

    const isPrescribingLoading = (diagnosisId) => {
        return loadingStates.prescriptions[diagnosisId] === true
    }

    return {
        prescribingList,
        getPrescribingByDiagnosisId,
        isLoadingExamination: loadingStates.examination,
        isPrescribingLoading,
        user,
        examinationDetail,
        examinationId,
        diagnosisInfo,
    }
}

export default usePayment