import { Box, Grid, InputLabel, Paper, Stack, TextField, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { DASHBOARD_PAPER_SX, DASHBOARD_SURFACE } from "../../../layout/dashboard/styleTokens"
import Loading from "../../Loading"
import { EXAM_DETAIL_EMBEDDED_HEADER_SX, EXAM_DETAIL_EMBEDDED_PANEL_SX } from "../ExaminationDetailCard/detailLayoutTokens"

function ReadOnlyField({ label, value }) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500} sx={{ wordBreak: "break-word" }}>
        {value || "—"}
      </Typography>
    </Stack>
  )
}

const DiagnosisCard = ({ id, sign, diagnosed, isLoading, embedded = false }) => {
  const { t, ready } = useTranslation(["diagnosis"])

  if (!ready && isLoading)
    return (
      <Box sx={{ py: 3 }}>
        <Loading />
      </Box>
    )

  if (!id) return <Box sx={{ color: "error.main", typography: "body2" }}>{t("errNullDiagnosis")}</Box>

  if (embedded) {
    return (
      <Box sx={EXAM_DETAIL_EMBEDDED_PANEL_SX}>
        <Box sx={EXAM_DETAIL_EMBEDDED_HEADER_SX}>
          <Typography variant="body2" fontWeight={600} color="primary.dark">
            {t("prescriptionInformation")} #{id}
          </Typography>
        </Box>
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12} sm={6}>
            <ReadOnlyField label={t("sign")} value={sign} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ReadOnlyField label={t("diagnosed")} value={diagnosed} />
          </Grid>
        </Grid>
      </Box>
    )
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Paper
        elevation={DASHBOARD_SURFACE.elevation}
        sx={{
          ...DASHBOARD_PAPER_SX,
          overflow: "hidden",
          border: 1,
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            py: 2,
            px: 3,
            bgcolor: "#f8faff",
            borderBottom: "2px solid",
            borderColor: "primary.main",
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} color="primary.dark">
            {t("prescriptionInformation")}
          </Typography>
        </Box>

        <Grid container>
          <Grid item xs={12} sx={{ p: 2.5 }}>
            <InputLabel htmlFor="sign" sx={{ fontSize: "0.75rem", mb: 1, color: "text.secondary" }}>
              {t("sign")}
            </InputLabel>
            <TextField
              fullWidth
              id="sign"
              name="sign"
              type="text"
              value={sign}
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} sx={{ px: 2.5, pb: 2.5 }}>
            <InputLabel htmlFor="diagnosed" sx={{ fontSize: "0.75rem", mb: 1, color: "text.secondary" }}>
              {t("diagnosed")}
            </InputLabel>
            <TextField
              fullWidth
              id="diagnosed"
              name="diagnosed"
              type="text"
              value={diagnosed}
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default DiagnosisCard
