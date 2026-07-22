import { Alert } from "@mui/material"
import { useTranslation } from "react-i18next"

/**
 * Clinical safety banner when patient.allergies is non-empty.
 */
const PatientAllergyAlert = ({ allergies, sx, dense = false }) => {
  const text = typeof allergies === "string" ? allergies.trim() : ""
  const { t } = useTranslation(["prescription-detail", "booking"])
  if (!text) return null

  return (
    <Alert
      severity="warning"
      variant="outlined"
      sx={{
        textAlign: "left",
        ...(dense ? { py: 0.5, "& .MuiAlert-message": { py: 0.25 } } : null),
        ...sx,
      }}
    >
      <strong>{t("prescription-detail:allergiesWarning")}: </strong>
      {text}
    </Alert>
  )
}

export default PatientAllergyAlert
