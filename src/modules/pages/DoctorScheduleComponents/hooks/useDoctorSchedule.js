import { useContext, useEffect, useState } from "react"
import { fetchCheckWeeklySchedule, fetchCreateDoctorScheduleByWeek, fetchUpdateDoctorSchedule } from "../services"
import { useTranslation } from "react-i18next"
import { ConfirmAlert, ErrorAlert } from "../../../../config/sweetAlert2"
import { useSearchParams } from "react-router-dom"
import moment from "moment"
import UserContext from "../../../../lib/context/UserContext"
import { TOAST_ERROR, TOAST_SUCCESS } from "../../../../lib/constants"
import createToastMessage from "../../../../lib/utils/createToastMessage"
import { buildWeekdayPattern, expandPatternToWeeks } from "../utils/schedulePattern"

const isoWeekStateFromMoment = (m) => {
    const day = m.clone()
    if (day.day() === 0) day.add(1, "day")
    return { year: day.isoWeekYear(), week: day.isoWeek() }
}

const useDoctorSchedule = () => {
    const { t } = useTranslation(["modal", "doctor-schedule"])

    const now = moment()
    const { user } = useContext(UserContext)
    const initial = isoWeekStateFromMoment(now)

    const [selectedYear, setSelectedYear] = useState(initial.year)
    const [selectedWeek, setSelectedWeek] = useState(initial.week)
    const [isLoading, setIsLoading] = useState(false)
    const [flag, setFlag] = useState(false)
    const [existSchedule, setExistSchedule] = useState({})
    /** @type {'week' | 'month'} */
    const [applyRange, setApplyRange] = useState("week")

    const [q] = useSearchParams()

    useEffect(() => {
        const checkWeeklySchedule = async () => {
            try {
                setIsLoading(true)
                let query = q.toString()

                let querySample = query
                    ? `${query}&week=${selectedYear}-W${selectedWeek.toString().padStart(2, "0")}`
                    : `week=${selectedYear}-W${selectedWeek.toString().padStart(2, "0")}`

                const res = await fetchCheckWeeklySchedule(querySample)
                if (res.status === 200) {
                    setExistSchedule(res.data)
                }
            } catch (err) {
                console.log(err)
            } finally {
                setIsLoading(false)
            }
        }
        checkWeeklySchedule()
    }, [selectedWeek, selectedYear, flag, q])

    const shiftWeek = (delta) => {
        const next = moment()
            .isoWeekYear(selectedYear)
            .isoWeek(selectedWeek)
            .startOf("isoWeek")
            .add(delta, "week")
        setSelectedYear(next.isoWeekYear())
        setSelectedWeek(next.isoWeek())
    }

    const goPrevWeek = () => shiftWeek(-1)
    const goNextWeek = () => shiftWeek(1)
    const goThisWeek = () => {
        const cur = isoWeekStateFromMoment(moment())
        setSelectedYear(cur.year)
        setSelectedWeek(cur.week)
    }

    const handleApiError = (err) => {
        const apiMsg = err?.response?.data?.errMsg
        const errCode = err?.response?.data?.errCode
        if (errCode === "HAS_BOOKINGS") {
            ErrorAlert(
                t("doctor-schedule:updateBlockedTitle"),
                t("doctor-schedule:updateBlockedHasBookings"),
                t("modal:ok"),
            )
            createToastMessage({
                type: TOAST_ERROR,
                message: t("doctor-schedule:updateBlockedHasBookings"),
            })
        } else if (apiMsg) {
            ErrorAlert(t("doctor-schedule:updateBlockedTitle"), apiMsg, t("modal:ok"))
            createToastMessage({ type: TOAST_ERROR, message: apiMsg })
        } else {
            ErrorAlert(t("modal:errSomethingWentWrong"), t("modal:pleaseTryAgain"), t("modal:ok"))
        }
    }

    /**
     * @param {object} data form values
     * @param {string[]} currentWeekDates Mon–Sat YYYY-MM-DD for the visible week
     * @param {{ onSuccess?: () => void }} [options]
     */
    const onSubmit = (data, currentWeekDates = [], options = {}) => {
        const weekCount = applyRange === "month" ? 4 : 1
        const pattern = buildWeekdayPattern(data.weekly_schedule || {}, currentWeekDates)
        const weeks = expandPatternToWeeks({
            pattern,
            selectedYear,
            selectedWeek,
            weekCount,
        })

        const confirmTitle =
            applyRange === "month"
                ? t("doctor-schedule:confirmApplyMonth")
                : existSchedule[user.email]
                  ? t("doctor-schedule:confirmUpdateSchedule")
                  : t("doctor-schedule:confirmCreateSchedule")

        const handleOnSubmit = async () => {
            try {
                setIsLoading(true)
                let lastOk = false

                for (const chunk of weeks) {
                    const payload = {
                        doctorID: data.doctorID,
                        weekly_schedule: chunk.weekly_schedule,
                    }

                    if (chunk.isFirstWeek && existSchedule[user.email]) {
                        const res = await fetchUpdateDoctorSchedule(payload, chunk.weekStr)
                        lastOk = res.status === 200 || res.status === 201
                    } else {
                        const res = await fetchCreateDoctorScheduleByWeek(payload)
                        lastOk = res.status === 200 || res.status === 201
                    }
                }

                if (lastOk) {
                    createToastMessage({
                        type: TOAST_SUCCESS,
                        message:
                            applyRange === "month"
                                ? t("doctor-schedule:applyMonthSuccess")
                                : existSchedule[user.email]
                                  ? t("modal:updateSuccess")
                                  : t("modal:createSuccess"),
                    })
                    setFlag((prev) => !prev)
                    options.onSuccess?.()
                }
            } catch (err) {
                handleApiError(err)
            } finally {
                setIsLoading(false)
            }
        }

        return ConfirmAlert(
            confirmTitle,
            t("modal:noThrowBack"),
            t("modal:ok"),
            t("modal:cancel"),
            () => {
                handleOnSubmit()
            },
            () => {},
        )
    }

    const refreshSchedule = () => setFlag((prev) => !prev)

    return {
        onSubmit,
        setSelectedWeek,
        existSchedule,
        selectedWeek,
        selectedYear,
        isLoading,
        refreshSchedule,
        goPrevWeek,
        goNextWeek,
        goThisWeek,
        applyRange,
        setApplyRange,
    }
}
export default useDoctorSchedule
