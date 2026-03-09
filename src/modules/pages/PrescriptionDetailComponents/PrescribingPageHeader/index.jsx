import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material"
import LocalHospitalIcon from "@mui/icons-material/LocalHospital"
import PersonIcon from "@mui/icons-material/Person"
import { useTranslation } from "react-i18next"
import moment from "moment"
import useCustomModal from "../../../../lib/hooks/useCustomModal"
import CustomModal from "../../../common/components/Modal"
import useMedicalRecordsModal from "../hooks/useMedicalRecordsModal"
import Loading from "../../../common/components/Loading"
import CustomCollapseListItemButton from "../../../common/components/collapse/ListItemButton"
import MiniDiagnosisCard from "../../../common/components/card/ExaminationDetailCard/MiniDiagnosisCard"
import MiniPrescribingCard from "../../../common/components/card/ExaminationDetailCard/MiniPrescribingCard"

const translate = (t, k, opt) => t("prescription-detail:" + k, opt)
const genderT = (g, t) => (g === 0 ? t("prescription-detail:male") : g === 1 ? t("prescription-detail:female") : t("prescription-detail:secret"))

const PrescribingPageHeader = ({ patient }) => {
  const { t } = useTranslation(["prescription-detail", "common", "modal"])
  const { handleCloseModal, isOpen, handleOpenModal } = useCustomModal()
  const { medicalRecords, isLoading } = useMedicalRecordsModal(patient?.id)

  const fullName = patient ? [patient.first_name, patient.last_name].filter(Boolean).join(" ") || t("common:undefined") : ""
  const year = patient?.date_of_birth ? moment(patient.date_of_birth).format("YYYY") : ""

  const recordTitle = (m, i) => {
    const d = moment(m.created_date).format("DD-MM-YYYY")
    return i === 0 ? translate(t, "lastRecord") + ": " + d : i === medicalRecords.length - 1 ? translate(t, "firstRecord") + ": " + d : translate(t, "nextRecord", { index: i + 1 }) + ": " + d
  }

  const modalContent = (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>{translate(t, "patientInfo")}</Typography>
      <Box component={Paper} elevation={2} sx={{ p: 2, mb: 2 }}>
        <Grid container sx={{ "& .MuiGrid-item": { p: 1.5 } }}>
          <Grid item xs={6}><Typography variant="body2"><strong>{translate(t, "patientFullName")}:</strong> {patient?.first_name} {patient?.last_name}</Typography></Grid>
          <Grid item xs={3}><Typography variant="body2"><strong>{translate(t, "dateOfBirth")}:</strong> {patient?.date_of_birth ? moment(patient.date_of_birth).format("DD/MM/YYYY") : t("common:undefined")}</Typography></Grid>
          <Grid item xs={3}><Typography variant="body2"><strong>{translate(t, "gender")}:</strong> {genderT(patient?.gender, t)}</Typography></Grid>
          <Grid item xs={6}><Typography variant="body2"><strong>{translate(t, "email")}:</strong> {patient?.email ?? "—"}</Typography></Grid>
          <Grid item xs={6}><Typography variant="body2"><strong>{translate(t, "phoneNumber")}:</strong> {patient?.phone_number ?? "—"}</Typography></Grid>
          <Grid item xs={12}><Typography variant="body2"><strong>{translate(t, "address")}:</strong> {patient?.address ?? "—"}</Typography></Grid>
        </Grid>
      </Box>
      <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>{translate(t, "medicalRecords")}</Typography>
      {isLoading ? <Box sx={{ py: 2 }}><Loading /></Box> : !medicalRecords?.length ? <Box>{translate(t, "unDiagnosed")}</Box> : medicalRecords.map((m, i) => (
        <Box key={m.id ?? i} component={Paper} elevation={2} sx={{ p: 2, mb: 1 }}>
          <CustomCollapseListItemButton
            isOpen={i === 0}
            title={recordTitle(m, i)}
            content={
              <Box sx={{ "& > div": { p: 1.5 } }}>
                <Box><MiniDiagnosisCard diagnosis={m} isLoading={isLoading} /></Box>
                <Box><MiniPrescribingCard prescribing={m.prescribing_info} isLoading={isLoading} /></Box>
              </Box>
            }
          />
        </Box>
      ))}
    </Box>
  )

  return (
    <>
      <Box component={Paper} elevation={3} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 2, py: 1.5, px: 3, width: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
          <LocalHospitalIcon color="primary" sx={{ fontSize: 28 }} />
          <Typography variant="h6" component="h1" noWrap sx={{ minWidth: 0 }}>
            {translate(t, "prescribing")}{fullName && ` - ${fullName}`}{year && ` (${year})`}
          </Typography>
        </Box>
        <Box
          component="button"
          type="button"
          onClick={handleOpenModal}
          aria-label={translate(t, "patientInfo")}
          sx={{
            display: "flex", alignItems: "center", gap: 1, p: 1, borderRadius: 4, bgcolor: "action.hover",
            border: "1px solid", borderColor: "divider", cursor: "pointer", color: "primary.main", font: "inherit",
            transition: "background-color 0.2s, border-color 0.2s, box-shadow 0.2s",
            "&:hover": { bgcolor: "action.selected", borderColor: "primary.main", boxShadow: 1 },
            "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
          }}
        >
          <PersonIcon sx={{ fontSize: 24 }} />
          <Typography component="span" variant="body2" fontWeight={600}>{translate(t, "patientInfo")}</Typography>
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

export default PrescribingPageHeader