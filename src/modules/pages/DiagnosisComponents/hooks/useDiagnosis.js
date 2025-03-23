import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { userContext } from "../../../../App";
import { authApi, endpoints } from "../../../../config/APIs";
import { fetchDiagnosisByExamID } from "../services";
import UserContext from "../../../../lib/context/UserContext";

const useDiagnosis = () => {
    const { examinationId } = useParams();
    const {user} = useContext(UserContext);
    const [examinationDetail, setExaminationDetail] = useState([])
    const [isLoadingExamination, setIsLoadingExamination] = useState(true)
    const [prescriptionId, setPrescriptionId] = useState(-1)
    const [diagnosis, setDiagnosis] = useState({})
    const [flag, setFlag] = useState(false)

    const handleChangeFlag = () => {
        setFlag(!flag)
    }

    useEffect(()=>{
       const loadExaminationDetail = async () => {
            try {
                const res = await authApi().get(endpoints['examination-detail'](examinationId))
                if (res.status === 200) {
                    setIsLoadingExamination(false)
                    setExaminationDetail(res.data)
                }

            } catch (err) {
                if (err.response.status === 404) {
                    setIsLoadingExamination(false)
                    setExaminationDetail([])
                }
            }
       }
       const loadDiagnosis = async (examinationId) => {
        try {
            const res = await fetchDiagnosisByExamID(examinationId)
            if (res.status === 200) {
                if(res.data){
                    setPrescriptionId(res.data.id)
                    setDiagnosis(res.data)
                }else{
                    setPrescriptionId(-1)
                    setDiagnosis({
                        "sign":"",
                        "diagnosed":"",
                    })
                }
            }
        } catch (err) {
            setPrescriptionId(-1)
            setDiagnosis({
                "sign":"",
                "diagnosed":"",
            })
        }
    }
       if(user){
            loadExaminationDetail()
       }
       if(examinationId)
            loadDiagnosis(examinationId)
    },[flag,user])

    return{
        user,
        isLoadingExamination,
        examinationDetail,
        examinationId,
        prescriptionId,
        diagnosis,
        handleChangeFlag
    }
}
export default useDiagnosis