import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useContext, useEffect } from "react"
import { userContext } from "../../../../App"
import { db } from "../../../../config/firebase";
import { ErrorAlert } from "../../../../config/sweetAlert2";
import { APP_ENV, TOAST_ERROR } from "../../../../lib/constants";
import UserContext from "../../../../lib/context/UserContext";
import { useTranslation } from "react-i18next";
import createToastMessage from "../../../../lib/utils/createToastMessage";

const useConversationList = () => {    
    const {t} = useTranslation(['modal'])
    const {user} = useContext(UserContext);
    useEffect(()=>{
        const setUserDB = async ()=>{    
            try{
                await setDoc(doc(db, `${APP_ENV}_users`, user.id.toString()), {
                    id: user.id,
                    email: user.email,
                    fullName: `${user.first_name} ${user.last_name}`,
                    avatar: user.avatar_path,
                    lastSeen: serverTimestamp() 
                  }, { merge: true });
            }catch(err){
                createToastMessage({message:t('modal:updateFailed'), type: TOAST_ERROR})
            }
        }
        if(user){
            setUserDB()
        }
    },[user])
    return {
        user
    }
}
export default useConversationList