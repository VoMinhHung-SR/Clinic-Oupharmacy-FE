import { Box } from "@mui/system"
import { Helmet } from "react-helmet"
import { useTranslation } from "react-i18next"
import usePrescriptionList from "../../../modules/pages/PrescriptionListComponents/hooks/usePrescription"
import SkeletonPrescribingList from "../../../modules/common/components/skeletons/pages/prescribing"
import PrescribingListShell from "../../../features/prescribing/pages/PrescribingListShell"

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
      <Box className="ou-h-[80vh]">
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
