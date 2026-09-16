import { doc, setDoc } from 'firebase/firestore'
import { authApi, endpoints } from '../../../../../config/APIs'
import { db } from '../../../../../config/firebase'
import { APP_ENV } from '../../../../../lib/constants'

/**
 * @typedef {object} ConsultationSession
 * @property {number} id
 * @property {number} user_id
 * @property {number|null} pharmacist_id
 * @property {string} status
 * @property {string} firestore_conversation_id
 * @property {string} need_text
 * @property {object} context_json
 */

/** @returns {Promise<import('axios').AxiosResponse<ConsultationSession[]>>} */
export const fetchConsultationQueue = async () => {
  return authApi().get(`${endpoints['consultation-sessions']}?scope=queue`)
}

/** @returns {Promise<import('axios').AxiosResponse<ConsultationSession>>} */
export const claimConsultationSession = async (sessionId) => {
  return authApi().post(endpoints['consultation-session-claim'](sessionId), {})
}

/** @returns {Promise<import('axios').AxiosResponse<ConsultationSession>>} */
export const completeConsultationSession = async (sessionId) => {
  return authApi().post(endpoints['consultation-session-complete'](sessionId), {})
}

/**
 * After claim: attach pharmacist to Firestore conversation members (Clinic inbox visibility).
 * @param {string} conversationId
 * @param {number} patientId
 * @param {number} pharmacistId
 */
export const attachPharmacistToFirestoreConversation = async (
  conversationId,
  patientId,
  pharmacistId,
) => {
  if (!conversationId) return
  await setDoc(
    doc(db, `${APP_ENV}_conversations`, conversationId),
    {
      members: [patientId, pharmacistId],
      pharmacist_id: pharmacistId,
    },
    { merge: true },
  )
}
