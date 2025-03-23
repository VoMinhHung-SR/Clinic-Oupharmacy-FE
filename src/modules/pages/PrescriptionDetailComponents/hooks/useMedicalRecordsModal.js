import { useEffect, useState } from "react"
import { fetchMedicalRecords } from "../services"

const useMedicalRecordsModal = (patientID) => {
    const [isLoading, setIsLoading] = useState(false)
    const [medicalRecords, setMedicalRecords] = useState([])

    useEffect(()=> {
        const loadData = async (patientID) => {
            setIsLoading(true)
            try{
                const res = await fetchMedicalRecords(patientID)
                if(res.status === 200)
                    setMedicalRecords(res.data)
            }catch(err){
                console.log(err)
            }finally{
                setIsLoading(false)
            }
        }
        if(patientID)
            loadData(patientID)
    },[patientID])

    return {
        medicalRecords, isLoading
    }

}

export default useMedicalRecordsModal