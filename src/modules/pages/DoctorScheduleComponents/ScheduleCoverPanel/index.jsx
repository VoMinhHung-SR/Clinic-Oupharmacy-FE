import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import useScheduleCover from "../hooks/useScheduleCover"
import { dashboardRadius } from "../../../common/layout/dashboard/styleTokens"

const doctorLabel = (d) => {
  const name = `${d.first_name || ""} ${d.last_name || ""}`.trim()
  return name ? `${name} (${d.email})` : d.email
}

const candidateLabel = (c) => {
  const name = `${c.firstName || ""} ${c.lastName || ""}`.trim()
  return name || c.email
}

/**
 * Nurse cover panel. `variant="sidebar"` stacks fields for the right pane.
 * `focusedDate` (YYYY-MM-DD) syncs the date field when nurse selects a day on the grid.
 */
const ScheduleCoverPanel = ({ onSuccess, variant = "default", focusedDate }) => {
  const { t } = useTranslation(["doctor-schedule", "common"])
  const isSidebar = variant === "sidebar"
  const {
    doctors,
    fromDoctorId,
    setFromDoctorId,
    date,
    setDate,
    session,
    setSession,
    candidates,
    loadingDoctors,
    loadingCandidates,
    submitting,
    loadCandidates,
    reassignTo,
  } = useScheduleCover({ onSuccess })

  useEffect(() => {
    if (focusedDate) setDate(focusedDate)
  }, [focusedDate, setDate])

  return (
    <Box
      sx={{
        p: isSidebar ? 2 : 3,
        height: isSidebar ? "100%" : "auto",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        ...(isSidebar
          ? {}
          : { borderTop: 1, borderColor: "divider" }),
      }}
    >
      {!isSidebar && (
        <>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
            {t("doctor-schedule:coverTitle")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t("doctor-schedule:coverHint")}
          </Typography>
        </>
      )}

      {isSidebar && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t("doctor-schedule:coverHint")}
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: isSidebar ? "column" : "row",
          flexWrap: isSidebar ? "nowrap" : "wrap",
          gap: 1.5,
          alignItems: isSidebar ? "stretch" : "center",
          mb: 2,
        }}
      >
        <FormControl
          size="small"
          fullWidth={isSidebar}
          sx={{ minWidth: isSidebar ? 0 : 220 }}
          disabled={loadingDoctors}
        >
          <InputLabel>{t("doctor-schedule:coverFromDoctor")}</InputLabel>
          <Select
            value={fromDoctorId}
            label={t("doctor-schedule:coverFromDoctor")}
            onChange={(e) => setFromDoctorId(e.target.value)}
          >
            {doctors.map((d) => (
              <MenuItem key={d.id} value={d.id}>
                {doctorLabel(d)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          type="date"
          fullWidth={isSidebar}
          label={t("doctor-schedule:coverDate")}
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <FormControl size="small" fullWidth={isSidebar} sx={{ minWidth: isSidebar ? 0 : 140 }}>
          <InputLabel>{t("doctor-schedule:coverSession")}</InputLabel>
          <Select
            value={session}
            label={t("doctor-schedule:coverSession")}
            onChange={(e) => setSession(e.target.value)}
          >
            <MenuItem value="morning">{t("doctor-schedule:morning")}</MenuItem>
            <MenuItem value="afternoon">{t("doctor-schedule:afternoon")}</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          fullWidth={isSidebar}
          onClick={loadCandidates}
          disabled={loadingCandidates || submitting}
          sx={{ borderRadius: dashboardRadius("control"), textTransform: "none", fontWeight: 500 }}
        >
          {loadingCandidates ? (
            <CircularProgress size={20} />
          ) : (
            t("doctor-schedule:coverLoadCandidates")
          )}
        </Button>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
        {candidates.length > 0 && (
          <List dense sx={{ bgcolor: "background.paper", py: 0 }}>
            {candidates.map((c) => {
              const blocked = !c.canCover
              const conflictHint =
                blocked && Array.isArray(c.conflicts) && c.conflicts.length
                  ? c.conflicts.map((x) => `${x.start_time}-${x.end_time}`).join(", ")
                  : ""
              return (
                <ListItem
                  key={c.doctorId}
                  sx={{
                    px: 1,
                    py: 1,
                    mb: 1,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: dashboardRadius("control"),
                    alignItems: "flex-start",
                    flexDirection: isSidebar ? "column" : "row",
                    gap: isSidebar ? 1 : 0,
                  }}
                  secondaryAction={
                    !isSidebar ? (
                      <Button
                        size="small"
                        variant="contained"
                        disabled={blocked || submitting}
                        onClick={() => reassignTo(c.doctorId)}
                        sx={{ textTransform: "none" }}
                      >
                        {t("doctor-schedule:coverAssign")}
                      </Button>
                    ) : null
                  }
                >
                  <ListItemText
                    primary={candidateLabel(c)}
                    secondary={
                      blocked
                        ? `${t("doctor-schedule:coverConflict")}${
                            conflictHint ? `: ${conflictHint}` : ""
                          }`
                        : t("doctor-schedule:coverReady")
                    }
                    primaryTypographyProps={{ fontWeight: 600, fontSize: "0.8125rem" }}
                    secondaryTypographyProps={{ fontSize: "0.75rem" }}
                    sx={{ mr: isSidebar ? 0 : 8 }}
                  />
                  {isSidebar && (
                    <Button
                      size="small"
                      variant="contained"
                      fullWidth
                      disabled={blocked || submitting}
                      onClick={() => reassignTo(c.doctorId)}
                      sx={{ textTransform: "none", borderRadius: dashboardRadius("control") }}
                    >
                      {t("doctor-schedule:coverAssign")}
                    </Button>
                  )}
                </ListItem>
              )
            })}
          </List>
        )}

        {!loadingCandidates && candidates.length === 0 && fromDoctorId && date ? (
          <Typography variant="body2" color="text.secondary">
            {t("doctor-schedule:coverNoCandidatesYet")}
          </Typography>
        ) : null}
      </Box>
    </Box>
  )
}

export default ScheduleCoverPanel
