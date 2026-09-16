import { Box } from "@mui/material"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import moment from "moment"
import useDoctorSchedule from "../hooks/useDoctorSchedule"
import { useEffect, useMemo, useState } from "react"
import SkeletonDoctorScheduleList from "../../../common/components/skeletons/pages/doctor-schedules"
import WeekToolbar from "../WeekToolbar"
import WeekSessionGrid from "../WeekSessionGrid"
import WeekSidebar from "../WeekSidebar"

const DoctorScheduleForm = ({ doctor }) => {
  const {
    onSubmit,
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
  } = useDoctorSchedule()
  const { t, ready } = useTranslation(["doctor-schedule", "common"])

  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      doctorID: doctor.id,
      weekly_schedule: {},
    },
  })

  const dayLabels = useMemo(
    () => [
      t("doctor-schedule:monday"),
      t("doctor-schedule:tuesday"),
      t("doctor-schedule:wednesday"),
      t("doctor-schedule:thursday"),
      t("doctor-schedule:friday"),
      t("doctor-schedule:saturday"),
    ],
    [t],
  )

  const { daysOfSelectedWeek, currentWeekDates } = useMemo(() => {
    const start = moment().isoWeekYear(selectedYear).isoWeek(selectedWeek).startOf("isoWeek")
    return {
      daysOfSelectedWeek: Array.from({ length: 6 }, (_, i) =>
        start.clone().add(i, "days").format("DD/MM/YYYY"),
      ),
      currentWeekDates: Array.from({ length: 6 }, (_, i) =>
        start.clone().add(i, "days").format("YYYY-MM-DD"),
      ),
    }
  }, [selectedWeek, selectedYear])

  const [focusedDate, setFocusedDate] = useState(null)
  const [editOpen, setEditOpen] = useState(false)

  useEffect(() => {
    const today = moment().format("YYYY-MM-DD")
    if (currentWeekDates.includes(today)) {
      setFocusedDate(today)
    } else {
      setFocusedDate(currentWeekDates[0] || null)
    }
  }, [currentWeekDates])

  const hasExistingSchedule = useMemo(
    () =>
      currentWeekDates.some(
        (date) =>
          existSchedule?.[doctor.email]?.[date]?.morning ||
          existSchedule?.[doctor.email]?.[date]?.afternoon,
      ),
    [currentWeekDates, existSchedule, doctor.email],
  )

  const resetFormFromServer = () => {
    const doctorSchedule = existSchedule?.[doctor.email]
    methods.reset({
      doctorID: doctor.id,
      weekly_schedule: doctorSchedule || {},
    })
  }

  useEffect(() => {
    resetFormFromServer()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync when server schedule changes
  }, [existSchedule, doctor])

  const handleCloseEdit = () => {
    resetFormFromServer()
    setEditOpen(false)
  }

  const handleSave = methods.handleSubmit((data) =>
    onSubmit(data, currentWeekDates, { onSuccess: () => setEditOpen(false) }),
  )

  if (!ready) {
    return (
      <Box>
        <SkeletonDoctorScheduleList />
      </Box>
    )
  }

  return (
    <Box
      component="form"
      onSubmit={handleSave}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        opacity: isLoading ? 0.72 : 1,
        transition: "opacity 0.15s",
        pointerEvents: isLoading ? "none" : "auto",
      }}
    >
      <WeekToolbar
        selectedWeek={selectedWeek}
        selectedYear={selectedYear}
        onPrevWeek={goPrevWeek}
        onNextWeek={goNextWeek}
        onThisWeek={goThisWeek}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          flex: 1,
          minHeight: { xs: 520, md: 0 },
          alignItems: "stretch",
        }}
      >
        <Box
          sx={{
            flex: "1 1 0",
            minWidth: 0,
            minHeight: { xs: 360, md: 0 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <WeekSessionGrid
            control={methods.control}
            doctor={doctor}
            scheduleData={existSchedule}
            focusedDate={focusedDate}
            onFocusDate={setFocusedDate}
            daysOfSelectedWeek={daysOfSelectedWeek}
            currentWeekDates={currentWeekDates}
            dayLabels={dayLabels}
            editable={editOpen}
          />
        </Box>

        <WeekSidebar
          control={methods.control}
          doctor={doctor}
          scheduleData={existSchedule}
          focusedDate={focusedDate}
          dayLabels={dayLabels}
          currentWeekDates={currentWeekDates}
          hasExistingSchedule={hasExistingSchedule}
          isLoading={isLoading}
          onSubmitClick={handleSave}
          onCoverSuccess={refreshSchedule}
          applyRange={applyRange}
          setApplyRange={setApplyRange}
          editOpen={editOpen}
          onOpenEdit={() => setEditOpen(true)}
          onCloseEdit={handleCloseEdit}
        />
      </Box>
    </Box>
  )
}

export default DoctorScheduleForm
