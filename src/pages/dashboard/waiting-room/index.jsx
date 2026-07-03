import { useTranslation } from "react-i18next"
import useOnlineWaitingRoom from "../../../modules/pages/WaittingRoomComponents/hooks/useOnlineWaitingRoom"
import { Paper, Typography, Grid, Box } from "@mui/material"
import moment from "moment"
import { CURRENT_DATE, WAITING_SESSION_AFTERNOON, WAITING_SESSION_MORNING } from "../../../lib/constants"
import SkeletonListLineItem from "../../../modules/common/components/skeletons/listLineItem"
import { Helmet } from "react-helmet"
import TimeSlotGrid from "../../../modules/pages/WaittingRoomComponents/TimeSlotGrid"
import { useState, useEffect } from "react"
import {
  DASHBOARD_PAGE_FRAME_SX,
  DASHBOARD_SCROLL_CONTENT_SX,
  DASHBOARD_SURFACE,
} from "../../../modules/common/layout/dashboard/styleTokens"

const waitingRoomHeaderSx = {
  p: 2,
  flexShrink: 0,
  bgcolor: "primary.main",
  color: "primary.contrastText",
  textAlign: "center",
}

const sessionLabelSx = {
  flexShrink: 0,
  textAlign: "center",
  bgcolor: "grey.100",
  p: 1.25,
}

const DashboardWaitingRoom = () => {
  const { t } = useTranslation(["waiting-room"])
  const { schedules, loading, error, updateTimeSlot } = useOnlineWaitingRoom()
  const [ticketsByTimeSlot, setTicketsByTimeSlot] = useState({})

  const timeSlots = [
    "08:00-09:00",
    "09:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "13:00-14:00",
    "14:00-15:00",
    "15:00-16:00",
    "16:00-17:00",
  ]

  useEffect(() => {
    if (schedules) {
      const initialTickets = {}
      timeSlots.forEach((timeSlot) => {
        initialTickets[timeSlot] = getTicketsForTimeSlot(timeSlot)
      })
      setTicketsByTimeSlot(initialTickets)
    }
  }, [schedules])

  const getTicketsForTimeSlot = (timeSlot) => {
    return schedules.flatMap((schedule) =>
      schedule.time_slots
        .filter((slot) => {
          const slotTime = `${slot.start_time.slice(0, 5)}-${slot.end_time.slice(0, 5)}`
          return slotTime === timeSlot
        })
        .map((slot) => ({
          id: slot.appointment_info.id,
          patientName: slot.patient_info.name,
          status: slot.status,
          session:
            Number(slot.start_time.slice(0, 2)) < 12
              ? WAITING_SESSION_MORNING
              : WAITING_SESSION_AFTERNOON,
          doctorName: slot.appointment_info.doctor_info.doctor_name,
          doctorId: slot.appointment_info.doctor_info.doctor_id,
          timeSlot: `${slot.start_time.slice(0, 5)}-${slot.end_time.slice(0, 5)}`,
        }))
    )
  }

  const handleTicketMove = async (ticket, newTimeSlot, session) => {
    const previousState = { ...ticketsByTimeSlot }
    setTicketsByTimeSlot((prevTickets) => {
      const newTickets = { ...prevTickets }
      Object.keys(newTickets).forEach((slot) => {
        newTickets[slot] = newTickets[slot].filter((item) => item.id !== ticket.id)
      })
      newTickets[newTimeSlot] = [...newTickets[newTimeSlot], ticket]
      return newTickets
    })

    const [newStartTime, newEndTime] = newTimeSlot.split("-")
    try {
      const result = await updateTimeSlot(
        ticket.id,
        newStartTime,
        newEndTime,
        ticket.doctorId,
        ticket.session,
        session
      )
      if (!result) {
        setTicketsByTimeSlot(previousState)
      }
    } catch {
      setTicketsByTimeSlot(previousState)
    }
  }

  const renderGrid = (slots, session) =>
    slots.map((timeSlot) => (
      <TimeSlotGrid
        key={timeSlot}
        timeSlot={timeSlot}
        tickets={ticketsByTimeSlot[timeSlot] || []}
        onTicketMove={(ticket, newTimeSlot) => handleTicketMove(ticket, newTimeSlot, session)}
      />
    ))

  const roomShell = (body) => (
    <Paper
      elevation={DASHBOARD_SURFACE.elevation}
      sx={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        borderRadius: DASHBOARD_SURFACE.borderRadius,
        overflow: "hidden",
      }}
    >
      <Box sx={waitingRoomHeaderSx}>
        <Typography variant="h6">
          {t("title")} - {moment(CURRENT_DATE).format("DD/MM/YYYY")}
        </Typography>
      </Box>
      <Box className="ou-scrollbar" sx={DASHBOARD_SCROLL_CONTENT_SX}>
        {body}
      </Box>
    </Paper>
  )

  if (loading) {
    return (
      <Box sx={DASHBOARD_PAGE_FRAME_SX}>
        {roomShell(
          <>
            <Box sx={sessionLabelSx}>{t("morning")}</Box>
            <Grid container>
              <SkeletonListLineItem height="200px" width="25%" />
              <SkeletonListLineItem height="200px" width="25%" />
              <SkeletonListLineItem height="200px" width="25%" />
              <SkeletonListLineItem height="200px" width="25%" />
            </Grid>
            <Box sx={sessionLabelSx}>{t("afternoon")}</Box>
            <Grid container>
              <SkeletonListLineItem height="200px" width="25%" />
              <SkeletonListLineItem height="200px" width="25%" />
              <SkeletonListLineItem height="200px" width="25%" />
              <SkeletonListLineItem height="200px" width="25%" />
            </Grid>
          </>
        )}
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ ...DASHBOARD_PAGE_FRAME_SX, justifyContent: "center", alignItems: "center" }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    )
  }

  return (
    <Box sx={DASHBOARD_PAGE_FRAME_SX}>
      <Helmet>
        <title>{t("title")}</title>
      </Helmet>
      {roomShell(
        <>
          <Box sx={sessionLabelSx}>{t("morning")}</Box>
          <Grid container>{renderGrid(timeSlots.slice(0, 4), "morning")}</Grid>
          <Box sx={sessionLabelSx}>{t("afternoon")}</Box>
          <Grid container>{renderGrid(timeSlots.slice(4), "afternoon")}</Grid>
        </>
      )}
    </Box>
  )
}

export default DashboardWaitingRoom
