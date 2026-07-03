import { Box, Grid, Stack, Typography } from "@mui/material"
import moment from "moment"
import { useTranslation } from "react-i18next"
import CustomCollapseListItemButton from "../../collapse/ListItemButton"
import Loading from "../../Loading"
import {
  EXAM_DETAIL_RELATED_STACK_SX,
  EXAM_DETAIL_SECTION_GAP,
  EXAM_DETAIL_SUMMARY_SX,
} from "./detailLayoutTokens"
import useExaminationDetailCard from "./hooks/useExaminationDetailCard"
import MiniDiagnosisCard from "./MiniDiagnosisCard"
import MiniPrescribingCard from "./MiniPrescribingCard"

function DetailField({ label, children, xs = 12, sm = 6 }) {
  return (
    <Grid item xs={xs} sm={sm}>
      <Stack spacing={0.5} sx={{ minHeight: 44 }}>
        <Typography variant="caption" color="text.secondary" component="div">
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={500} color="text.primary" sx={{ wordBreak: "break-word" }}>
          {children ?? "—"}
        </Typography>
      </Stack>
    </Grid>
  )
}

const ExaminationDetailCard = ({ examinationData }) => {
  const { t, ready } = useTranslation(["examination-detail"])
  const { diagnosis, isLoading, bill, prescribing } = useExaminationDetailCard(examinationData?.id)

  if (!ready) {
    return (
      <Box sx={{ py: 4 }}>
        <Loading />
      </Box>
    )
  }

  const appointmentDate = examinationData.schedule_appointment?.day
    ? moment(examinationData.schedule_appointment.day).format("DD/MM/YYYY")
    : moment(examinationData.created_date).format("DD/MM/YYYY")

  const doctorName = [
    examinationData.schedule_appointment?.first_name,
    examinationData.schedule_appointment?.last_name,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <Stack spacing={EXAM_DETAIL_SECTION_GAP}>
      <Box sx={EXAM_DETAIL_SUMMARY_SX}>
        <Grid container spacing={2.5} columnSpacing={3}>
          <DetailField label={t("examinationId")}>{examinationData.id}</DetailField>
          <DetailField label={t("createdDate")}>{appointmentDate}</DetailField>
          <DetailField label={t("patientFullName")}>
            {examinationData.patient.first_name} {examinationData.patient.last_name}
          </DetailField>
          <DetailField label={t("mailStatus")}>
            {examinationData.mail_status ? t("sent") : t("noSend")}
          </DetailField>
          <DetailField label={t("userCreated")} xs={12} sm={12}>
            {examinationData.user.email}
          </DetailField>
          <DetailField label={t("doctor")}>{doctorName}</DetailField>
          <DetailField label={t("remindEmail")}>
            {examinationData.reminder_email ? t("sent") : t("noSend")}
          </DetailField>
          <DetailField label={t("description")} xs={12} sm={12}>
            {examinationData.description}
          </DetailField>
        </Grid>
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight={600} color="primary.dark" sx={{ mb: 1.5 }}>
          {t("moreInformation")}
        </Typography>

        <Box sx={EXAM_DETAIL_RELATED_STACK_SX}>
          <CustomCollapseListItemButton
            standalone
            title={t("diagnose")}
            loading={isLoading}
            content={<MiniDiagnosisCard diagnosis={diagnosis} isLoading={isLoading} />}
          />
          <CustomCollapseListItemButton
            standalone
            title={t("prescribing")}
            content={<MiniPrescribingCard prescribing={prescribing} isLoading={isLoading} receipt={bill} />}
          />
        </Box>
      </Box>
    </Stack>
  )
}

export default ExaminationDetailCard
