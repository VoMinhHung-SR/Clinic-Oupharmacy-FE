import { useEffect, useState } from "react";
import { fetchPatientExist } from "../../BookingComponents/services";
import * as Yup from 'yup';
import { REGEX_EMAIL } from "../../../../lib/constants";
import { useTranslation } from "react-i18next";
import { useNavigate, useNavigation, useParams } from "react-router";
import { fetchExaminationDetail } from "../services";

const useExaminationDetail = () => {
    const {t} = useTranslation('yup-validate')
    const {examinationId} = useParams();
    const router = useNavigate()
    const [isLoadingExaminationDetail,setIsLoadingExaminationDetail] = useState(true)
    const [examinationData, setExaminationData] = useState('')

    useEffect(()=> {
        const loadExaminationDetail = async (examinationId) => {
            try{
                const res = await fetchExaminationDetail(examinationId)
                if (res.status === 200){
                    setIsLoadingExaminationDetail(false)
                    setExaminationData(res.data)
                }
            }catch(err){
                setExaminationData('')
                setIsLoadingExaminationDetail(false)
                const res = err.response;
                if (res.status === 404)
                    router('/404')
            }
        }
        if (examinationId)
            loadExaminationDetail(examinationId);
    }, [])
    // Called when form dont have errors

    return {
        isLoadingExaminationDetail,
        examinationData
    }
}

export default useExaminationDetail