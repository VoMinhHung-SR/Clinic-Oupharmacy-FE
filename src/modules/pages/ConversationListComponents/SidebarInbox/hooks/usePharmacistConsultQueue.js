import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import createToastMessage from '../../../../../lib/utils/createToastMessage'
import { TOAST_ERROR, TOAST_SUCCESS } from '../../../../../lib/constants'
import {
  attachPharmacistToFirestoreConversation,
  claimConsultationSession,
  completeConsultationSession,
  fetchConsultationQueue,
} from '../services/consultationSessions'

const usePharmacistConsultQueue = (user, enabled) => {
  const { t } = useTranslation(['conversation', 'modal'])
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [busyId, setBusyId] = useState(null)
  const [sessions, setSessions] = useState([])

  const conversationPath = (conversationId, patientId) => {
    const base = window.location.pathname.includes('/dashboard')
      ? '/dashboard/conversations'
      : '/conversations'
    return `${base}/${conversationId}/${patientId}/message`
  }

  const reload = useCallback(async () => {
    if (!enabled || !user) return
    setLoading(true)
    try {
      const res = await fetchConsultationQueue()
      const rows = Array.isArray(res.data) ? res.data : []
      setSessions(
        rows.filter(
          (row) =>
            row.status === 'WAITING_FOR_PROFESSIONAL' ||
            (row.pharmacist_id === user.id && row.status === 'IN_PROGRESS'),
        ),
      )
    } catch (err) {
      console.error(err)
      createToastMessage({
        type: TOAST_ERROR,
        message: t('consultQueueLoadFailed'),
      })
    } finally {
      setLoading(false)
    }
  }, [enabled, user, t])

  useEffect(() => {
    reload()
  }, [reload])

  const openSessionChat = useCallback(
    (session) => {
      const conversationId = session?.firestore_conversation_id
      if (!conversationId) {
        createToastMessage({ type: TOAST_ERROR, message: t('consultMissingThread') })
        return
      }
      navigate(conversationPath(conversationId, session.user_id))
    },
    [navigate, t],
  )

  const claimAndOpen = useCallback(
    async (session) => {
      if (!user || !session?.id) return

      if (session.pharmacist_id === user.id && session.status === 'IN_PROGRESS') {
        openSessionChat(session)
        return
      }

      setBusyId(session.id)
      try {
        const res = await claimConsultationSession(session.id)
        const claimed = res.data
        const conversationId =
          claimed?.firestore_conversation_id || session.firestore_conversation_id
        const patientId = claimed?.user_id || session.user_id
        await attachPharmacistToFirestoreConversation(conversationId, patientId, user.id)
        createToastMessage({ type: TOAST_SUCCESS, message: t('consultClaimed') })
        await reload()
        if (conversationId) {
          navigate(conversationPath(conversationId, patientId))
        }
      } catch (err) {
        console.error(err)
        createToastMessage({ type: TOAST_ERROR, message: t('consultClaimFailed') })
      } finally {
        setBusyId(null)
      }
    },
    [user, navigate, reload, t, openSessionChat],
  )

  const completeSession = useCallback(
    async (session) => {
      if (!session?.id) return
      setBusyId(session.id)
      try {
        await completeConsultationSession(session.id)
        createToastMessage({ type: TOAST_SUCCESS, message: t('consultCompleted') })
        await reload()
      } catch (err) {
        console.error(err)
        createToastMessage({ type: TOAST_ERROR, message: t('consultCompleteFailed') })
      } finally {
        setBusyId(null)
      }
    },
    [reload, t],
  )

  return {
    loading,
    sessions,
    busyId,
    reload,
    claimAndOpen,
    completeSession,
  }
}

export default usePharmacistConsultQueue
