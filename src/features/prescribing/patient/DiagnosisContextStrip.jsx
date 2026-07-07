import { Box, Chip, Paper, Stack, Typography } from "@mui/material"
import { alpha } from "@mui/material/styles"
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined"
import { useTranslation } from "react-i18next"
import { parseSymptoms } from "./parseSymptoms"
import {
  PRESCRIBING_CONTEXT_ELEVATION,
  prescribingContextPaperSx,
  prescribingPillRadius,
} from "../layout/prescribingChrome"

const symptomChipSx = (theme) => ({
  height: 26,
  fontWeight: 600,
  fontSize: "0.75rem",
  borderRadius: prescribingPillRadius,
  bgcolor: "background.paper",
  borderColor: alpha(theme.palette.primary.main, 0.35),
  color: theme.palette.primary.dark,
})

export default function DiagnosisContextStrip({ sign, diagnosed }) {
  const { t } = useTranslation(["prescription-detail"])
  const symptoms = parseSymptoms(sign)
  const hasDiagnosis = Boolean(diagnosed?.trim())
  const hasContext = hasDiagnosis || symptoms.length > 0

  if (!hasContext) {
    return null
  }

  return (
    <Box
      component={Paper}
      elevation={PRESCRIBING_CONTEXT_ELEVATION}
      sx={{
        ...prescribingContextPaperSx,
        mb: 1.5,
        py: 1.25,
        px: { xs: 1.5, md: 2 },
        width: "100%",
        flexShrink: 0,
        borderLeftWidth: 4,
        borderLeftStyle: "solid",
        borderLeftColor: "primary.main",
      }}
    >
      <Stack
        direction="row"
        flexWrap="wrap"
        alignItems="center"
        useFlexGap
        spacing={0.75}
        sx={{ rowGap: 0.75 }}
      >
        <LocalHospitalOutlinedIcon color="primary" sx={{ fontSize: 20 }} aria-hidden />

        <Typography
          component="span"
          variant="body2"
          color="primary.dark"
          fontWeight={700}
          sx={{ whiteSpace: "nowrap" }}
        >
          {t("prescription-detail:diagnosisContextHeading")}:
        </Typography>

        <Typography
          component="span"
          variant="body2"
          fontWeight={700}
          color="text.primary"
          sx={{ lineHeight: 1.35 }}
        >
          {hasDiagnosis ? diagnosed : "—"}
        </Typography>

        {symptoms.length > 0 ? (
          <>
            <Typography component="span" variant="body2" color="text.disabled" aria-hidden>
              ·
            </Typography>
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
              fontWeight={600}
              sx={{ whiteSpace: "nowrap" }}
            >
              {t("prescription-detail:symptomsHeading")}:
            </Typography>
            {symptoms.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                variant="outlined"
                sx={symptomChipSx}
              />
            ))}
          </>
        ) : (
          <Chip
            label={t("prescription-detail:noSymptoms")}
            size="small"
            variant="outlined"
            sx={(theme) => ({
              ...symptomChipSx(theme),
              color: theme.palette.text.disabled,
              borderStyle: "dashed",
            })}
          />
        )}
      </Stack>
    </Box>
  )
}
