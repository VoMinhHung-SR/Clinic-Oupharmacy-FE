import {
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material"
import { useTranslation } from "react-i18next"
import PrescriptionDraftLineItem from "../PrescriptionDraftLineItem"

export default function PrescriptionFormSidebar({
  medicinesSubmit,
  onAddPrescriptionDetail,
  onReset,
  onEditItem,
  onRemove,
  user,
  diagnosisId
}) {
  const { t } = useTranslation(["prescription-detail", "common"])
  return (
    <Box sx={{ maxWidth: "100%", minWidth: 0 }}>
      <Box
        component={Paper}
        elevation={8}
        sx={{
          p: 2.5,
          width: "100%",
          minHeight: 360,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" component="h2" textAlign="center" fontWeight={600} sx={{ mb: 2 }}>
          {t("prescription-detail:prescriptionDetail")}
        </Typography>

        {medicinesSubmit.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
            {t("prescription-detail:nullMedicine")}
          </Typography>
        ) : (
          <>
            <Box
              sx={{
                mb: 2,
                maxHeight: 320,
                minHeight: 0,
                overflowY: "auto",
                overflowX: "hidden",
                WebkitOverflowScrolling: "touch",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                px: 1,
                py: 0.5,
                "&::-webkit-scrollbar": { width: 8 },
                "&::-webkit-scrollbar-track": { bgcolor: "action.hover", borderRadius: 1 },
                "&::-webkit-scrollbar-thumb": { bgcolor: "action.selected", borderRadius: 1 },
              }}
            >
              {medicinesSubmit.map((item, index) => (
                <PrescriptionDraftLineItem
                  key={item.id ?? index}
                  medicineName={item.medicineName}
                  packaging={item.packaging}
                  uses={item.uses}
                  quantity={item.quantity}
                  index={index}
                  itemId={item.id}
                  onRemove={onRemove}
                  onEditItem={onEditItem}
                  variant="card"
                />
              ))}
            </Box>

            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              {t("prescription-detail:doctorNote")}:
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
              
            </Typography>

            <Box className="ou-flex ou-gap-2">
              <Button
                variant="outlined"
                color="error"
                className="ou-flex-1"
                onClick={onReset}
                aria-label={t("common:deleteAll")}
              >
                {t("common:deleteAll")}
              </Button>
              <Button
                variant="contained"
                color="success"
                className="ou-flex-1"
                onClick={() => onAddPrescriptionDetail(user?.id, diagnosisId)}
                aria-label={t("prescription-detail:prescribing")}
              >
                {t("prescription-detail:prescribing")}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}
