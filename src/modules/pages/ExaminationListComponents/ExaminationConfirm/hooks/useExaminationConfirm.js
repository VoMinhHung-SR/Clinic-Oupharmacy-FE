import { doc, serverTimestamp, setDoc } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"
import { db } from "../../../../../config/firebase"
import { APP_ENV, STATUS_BOOKING_CONFIRMED, TOAST_SUCCESS } from "../../../../../lib/constants"
import { fetchExaminationListConfirm, fetchSendEmailConfirmExamination } from "../services"
import createToastMessage from "../../../../../lib/utils/createToastMessage"
import { ConfirmAlert, ErrorAlert } from "../../../../../config/sweetAlert2"
import { goToTop } from "../../../../../lib/utils/helper"
import UserContext from "../../../../../lib/context/UserContext"

const useExaminationConfirm = () =>{
    const {t} = useTranslation(['examinations','modal'])
    // ====== QuerySet ======
    const [q] = useSearchParams();
    
    const [filterCount, setFilterCount] = useState(0);
    const [paramsFilter, setParamsFilter] = useState({
        mailStatus:0,
        createdDate:0,
        kw: '',
        hasDiagnosis: ''
    })
    
    // ====== Pagination ======
    const [isLoadingExamination, setIsLoadingExamination] = useState(true)
    const [isRequestSuccessful, setIsRequestSuccessful] = useState(true);

    const [pagination, setPagination] = useState({ count: 0, sizeNumber: 0 });
    const [page, setPage] = useState(1);
    
    const handleChangePage = (event, value) => {
      if(page=== value)
        return;
      goToTop();
      setIsLoadingExamination(true);
      setExaminationList([]);
      setPage(value);
    };

    const handleOnSubmitFilter = (value) => {
        setIsLoadingExamination(true);
        setParamsFilter(value)
        setFilterCount(Object.values(value).filter(v => v !== 0 && v !== '').length);
        setPage(1);
        setFlag(!flag)
    }


    const {user} = useContext(UserContext)
    const [flag, setFlag] = useState(false)
    const [examinationList, setExaminationList] = useState([])

    const handleChangeFlag = () => {
        setFlag(!flag)
    }

    useEffect(()=>{
        const loadExamination = async () => {
            try{
                let querySample = q.toString();
                
                const queryParams = `page=${page}`+
                `&kw=${paramsFilter.kw === '' ? '' : paramsFilter.kw}`+
                `&status=${paramsFilter.mailStatus === 1 ? 'true' 
                :(paramsFilter.mailStatus === -1 ? "false" : "")}` +
                `&ordering=${paramsFilter.createdDate === 0 ? "-created_date": "created_date"}` +
                `&has_diagnosis=${paramsFilter.hasDiagnosis === 1 ? 'true' 
                :(paramsFilter.hasDiagnosis === -1 ? "false" : "")}`

                querySample === "" ? querySample += '?' + queryParams : querySample += queryParams
                
                const res = await fetchExaminationListConfirm(querySample);
                if (res.status === 200) {
                    const data = await res.data;
                    setExaminationList(data.results)
                    setIsLoadingExamination(false)
                    setPagination({
                        count: data.count,
                        sizeNumber: Math.ceil(data.count / 30),
                    });
                    setIsRequestSuccessful(true);
                }
            }catch (err){
                setIsLoadingExamination(false)
                setIsRequestSuccessful(false);
                setExaminationList([])
            }
        }
        if(user)
            loadExamination()
    }, [user, flag, page])


    // Handle on children elements
    const [loadingState, setLoadingState] = useState({});

    const handleSendEmailConfirm = async (userID, examinationID, avatar, callback) => {
        setLoadingState((prevState) => ({ ...prevState, [examinationID]: true }));
        try {
          const res = await fetchSendEmailConfirmExamination(examinationID);
          if (res.status === 200) {
            await createNotificationRealtime(userID, examinationID, avatar);
            createToastMessage({ message: t('sendMailSuccesses'), type: TOAST_SUCCESS });
            setFlag(!flag)
          } else if (res.status === 400) {
            ErrorAlert(t('modal:errSomethingWentWrong'), t('modal:pleaseTryAgain'), t('modal:ok'));
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingState((prevState) => ({ ...prevState, [examinationID]: false }));
        }
      };

      const createNotificationRealtime  = async (userID, examinationID, avatar) => {
        try{
            await setDoc(doc(db,`${APP_ENV}_notifications`, examinationID.toString()),{
                "is_commit": false,
                "is_active": true,
                "booking_id": examinationID,
                'content': STATUS_BOOKING_CONFIRMED,
                "recipient_id": userID,
                "avatar": avatar,
                "sent_at" : serverTimestamp()
            },{merge:true})
        }catch(err){
            console.error(err)
        }
    }
   
    return{
        user,
        page,
        pagination,
        filterCount,
        paramsFilter,
        examinationList,
        isRequestSuccessful,
        isLoadingExamination,
        loadingState,
        handleChangePage,
        handleChangeFlag,
        handleOnSubmitFilter, handleSendEmailConfirm,
    }
}
export default useExaminationConfirm