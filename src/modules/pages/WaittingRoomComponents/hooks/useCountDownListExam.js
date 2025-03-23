import { useCallback, useEffect, useState } from "react"
// import { fetchListExaminationToday } from "../services"

const useCountDownListExam = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [examinationList, setExaminationList] = useState([]) 
    useEffect(()=> {
        const loadListExamToday = async () =>{
            // const res = await fetchListExaminationToday();
            try{
                if(res.status === 200){
                    setIsLoading(false)
                    setExaminationList(res.data)
                }
            }catch(err){
                const res = err.response
                if(res.status === 500){
                    setIsLoading(false)   
                    setExaminationList([])
                }
            }
        }
        loadListExamToday()
    }, [])
    return {
        examinationList, setExaminationList, isLoading
    }
}
export default useCountDownListExam