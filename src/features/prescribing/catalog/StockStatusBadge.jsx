import { Box, Typography } from "@mui/material"
import { alpha } from "@mui/material/styles"
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined"
import { useTranslation } from "react-i18next"
import { prescribingPillRadius } from "../layout/prescribingChrome"

const LOW_STOCK_THRESHOLD = 5

const toneSx = (theme, tone) => {
  const map = {
    out: {
      main: theme.palette.error.main,
      dark: theme.palette.error.dark,
    },
    low: {
      main: theme.palette.warning.main,
      dark: theme.palette.warning.dark,
    },
    ok: {
      main: theme.palette.success.main,
      dark: theme.palette.success.dark,
    },
  }
  const c = map[tone]
  return {
    borderColor: alpha(c.main, 0.4),
    bgcolor: alpha(c.main, 0.12),
    color: c.dark,
  }
}

/**
 * Compact stock indicator for quick-add — informational only (not a catalog filter).
 */
export default function StockStatusBadge({ count }) {
  const { t } = useTranslation(["medicine"])
  const stockNum = Number(count)

  if (!Number.isFinite(stockNum)) return null

  const isOut = stockNum <= 0
  const isLow = !isOut && stockNum <= LOW_STOCK_THRESHOLD
  const tone = isOut ? "out" : isLow ? "low" : "ok"
  const Icon = isOut ? ErrorOutlineIcon : isLow ? WarningAmberOutlinedIcon : Inventory2OutlinedIcon
  const label = isOut
    ? t("medicine:outOfStockLabel")
    : t("medicine:inStockLabel", { count: stockNum })

  return (
    <Box
      role="status"
      sx={(theme) => ({
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: 1,
        py: 0.375,
        borderRadius: prescribingPillRadius,
        border: "1px solid",
        flexShrink: 0,
        maxWidth: "100%",
        ...toneSx(theme, tone),
      })}
    >
      <Icon sx={{ fontSize: 16, opacity: 0.9 }} aria-hidden />
      <Typography variant="caption" fontWeight={600} lineHeight={1.2} noWrap>
        {label}
      </Typography>
    </Box>
  )
}
