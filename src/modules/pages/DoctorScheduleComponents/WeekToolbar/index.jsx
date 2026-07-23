import { Box, Button, IconButton, Typography } from "@mui/material"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { useTranslation } from "react-i18next"
import moment from "moment"
import {
  DASHBOARD_FILTER_BUTTON_SX,
  dashboardRadius,
} from "../../../common/layout/dashboard/styleTokens"

const WeekToolbar = ({
  selectedWeek,
  selectedYear,
  onPrevWeek,
  onNextWeek,
  onThisWeek,
}) => {
  const { t } = useTranslation(["doctor-schedule", "common"])

  const start = moment().isoWeekYear(selectedYear).isoWeek(selectedWeek).startOf("isoWeek")
  const end = start.clone().add(5, "days")
  const rangeLabel = `${start.format("DD/MM/YY")} – ${end.format("DD/MM/YY")}`

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.5,
        px: { xs: 1.5, md: 2 },
        py: 1.5,
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        flexShrink: 0,
      }}
    >
      <Typography variant="subtitle1" fontWeight={600} color="primary.dark">
        {t("doctor-schedule:doctorCalendar")} — {t("doctor-schedule:week")} {selectedWeek},{" "}
        {selectedYear}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <IconButton
          size="small"
          onClick={onPrevWeek}
          aria-label={t("doctor-schedule:prevWeek")}
          sx={{ border: 1, borderColor: "divider", borderRadius: dashboardRadius("control") }}
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>

        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ minWidth: { xs: 140, sm: 180 }, textAlign: "center" }}
        >
          {t("doctor-schedule:week")} {selectedWeek}: {rangeLabel}
        </Typography>

        <IconButton
          size="small"
          onClick={onNextWeek}
          aria-label={t("doctor-schedule:nextWeek")}
          sx={{ border: 1, borderColor: "divider", borderRadius: dashboardRadius("control") }}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>

        <Button
          size="small"
          variant="outlined"
          onClick={onThisWeek}
          sx={DASHBOARD_FILTER_BUTTON_SX}
        >
          {t("doctor-schedule:thisWeek")}
        </Button>
      </Box>
    </Box>
  )
}

export default WeekToolbar
