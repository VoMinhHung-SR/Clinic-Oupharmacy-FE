import { Box, Grid, Paper } from "@mui/material"
import { Helmet } from "react-helmet"
import StatisticCard from "../../modules/common/components/card/StatisticCard"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import AssignmentIcon from "@mui/icons-material/Assignment"
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew"
import { CURRENT_DATE, MAX_EXAM_PER_DAY, ROLE_ADMIN, ROLE_DOCTOR } from "../../lib/constants"
import useStatistic from "../../modules/pages/DashboardComponents/hooks/useStatistic"
import useLimitExamPerDay from "../../modules/pages/HomeComponents/hooks/useLimitExamPerDay"
import { useTranslation } from "react-i18next"
import SkeletonDashboardHome from "../../modules/common/components/skeletons/pages/dashboard"
import PillsIcon from "../../lib/icon/PillsIcon"
import BookingChart from "../../modules/common/components/charts/BookingChart"
import RevenueChart from "../../modules/common/components/charts/RevenueChart"
import DoctorScheduleWeeklyChart from "../../modules/common/components/charts/DoctorScheduleWeeklyChart"
import { useContext } from "react"
import UserContext from "../../lib/context/UserContext"
import {
  DASHBOARD_PAGE_FRAME_SX,
  DASHBOARD_SCROLL_CONTENT_SX,
  DASHBOARD_SURFACE,
} from "../../modules/common/layout/dashboard/styleTokens"

const DashBoard = () => {
  const { t, tReady } = useTranslation(["dashboard"])
  const { user } = useContext(UserContext)
  const { totalPatients, totalUsers, totalProducts, totalVariants, totalVariantUnits, totalMedicineUnit } =
    useStatistic()
  const { totalExams } = useLimitExamPerDay(CURRENT_DATE)

  if (!tReady)
    return (
      <Box sx={DASHBOARD_PAGE_FRAME_SX}>
        <Helmet>
          <title>Dashboard</title>
        </Helmet>
        <SkeletonDashboardHome />
      </Box>
    )

  return (
    <>
      <Helmet>
        <title>{t("dashboard:dashboard")}</title>
      </Helmet>
      <Box sx={DASHBOARD_PAGE_FRAME_SX}>
        <Grid container sx={{ flexShrink: 0, mb: 2 }}>
          <Grid item xs={12} sm={6} md={3} sx={{ p: 1, pl: { md: 0 } }}>
            <StatisticCard
              icon={<AccessibilityNewIcon sx={{ fontSize: 60, color: "primary.main" }} />}
              title={t("dashboard:patients")}
              value={totalPatients}
              footer={t("dashboard:noteTotalPatients")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ p: 1 }}>
            <StatisticCard
              icon={<AccountCircleIcon sx={{ fontSize: 60, color: "primary.main" }} />}
              title={t("dashboard:users")}
              value={totalUsers}
              footer={t("dashboard:noteTotalUsers")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ p: 1 }}>
            <StatisticCard
              icon={<AssignmentIcon sx={{ fontSize: 60, color: "primary.main" }} />}
              title={t("dashboard:bookings")}
              value={`${totalExams}/${MAX_EXAM_PER_DAY}`}
              footer={t("dashboard:noteTotalBookings")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ p: 1, pr: { md: 0 } }}>
            <StatisticCard
              icon={
                <Box sx={{ color: "primary.main", lineHeight: 0 }}>
                  <PillsIcon size={60} />
                </Box>
              }
              title={t("dashboard:noteTotalProducts")}
              value={totalProducts || totalMedicineUnit}
              footer={`SKU: ${totalVariants || totalMedicineUnit} | ${t("dashboard:variantUnits")}: ${totalVariantUnits || 0}`}
            />
          </Grid>
        </Grid>

        <Box className="ou-scrollbar" sx={DASHBOARD_SCROLL_CONTENT_SX}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper elevation={DASHBOARD_SURFACE.elevation} sx={{ p: 2, borderRadius: DASHBOARD_SURFACE.borderRadius }}>
                {user.role === ROLE_ADMIN || user.role === ROLE_DOCTOR ? (
                  <DoctorScheduleWeeklyChart />
                ) : (
                  <BookingChart />
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={DASHBOARD_SURFACE.elevation} sx={{ p: 2, borderRadius: DASHBOARD_SURFACE.borderRadius }}>
                <RevenueChart />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  )
}

export default DashBoard
