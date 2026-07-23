import { Box, Checkbox, Tooltip, Typography, alpha, useTheme } from "@mui/material"
import CircleIcon from "@mui/icons-material/Circle"
import { Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"
import moment from "moment"
import { useState } from "react"
import {
  DASHBOARD_TABLE_HEAD_BG,
  dashboardRadius,
} from "../../../common/layout/dashboard/styleTokens"
import { ROLE_DOCTOR } from "../../../../lib/constants"

const SESSIONS = ["morning", "afternoon"]

const cellKey = (date, session) => `${date}:${session}`

/**
 * Week grid as CSS grid (not MUI Table) so hover/focus apply to exactly one cell.
 * Body cells stay neutral; today/focus markers live on the header only.
 */
const WeekSessionGrid = ({
  control,
  doctor,
  scheduleData,
  focusedDate,
  onFocusDate,
  daysOfSelectedWeek,
  currentWeekDates,
  dayLabels,
  editable = false,
}) => {
  const { t } = useTranslation(["doctor-schedule", "common"])
  const theme = useTheme()
  const isDoctor = doctor?.role === ROLE_DOCTOR
  const [hoveredKey, setHoveredKey] = useState(null)

  const isToday = (date) => moment().format("YYYY-MM-DD") === date
  const isPastOrToday = (date) => moment(date).isSameOrBefore(moment(), "day")

  const hoverTint = alpha(theme.palette.primary.main, 0.1)
  const todayHeaderBg = alpha(theme.palette.primary.main, 0.1)

  const renderDoctorEditors = (date, session) => {
    const disabled = !editable || isPastOrToday(date)
    return (
      <Controller
        name={`weekly_schedule.${date}.${session}`}
        control={control}
        defaultValue={{ session, is_off: true }}
        render={({ field }) => {
          const available = !field.value?.is_off
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Checkbox
                checked={available}
                onChange={(e) => {
                  e.stopPropagation()
                  if (!editable) return
                  field.onChange({
                    ...(field.value || { session }),
                    session,
                    is_off: !e.target.checked,
                  })
                }}
                onClick={(e) => e.stopPropagation()}
                disabled={disabled}
                readOnly={!editable}
                size="medium"
                inputProps={{ "aria-label": `${session} ${date}` }}
                sx={{
                  color: available ? "success.main" : undefined,
                  "&.Mui-checked": { color: "primary.main" },
                }}
              />
            </Box>
          )
        }}
      />
    )
  }

  const renderNurseOverview = (date, session) => {
    if (!scheduleData || typeof scheduleData !== "object") {
      return (
        <Typography variant="body2" color="text.disabled" fontWeight={400}>
          —
        </Typography>
      )
    }

    const entries = Object.keys(scheduleData)
      .map((email) => {
        const schedule = scheduleData[email]?.[date]
        if (!schedule?.[session]) return null
        return { email, available: !schedule[session].is_off }
      })
      .filter(Boolean)

    if (entries.length === 0) {
      return (
        <Typography variant="body2" color="text.disabled" fontWeight={400}>
          —
        </Typography>
      )
    }

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 0.5,
          width: "100%",
          px: 0.5,
        }}
      >
        {entries.map(({ email, available }) => {
          const displayName = email.split("@")[0]
          const shortName = displayName.length > 14 ? `${displayName.slice(0, 14)}…` : displayName
          return (
            <Tooltip title={email} key={email} arrow>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 0 }}>
                <CircleIcon
                  aria-hidden
                  sx={{
                    color: available ? "success.main" : "error.main",
                    fontSize: 11,
                    flexShrink: 0,
                  }}
                />
                <Typography variant="caption" fontWeight={500} color="text.primary" noWrap>
                  {shortName}
                </Typography>
              </Box>
            </Tooltip>
          )
        })}
      </Box>
    )
  }

  const cornerSx = {
    bgcolor: DASHBOARD_TABLE_HEAD_BG,
    borderBottom: "2px solid",
    borderColor: "primary.main",
    borderRight: 1,
    borderRightColor: "divider",
    display: "flex",
    alignItems: "center",
    px: 1.5,
    py: 1.25,
    fontWeight: 600,
    fontSize: "0.8125rem",
    color: "text.secondary",
    position: "sticky",
    left: 0,
    zIndex: 2,
  }

  const sessionLabelSx = {
    bgcolor: "background.paper",
    borderRight: 1,
    borderBottom: 1,
    borderColor: "divider",
    display: "flex",
    alignItems: "center",
    px: 1.5,
    fontWeight: 500,
    fontSize: "0.8125rem",
    color: "text.secondary",
    position: "sticky",
    left: 0,
    zIndex: 1,
  }

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        overflow: "auto",
        overscrollBehavior: "contain",
        px: { xs: 1, md: 1.5 },
        py: 1.5,
        "@media (prefers-reduced-motion: reduce)": {
          "& *": { transition: "none !important" },
        },
      }}
    >
      <Box
        role="grid"
        aria-label={t("doctor-schedule:doctorCalendar")}
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: `88px repeat(6, minmax(104px, 1fr))`,
            md: `112px repeat(6, minmax(0, 1fr))`,
          },
          gridTemplateRows: "auto minmax(140px, 1fr) minmax(140px, 1fr)",
          minHeight: { xs: 360, md: "100%" },
          height: { md: "100%" },
          minWidth: 720,
          border: 1,
          borderColor: "divider",
          borderRadius: dashboardRadius("control"),
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        {/* Corner */}
        <Box role="columnheader" sx={cornerSx}>
          {t("doctor-schedule:time")}
        </Box>

        {/* Day headers */}
        {currentWeekDates.map((date, index) => {
          const today = isToday(date)
          const focused = focusedDate === date
          return (
            <Box
              key={`h-${date}`}
              role="columnheader"
              tabIndex={0}
              onClick={() => onFocusDate(date)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onFocusDate(date)
                }
              }}
              sx={{
                bgcolor: today ? todayHeaderBg : DASHBOARD_TABLE_HEAD_BG,
                borderBottom: "2px solid",
                borderColor: "primary.main",
                borderLeft: index === 0 ? 0 : 1,
                borderLeftColor: "divider",
                boxShadow: focused ? `inset 0 -3px 0 ${theme.palette.primary.main}` : "none",
                cursor: "pointer",
                textAlign: "center",
                px: 1,
                py: 1.25,
                outline: "none",
                transition: "background-color 0.12s ease",
                "&:hover": { bgcolor: hoverTint },
                "&:focus-visible": {
                  boxShadow: `inset 0 0 0 2px ${theme.palette.primary.main}`,
                },
              }}
            >
              <Typography
                component="span"
                sx={{
                  display: "block",
                  fontWeight: today ? 700 : 600,
                  fontSize: "0.8125rem",
                  lineHeight: 1.3,
                  color: "primary.dark",
                  textWrap: "balance",
                }}
              >
                {dayLabels[index]}
                {today ? ` (${t("doctor-schedule:today")})` : ""}
              </Typography>
              <Typography
                component="span"
                sx={{
                  display: "block",
                  fontWeight: 400,
                  fontSize: "0.75rem",
                  lineHeight: 1.3,
                  color: "text.secondary",
                  mt: 0.25,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {daysOfSelectedWeek[index]}
              </Typography>
            </Box>
          )
        })}

        {/* Session rows */}
        {SESSIONS.map((session) => (
          <Box key={session} sx={{ display: "contents" }}>
            <Box role="rowheader" sx={sessionLabelSx}>
              {t(`doctor-schedule:${session}`)}
            </Box>
            {currentWeekDates.map((date, index) => {
              const key = cellKey(date, session)
              const isHovered = hoveredKey === key
              return (
                <Box
                  key={key}
                  role="gridcell"
                  tabIndex={0}
                  aria-selected={focusedDate === date}
                  onClick={() => onFocusDate(date)}
                  onMouseEnter={() => setHoveredKey(key)}
                  onMouseLeave={() => setHoveredKey((prev) => (prev === key ? null : prev))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      onFocusDate(date)
                    }
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderLeft: index === 0 ? 0 : 1,
                    borderBottom: session === "morning" ? 1 : 0,
                    borderColor: "divider",
                    // Hover is the only body fill — never paint the whole column
                    bgcolor: isHovered ? hoverTint : "background.paper",
                    cursor: "pointer",
                    outline: "none",
                    transitionProperty: "background-color",
                    transitionDuration: "0.12s",
                    transitionTimingFunction: "ease",
                    touchAction: "manipulation",
                    "&:focus-visible": {
                      boxShadow: `inset 0 0 0 2px ${theme.palette.primary.main}`,
                      zIndex: 1,
                    },
                  }}
                >
                  {isDoctor
                    ? renderDoctorEditors(date, session)
                    : renderNurseOverview(date, session)}
                </Box>
              )
            })}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default WeekSessionGrid
