import { Box, Button, Paper, Typography } from "@mui/material"
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined"
import { DASHBOARD_SURFACE, DASHBOARD_PAPER_SX } from "../../../modules/common/layout/dashboard/styleTokens"
import { useTranslation } from "react-i18next"
import PrescriptionDraftLineItem from "../../../modules/pages/PrescriptionDetailComponents/PrescriptionDraftLineItem"
import DraftSummary from "./DraftSummary"
import { prescribingInsetPanelSx, prescribingPillRadius } from "../layout/prescribingChrome"

const listScrollSx = {
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  overflowX: "hidden",
  WebkitOverflowScrolling: "touch",
  ...prescribingInsetPanelSx,
  px: 1,
  py: 0.5,
  "&::-webkit-scrollbar": { width: 6 },
  "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
  "&::-webkit-scrollbar-thumb": { bgcolor: "action.selected", borderRadius: prescribingPillRadius },
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
        width: "100%",
      }}
    >
      <Paper
        elevation={compact ? 0 : DASHBOARD_SURFACE.elevation}
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          p: compact ? 0 : 2.5,
          width: "100%",
          ...(compact ? {} : DASHBOARD_PAPER_SX),
          bgcolor: compact ? "transparent" : undefined,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
            flexShrink: 0,
          }}
        >
          <Typography variant="h6" component="h2" fontWeight={600}>
            {t("prescription-detail:prescriptionDetail")}
          </Typography>
        </Box>

        {count === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              textAlign: "center",
              pt: 2,
              pb: 3,
              px: 1.5,
              gap: 1,
            }}
          >
            <AssignmentOutlinedIcon
              sx={{ fontSize: 56, color: "primary.main", opacity: 0.55 }}
              aria-hidden
            />
            <Typography variant="body2" fontWeight={600} color="text.primary">
              {t("prescription-detail:nullMedicine")}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 260, lineHeight: 1.45 }}>
              {t("prescription-detail:draftEmptyHint")}
            </Typography>
          </Box>
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
