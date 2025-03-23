import { useEffect, useState } from "react"
import { fetchDiagnosisByExaminationID, fetchPrescribingByDiagnosis } from "../../../../../pages/PaymentComponents/services"
import { fetchPrescriptionDetailBillCard } from "../../BillCard/services"

const useExaminationDetailCard = (examinationID) => {
   const [diagnosis , setDiagnosis] = useState([])
   const [prescribing, setPrescribing] = useState([])
   const [bill, setBill] = useState([])
   const [isLoading, setIsLoading] = useState(true)
   useEffect(()=> {
    const loadDiagnosis = async (examinationID) => {
        try{
            // Load Diagnosis
            const res = await fetchDiagnosisByExaminationID(examinationID)
            if(res.status === 200){
                setDiagnosis(res.data)
                // Load Prescribing
                loadPrescribing(res.data.id)
            }
        }catch(err){
            const res = err.response
            if(res.status === 500)
                console.log(err)
        }
    }

    const loadPrescribing = async (diagnosedID) => {
        try{
            const res = await fetchPrescribingByDiagnosis(diagnosedID)
            if(res.status === 200){
                setPrescribing(res.data)
                if(res.data.length !== 0){
                    // Load Bill
                    res.data.map(p => loadBill(p.id))
                }
            }
        }catch(err){
            const res = err.response
            if(res.status === 500)
                console.log(err)
        }
    }

    const loadBill = async (prescribingID) => {
        try{
            const res = await fetchPrescriptionDetailBillCard(prescribingID)
            if(res.status === 200){
                setBill(res.data)
            }
        }catch(err){
            const res = err.response
            if(res.status === 500)
                console.log(err)
        }
    }

    if(examinationID){
        loadDiagnosis(examinationID)
        setIsLoading(false)
    }
   }, [])

    return {
        isLoading,
        diagnosis, bill, 
        prescribing
    }
}

export default useExaminationDetailCard