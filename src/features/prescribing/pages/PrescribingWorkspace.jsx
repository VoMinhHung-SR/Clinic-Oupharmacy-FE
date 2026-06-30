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
    )
  }

  if (!isLoadingPrescriptionDetail && prescriptionDetail === null) {
    return (
      <Box className="ou-relative ou-items-center" sx={{ minHeight: "550px" }}>
        <Box
          className="ou-absolute ou-p-5 ou-text-center ou-flex-col ou-flex ou-justify-center ou-items-center ou-top-0 ou-bottom-0 ou-w-full ou-place-items-center"
        >
          <h2 className="ou-text-xl ou-text-red-600">{t("prescription-detail:errNullPrescription")}</h2>
          <Typography className="text-center">
            <h3>{t("common:goToBooking")} </h3>
            <Button onClick={() => navigate("/booking")}>{t("common:here")}!</Button>
          </Typography>
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
