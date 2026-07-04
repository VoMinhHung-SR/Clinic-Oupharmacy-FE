import { Box } from "@mui/material"
import { useTranslation } from "react-i18next"
import DiagnosisCard from "../../DiagnosisCard"
import useListItemButton from "../hooks/useListItemButton"
import ListItemButton from "../ListItemButton"
import SkeDiagnosisCard from "../../../skeletons/card/SkeDiagnosisCard"

const MiniDiagnosisCard = ({ diagnosis, isLoading }) => {
  const { t, ready } = useTranslation(["diagnosis"])
  const { isOpen, handleIsOpen } = useListItemButton()
  const { id, sign, diagnosed } = diagnosis

  if (!ready && !isLoading) return <SkeDiagnosisCard key={`mini-load-diagnosis-${id}`} />

  if (!id) return <Box sx={{ color: "error.main", typography: "body2" }}>{t("errNullDiagnosis")}</Box>

  return (
    <Box>
      <ListItemButton
        callback={() => handleIsOpen()}
        arrayContent={diagnosis ? [diagnosis] : []}
        selectedId={isOpen ? id : null}
        title={t("diagnosisExist")}
      />
      {isOpen ? <DiagnosisCard id={id} diagnosed={diagnosed} sign={sign} embedded /> : null}
    </Box>
  )
}

export default MiniDiagnosisCard
