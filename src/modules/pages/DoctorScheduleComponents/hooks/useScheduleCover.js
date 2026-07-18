import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ConfirmAlert, ErrorAlert } from "../../../../config/sweetAlert2"
import { ROLE_DOCTOR, TOAST_ERROR, TOAST_SUCCESS } from "../../../../lib/constants"
import createToastMessage from "../../../../lib/utils/createToastMessage"
import {
    fetchCoverCandidates,
    fetchCoverReassign,
    fetchDoctorsForCover,
} from "../services"

const useScheduleCover = ({ onSuccess } = {}) => {
    const { t } = useTranslation(["doctor-schedule", "modal"])
    const [doctors, setDoctors] = useState([])
    const [fromDoctorId, setFromDoctorId] = useState("")
    const [date, setDate] = useState("")
    const [session, setSession] = useState("morning")
    const [candidates, setCandidates] = useState([])
    const [loadingDoctors, setLoadingDoctors] = useState(false)
    const [loadingCandidates, setLoadingCandidates] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        let cancelled = false
        const load = async () => {
            setLoadingDoctors(true)
            try {
                const res = await fetchDoctorsForCover()
                if (cancelled) return
                const list = (res.data || []).filter((u) => u.role === ROLE_DOCTOR && u.is_active !== false)
                setDoctors(list)
            } catch (err) {
                console.log(err)
                if (!cancelled) setDoctors([])
            } finally {
                if (!cancelled) setLoadingDoctors(false)
            }
        }
        load()
        return () => {
            cancelled = true
        }
    }, [])

    const loadCandidates = async () => {
        if (!fromDoctorId || !date || !session) {
            ErrorAlert(
                t("doctor-schedule:coverMissingFieldsTitle"),
                t("doctor-schedule:coverMissingFieldsBody"),
                t("modal:ok"),
            )
            return
        }
        setLoadingCandidates(true)
        setCandidates([])
        try {
            const res = await fetchCoverCandidates({
                fromDoctorId: Number(fromDoctorId),
                date,
                session,
            })
            setCandidates(res.data?.candidates || [])
        } catch (err) {
            const apiMsg = err?.response?.data?.errMsg
            ErrorAlert(
                t("doctor-schedule:coverLoadFailedTitle"),
                apiMsg || t("modal:pleaseTryAgain"),
                t("modal:ok"),
            )
            createToastMessage({
                type: TOAST_ERROR,
                message: apiMsg || t("doctor-schedule:coverLoadFailedTitle"),
            })
        } finally {
            setLoadingCandidates(false)
        }
    }

    const reassignTo = (toDoctorId) => {
        if (!fromDoctorId || !date || !session || !toDoctorId) return

        const run = async () => {
            setSubmitting(true)
            try {
                const res = await fetchCoverReassign({
                    fromDoctorId: Number(fromDoctorId),
                    toDoctorId: Number(toDoctorId),
                    date,
                    session,
                })
                if (res.status === 200) {
                    createToastMessage({
                        type: TOAST_SUCCESS,
                        message: t("doctor-schedule:coverSuccess"),
                    })
                    setCandidates([])
                    if (typeof onSuccess === "function") onSuccess()
                }
            } catch (err) {
                const apiMsg = err?.response?.data?.errMsg
                const errCode = err?.response?.data?.errCode
                ErrorAlert(
                    t("doctor-schedule:coverFailedTitle"),
                    apiMsg || t("modal:pleaseTryAgain"),
                    t("modal:ok"),
                )
                createToastMessage({
                    type: TOAST_ERROR,
                    message: apiMsg || errCode || t("doctor-schedule:coverFailedTitle"),
                })
            } finally {
                setSubmitting(false)
            }
        }

        return ConfirmAlert(
            t("doctor-schedule:coverConfirmTitle"),
            t("doctor-schedule:coverConfirmBody"),
            t("modal:ok"),
            t("modal:cancel"),
            () => {
                run()
            },
            () => {},
        )
    }

    return {
        doctors,
        fromDoctorId,
        setFromDoctorId,
        date,
        setDate,
        session,
        setSession,
        candidates,
        loadingDoctors,
        loadingCandidates,
        submitting,
        loadCandidates,
        reassignTo,
    }
}

export default useScheduleCover
