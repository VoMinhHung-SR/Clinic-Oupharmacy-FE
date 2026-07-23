import { useContext } from "react"
import { Box, Paper } from "@mui/material"
import { useTranslation } from "react-i18next"
import DoctorScheduleForm from "../../../modules/pages/DoctorScheduleComponents/DoctorScheduleForm"
import UserContext from "../../../lib/context/UserContext"
import { Helmet } from "react-helmet"
import SkeletonDoctorScheduleList from "../../../modules/common/components/skeletons/pages/doctor-schedules"
import {
  DASHBOARD_PAGE_FRAME_SX,
  DASHBOARD_SURFACE,
} from "../../../modules/common/layout/dashboard/styleTokens"

const DoctorSchedules = () => {
  const { t, ready } = useTranslation(["doctor-schedule", "common"])
  const { user } = useContext(UserContext)

  if (!ready)
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
            borderRadius: DASHBOARD_SURFACE.borderRadius,
            width: "100%",
            maxWidth: "100%",
            mx: "auto",
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <DoctorScheduleForm doctor={user} />
        </Paper>
      </Box>
    </>
  )
}

export default DoctorSchedules
