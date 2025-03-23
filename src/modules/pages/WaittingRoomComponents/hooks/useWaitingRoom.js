import { useEffect, useMemo, useState } from "react"
import moment from "moment";
import { APP_ENV, CURRENT_DATE, TOAST_ERROR, TOAST_SUCCESS } from "../../../../lib/constants";
import { useCollection } from "react-firebase-hooks/firestore";
import { generateQueryGetWaitingRoomListToday } from "../utils/helpers";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebase";
import { useTranslation } from "react-i18next";
import { ConfirmAlert } from "../../../../config/sweetAlert2";
import createToastMessage from "../../../../lib/utils/createToastMessage";


const useWaitingRoom = () => {
  const {t} = useTranslation(['waiting-room', 'modal'])
  const [exams, setExams] = useState([]);
  const todayStr = moment().utcOffset('+07:00').format('YYYY-MM-DD');
  const today = moment(todayStr).format('YYYY-MM-DD');
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {

    const unsubscribe = onSnapshot(doc(db, `${APP_ENV}_waiting-room`, today), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const examsArray = docSnapshot.data().exams;
        setExams(examsArray);
      } else {
        setExams([]);
      }

      setIsLoading(false)
    }, (error) => {
      setIsLoading(false)
      setExams([]);
    });

    return () => unsubscribe();

  }, [today]);

  const eventMove = (title, callback) => {
    return ConfirmAlert(
      title,
      t('modal:noThrowBack'),
      t('modal:yes'),
      t('modal:cancel'),
      callback,
      () => { return; }
    );
  };
  
  const handleMoveToTop = (index) => {
    eventMove(t('confirmMoveToTop'), async () => {
      const examList = [...exams];
  
      // Check if the current exam has been committed
      if (examList[index].isCommitted) {
        return createToastMessage({message:t('moveFailed'),type:TOAST_ERROR});
      }
  
      // Find the last index of a committed exam
      let lastCommittedIndex = -1;
      for (let i = 0; i < examList.length; i++) {
        if (examList[i].isCommitted) {
          lastCommittedIndex = i;
        }
      }
  
      // Check if the target index is greater than the last committed index
      if (index > lastCommittedIndex) {
        // Move the exam to the target index
        const [removedExam] = examList.splice(index, 1);
        examList.splice(lastCommittedIndex + 1, 0, removedExam);
  
        // Recalculate startedDate for each exam in examList
        let currentDate = new Date();
        currentDate.setHours(7, 0, 0, 0);
        for (let i = 0; i < examList.length; i++) {
          const exam = examList[i];
          exam.startedDate = new Date(currentDate.getTime() + i * 20 * 60 * 1000);
        }
        
        // Update exams collection in firestore
        try {
          await updateDoc(doc(db, `${APP_ENV}_waiting-room`, today), { exams: examList });
          createToastMessage({message:t('moveSuccessful'),type:TOAST_SUCCESS});
        } catch (error) {
          createToastMessage({message:t('moveFailed'),type:TOAST_ERROR});
        } 
      } else {
        createToastMessage({message:t('moveFailed'),type:TOAST_ERROR});
      }
    });
  };
  
  const handleBringToBottom = (index) => {

    eventMove(t('confirmMoveToBottom'), async () => {
      const examList = [...exams];

      // Apply filter to check if the current exam has been committed
      if (examList[index].isCommitted) {
        return createToastMessage({message:t('moveFailed'),type:TOAST_ERROR});
      }

      // Apply filter to check if the next exam has been committed
      if (index < examList.length - 1 && examList[index + 1].isCommitted) {
        return createToastMessage({message:t('moveFailed'),type:TOAST_ERROR});
      }

      const [removedExam] = examList.splice(index, 1);
      examList.push(removedExam);

      // Recalculate startedDate for each exam in examList
      let currentDate = new Date();
      currentDate.setHours(7, 0, 0, 0);
      for (let i = 0; i < examList.length; i++) {
        const exam = examList[i];
        exam.startedDate = new Date(currentDate.getTime() + i * 20 * 60 * 1000);
      }
      // Update exams collection in firestore
      try {
        await updateDoc(doc(db,`${APP_ENV}_waiting-room`, today), { exams: examList });
        createToastMessage({message:t('moveSuccessful'),type:TOAST_SUCCESS});
      } catch (error) {
        createToastMessage({message:t('moveFailed'),type:TOAST_ERROR});
      }
    });
  };

  return { exams, isLoading, handleMoveToTop, handleBringToBottom };
};

export default useWaitingRoom;