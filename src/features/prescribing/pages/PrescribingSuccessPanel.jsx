import { Alert, Box, Button, Paper, Stack } from "@mui/material"
import PrintIcon from "@mui/icons-material/Print"
import { useTranslation } from "react-i18next"
import PrescriptionDetailCard from "../../../modules/common/components/card/PrescriptionDetailCard"

export default function PrescribingSuccessPanel({ prescriptionData, onPrint }) {
  const { t } = useTranslation(["prescription-detail"])

  return (
    <Box className="print-area" sx={{ py: { xs: 2, md: 3 } }}>
      <Alert severity="success" sx={{ mb: 2 }} role="status">
        {t("prescription-detail:newPrescriptionCreated")}
      </Alert>

      <Paper elevation={2} sx={{ p: { xs: 1.5, md: 2 }, mb: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 2 }} className="no-print">
          <Button
            variant="contained"
            color="primary"
            startIcon={<PrintIcon />}
            onClick={onPrint}
            aria-label={t("prescription-detail:printPrescription")}
          >
            {t("prescription-detail:printPrescription")}
          </Button>
        </Stack>

        <PrescriptionDetailCard prescriptionData={prescriptionData} onPrint={onPrint} />
      </Paper>
    </Box>
  )
}
