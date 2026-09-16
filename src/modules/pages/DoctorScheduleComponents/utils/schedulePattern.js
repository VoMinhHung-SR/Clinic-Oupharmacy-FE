import moment from "moment"

/**
 * Build Mon–Sat session template from the visible week form values.
 * @param {Record<string, Record<string, { session?: string, is_off?: boolean }>>} weeklySchedule
 * @param {string[]} currentWeekDates YYYY-MM-DD × 6 (Mon–Sat)
 */
export const buildWeekdayPattern = (weeklySchedule, currentWeekDates) =>
  currentWeekDates.map((date) => {
    const day = weeklySchedule?.[date] || {}
    const out = {}
    ;["morning", "afternoon"].forEach((session) => {
      const cell = day[session]
      out[session] = {
        session,
        is_off: cell ? !!cell.is_off : true,
      }
    })
    return out
  })

/**
 * Expand weekday pattern across `weekCount` ISO weeks starting at selected year/week.
 * Following weeks only include dates after today (create/open slots ahead).
 */
export const expandPatternToWeeks = ({
  pattern,
  selectedYear,
  selectedWeek,
  weekCount,
}) => {
  const byWeek = []
  const today = moment().startOf("day")

  for (let w = 0; w < weekCount; w++) {
    const weekStart = moment()
      .isoWeekYear(selectedYear)
      .isoWeek(selectedWeek)
      .startOf("isoWeek")
      .add(w, "week")
    const weekYear = weekStart.isoWeekYear()
    const weekNum = weekStart.isoWeek()
    const weekly_schedule = {}

    for (let d = 0; d < 6; d++) {
      const date = weekStart.clone().add(d, "days")
      const dateStr = date.format("YYYY-MM-DD")
      const dayPattern = pattern[d] || {
        morning: { session: "morning", is_off: true },
        afternoon: { session: "afternoon", is_off: true },
      }

      if (w === 0) {
        weekly_schedule[dateStr] = dayPattern
      } else if (date.isAfter(today, "day")) {
        weekly_schedule[dateStr] = dayPattern
      }
    }

    if (Object.keys(weekly_schedule).length > 0) {
      byWeek.push({
        year: weekYear,
        week: weekNum,
        weekStr: `week=${weekYear}-W${String(weekNum).padStart(2, "0")}`,
        weekly_schedule,
        isFirstWeek: w === 0,
      })
    }
  }

  return byWeek
}
