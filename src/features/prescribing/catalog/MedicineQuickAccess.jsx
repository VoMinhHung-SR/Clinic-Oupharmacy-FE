import { Box, Chip, Stack, Typography } from "@mui/material"
import StarIcon from "@mui/icons-material/Star"
import HistoryIcon from "@mui/icons-material/History"
import { useTranslation } from "react-i18next"

export default function MedicineQuickAccess({ prefs, loading, onSelectEntry }) {
  const { t } = useTranslation(["medicine"])
  const { frequent = [], recent = [] } = prefs ?? {}

  if (loading) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
        {t("medicine:quickAccessLoading")}
      </Typography>
    )
  }

  if (!frequent.length && !recent.length) {
    return null
  }

  const renderChip = (entry, icon) => {
    const name = entry.variant?.medicine?.name || entry.variant?.product?.web_name || "—"
    const packaging = entry.variant?.packaging || entry.variant?.packing || ""
    const label = packaging ? `${name} · ${packaging}` : name
    return (
      <Chip
        key={`${entry.product_variant_id}-${icon}`}
        icon={icon}
        label={label}
        size="small"
        variant="outlined"
        onClick={() => onSelectEntry(entry)}
        sx={{ maxWidth: "100%", "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" } }}
      />
    )
  }

  return (
    <Box sx={{ py: 1.5, px: 0.5 }}>
      {frequent.length > 0 && (
        <Box sx={{ mb: recent.length ? 1.5 : 0 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mb: 0.75 }}>
            {t("medicine:quickAccessFrequent")}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={0.75} useFlexGap>
            {frequent.map((entry) => renderChip(entry, <StarIcon sx={{ fontSize: 16 }} />))}
          </Stack>
        </Box>
      )}
      {recent.length > 0 && (
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mb: 0.75 }}>
            {t("medicine:quickAccessRecent")}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={0.75} useFlexGap>
            {recent.map((entry) => renderChip(entry, <HistoryIcon sx={{ fontSize: 16 }} />))}
          </Stack>
        </Box>
      )}
    </Box>
  )
}
