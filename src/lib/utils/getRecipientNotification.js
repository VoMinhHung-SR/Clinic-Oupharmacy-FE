import { collection, orderBy, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import { APP_ENV } from "../constants";

export const generateQueryGetNotification = (recipientId) =>{
	if(!recipientId)		
		return
	return query(
		collection(db, `${APP_ENV}_notifications`),
		where('recipient_id', '==', recipientId),
		orderBy('sent_at', 'desc')
	);
}
	
	