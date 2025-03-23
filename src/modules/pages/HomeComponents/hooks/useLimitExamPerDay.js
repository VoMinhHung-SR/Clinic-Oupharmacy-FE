import { useEffect, useState } from "react"
import { fetchGetTotalExamsPerDay } from "../services"
import { CURRENT_DATE } from "../../../../lib/constants"

const useLimitExamPerDay = (date = CURRENT_DATE) => {
    const [totalExams, setTotalExams]= useState(0)
    const [isOpen, setIsOpen] = useState(false)

    const handleCloseModal = () => setIsOpen(false)
    const handleOpenModal = () => setIsOpen(true)

    useEffect(()=> {
        const loadTotalExamsPerDay = async (date) => {
            const res = await fetchGetTotalExamsPerDay(date)
            if(res.status === 200)
                setTotalExams(res.data.totalExams)
        }
        if(date)
            loadTotalExamsPerDay(date)
    }, [date])
    
    return {
        totalExams, isOpen, handleCloseModal,handleOpenModal
    }
}

export default useLimitExamPerDay