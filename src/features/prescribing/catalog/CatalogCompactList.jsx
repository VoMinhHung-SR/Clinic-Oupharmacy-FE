import { Box, List, ListItemButton, Typography } from "@mui/material"
import StarIcon from "@mui/icons-material/Star"
import { useTranslation } from "react-i18next"
import SearchResultSkeleton from "./SearchResultSkeleton"
import CatalogEmptyState from "./CatalogEmptyState"
import StockStatusBadge from "./StockStatusBadge"
import { getVariantDisplayName } from "../../../lib/adapters/storeProduct"

const pickVariantId = (variant) => variant?.id ?? variant?.product_variant_id ?? null

const pickName = (variant) => getVariantDisplayName(variant) || "—"

const pickPackaging = (variant) =>
  variant?.packaging || variant?.packing || variant?.package_size || ""

/**
 * Category browse rows — avoids MUI Chip (styled engine issues on Vite dev).
 */
export default function CatalogCompactList({
  variants,
  loading,
  frequentVariantIds,
  onSelectVariant,
  selectedVariantId,
}) {
  const { t } = useTranslation(["medicine"])

  if (loading) {
    return <SearchResultSkeleton rows={5} />
  }

  if (!variants?.length) {
    return <CatalogEmptyState variant="empty" compact />
  }

  return (
    <List dense disablePadding sx={{ py: 0.5 }} role="list">
      {variants.map((variant, index) => {
        const variantId = pickVariantId(variant)
        const name = pickName(variant)
        const packaging = pickPackaging(variant)
        const variantCount = Number(variant?.variant_count ?? 1)
        const detailParts = [
          packaging,
          variantCount > 1 ? t("medicine:variantCount", { count: variantCount }) : null,
        ].filter(Boolean)
        const isFrequent = variantId != null && frequentVariantIds?.has?.(variantId)
        const isSelected = variantId != null && selectedVariantId === variantId
        const stock = Number(variant?.in_stock ?? 0)

        return (
          <ListItemButton
            key={variantId ?? `variant-${index}`}
            selected={isSelected}
            onClick={() => onSelectVariant(variant)}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              border: "1px solid",
              borderColor: isSelected ? "primary.main" : "divider",
              alignItems: "flex-start",
              py: 1,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0, pr: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 0 }}>
                {isFrequent ? (
                  <StarIcon sx={{ fontSize: 16, color: "warning.main", flexShrink: 0 }} aria-hidden />
                ) : null}
                <Typography variant="body2" fontWeight={500} title={name} sx={{ wordBreak: "break-word" }}>
                  {name}
                </Typography>
              </Box>
              {detailParts.length ? (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.25 }}>
                  {detailParts.join(" · ")}
                </Typography>
              ) : null}
            </Box>
            <StockStatusBadge count={stock} />
          </ListItemButton>
        )
      })}
    </List>
  )
}
