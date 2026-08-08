import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Typography,
  alpha,
  useTheme,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import CircleIcon from "@mui/icons-material/Circle"
import { useState } from "react"
import { useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import moment from "moment"
import {
  DASHBOARD_FILTER_BUTTON_SX,
  dashboardRadius,
} from "../../../common/layout/dashboard/styleTokens"
import { ROLE_DOCTOR, ROLE_NURSE } from "../../../../lib/constants"
import ScheduleCoverPanel from "../ScheduleCoverPanel"

const SESSIONS = ["morning", "afternoon"]

/**
 * Nurse: status default → cover on trigger.
 * Doctor: status default → edit schedule on trigger → Quay lại / save → status.
 */
const WeekSidebar = ({
  control,
  doctor,
  scheduleData,
  focusedDate,
  dayLabels,
  currentWeekDates,
  hasExistingSchedule,
  isLoading,
  onSubmitClick,
  onCoverSuccess,
  applyRange,
  setApplyRange,
  editOpen,
  onOpenEdit,
  onCloseEdit,
}) => {
  const { t } = useTranslation(["doctor-schedule", "common", "modal"])
  const theme = useTheme()
  const isDoctor = doctor?.role === ROLE_DOCTOR
  const isNurse = doctor?.role === ROLE_NURSE
  const [coverOpen, setCoverOpen] = useState(false)
  const weeklySchedule = useWatch({ control, name: "weekly_schedule" }) || {}
  const availableBg = alpha(theme.palette.success.main, 0.08)

  const focusedIndex = currentWeekDates.indexOf(focusedDate)
  const focusedDayLabel =
    focusedIndex >= 0
      ? `${dayLabels[focusedIndex]} (${moment(focusedDate).format("DD/MM/YYYY")})`
      : null

  const doctorSessionAvailable = (session) => {
    const cell = weeklySchedule?.[focusedDate]?.[session]
    return cell ? !cell.is_off : false
  }

  const peersForSession = (session) =>
    Object.keys(scheduleData || {})
      .filter((email) => email !== doctor.email)
      .map((email) => {
        const s = scheduleData[email]?.[focusedDate]?.[session]
        if (!s) return null
        return { email, available: !s.is_off }
      })
      .filter(Boolean)

  const nurseSessionEntries = (session) =>
    Object.keys(scheduleData || {})
      .map((email) => {
        const s = scheduleData[email]?.[focusedDate]?.[session]
        if (!s) return null
        return { email, available: !s.is_off }
      })
      .filter(Boolean)

  const statusEntriesForSession = (session) =>
    isDoctor ? peersForSession(session) : nurseSessionEntries(session)

  const availableCount = isDoctor
    ? SESSIONS.reduce((acc, session) => acc + (doctorSessionAvailable(session) ? 1 : 0), 0)
    : SESSIONS.reduce(
        (acc, session) => acc + nurseSessionEntries(session).filter((e) => e.available).length,
        0,
      )

  const sidebarTitle = (() => {
    if (isNurse) {
      return coverOpen
        ? t("doctor-schedule:sidebarCoverTitle")
        : t("doctor-schedule:sidebarTitle")
    }
    return editOpen
      ? t("doctor-schedule:sidebarEditTitle")
      : t("doctor-schedule:sidebarTitle")
  })()

  const showBack = (isNurse && coverOpen) || (isDoctor && editOpen)

  const handleBack = () => {
    if (isNurse && coverOpen) setCoverOpen(false)
    if (isDoctor && editOpen) onCloseEdit?.()
  }

  const renderDoctorList = (session) => {
    const entries = statusEntriesForSession(session)
    if (entries.length === 0) {
      return (
        <Typography variant="caption" color="text.secondary" fontWeight={400}>
          {t("doctor-schedule:noDoctorsInSession")}
        </Typography>
      )
    }
    return (
      <List dense disablePadding>
        {entries.map(({ email, available }) => (
          <ListItem
            key={`${session}-${email}`}
            sx={{
              px: 1,
              py: 0.75,
              mb: 0.5,
              border: 1,
              borderColor: "divider",
              borderRadius: dashboardRadius("control"),
            }}
          >
            <CircleIcon
              aria-hidden
              sx={{
                fontSize: 10,
                mr: 1,
                color: available ? "success.main" : "error.main",
              }}
            />
            <ListItemText
              primary={email.split("@")[0]}
              secondary={
                available
                  ? t("doctor-schedule:available")
                  : t("doctor-schedule:unavailable")
              }
              primaryTypographyProps={{ fontWeight: 600, fontSize: "0.8125rem" }}
              secondaryTypographyProps={{ fontSize: "0.7rem", fontWeight: 400 }}
            />
          </ListItem>
        ))}
      </List>
    )
  }

  const renderStatusBody = () => (
    <>
      {!focusedDate ? (
        <Typography variant="body2" color="text.secondary">
          {t("doctor-schedule:sidebarEmpty")}
        </Typography>
      ) : (
        <>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Chip
              size="small"
              label={t("doctor-schedule:availableCount", { count: availableCount })}
              color="primary"
              variant="outlined"
              sx={{ borderRadius: dashboardRadius("pill"), fontWeight: 500 }}
            />
          </Box>

          {isDoctor && (
            <>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                {t("doctor-schedule:mySessions")}
              </Typography>
              <List dense disablePadding sx={{ mb: 2 }}>
                {SESSIONS.map((session) => {
                  const available = doctorSessionAvailable(session)
                  return (
                    <ListItem
                      key={session}
                      sx={{
                        px: 1.5,
                        py: 1,
                        mb: 1,
                        border: 1,
                        borderColor: "divider",
                        borderRadius: dashboardRadius("control"),
                        bgcolor: available ? availableBg : "transparent",
                      }}
                    >
                      <ListItemText
                        primary={t(`doctor-schedule:${session}`)}
                        secondary={
                          available
                            ? t("doctor-schedule:available")
                            : t("doctor-schedule:unavailable")
                        }
                        primaryTypographyProps={{ fontWeight: 600, fontSize: "0.875rem" }}
                        secondaryTypographyProps={{ fontWeight: 400, fontSize: "0.75rem" }}
                      />
                    </ListItem>
                  )
                })}
              </List>

              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                {t("doctor-schedule:otherDoctorsToday")}
              </Typography>
            </>
          )}

          {SESSIONS.map((session) => (
            <Box key={session} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.75 }}>
                {t(`doctor-schedule:${session}`)}
              </Typography>
              {renderDoctorList(session)}
            </Box>
          ))}
        </>
      )}
    </>
  )

  const renderDoctorEditBody = () => (
    <>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }} fontWeight={400}>
        {t("doctor-schedule:sidebarDoctorHint")}
      </Typography>

      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
        {t("doctor-schedule:mySessions")}
      </Typography>
      <List dense disablePadding sx={{ mb: 2 }}>
        {SESSIONS.map((session) => {
          const available = doctorSessionAvailable(session)
          return (
            <ListItem
              key={session}
              sx={{
                px: 1.5,
                py: 1,
                mb: 1,
                border: 1,
                borderColor: "divider",
                borderRadius: dashboardRadius("control"),
                bgcolor: available ? availableBg : "transparent",
              }}
            >
              <ListItemText
                primary={t(`doctor-schedule:${session}`)}
                secondary={
                  available
                    ? t("doctor-schedule:available")
                    : t("doctor-schedule:unavailable")
                }
                primaryTypographyProps={{ fontWeight: 600, fontSize: "0.875rem" }}
                secondaryTypographyProps={{ fontWeight: 400, fontSize: "0.75rem" }}
              />
            </ListItem>
          )
        })}
      </List>

      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
        {t("doctor-schedule:quickApply")}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
        {t("doctor-schedule:quickApplyHint")}
      </Typography>
      <FormControl size="small" fullWidth>
        <InputLabel id="apply-range-label">{t("doctor-schedule:applyRange")}</InputLabel>
        <Select
          labelId="apply-range-label"
          label={t("doctor-schedule:applyRange")}
          value={applyRange}
          onChange={(e) => setApplyRange(e.target.value)}
        >
          <MenuItem value="week">{t("doctor-schedule:applyThisWeek")}</MenuItem>
          <MenuItem value="month">{t("doctor-schedule:applyOneMonth")}</MenuItem>
        </Select>
      </FormControl>
    </>
  )

  return (
    <Box
      sx={{
        width: { xs: "100%", md: 360 },
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        borderTop: { xs: 1, md: 0 },
        borderLeft: { md: 1 },
        borderColor: "divider",
        bgcolor: "background.paper",
        minHeight: { xs: 320, md: 0 },
        alignSelf: "stretch",
        overflow: "hidden",
      }}
    >
      <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider", flexShrink: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {showBack && (
            <Button
              size="small"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              sx={{ ...DASHBOARD_FILTER_BUTTON_SX, minWidth: 0, px: 1 }}
            >
              {t("modal:back")}
            </Button>
          )}
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} color="primary.dark" noWrap>
              {sidebarTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }} fontWeight={400}>
              {focusedDayLabel || t("doctor-schedule:sidebarPickDay")}
            </Typography>
          </Box>
        </Box>
      </Box>

      {isNurse && coverOpen ? (
        <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
          <ScheduleCoverPanel
            variant="sidebar"
            focusedDate={focusedDate}
            onSuccess={() => {
              onCoverSuccess?.()
              setCoverOpen(false)
            }}
          />
        </Box>
      ) : (
        <>
          <Box sx={{ flex: 1, overflow: "auto", px: 2, py: 1.5 }}>
            {isDoctor && editOpen ? renderDoctorEditBody() : renderStatusBody()}
          </Box>

          <Divider />
          <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", flexShrink: 0, gap: 1 }}>
            {isNurse && !coverOpen && (
              <Button
                type="button"
                variant="outlined"
                color="primary"
                onClick={() => setCoverOpen(true)}
                sx={DASHBOARD_FILTER_BUTTON_SX}
              >
                {t("doctor-schedule:startCover")}
              </Button>
            )}
            {isDoctor && !editOpen && (
              <Button
                type="button"
                variant="outlined"
                color="primary"
                onClick={onOpenEdit}
                sx={DASHBOARD_FILTER_BUTTON_SX}
              >
                {t(
                  hasExistingSchedule
                    ? "doctor-schedule:updateSchedule"
                    : "doctor-schedule:createSchedule",
                )}
              </Button>
            )}
            {isDoctor && editOpen && (
              <Button
                type="button"
                variant="contained"
                color={hasExistingSchedule ? "primary" : "success"}
                disabled={isLoading}
                onClick={onSubmitClick}
                sx={DASHBOARD_FILTER_BUTTON_SX}
              >
                {applyRange === "month"
                  ? t("doctor-schedule:applyOneMonth")
                  : t("doctor-schedule:saveSchedule")}
              </Button>
            )}
          </Box>
        </>
      )}
    </Box>
  )
}

export default WeekSidebar
