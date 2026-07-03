import { Button, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useContext, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import PrescribingContext from "../../../lib/context/PrescribingContext"
import UserContext from "../../../lib/context/UserContext"
import usePrescriptionDetail from "../../../modules/pages/PrescriptionDetailComponents/hooks/usePrescriptionDetail"
import useCustomNavigate from "../../../lib/hooks/useCustomNavigate"
import { ConfirmAlert } from "../../../config/sweetAlert2"
import BackdropLoading from "../../../modules/common/components/BackdropLoading"
import SkeletonPrescribingPage from "../../../modules/common/components/skeletons/pages/prescribing-prescribing-page"
import PrescribingShell from "../layout/PrescribingShell"
import PrescribingCatalogSection from "../catalog/PrescribingCatalogSection"
import PrescriptionDraftPanel from "../draft/PrescriptionDraftPanel"
import PrescribingSuccessPanel from "./PrescribingSuccessPanel"
import { DASHBOARD_PAGE_FRAME_SX } from "../../../modules/common/layout/dashboard/styleTokens"

export default function PrescribingWorkspace({ diagnosisId }) {
  const { t, ready } = useTranslation(["prescription-detail", "common", "modal"])
  const { user } = useContext(UserContext)
  const {
    medicinesSubmit,
    handleAddPrescriptionDetail,
    newPrescribing,
    resetMedicineStore,
    removeMedicineItem,
    updateMedicineItem,
    addMedicineItem,
    clearForm,
    hasUnsavedChanges,
    newestPrescriptionDetail,
    isBackdropLoading,
    isLoadingButton,
  } = useContext(PrescribingContext)

  const { isLoadingPrescriptionDetail, prescriptionDetail } = usePrescriptionDetail()
  const { navigate } = useCustomNavigate({
    shouldBlock: hasUnsavedChanges,
    onClearForm: () => clearForm(),
  })

  const [confirm, setConfirm] = useState(false)
  const hasShownDialog = useRef(false)

  useEffect(() => {
    if (
      !isLoadingPrescriptionDetail &&
      prescriptionDetail &&
      prescriptionDetail.prescribing_info.length > 0 &&
      !confirm &&
      !hasShownDialog.current
    ) {
      hasShownDialog.current = true
      ConfirmAlert(
        t("prescription-detail:prescriptionDetailExist"),
        t("prescription-detail:prescriptionDetailExistDescription"),
        t("modal:continue"),
        t("modal:back"),
        () => setConfirm(true),
        () => navigate("/dashboard/prescribing/")
      )
    }
  }, [isLoadingPrescriptionDetail, prescriptionDetail, confirm, navigate, t])

  const handlePrint = () => window.print()

  if (!ready || isLoadingPrescriptionDetail) {
    return <SkeletonPrescribingPage />
  }

  if (newestPrescriptionDetail.length > 0 && prescriptionDetail) {
    return (
      <Box sx={{ ...DASHBOARD_PAGE_FRAME_SX, overflow: "auto" }} className="ou-scrollbar">
        <PrescribingSuccessPanel
        prescriptionData={{
          listPrescribingId: [newPrescribing.id],
          created_date: newestPrescriptionDetail[0].created_date,
          medicineUnits: newestPrescriptionDetail,
          examination: prescriptionDetail.examination,
          patient: prescriptionDetail.examination.patient,
          user: prescriptionDetail.user,
        }}
        onPrint={handlePrint}
        />
      </Box>
    )
  }

  if (!isLoadingPrescriptionDetail && prescriptionDetail === null) {
    return (
      <Box
        sx={{
          ...DASHBOARD_PAGE_FRAME_SX,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" color="error" gutterBottom>
            {t("prescription-detail:errNullPrescription")}
          </Typography>
          <Typography gutterBottom>{t("common:goToBooking")}</Typography>
          <Button onClick={() => navigate("/booking")}>{t("common:here")}!</Button>
        </Box>
      </Box>
    )
  }

  const draftPanel = (
    <PrescriptionDraftPanel
      medicinesSubmit={medicinesSubmit}
      onAddPrescriptionDetail={handleAddPrescriptionDetail}
      onReset={resetMedicineStore}
      onEditItem={updateMedicineItem}
      onRemove={removeMedicineItem}
      user={user}
      diagnosisId={diagnosisId}
      isLoadingButton={isLoadingButton}
      compact={false}
    />
  )

  return (
    <>
      {isBackdropLoading ? (
        <Box className="ou-absolute ou-top-0 ou-left-0 ou-right-0 ou-bottom-0 ou-bg-black ou-opacity-50" sx={{ zIndex: 1300 }}>
          <BackdropLoading />
        </Box>
      ) : null}

      <PrescribingShell
        patient={prescriptionDetail?.examination?.patient}
        draftCount={medicinesSubmit.length}
        catalogContent={
          <PrescribingCatalogSection
            onAddMedicineLineItem={addMedicineItem}
            medicinesSubmit={medicinesSubmit}
          />
        }
        draftContent={draftPanel}
      />
    </>
  )
}
