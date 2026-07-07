import { Box, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material"
import { alpha } from "@mui/material/styles"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import AddIcon from "@mui/icons-material/Add"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import { useTranslation } from "react-i18next"
import { getVariantDisplayName } from "../../../lib/adapters/storeProduct"
import {
  prescribingPillRadius,
  prescribingSectionBandSx,
} from "../layout/prescribingChrome"
import { DIAGNOSIS_SUGGESTIONS_VISIBLE_LIMIT, truncateQuickAccessLabel } from "./mergeQuickAccessEntries"

const chipSx = (theme) => ({
  height: 32,
  maxWidth: { xs: "100%", sm: 200 },
  flex: { xs: "1 1 calc(50% - 6px)", sm: "0 1 auto" },
  minWidth: 0,
  fontWeight: 500,
  borderRadius: prescribingPillRadius,
  pl: 1.25,
  pr: 0.75,
  bgcolor: "background.paper",
  borderColor: alpha(theme.palette.info.main, 0.35),
  color: theme.palette.text.primary,
  "& .MuiChip-label": {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    px: 0,
    pr: 0.25,
    width: "100%",
  },
  "&:hover": {
    bgcolor: alpha(theme.palette.info.main, 0.1),
    borderColor: alpha(theme.palette.info.main, 0.5),
    boxShadow: 1,
  },
})

function resolveSubtitle(t, meta) {
  if (!meta) {
    return t("medicine:diagnosisZoneHint")
  }
  const matched = Number(meta.matched_diagnoses) || 0
  const clinicMatched = Number(meta.clinic_matched_diagnoses) || 0
  const total = matched + clinicMatched
  if (total > 0) {
    return t("medicine:diagnosisSuggestionsSubtitle", { count: total })
  }
  return t("medicine:diagnosisZoneHint")
}

function resolveChipTooltip(t, entry, fullLabel) {
  const count = entry.prescribe_count ?? 0
  if (entry.prefill_allowed) {
    return t("medicine:diagnosisSuggestionChipTooltipDose", { label: fullLabel, count })
  }
  return t("medicine:diagnosisSuggestionChipTooltip", { label: fullLabel, count })
}

/**
 * P0b — diagnosis-aware suggestions. Tinted band (no nested elevation).
 */
export default function DiagnosisMedicineSuggestions({
  suggestions = [],
  meta = null,
  onSelectEntry,
}) {
  const { t } = useTranslation(["medicine"])

  const visible = suggestions.slice(0, DIAGNOSIS_SUGGESTIONS_VISIBLE_LIMIT)
  const subtitle = resolveSubtitle(t, meta)

  if (!suggestions.length) {
    return null
  }

  return (
    <Box
      id="prescribing-diagnosis-suggestions"
      role="region"
      aria-label={t("medicine:diagnosisSuggestionsPlaceholderTitle")}
      sx={{
        ...prescribingSectionBandSx,
        mt: 1.25,
        mb: 0.75,
        px: { xs: 1.25, sm: 1.5 },
        py: 1.25,
        bgcolor: (theme) => alpha(theme.palette.info.main, 0.07),
        borderLeftWidth: 4,
        borderLeftStyle: "solid",
        borderLeftColor: "info.main",
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.25 }}>
            <AutoAwesomeIcon color="primary" sx={{ fontSize: 18 }} aria-hidden />
            <Typography variant="subtitle2" fontWeight={700} color="primary.dark">
              {t("medicine:diagnosisSuggestionsPlaceholderTitle")}
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.4 }}>
            {subtitle}
          </Typography>
        </Box>
        <Tooltip title={t("medicine:diagnosisSuggestionsDisclaimer")} enterDelay={300}>
          <IconButton size="small" aria-label={t("medicine:diagnosisSuggestionsDisclaimer")} sx={{ mt: -0.25 }}>
            <InfoOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Stack>

      <Stack
        direction="row"
        flexWrap="wrap"
        gap={0.75}
        useFlexGap
        alignItems="stretch"
        sx={{ mt: 1.25, width: "100%" }}
      >
        {visible.map((entry) => {
          const name = getVariantDisplayName(entry.variant) || "—"
          const packaging = entry.variant?.packaging || entry.variant?.packing || ""
          const fullLabel = packaging ? `${name} · ${packaging}` : name
          const shortLabel = truncateQuickAccessLabel(fullLabel, 28)

          return (
            <Tooltip
              key={`${entry.product_variant_id}-${entry.source || "doctor"}`}
              title={resolveChipTooltip(t, entry, fullLabel)}
              enterDelay={400}
            >
              <Chip
                label={
                  <Stack direction="row" alignItems="center" spacing={0.25} sx={{ width: "100%", minWidth: 0 }}>
                    <Box
                      component="span"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      {shortLabel}
                    </Box>
                    <AddIcon sx={{ fontSize: 15, opacity: 0.75, flexShrink: 0 }} aria-hidden />
                  </Stack>
                }
                size="small"
                variant="outlined"
                onClick={() => onSelectEntry(entry)}
                sx={chipSx}
              />
            </Tooltip>
          )
        })}
      </Stack>
    </Box>
  )
}
