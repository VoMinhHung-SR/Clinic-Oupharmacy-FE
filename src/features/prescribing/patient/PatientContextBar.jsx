import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material"
import LocalHospitalIcon from "@mui/icons-material/LocalHospital"
import PersonIcon from "@mui/icons-material/Person"
import FolderSharedIcon from "@mui/icons-material/FolderShared"
import { useTranslation } from "react-i18next"
import moment from "moment"
import useCustomModal from "../../../lib/hooks/useCustomModal"
import CustomModal from "../../../modules/common/components/Modal"
import useMedicalRecordsModal from "../../../modules/pages/PrescriptionDetailComponents/hooks/useMedicalRecordsModal"
import Loading from "../../../modules/common/components/Loading"
import CustomCollapseListItemButton from "../../../modules/common/components/collapse/ListItemButton"
import MiniDiagnosisCard from "../../../modules/common/components/card/ExaminationDetailCard/MiniDiagnosisCard"
import MiniPrescribingCard from "../../../modules/common/components/card/ExaminationDetailCard/MiniPrescribingCard"

const translate = (t, k, opt) => t("prescription-detail:" + k, opt)
const genderT = (g, t) =>
  g === 0 ? t("prescription-detail:male") : g === 1 ? t("prescription-detail:female") : t("prescription-detail:secret")

export default function PatientContextBar({ patient }) {
  const { t } = useTranslation(["prescription-detail", "common", "modal"])
  const { handleCloseModal, isOpen, handleOpenModal } = useCustomModal()
  const { medicalRecords, isLoading } = useMedicalRecordsModal(patient?.id)

  const fullName = patient
    ? [patient.first_name, patient.last_name].filter(Boolean).join(" ") || t("common:undefined")
    : ""
  const year = patient?.date_of_birth ? moment(patient.date_of_birth).format("YYYY") : ""

  const recordTitle = (m, i) => {
    const d = moment(m.created_date).format("DD-MM-YYYY")
    return i === 0
      ? translate(t, "lastRecord") + ": " + d
      : i === medicalRecords.length - 1
        ? translate(t, "firstRecord") + ": " + d
        : translate(t, "nextRecord", { index: i + 1 }) + ": " + d
  }

  const modalContent = (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
        {translate(t, "patientInfo")}
      </Typography>
      <Box component={Paper} elevation={2} sx={{ p: 2, mb: 2 }}>
        <Grid container sx={{ "& .MuiGrid-item": { p: 1.5 } }}>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>{translate(t, "patientFullName")}:</strong> {patient?.first_name} {patient?.last_name}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2">
              <strong>{translate(t, "dateOfBirth")}:</strong>{" "}
              {patient?.date_of_birth ? moment(patient.date_of_birth).format("DD/MM/YYYY") : t("common:undefined")}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2">
              <strong>{translate(t, "gender")}:</strong> {genderT(patient?.gender, t)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>{translate(t, "email")}:</strong> {patient?.email ?? "—"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>{translate(t, "phoneNumber")}:</strong> {patient?.phone_number ?? "—"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">
              <strong>{translate(t, "address")}:</strong> {patient?.address ?? "—"}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
        {translate(t, "medicalRecords")}
      </Typography>
      {isLoading ? (
        <Box sx={{ py: 2 }}>
          <Loading />
        </Box>
      ) : !medicalRecords?.length ? (
        <Box>{translate(t, "unDiagnosed")}</Box>
      ) : (
        medicalRecords.map((m, i) => (
          <Box key={m.id ?? i} component={Paper} elevation={2} sx={{ p: 2, mb: 1 }}>
            <CustomCollapseListItemButton
              isOpen={i === 0}
              title={recordTitle(m, i)}
              content={
                <Box sx={{ "& > div": { p: 1.5 } }}>
                  <Box>
                    <MiniDiagnosisCard diagnosis={m} isLoading={isLoading} />
                  </Box>
                  <Box>
                    <MiniPrescribingCard prescribing={m.prescribing_info} isLoading={isLoading} />
                  </Box>
                </Box>
              }
            />
          </Box>
        ))
      )}
    </Box>
  )

  return (
    <>
      <Box
        component={Paper}
        elevation={2}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
          mb: 2,
          py: 1.25,
          px: { xs: 2, md: 2.5 },
          width: "100%",
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
          <LocalHospitalIcon color="primary" sx={{ fontSize: { xs: 24, md: 28 } }} aria-hidden />
          <Typography variant="h6" component="h1" noWrap sx={{ minWidth: 0, fontSize: { xs: "1rem", md: "1.15rem" } }}>
            {translate(t, "prescribing")}
            {fullName && ` — ${fullName}`}
            {year && ` (${year})`}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<PersonIcon />}
            onClick={handleOpenModal}
            aria-label={translate(t, "patientInfo")}
            sx={{ textTransform: "none" }}
          >
            {translate(t, "patientInfo")}
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FolderSharedIcon />}
            onClick={handleOpenModal}
            aria-label={translate(t, "medicalRecords")}
            sx={{ textTransform: "none", display: { xs: "none", sm: "inline-flex" } }}
          >
            {translate(t, "medicalRecords")}
          </Button>
        </Box>
      </Box>
      <CustomModal
        title={`${translate(t, "patientInfo")} & ${translate(t, "medicalRecords")}`}
        className="ou-text-center"
        open={isOpen}
        onClose={handleCloseModal}
        content={modalContent}
        actions={[<Button key="close" onClick={handleCloseModal}>{t("modal:cancel")}</Button>]}
      />
    </>
  )
}
