import { collection, query } from "firebase/firestore";
import { db } from "../../../../config/firebase";
import { APP_ENV } from "../../../../lib/constants";

export const generateQueryGetWaitingRoomListToday = (date) =>{
	if(!date)		
		return
	return query(
		collection(db, `${APP_ENV}_waiting-room`,date)
	);
}
	
	