import { useContext, useEffect, useState } from "react"
import { userContext } from "../../../../App"
import { fetchDiagnosisList } from "../services"
import { useSearchParams } from "react-router-dom"
import { goToTop } from "../../../../lib/utils/helper"
import UserContext from "../../../../lib/context/UserContext"

const usePrescriptionList = () =>{
    const {user} = useContext(UserContext)
    const [prescriptionList, setPrescriptionList] = useState([])
    const [isLoadingPrescriptionList, setIsLoadingPrescriptionList] = useState(true);
    
    // ====== QuerySet ======
    const [q] = useSearchParams();
    const [flag, setFlag] = useState(false)

    const [paramsFilter, setParamsFilter] = useState({
        // id: 0,
        createdDate:0,
        hasPrescription:0, 
        hasPayment:0,
        patientName: '',
        doctorName: ''
    })

    const [pagination, setPagination] = useState({ count: 0, sizeNumber: 0 });
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false)

    const handleChangePage = (event, value) => {
        goToTop();
        setIsLoading(true)
        setIsLoadingPrescriptionList(true)
        setPage(value)
    };

    const handleOnSubmitFilter = (value) => {
        setIsLoadingPrescriptionList(true);
        setParamsFilter(value)
        setPage(1);
        setFlag(!flag)
    }


    useEffect(()=>{
        const loadPrescriptionList = async () =>{
            try {

                let querySample = q.toString();

                const queryParams = `page=${page}`+
                `&ordering=${paramsFilter.createdDate === 0 ? "-created_date": "created_date"}` +
                `&doctor_name=${paramsFilter.doctorName === '' ? '' : paramsFilter.doctorName.toString() }`+
                `&patient_name=${paramsFilter.patientName === '' ? '' : paramsFilter.patientName.toString()}`+
                `&has_payment=${paramsFilter.hasPayment === 1 ? 'true' 
                :(paramsFilter.hasPayment === -1 ? "false" : "")}` +
                `&has_prescription=${paramsFilter.hasPrescription === 1 ? 'true' 
                :(paramsFilter.hasPrescription === -1 ? "false" : "")}`


                querySample === "" ? querySample += '?' + queryParams : querySample += queryParams

                const res = await fetchDiagnosisList(querySample);

                if (res.status === 200) {
                    const data = await res.data;
                    setPrescriptionList(data.results);
                    setPagination({
                        count: data.count,
                        sizeNumber: Math.ceil(data.count / 30),
                    });
                    setIsLoading(true)
                }
            } catch (err) {
                setPrescriptionList([]);
                setIsLoading(false)
                console.error(err);
            } finally {
                setIsLoadingPrescriptionList(false);
                
            }
        }
        if(user){
            loadPrescriptionList();
        }
    },[user, flag, page])
    return {
        isLoadingPrescriptionList, paramsFilter,
        prescriptionList, handleOnSubmitFilter, isLoading,
        user,  handleChangePage, pagination, page    
    }
}
export default usePrescriptionList