import { useContext } from "react"
import { Box, Paper } from "@mui/material"
import { useTranslation } from "react-i18next"
import DoctorScheduleForm from "../../../modules/pages/DoctorScheduleComponents/DoctorScheduleForm"
import UserContext from "../../../lib/context/UserContext"
import { Helmet } from "react-helmet"
import SkeletonDoctorScheduleList from "../../../modules/common/components/skeletons/pages/doctor-schedules"
import {
  DASHBOARD_PAGE_FRAME_SX,
  DASHBOARD_SCROLL_CONTENT_SX,
  DASHBOARD_SURFACE,
} from "../../../modules/common/layout/dashboard/styleTokens"

const DoctorSchedules = () => {
  const { t, tReady } = useTranslation(["doctor-schedule", "common"])
  const { user } = useContext(UserContext)

  if (!tReady)
    return (
      <Box sx={DASHBOARD_PAGE_FRAME_SX}>
        <Helmet>
          <title>Doctor Schedules</title>
        </Helmet>
        <SkeletonDoctorScheduleList />
      </Box>
    )

  return (
    <>
      <Helmet>
        <title>{t("doctor-schedule:doctor-schedule")}</title>
      </Helmet>
      <Box sx={DASHBOARD_PAGE_FRAME_SX}>
        <Paper
          elevation={DASHBOARD_SURFACE.elevation}
          className="ou-scrollbar"
          sx={{
            ...DASHBOARD_SCROLL_CONTENT_SX,
            borderRadius: DASHBOARD_SURFACE.borderRadius,
            width: "100%",
            maxWidth: "100%",
            mx: "auto",
          }}
        >
          <DoctorScheduleForm doctor={user} />
        </Paper>
      </Box>
    </>
  )
}

export default DoctorSchedules
