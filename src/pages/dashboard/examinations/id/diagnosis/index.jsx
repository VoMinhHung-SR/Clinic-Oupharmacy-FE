import { Box, Button, Grid, Paper, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { Helmet } from "react-helmet"
import DiagnosisForm from "../../../../../modules/pages/DiagnosisComponents/DiagnosisForm"
import PatientInfoModal from "../../../../../modules/pages/PrescriptionDetailComponents/PatientInfoModal"
import MedicalRecordsModal from "../../../../../modules/pages/PrescriptionDetailComponents/MedicalRecordsModal"
import useDiagnosis from "../../../../../modules/pages/DiagnosisComponents/hooks/useDiagnosis"
import AppointmentStatusBanner from "../../../../../modules/pages/DiagnosisComponents/AppointmentStatusBanner"
import SkeletonDiagnosis from "../../../../../modules/common/components/skeletons/pages/examinations/diagnosis"
import {
  DASHBOARD_PAGE_FRAME_SX,
  DASHBOARD_SCROLL_CONTENT_SX,
  DASHBOARD_SURFACE,
} from "../../../../../modules/common/layout/dashboard/styleTokens"

const Diagnosis = () => {
  const { examinationDetail, isLoadingExamination, diagnosis, prescriptionId, examinationId, user, handleChangeFlag } =
    useDiagnosis()
  const router = useNavigate()
  const { t, ready } = useTranslation(["diagnosis", "common"])

  if (!ready || isLoadingExamination)
    return (
      <Box sx={DASHBOARD_PAGE_FRAME_SX}>
        <Helmet>
          <title>Diagnosis</title>
        </Helmet>
        <SkeletonDiagnosis />
      </Box>
    )

  return (
    <>
      <Helmet>
        <title>{t("diagnosis:title")}</title>
      </Helmet>

      {!isLoadingExamination && examinationDetail && examinationDetail.length === 0 && (
        <Box
          sx={{
            ...DASHBOARD_PAGE_FRAME_SX,
            alignItems: "center",
            justifyContent: "center",
            p: 3,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" color="error" gutterBottom>
              {t("errNullExamination")}
            </Typography>
            <Typography gutterBottom>{t("common:goToBooking")}</Typography>
            <Button onClick={() => router("/booking")}>{t("here")}!</Button>
          </Box>
        </Box>
      )}

      {!isLoadingExamination && examinationDetail && (
        <Box className="ou-scrollbar" sx={{ ...DASHBOARD_PAGE_FRAME_SX, ...DASHBOARD_SCROLL_CONTENT_SX }}>
          <Box sx={{ maxWidth: 1200, mx: "auto", width: "100%", py: 2 }}>
            <Paper
              elevation={DASHBOARD_SURFACE.elevation}
              sx={{ borderRadius: DASHBOARD_SURFACE.borderRadius, p: 2.5, mb: 2 }}
            >
              <Typography variant="h5" align="center" fontWeight={600} sx={{ mb: 2 }}>
                {t("common:basicInformation")}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
                  <PatientInfoModal patientData={examinationDetail.patient} />
                </Grid>
                <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
                  <MedicalRecordsModal patientID={examinationDetail.patient.id} />
                </Grid>
              </Grid>
            </Paper>

            <AppointmentStatusBanner
              scheduleAppointment={examinationDetail?.schedule_appointment}
              hasDiagnosis={!!(diagnosis?.id ?? prescriptionId > 0)}
            />

            {user ? (
              <DiagnosisForm
                id={prescriptionId}
                examinationId={examinationId}
                diagnosed={diagnosis.diagnosed}
                sign={diagnosis.sign}
                userID={user.id}
                patientID={examinationDetail.patient.id}
                handleChangeFlag={handleChangeFlag}
              />
            ) : null}
          </Box>
        </Box>
      )}
    </>
  )
}

export default Diagnosis
