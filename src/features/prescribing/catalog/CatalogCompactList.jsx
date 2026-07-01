import { Box, List, ListItemButton, Typography } from "@mui/material"
import StarIcon from "@mui/icons-material/Star"
import SearchResultSkeleton from "./SearchResultSkeleton"
import CatalogEmptyState from "./CatalogEmptyState"
import StockStatusBadge from "./StockStatusBadge"

const pickVariantId = (variant) => variant?.id ?? variant?.product_variant_id ?? null

const pickName = (variant) =>
  variant?.medicine?.name || variant?.product?.web_name || variant?.product?.name || "—"

const pickPackaging = (variant) =>
  variant?.packaging || variant?.packing || variant?.package_size || ""

/**
 * Category browse rows — avoids MUI Chip (styled engine issues on Vite dev).
 */
export default function CatalogCompactList({
  variants,
  loading,
  isIdle,
  frequentVariantIds,
  onSelectVariant,
  selectedVariantId,
}) {
  if (loading) {
    return <SearchResultSkeleton rows={5} />
  }

  if (isIdle) {
    return null
  }

  if (!variants?.length) {
    return <CatalogEmptyState variant="empty" />
  }

  return (
    <List dense disablePadding sx={{ py: 0.5 }} role="list">
      {variants.map((variant, index) => {
        const variantId = pickVariantId(variant)
        const name = pickName(variant)
        const packaging = pickPackaging(variant)
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
              {packaging ? (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.25 }}>
                  {packaging}
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
