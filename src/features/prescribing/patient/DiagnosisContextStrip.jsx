import { Box, Paper, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

export default function DiagnosisContextStrip({ sign, diagnosed }) {
  const { t } = useTranslation(["prescription-detail"])

  if (!sign && !diagnosed) {
    return null
  }

  return (
    <Box
      component={Paper}
      elevation={1}
      sx={{
        mb: 2,
        py: 1.25,
        px: { xs: 2, md: 2.5 },
        width: "100%",
        flexShrink: 0,
        borderLeft: 3,
        borderColor: "primary.main",
      }}
    >
      {sign ? (
        <Typography variant="body2" sx={{ mb: diagnosed ? 0.5 : 0 }}>
          <Typography component="span" variant="caption" color="text.secondary" fontWeight={600}>
            {t("prescription-detail:sign")}:{" "}
          </Typography>
          {sign}
        </Typography>
      ) : null}
      {diagnosed ? (
        <Typography variant="body2">
          <Typography component="span" variant="caption" color="text.secondary" fontWeight={600}>
            {t("prescription-detail:diagnosed")}:{" "}
          </Typography>
          {diagnosed}
        </Typography>
      ) : null}
    </Box>
  )
}
