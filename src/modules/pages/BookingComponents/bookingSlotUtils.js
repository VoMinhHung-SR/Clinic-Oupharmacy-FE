/**
 * Count bookable hour radios for a doctor schedule payload
 * (same rules as DoctorAvailabilityTime radios).
 */
export function countAvailableBookingSlots(schedule) {
  if (!Array.isArray(schedule) || schedule.length === 0) {
    return 0
  }

  const morningHours = [8, 9, 10, 11]
  const afternoonHours = [13, 14, 15, 16]
  let available = 0

  const countSession = (hours, session) => {
    for (const hour of hours) {
      const startHour = `${hour.toString().padStart(2, "0")}:00:00`
      const endHour = `${(hour + 1).toString().padStart(2, "0")}:00:00`
      const scheduleItem = schedule.find(
        (time) => time.session === session && time.is_off === false
      )
      if (!scheduleItem) continue
      const taken = scheduleItem.time_slots.some(
        (slot) => slot.start_time === startHour && slot.end_time === endHour
      )
      if (!taken) available += 1
    }
  }

  countSession(morningHours, "morning")
  countSession(afternoonHours, "afternoon")
  return available
}

export function hasSelectedBookingTime(selectedTime) {
  return Boolean(
    selectedTime &&
      selectedTime.start &&
      selectedTime.end &&
      selectedTime.scheduleID
  )
}
