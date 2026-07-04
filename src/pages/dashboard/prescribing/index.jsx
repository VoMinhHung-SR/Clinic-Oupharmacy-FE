import { Box } from "@mui/system"
import { Helmet } from "react-helmet"
import { useTranslation } from "react-i18next"
import usePrescriptionList from "../../../modules/pages/PrescriptionListComponents/hooks/usePrescription"
import SkeletonPrescribingList from "../../../modules/common/components/skeletons/pages/prescribing"
import PrescribingListShell from "../../../features/prescribing/pages/PrescribingListShell"
import { DASHBOARD_PAGE_FRAME_SX } from "../../../modules/common/layout/dashboard/styleTokens"

export default function PrescriptionList() {
  const {
    user,
    prescriptionList,
    isLoadingPrescriptionList,
    pagination,
    page,
    handleChangePage,
    handleOnSubmitFilter,
    paramsFilter,
  } = usePrescriptionList()
  const { t, ready } = useTranslation(["prescription", "common"])

  if (!ready) {
    return (
      <Box sx={DASHBOARD_PAGE_FRAME_SX}>
        <Helmet>
          <title>Prescribing</title>
        </Helmet>
        <SkeletonPrescribingList />
      </Box>
    )
  }

  return (
    <>
      <Helmet>
        <title>{t("common:prescribing")}</title>
      </Helmet>
      <PrescribingListShell
        user={user}
        prescriptionList={prescriptionList}
        isLoadingPrescriptionList={isLoadingPrescriptionList}
        pagination={pagination}
        page={page}
        handleChangePage={handleChangePage}
        handleOnSubmitFilter={handleOnSubmitFilter}
        paramsFilter={paramsFilter}
      />
    </>
  )
}
