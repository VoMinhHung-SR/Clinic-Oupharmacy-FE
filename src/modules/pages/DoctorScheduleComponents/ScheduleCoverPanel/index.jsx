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
import { useTranslation } from "react-i18next"
import useScheduleCover from "../hooks/useScheduleCover"

const doctorLabel = (d) => {
    const name = `${d.first_name || ""} ${d.last_name || ""}`.trim()
    return name ? `${name} (${d.email})` : d.email
}

const candidateLabel = (c) => {
    const name = `${c.firstName || ""} ${c.lastName || ""}`.trim()
    return name || c.email
}

/**
 * P5 nurse-led cover: pick busy doctor + session → list same-specialty covers → reassign.
 */
const ScheduleCoverPanel = ({ onSuccess }) => {
    const { t } = useTranslation(["doctor-schedule", "common"])
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

    return (
        <Box sx={{ p: 3, borderTop: "1px solid #e0e0e0" }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
                {t("doctor-schedule:coverTitle")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t("doctor-schedule:coverHint")}
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <FormControl size="small" sx={{ minWidth: 220 }} disabled={loadingDoctors}>
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
                    label={t("doctor-schedule:coverDate")}
                    InputLabelProps={{ shrink: true }}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                <FormControl size="small" sx={{ minWidth: 140 }}>
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
                    onClick={loadCandidates}
                    disabled={loadingCandidates || submitting}
                >
                    {loadingCandidates ? (
                        <CircularProgress size={20} />
                    ) : (
                        t("doctor-schedule:coverLoadCandidates")
                    )}
                </Button>
            </Box>

            {candidates.length > 0 && (
                <List dense sx={{ maxWidth: 560, bgcolor: "background.paper" }}>
                    {candidates.map((c) => {
                        const blocked = !c.canCover
                        const conflictHint =
                            blocked && Array.isArray(c.conflicts) && c.conflicts.length
                                ? c.conflicts.map((x) => `${x.start_time}-${x.end_time}`).join(", ")
                                : ""
                        return (
                            <ListItem
                                key={c.doctorId}
                                secondaryAction={
                                    <Button
                                        size="small"
                                        variant="contained"
                                        disabled={blocked || submitting}
                                        onClick={() => reassignTo(c.doctorId)}
                                    >
                                        {t("doctor-schedule:coverAssign")}
                                    </Button>
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
                                />
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
    )
}

export default ScheduleCoverPanel
