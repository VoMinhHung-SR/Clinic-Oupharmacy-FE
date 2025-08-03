import { useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import SuccessfulAlert, { ConfirmAlert, ErrorAlert } from "../../../../config/sweetAlert2"
import { fetchDeleteAnExamination, fetchExaminationList } from "../services"
import { useSearchParams } from "react-router-dom"
import { goToTop } from "../../../../lib/utils/helper"
import UserContext from "../../../../lib/context/UserContext"
const useExaminationList = () => {
    const {user} = useContext(UserContext)
    const [isLoading, setIsLoading] = useState(true)
    const [flag, setFlag] = useState(false)
    const [examinationList, setExaminationList] = useState([])

    const {t} = useTranslation(['examinations','modal'])
     // ====== QuerySet ======
    const [q] = useSearchParams();

    const [pagination, setPagination] = useState({ count: 0, sizeNumber: 0 });
    const [page, setPage] = useState(1);

    const handleChangePage = (event, value) => {
        goToTop()
        setIsLoading(true)
        setPage(value)
    };
    const handleChangeFlag = () => setFlag(!flag)

    useEffect(()=> {
        const loadExaminations = async (userID) =>{
            try{
                let query = q.toString();
                
                let querySample = query 
                querySample === "" ? (querySample += `page=${page}`): 

                (querySample += `&page=${page}`);
                const res = await fetchExaminationList(userID, querySample)
                if (res.status === 200) {
                    const data = await res.data;
                    setExaminationList(data.results)
                    setPagination({
                        count: data.count,
                        sizeNumber: Math.ceil(data.count / 10),
                    });
                  
                }
            }catch (err) {
                setIsLoading(false)
                setExaminationList([])
            }finally{
                setIsLoading(false)
            }
            
        }
        if(user){
            loadExaminations(user.id)
        }
    }, [user, flag, page])

    const handleDeleteExamination = (examinationID) =>{

        const deleteExamination = async () =>{
            const res = await fetchDeleteAnExamination(examinationID)
            if (res.status === 204){
                SuccessfulAlert({title: t('modal:deleteCompleted'), confirmButtonText: t('modal:ok')})
                setFlag(!flag)
            }else{
                ErrorAlert(t('modal:deleteFailed'), t('modal:errSomethingWentWrong'), t('modal:ok'))
            }
        }
        return ConfirmAlert(t('examinations:confirmDelete'),t('modal:noThrowBack'),
        t('modal:yes'),
        t('modal:cancel'),
        // this is callback function when user confirmed "Yes"
        ()=>{
            deleteExamination()
        }, ()=> {return;})
    }

    return {
        examinationList,
        isLoading,
        setExaminationList,
        handleDeleteExamination, handleChangeFlag,
        handleChangePage, pagination, page
    }
}

export default useExaminationList