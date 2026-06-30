import { Box, Button, Chip, Paper, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import PrescriptionDraftLineItem from "../../../modules/pages/PrescriptionDetailComponents/PrescriptionDraftLineItem"
import DraftSummary from "./DraftSummary"

const listScrollSx = {
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  overflowX: "hidden",
  WebkitOverflowScrolling: "touch",
  borderRadius: 1,
  border: "1px solid",
  borderColor: "divider",
  px: 1,
  py: 0.5,
  "&::-webkit-scrollbar": { width: 6 },
  "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
  "&::-webkit-scrollbar-thumb": { bgcolor: "action.selected", borderRadius: 999 },
}

export default function PrescriptionDraftPanel({
  medicinesSubmit,
  onAddPrescriptionDetail,
  onReset,
  onEditItem,
  onRemove,
  user,
  diagnosisId,
  isLoadingButton = false,
  compact = false,
}) {
  const { t } = useTranslation(["prescription-detail", "common"])
  const count = medicinesSubmit.length

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: { xs: "auto", md: "100%" },
        minHeight: { xs: 280, md: 0 },
        maxWidth: "100%",
        minWidth: 0,
      }}
    >
      <Paper
        elevation={compact ? 0 : 8}
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          p: compact ? 0 : 2.5,
          width: "100%",
          boxShadow: compact ? 0 : 3,
          bgcolor: compact ? "transparent" : undefined,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mb: 2,
            flexShrink: 0,
          }}
        >
          <Typography variant="h6" component="h2" fontWeight={600}>
            {t("prescription-detail:prescriptionDetail")}
          </Typography>
          {count > 0 ? (
            <Chip label={count} size="small" color="primary" sx={{ fontWeight: 600, minWidth: 28 }} />
          ) : null}
        </Box>

        {count === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 6, px: 1 }}>
            {t("prescription-detail:nullMedicine")}
          </Typography>
        ) : (
          <>
            <Box sx={listScrollSx}>
              {medicinesSubmit.map((item, index) => (
                <PrescriptionDraftLineItem
                  key={`${item.id}:${item.productVariantUnitId ?? ""}:${index}`}
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

            <DraftSummary items={medicinesSubmit} />

            <Box sx={{ display: "flex", gap: 1.5, mt: 2, flexShrink: 0 }}>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={onReset}
                aria-label={t("common:deleteAll")}
              >
                {t("common:deleteAll")}
              </Button>
              <Button
                variant="contained"
                color="success"
                fullWidth
                disabled={isLoadingButton}
                onClick={() => onAddPrescriptionDetail(user?.id, diagnosisId)}
                aria-label={t("prescription-detail:prescribing")}
              >
                {t("prescription-detail:prescribing")}
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  )
}
