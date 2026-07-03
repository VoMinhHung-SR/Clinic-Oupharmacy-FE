import { Box } from "@mui/material"
import { useTranslation } from "react-i18next"
import Loading from "../../../Loading"
import useListItemButton from "../hooks/useListItemButton"
import ListItemButton from "../ListItemButton"
import PrescribingCard from "./PrescribingCard"

const MiniPrescribingCard = ({ prescribing, isLoading }) => {
  const { t, ready } = useTranslation("prescription-detail")
  const { selectedId, handleSelectId, isOpen } = useListItemButton()

  if (!ready && isLoading)
    return (
      <Box sx={{ py: 3 }}>
        <Loading />
      </Box>
    )

  if (prescribing.length === 0) return <Box sx={{ color: "error.main", typography: "body2" }}>{t("errNullPrescribing")}</Box>

  return (
    <Box>
      <ListItemButton
        title={t("prescribingExist")}
        arrayContent={prescribing ?? []}
        selectedId={isOpen ? selectedId : null}
        callback={handleSelectId}
        isLoading={isLoading}
      />
      {isOpen && selectedId ? <PrescribingCard prescribing={selectedId} embedded /> : null}
    </Box>
  )
}

export default MiniPrescribingCard
