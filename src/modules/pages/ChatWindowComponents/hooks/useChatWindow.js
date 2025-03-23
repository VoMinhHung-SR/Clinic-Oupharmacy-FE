import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, where } from "firebase/firestore"
import { useContext, useEffect, useRef, useState } from "react"
import { useCollection } from "react-firebase-hooks/firestore"
import { useParams } from "react-router"
import { userContext } from "../../../../App"
import { db } from "../../../../config/firebase"
import { ErrorAlert } from "../../../../config/sweetAlert2"
import { generateQueryGetMessages, transformMessage } from "../../../../lib/utils/getMessagesInConversation"
import { fetchRecipientInbox } from "../services"
import { APP_ENV } from "../../../../lib/constants"
import UserContext from "../../../../lib/context/UserContext"

const useChatWindow = () => {
    const {user} = useContext(UserContext)
    const {conversationId, recipientId} = useParams()
    const [recipient, setRecipient] = useState([])

    const [newMessage, setNewMessage] = useState('')
    const [messagesInCoversation, setMessagesInConversation] = useState([])

    const queryGetMessages = generateQueryGetMessages(conversationId)
    const [messagesSnapshot, messagesLoading, __error] = useCollection(queryGetMessages)


    useEffect(()=> {
        const loadRecipientInfo = async () => {
            try{
                const res = await fetchRecipientInbox(recipientId)
                if (res.status === 200)
                    setRecipient(res.data)
            }catch(err){
                ErrorAlert("Đã có lỗi xảy ra", "Vui long thu lai sau","OK")
            }
                
        }
        const getConversationInfo = async () => {
            const conversationRef = doc(db, `${APP_ENV}_conversations`, conversationId.toString())
            const conversationSnapshot = await getDoc(conversationRef)
            const queryMessages = query(
                collection(db, `${APP_ENV}_messages`),
                where('conversation_id', '==', conversationId.toString()),
                orderBy('sent_at', 'asc')
            )
            const messagesSnapshot = await getDocs(queryMessages)
            const messages = messagesSnapshot.docs.map(messageDoc =>
                transformMessage(messageDoc)
            )
            setMessagesInConversation(messages)
            return {
                conversation: conversationSnapshot.data(),
                messages
            }
        }
        if(recipientId)
            loadRecipientInfo();
        if(conversationId){
            getConversationInfo();
        }
        
    }, [conversationId, recipientId])

    const addMessageToDbAndUpdateLastSeen = async () => {
        // update last seen in 'users' collection
        await setDoc(
            doc(db, `${APP_ENV}_users`, user.id.toString()),
            {
                lastSeen: serverTimestamp()
            },
            { merge: true }
        ) // just update what is changed

        // add new message to 'messages' collection
        await addDoc(collection(db, `${APP_ENV}_messages`), {
            conversation_id: conversationId,
            sent_at: serverTimestamp(),
            text: newMessage,
            user: user.id
        })

        // reset input field
        setNewMessage('')
    }
    
    const sendMessageOnEnter = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            if (!newMessage) return
            addMessageToDbAndUpdateLastSeen()
        }
    }

    const sendMessageOnClick = (event) => {
        event.preventDefault()
        if (!newMessage) return
        addMessageToDbAndUpdateLastSeen()
    }

    return {
        recipient,sendMessageOnEnter,sendMessageOnClick,
        newMessage, setNewMessage, messagesLoading,messagesSnapshot, 
        messagesInCoversation, 
    }
}
export default useChatWindow