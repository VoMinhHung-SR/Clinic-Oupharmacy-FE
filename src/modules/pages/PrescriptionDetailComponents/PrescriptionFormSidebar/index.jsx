import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
        <Typography variant="h6" component="h2" textAlign="center" sx={{ mb: 2 }}>
          {t("prescription-detail:prescriptionDetail")}
        </Typography>

        {medicinesSubmit.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 3 }}>
            {t("prescription-detail:nullMedicine")}
          </Typography>
        ) : (
          <>
            <Box sx={{ overflowX: "auto", mb: 2 }}>
              <Table size="small" sx={{ minWidth: 320 }}>
                <TableHead>
                  <TableRow>
                    <TableCell padding="none" sx={{ width: 32, textAlign: "center", fontSize: "0.75rem", fontWeight: 600 }} scope="col" />
                    <TableCell sx={{ fontSize: "0.75rem", fontWeight: 600, minWidth: 120 }} scope="col">{t("prescription-detail:medicineName")}</TableCell>
                    <TableCell sx={{ width: 72, textAlign: "center", fontSize: "0.75rem", fontWeight: 600 }} scope="col">{t("prescription-detail:uses")}</TableCell>
                    <TableCell sx={{ width: 64, textAlign: "center", fontSize: "0.75rem", fontWeight: 600 }} scope="col">{t("prescription-detail:quantity")}</TableCell>
                    {onRemove && <TableCell padding="none" sx={{ width: 48 }} scope="col" />}
                  </TableRow>
                </TableHead>
                <TableBody>
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
                    />
                  ))}
                </TableBody>
              </Table>
            </Box>

            <Grid container spacing={1.5}>
              <Grid item xs={6}>
                <EditPrescriptionModal medicinesSubmitData={medicinesSubmit} handleOnEdit={onEdit} handleClearAll={onReset} />
              </Grid>
              <Grid item xs={6}>
                <Button fullWidth variant="outlined" color="error" onClick={onReset} aria-label={t("common:deleteAll")}>
                  {t("common:deleteAll")}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  size="medium"
                  onClick={() => onAddPrescriptionDetail(user?.id, diagnosisId)}
                  aria-label={t("prescription-detail:prescribing")}
                >
                  {t("prescription-detail:prescribing")}
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Box>
  )
}
