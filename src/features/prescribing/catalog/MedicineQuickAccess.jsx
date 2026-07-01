import { Box, Chip, Skeleton, Stack, Typography } from "@mui/material"
import { alpha } from "@mui/material/styles"
import StarIcon from "@mui/icons-material/Star"
import HistoryIcon from "@mui/icons-material/History"
import { useTranslation } from "react-i18next"

const chipSx = (tone) => (theme) => {
  const isFrequent = tone === "frequent"
  const main = isFrequent ? theme.palette.primary.main : theme.palette.grey[500]
  return {
    maxWidth: "100%",
    height: 30,
    fontWeight: 500,
    borderRadius: 999,
    bgcolor: alpha(main, isFrequent ? 0.1 : 0.08),
    borderColor: alpha(main, isFrequent ? 0.35 : 0.25),
    color: isFrequent ? theme.palette.primary.dark : theme.palette.text.primary,
    transition: "background-color 0.15s, border-color 0.15s, box-shadow 0.15s",
    "& .MuiChip-icon": {
      color: isFrequent ? theme.palette.primary.main : theme.palette.text.secondary,
      ml: 0.75,
    },
    "& .MuiChip-label": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      px: 0.5,
    },
    "&:hover": {
      bgcolor: alpha(main, isFrequent ? 0.16 : 0.14),
      borderColor: alpha(main, isFrequent ? 0.5 : 0.4),
      boxShadow: 1,
    },
  }
}

export default function MedicineQuickAccess({ prefs, loading, onSelectEntry }) {
  const { t } = useTranslation(["medicine"])
  const { frequent = [], recent = [] } = prefs ?? {}

  if (loading) {
    return (
      <Box sx={{ py: 1.5, px: 0.5 }} aria-busy="true">
        <Skeleton variant="text" width={80} height={16} sx={{ mb: 1 }} />
        <Stack direction="row" flexWrap="wrap" gap={0.75} useFlexGap>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rounded" width={120} height={30} sx={{ borderRadius: 999 }} />
          ))}
        </Stack>
      </Box>
    )
  }

  if (!frequent.length && !recent.length) {
    return null
  }

  const renderChip = (entry, tone) => {
    const name = entry.variant?.medicine?.name || entry.variant?.product?.web_name || "—"
    const packaging = entry.variant?.packaging || entry.variant?.packing || ""
    const label = packaging ? `${name} · ${packaging}` : name
    const icon =
      tone === "frequent" ? (
        <StarIcon sx={{ fontSize: 15 }} />
      ) : (
        <HistoryIcon sx={{ fontSize: 15 }} />
      )

    return (
      <Chip
        key={`${entry.product_variant_id}-${tone}`}
        icon={icon}
        label={label}
        size="small"
        variant="outlined"
        onClick={() => onSelectEntry(entry)}
        sx={chipSx(tone)}
      />
    )
  }

  return (
    <Box sx={{ py: 1.5, px: 0.5, width: "100%", textAlign: "center" }}>
      {frequent.length > 0 && (
        <Box sx={{ mb: recent.length ? 1.5 : 0 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mb: 0.75 }}>
            {t("medicine:quickAccessFrequent")}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={0.75} useFlexGap justifyContent="center">
            {frequent.map((entry) => renderChip(entry, "frequent"))}
          </Stack>
        </Box>
      )}
      {recent.length > 0 && (
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mb: 0.75 }}>
            {t("medicine:quickAccessRecent")}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={0.75} useFlexGap justifyContent="center">
            {recent.map((entry) => renderChip(entry, "recent"))}
          </Stack>
        </Box>
      )}
    </Box>
  )
}
