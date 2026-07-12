import { useMemo, useState } from "react"
import { Box, Button, Chip, Skeleton, Stack, Tooltip, Typography } from "@mui/material"
import { alpha } from "@mui/material/styles"
import StarIcon from "@mui/icons-material/Star"
import { useTranslation } from "react-i18next"
import { getVariantDisplayName } from "../../../lib/adapters/storeProduct"
import { prescribingPillRadius } from "../layout/prescribingChrome"
import {
  PERSONAL_MEDICINE_EXPANDED_LIMIT,
  PERSONAL_MEDICINE_PREVIEW_LIMIT,
  chipGridExpandedScrollSx,
  chipGridLineClampSx,
  mergeQuickAccessEntries,
  truncateQuickAccessLabel,
} from "./mergeQuickAccessEntries"

const chipSx = (theme, subtle = false) =>
  subtle
    ? {
        maxWidth: 200,
        height: 28,
        fontWeight: 500,
        borderRadius: prescribingPillRadius,
        bgcolor: "transparent",
        borderColor: theme.palette.divider,
        color: theme.palette.text.secondary,
        "& .MuiChip-icon": {
          color: theme.palette.warning.main,
          ml: 0.75,
        },
        "& .MuiChip-label": {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          px: 0.5,
          fontSize: "0.75rem",
        },
        "&:hover": {
          bgcolor: alpha(theme.palette.action.hover, 0.08),
          borderColor: theme.palette.divider,
        },
      }
    : {
        maxWidth: 220,
        height: 30,
        fontWeight: 500,
        borderRadius: prescribingPillRadius,
        bgcolor: alpha(theme.palette.primary.main, 0.08),
        borderColor: alpha(theme.palette.primary.main, 0.28),
        color: theme.palette.text.primary,
        "& .MuiChip-icon": {
          color: theme.palette.primary.main,
          ml: 0.75,
        },
        "& .MuiChip-label": {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          px: 0.5,
        },
        "&:hover": {
          bgcolor: alpha(theme.palette.primary.main, 0.14),
          borderColor: alpha(theme.palette.primary.main, 0.45),
          boxShadow: 1,
        },
      }

export default function MedicineQuickAccess({
  prefs,
  loading,
  onSelectEntry,
  excludeVariantIds = [],
  embedded = false,
  subtle = false,
  hideTitle = false,
}) {
  const { t } = useTranslation(["medicine"])
  const [expanded, setExpanded] = useState(false)
  const { frequent = [], recent = [] } = prefs ?? {}

  const excludeSet = useMemo(
    () => (excludeVariantIds instanceof Set ? excludeVariantIds : new Set(excludeVariantIds)),
    [excludeVariantIds]
  )

  const suggestions = useMemo(() => {
    const merged = mergeQuickAccessEntries(frequent, recent)
    if (!excludeSet.size) return merged
    return merged.filter((e) => !excludeSet.has(e.product_variant_id))
  }, [frequent, recent, excludeSet])

  const capped = suggestions.slice(0, PERSONAL_MEDICINE_EXPANDED_LIMIT)
  const visible = expanded
    ? capped
    : capped.slice(0, PERSONAL_MEDICINE_PREVIEW_LIMIT)
  const hasMore = capped.length > PERSONAL_MEDICINE_PREVIEW_LIMIT

  const sectionPadding = embedded ? { py: 0, px: 0 } : { py: 1, px: 0.5 }

  if (loading) {
    return (
      <Box sx={{ ...sectionPadding }} aria-busy="true">
        <Skeleton variant="text" width={100} height={16} sx={{ mb: 0.75 }} />
        <Stack direction="row" flexWrap="wrap" gap={0.75} useFlexGap>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rounded" width={100} height={30} sx={{ borderRadius: prescribingPillRadius }} />
          ))}
        </Stack>
      </Box>
    )
  }

  if (!suggestions.length) {
    return null
  }

  return (
    <Box sx={{ ...sectionPadding, width: "100%" }}>
      {!hideTitle ? (
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          sx={{ display: "block", mb: 0.75, textAlign: "left" }}
        >
          {t("medicine:quickAccessPersonal")}
        </Typography>
      ) : null}

      <Stack
        direction="row"
        flexWrap="wrap"
        gap={0.75}
        useFlexGap
        alignItems="center"
        sx={expanded ? chipGridExpandedScrollSx : chipGridLineClampSx()}
      >
        {visible.map((entry) => {
          const name = getVariantDisplayName(entry.variant) || "—"
          const packaging = entry.variant?.packaging || entry.variant?.packing || ""
          const fullLabel = packaging ? `${name} · ${packaging}` : name
          const shortLabel = truncateQuickAccessLabel(fullLabel)

          return (
            <Tooltip key={entry.product_variant_id} title={fullLabel} enterDelay={400}>
              <Chip
                icon={entry.isFrequent ? <StarIcon sx={{ fontSize: 15 }} /> : undefined}
                label={shortLabel}
                size="small"
                variant="outlined"
                onClick={() => onSelectEntry(entry)}
                sx={(theme) => chipSx(theme, subtle)}
              />
            </Tooltip>
          )
        })}
      </Stack>

      {hasMore && !expanded ? (
        <Button
          size="small"
          variant="text"
          onClick={() => setExpanded(true)}
          sx={{ mt: 0.5, minHeight: 28, py: 0, px: 0.5, textTransform: "none", fontSize: "0.75rem" }}
        >
          {t("medicine:quickAccessShowMore", {
            count: capped.length - PERSONAL_MEDICINE_PREVIEW_LIMIT,
          })}
        </Button>
      ) : null}
      {hasMore && expanded ? (
        <Button
          size="small"
          variant="text"
          onClick={() => setExpanded(false)}
          sx={{ mt: 0.5, minHeight: 28, py: 0, px: 0.5, textTransform: "none", fontSize: "0.75rem" }}
        >
          {t("medicine:quickAccessShowLess")}
        </Button>
      ) : null}
    </Box>
  )
}
