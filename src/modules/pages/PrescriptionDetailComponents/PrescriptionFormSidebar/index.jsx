import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import { useTranslation } from "react-i18next"
import PatientInfoModal from "../PatientInfoModal"
import MedicalRecordsModal from "../MedicalRecordsModal"
import EditPrescriptionModal from "../EditPrescriptionModal"
import PrescriptionDraftLineItem from "../PrescriptionDraftLineItem"

export default function PrescriptionFormSidebar({
  patient,
  patientId,
  medicinesSubmit,
  onAddPrescriptionDetail,
  onReset,
  onEdit,
  onEditItem,
  onRemove,
  user,
  diagnosisId,
}) {
  const { t } = useTranslation(["prescription-detail", "common"])

  return (
    <Box sx={{ maxWidth: "100%", minWidth: 0 }}>
      <Box sx={{ mb: 3 }}>
        <Grid container justifyContent="flex" component={Paper} elevation={5} sx={{ minHeight: 160, p: 2.5 }}>
          <Grid item xs={12} sx={{ pb: 2 }}>
            <Typography variant="h6" component="h1" textAlign="center">
              {t("common:basicInformation")}
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ pb: 2, textAlign: "center" }}>
            <PatientInfoModal patientData={patient} />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <MedicalRecordsModal patientID={patientId} />
          </Grid>
        </Grid>
      </Box>

      <Box component={Paper} elevation={5} sx={{ p: 2.5, width: "100%" }}>
        <Typography variant="h6" component="h2" textAlign="center" fontWeight={600} sx={{ mb: 2 }}>
          {t("prescription-detail:prescriptionDetail")}
        </Typography>

        {medicinesSubmit.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 3 }}>
            {t("prescription-detail:nullMedicine")}
          </Typography>
        ) : (
          <>
            <Box sx={{ mb: 2, maxHeight: 360, overflowY: "auto" }}>
              {medicinesSubmit.map((item, index) => (
                <PrescriptionDraftLineItem
                  key={item.id ?? index}
                  medicineName={item.medicineName}
                  packaging={item.packaging}
                  uses={item.uses}
                  quantity={item.quantity}
                  index={index}
                  itemId={item.id}
                  onRemove={onRemove}
                  onEditItem={onEditItem}
                  variant="card"
                />
              ))}
            </Box>

            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              {t("prescription-detail:totalAmount")}: —
            </Typography>

            <Stack spacing={1.5}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <EditPrescriptionModal medicinesSubmitData={medicinesSubmit} handleOnEdit={onEdit} handleClearAll={onReset} />
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={onReset}
                  aria-label={t("common:deleteAll")}
                >
                  {t("common:deleteAll")}
                </Button>
              </Box>
              <Button
                fullWidth
                variant="contained"
                color="success"
                size="large"
                onClick={() => onAddPrescriptionDetail(user?.id, diagnosisId)}
                aria-label={t("prescription-detail:prescribing")}
                sx={{ py: 1.5, textTransform: "uppercase", fontWeight: 600 }}
              >
                {t("prescription-detail:prescribing")}
              </Button>
            </Stack>
          </>
        )}
      </Box>
    </Box>
  )
}
