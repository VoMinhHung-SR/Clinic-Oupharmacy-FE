import { Box, Button, Paper, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { Helmet } from "react-helmet"
import usePayment from "../../../../../modules/pages/PaymentComponents/hooks/usePayment"
import { useNavigate } from "react-router-dom"
import PrescriptionDetailCard from "../../../../../modules/common/components/card/PrescriptionDetailCard"
import SkeletonPayments from "../../../../../modules/common/components/skeletons/pages/payments"
import {
  DASHBOARD_PAGE_FRAME_SX,
  DASHBOARD_SCROLL_CONTENT_SX,
  DASHBOARD_SURFACE,
} from "../../../../../modules/common/layout/dashboard/styleTokens"

const Payments = () => {
  const {
    isLoadingPrescriptionDetail,
    prescriptionDetail,
    diagnosisInfo,
    handlePayment,
    isLoadingButton,
  } = usePayment()
  const { t, ready } = useTranslation(["payment", "common", "modal"])
  const router = useNavigate()

  const groupMedicinesByDate = (prescriptionData) => {
    const result = []
    Object.keys(prescriptionData).forEach((date) => {
      const prescribingIds = Object.keys(prescriptionData[date])
      const firstPrescribingKey = prescribingIds[0]
      const firstPrescribingData = prescriptionData[date][firstPrescribingKey]
      const firstMedicineData = firstPrescribingData[0]

      const allMedicinesForDate = []
      prescribingIds.forEach((prescribingId) => {
        const medicines = prescriptionData[date][prescribingId]
        Object.values(medicines).forEach((medicine) => {
          allMedicinesForDate.push(medicine)
        })
      })

      result.push({
        date,
        prescribingIds: prescribingIds.map((id) => parseInt(id)),
        medicines: allMedicinesForDate,
        baseData: firstMedicineData,
      })
    })
    return result
  }

  const renderErrorBox = (key, titleKey, messageParams = {}) => (
    <Paper
      key={key}
      elevation={DASHBOARD_SURFACE.elevation}
      sx={{ borderRadius: DASHBOARD_SURFACE.borderRadius, py: 5, mb: 2, textAlign: "center" }}
    >
      <Typography variant="h6" color="error" gutterBottom>
        {t(titleKey, messageParams)}
      </Typography>
      <Typography gutterBottom>{t("common:backToHomepage")}</Typography>
      <Button onClick={() => router("/dashboard")}>{t("common:here")}!</Button>
    </Paper>
  )

  if (!ready || isLoadingPrescriptionDetail) {
    return (
      <Box sx={DASHBOARD_PAGE_FRAME_SX}>
        <Helmet>
          <title>Payments</title>
        </Helmet>
        <SkeletonPayments />
      </Box>
    )
  }

  return (
    <>
      <Helmet>
        <title>{t("common:payments")}</title>
      </Helmet>
      <Box
        className="ou-scrollbar"
        sx={{
          ...DASHBOARD_PAGE_FRAME_SX,
          ...DASHBOARD_SCROLL_CONTENT_SX,
          maxWidth: 1536,
          mx: "auto",
          width: "100%",
        }}
      >
        <Box className="print-area">
          {!isLoadingPrescriptionDetail && !diagnosisInfo &&
            renderErrorBox("examination-error", "payment:errLoadExaminationDetailFailed")}

          {!isLoadingPrescriptionDetail &&
            prescriptionDetail &&
            groupMedicinesByDate(prescriptionDetail).map(
              ({ date, prescribingIds, medicines, baseData }, index) => (
                <Box key={`${date}-${index}`} sx={{ mb: 2 }}>
                  <PrescriptionDetailCard
                    handlePayment={({ onSuccess, onError, momoWallet = false }) =>
                      handlePayment({ onSuccess, onError, momoWallet })
                    }
                    isLoadingButton={isLoadingButton}
                    prescriptionData={{
                      medicineUnits: medicines,
                      listPrescribingId: prescribingIds,
                      created_date: date,
                      examination: diagnosisInfo.examination,
                      patient: diagnosisInfo.patient,
                      user: diagnosisInfo.user,
                      bill_status: baseData.prescribing.bill_status,
                    }}
                  />
                </Box>
              )
            )}
        </Box>
      </Box>
    </>
  )
}

export default Payments
