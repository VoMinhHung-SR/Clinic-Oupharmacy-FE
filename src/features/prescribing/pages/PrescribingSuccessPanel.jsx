import { Alert, Box, Paper } from "@mui/material"
import { useTranslation } from "react-i18next"
import PrescriptionDetailCard from "../../../modules/common/components/card/PrescriptionDetailCard"

export default function PrescribingSuccessPanel({ prescriptionData, onPrint }) {
  const { t } = useTranslation(["prescription-detail"])

  return (
    <Box className="print-area" sx={{ py: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto" }}>
      <Alert severity="success" sx={{ mb: 2 }} role="status">
        {t("prescription-detail:newPrescriptionCreated")}
      </Alert>

      <Paper elevation={2} sx={{ p: { xs: 0, sm: 1 }, bgcolor: "transparent", boxShadow: "none" }}>
        <PrescriptionDetailCard
          prescriptionData={prescriptionData}
          onPrint={onPrint}
          printActionsEmphasized
        />
      </Paper>
    </Box>
  )
}
