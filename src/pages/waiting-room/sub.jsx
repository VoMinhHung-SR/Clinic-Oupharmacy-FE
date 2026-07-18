import { Box, Button, Paper, Typography, Grid } from "@mui/material"
import { useTranslation } from "react-i18next"
import { Helmet } from "react-helmet"
import { Link } from "react-router-dom"
import useOnlineWaitingRoom from "../../modules/pages/WaittingRoomComponents/hooks/useOnlineWaitingRoom"
import TimeSlotGrid from "../../modules/pages/WaittingRoomComponents/TimeSlotGrid"
import { CURRENT_DATE } from "../../lib/constants"
import moment from "moment"
import SkeletonListLineItem from "../../modules/common/components/skeletons/listLineItem"

const TIME_SLOTS = [
  "08:00-09:00",
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00",
]

const headerSx = {
  p: { xs: 1.5, sm: 2 },
  bgcolor: "primary.main",
  color: "primary.contrastText",
  textAlign: "center",
  borderRadius: "8px 8px 0 0",
}

const sessionLabelSx = {
  textAlign: "center",
  bgcolor: "grey.100",
  py: { xs: 1.5, sm: 2 },
}

const OnlineWaitingRoom = () => {
  const { t, tReady } = useTranslation(["waiting-room", "common"])
  const { schedules, loading, error } = useOnlineWaitingRoom()

  const getTicketsForTimeSlot = (timeSlot) =>
    schedules.flatMap((schedule) =>
      schedule.time_slots
        .filter((slot) => {
          const slotTime = `${slot.start_time.slice(0, 5)}-${slot.end_time.slice(0, 5)}`
          return slotTime === timeSlot
        })
        .map((slot) => ({
          id: slot.appointment_info.id,
          patientName: slot.patient_info.name,
          status: slot.status,
          doctorName: slot.appointment_info.doctor_info.doctor_name,
        }))
    )

  if (tReady || loading) {
    return (
      <Box>
        <Helmet>
          <title>{t("waiting-room:title")} - OUPharmacy</title>
        </Helmet>
        <Paper elevation={2} sx={{ borderRadius: 2 }}>
          <Box sx={headerSx}>
            <Typography variant="h6" sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
              {t("title")} - {moment(CURRENT_DATE).format("DD/MM/YYYY")}
            </Typography>
          </Box>
          <Box sx={sessionLabelSx}>{t("morning")}</Box>
          <Grid container>
            {TIME_SLOTS.slice(0, 4).map((slot) => (
              <Grid item xs={12} sm={6} md={3} sx={{ p: { xs: 1, sm: 2 } }} key={slot}>
                <SkeletonListLineItem height="200px" />
              </Grid>
            ))}
          </Grid>
          <Box sx={sessionLabelSx}>{t("afternoon")}</Box>
          <Grid container>
            {TIME_SLOTS.slice(4).map((slot) => (
              <Grid item xs={12} sm={6} md={3} sx={{ p: { xs: 1, sm: 2 } }} key={slot}>
                <SkeletonListLineItem height="200px" />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    )
  }

  if (error) {
    return (
      <Box>
        <Helmet>
          <title>{t("waiting-room:title")} - OUPharmacy</title>
        </Helmet>
        <Paper elevation={2} sx={{ borderRadius: 2, p: { xs: 2, sm: 4 }, textAlign: "center" }}>
          <Typography variant="h6" color="error" gutterBottom sx={{ fontSize: { xs: "1.05rem", sm: "1.25rem" } }}>
            {t("waiting-room:loadErrorTitle")}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3, fontSize: { xs: "0.95rem", sm: "1rem" } }}>
            {t("waiting-room:loadErrorDescription")}
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary" fullWidth sx={{ maxWidth: 280 }}>
            {t("common:backToHomepage")}
          </Button>
        </Paper>
      </Box>
    )
  }

  const hasAnyTicket = schedules.some(
    (s) => Array.isArray(s.time_slots) && s.time_slots.length > 0
  )

  return (
    <Box>
      <Helmet>
        <title>{t("waiting-room:title")} - OUPharmacy</title>
      </Helmet>

      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <Box sx={headerSx}>
          <Typography variant="h6" sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
            {t("title")} - {moment(CURRENT_DATE).format("DD/MM/YYYY")}
          </Typography>
        </Box>

        {!hasAnyTicket && (
          <Box sx={{ py: 3, px: 2, textAlign: "center" }}>
            <Typography color="text.secondary">{t("waiting-room:emptyToday")}</Typography>
          </Box>
        )}

        <Box sx={sessionLabelSx}>{t("morning")}</Box>
        <Grid container>
          {TIME_SLOTS.slice(0, 4).map((timeSlot) => (
            <TimeSlotGrid
              key={timeSlot}
              timeSlot={timeSlot}
              tickets={getTicketsForTimeSlot(timeSlot)}
            />
          ))}
        </Grid>

        <Box sx={sessionLabelSx}>{t("afternoon")}</Box>
        <Grid container>
          {TIME_SLOTS.slice(4).map((timeSlot) => (
            <TimeSlotGrid
              key={timeSlot}
              timeSlot={timeSlot}
              tickets={getTicketsForTimeSlot(timeSlot)}
            />
          ))}
        </Grid>
      </Paper>
    </Box>
  )
}

export default OnlineWaitingRoom
