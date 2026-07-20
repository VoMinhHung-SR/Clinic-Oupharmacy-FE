import { useState } from "react"
import { Box, Button, Grid, Paper, Tab, Tabs, Typography } from "@mui/material"
import LocalHospitalIcon from "@mui/icons-material/LocalHospital"
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
import PatientAllergyAlert from "../../../modules/common/components/PatientAllergyAlert"
import { EXAM_DETAIL_RELATED_STACK_SX } from "../../../modules/common/components/card/ExaminationDetailCard/detailLayoutTokens"
import {
  PRESCRIBING_CONTEXT_ELEVATION,
  prescribingContextPaperSx,
} from "../layout/prescribingChrome"
import { dashboardRadius } from "../../../modules/common/layout/dashboard/styleTokens"

const translate = (t, k, opt) => t("prescription-detail:" + k, opt)
const genderT = (g, t) =>
  g === 0 ? t("prescription-detail:male") : g === 1 ? t("prescription-detail:female") : t("prescription-detail:secret")

function PatientInfoPanel({ patient, t }) {
  return (
    <Box
      component={Paper}
      variant="outlined"
      sx={{ p: 2, mt: 2, borderRadius: dashboardRadius("control"), bgcolor: "grey.50" }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption" color="text.secondary" display="block">
            {translate(t, "patientFullName")}
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {patient?.first_name} {patient?.last_name}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="caption" color="text.secondary" display="block">
            {translate(t, "dateOfBirth")}
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {patient?.date_of_birth ? moment(patient.date_of_birth).format("DD/MM/YYYY") : t("common:undefined")}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="caption" color="text.secondary" display="block">
            {translate(t, "gender")}
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {genderT(patient?.gender, t)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption" color="text.secondary" display="block">
            {translate(t, "email")}
          </Typography>
          <Typography variant="body2" fontWeight={500} sx={{ wordBreak: "break-word" }}>
            {patient?.email ?? "—"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption" color="text.secondary" display="block">
            {translate(t, "phoneNumber")}
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {patient?.phone_number ?? "—"}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" display="block">
            {translate(t, "address")}
          </Typography>
          <Typography variant="body2" fontWeight={500} sx={{ wordBreak: "break-word" }}>
            {patient?.address ?? "—"}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" display="block">
            {translate(t, "allergies")}
          </Typography>
          <Typography variant="body2" fontWeight={500} sx={{ wordBreak: "break-word" }}>
            {patient?.allergies?.trim() ? patient.allergies : "—"}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}

function MedicalRecordsPanel({ medicalRecords, isLoading, recordTitle, t }) {
  if (isLoading) {
    return (
      <Box sx={{ py: 4 }}>
        <Loading />
      </Box>
    )
  }

  if (!medicalRecords?.length) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        {translate(t, "unDiagnosed")}
      </Typography>
    )
  }

  return (
    <Box sx={{ ...EXAM_DETAIL_RELATED_STACK_SX, mt: 2 }}>
      {medicalRecords.map((m, i) => (
        <Box key={m.id ?? i} component={Paper} variant="outlined" sx={{ borderRadius: dashboardRadius("control"), overflow: "hidden" }}>
          <CustomCollapseListItemButton
            standalone
            isOpen={i === 0}
            title={recordTitle(m, i)}
            content={
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <MiniDiagnosisCard diagnosis={m} isLoading={isLoading} />
                <MiniPrescribingCard prescribing={m.prescribing_info} isLoading={isLoading} />
              </Box>
            }
          />
        </Box>
      ))}
    </Box>
  )
}

export default function PatientContextBar({ patient }) {
  const { t } = useTranslation(["prescription-detail", "common", "modal"])
  const { handleCloseModal, isOpen, handleOpenModal } = useCustomModal()
  const { medicalRecords, isLoading } = useMedicalRecordsModal(patient?.id)
  const [activeTab, setActiveTab] = useState(0)

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

  const openChartModal = () => {
    setActiveTab(0)
    handleOpenModal()
  }

  const modalContent = (
    <Box>
      <Tabs
        value={activeTab}
        onChange={(_, value) => setActiveTab(value)}
        variant="fullWidth"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          minHeight: 42,
          "& .MuiTab-root": { textTransform: "none", fontWeight: 600, minHeight: 42 },
        }}
      >
        <Tab id="patient-chart-tab-info" aria-controls="patient-chart-panel-info" label={translate(t, "patientInfo")} />
        <Tab
          id="patient-chart-tab-history"
          aria-controls="patient-chart-panel-history"
          label={translate(t, "medicalRecords")}
        />
      </Tabs>

      <Box
        role="tabpanel"
        id="patient-chart-panel-info"
        aria-labelledby="patient-chart-tab-info"
        hidden={activeTab !== 0}
      >
        {activeTab === 0 ? <PatientInfoPanel patient={patient} t={t} /> : null}
      </Box>

      <Box
        role="tabpanel"
        id="patient-chart-panel-history"
        aria-labelledby="patient-chart-tab-history"
        hidden={activeTab !== 1}
      >
        {activeTab === 1 ? (
          <MedicalRecordsPanel medicalRecords={medicalRecords} isLoading={isLoading} recordTitle={recordTitle} t={t} />
        ) : null}
      </Box>
    </Box>
  )

  return (
    <>
      <Box
        component={Paper}
        elevation={PRESCRIBING_CONTEXT_ELEVATION}
        sx={{
          ...prescribingContextPaperSx,
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
        <Button
          size="small"
          variant="outlined"
          startIcon={<FolderSharedIcon />}
          onClick={openChartModal}
          aria-label={translate(t, "patientChart")}
          sx={{ textTransform: "none", flexShrink: 0 }}
        >
          {translate(t, "patientChart")}
        </Button>
      </Box>
      <PatientAllergyAlert allergies={patient?.allergies} sx={{ mb: 2 }} dense />
      <CustomModal
        title={translate(t, "patientChartTitle", { name: fullName })}
        open={isOpen}
        onClose={handleCloseModal}
        content={modalContent}
        actions={[
          <Button key="close" onClick={handleCloseModal}>
            {t("modal:cancel")}
          </Button>,
        ]}
      />
    </>
  )
}
