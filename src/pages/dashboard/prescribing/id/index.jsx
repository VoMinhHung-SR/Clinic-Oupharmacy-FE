import { Helmet } from "react-helmet"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import PrescribingWorkspace from "../../../../features/prescribing/pages/PrescribingWorkspace"

/** Thin route — orchestration lives in `features/prescribing/pages/PrescribingWorkspace`. */
export default function PrescriptionDetail() {
  const { t, ready } = useTranslation(["prescription-detail"])
  const { diagnosisId } = useParams()

  return (
    <>
      <Helmet>
        <title>{ready ? t("prescription-detail:prescriptionDetail") : "Prescribing"}</title>
      </Helmet>
      <PrescribingWorkspace diagnosisId={diagnosisId} />
    </>
  )
}
