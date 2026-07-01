import { Box, Typography } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined"
import { useTranslation } from "react-i18next"

export default function CatalogEmptyState({ variant = "idle", compact = false, centered = false }) {
  const { t } = useTranslation(["medicine"])
  const isIdle = variant === "idle"

  return (
    <Box
      sx={{
        textAlign: "center",
        display: centered ? "flex" : "block",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: centered ? "center" : undefined,
        width: centered ? "100%" : undefined,
        maxWidth: centered ? 420 : undefined,
        mx: centered ? "auto" : undefined,
        py: compact ? (centered ? 3 : 2) : 8,
        px: 2,
        color: "text.secondary",
      }}
    >
      {isIdle ? (
        <SearchIcon sx={{ fontSize: 48, mb: 1, opacity: 0.4 }} />
      ) : (
        <Inventory2OutlinedIcon sx={{ fontSize: 48, mb: 1, opacity: 0.4 }} />
      )}
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        {t(isIdle ? "medicine:catalogSearchIdleTitle" : "medicine:catalogNoResults")}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t(isIdle ? "medicine:catalogSearchIdleHint" : "medicine:catalogNoResultsHint")}
      </Typography>
    </Box>
  )
}
