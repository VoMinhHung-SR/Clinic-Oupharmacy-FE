import APIs, { endpoints } from "../../../../config/APIs"

export const fetchCreateDoctorScheduleByWeek = async (data) => {
    const res = await APIs.post(endpoints['doctor-create-schedule-weekly'], data)
    return res
}

export const fetchGetDoctorScheduleByWeek = async (weekly_str) => {
    const res = await APIs.get(`${endpoints['doctor-stats']}?${weekly_str}`)
    return res
}

export const fetchCheckWeeklySchedule = async (week_str) => {
    const res = await APIs.get(`${endpoints['doctor-check-weekly-schedule']}?${week_str}`)
    return res
}

export const fetchUpdateDoctorSchedule = async (data, week_str) => {
    const res = await APIs.put(`${endpoints['doctor-update-schedule-weekly']}?${week_str}`, data)
    return res
}