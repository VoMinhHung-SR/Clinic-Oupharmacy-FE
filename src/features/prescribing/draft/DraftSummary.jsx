import { Box, Divider, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { formatVnd, getDraftLineAmount, getDraftLineUnitPrice, getDraftSubtotal, hasDraftPricing } from "./draftTotals"

export default function DraftSummary({ items = [] }) {
  const { t } = useTranslation(["prescription-detail"])
  const count = items.length
  const subtotal = getDraftSubtotal(items)
  const showPricing = hasDraftPricing(items)

  if (count === 0) return null

  return (
    <Box sx={{ mt: 1.5, flexShrink: 0 }}>
      <Divider sx={{ mb: 1.5 }} />
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 1, mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          {t("prescription-detail:draftLineCount", { count })}
        </Typography>
        {showPricing ? (
          <Typography variant="subtitle1" fontWeight={700} color="primary.main">
            {t("prescription-detail:draftSubtotal")}: {formatVnd(subtotal)}
          </Typography>
        ) : (
          <Typography variant="caption" color="text.secondary">
            {t("prescription-detail:draftPricePending")}
          </Typography>
        )}
      </Box>
      {showPricing &&
        items.map((item, index) => {
          const unit = getDraftLineUnitPrice(item)
          if (unit <= 0) return null
          const lineTotal = getDraftLineAmount(item)
          return (
            <Box
              key={item.id ?? index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
                py: 0.25,
              }}
            >
              <Typography variant="caption" color="text.secondary" noWrap sx={{ flex: 1, minWidth: 0 }}>
                {item.medicineName}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                {formatVnd(lineTotal)}
              </Typography>
            </Box>
          )
        })}
    </Box>
  )
}
