import { Box, Chip, List, ListItemButton, ListItemText, Typography } from "@mui/material"
import StarIcon from "@mui/icons-material/Star"
import { useTranslation } from "react-i18next"
import SkeletonPrescribingPage from "../../../modules/common/components/skeletons/pages/prescribing-prescribing-page"
import CatalogEmptyState from "./CatalogEmptyState"

export default function CatalogCompactList({
  variants,
  loading,
  isIdle,
  frequentVariantIds,
  onSelectVariant,
  selectedVariantId,
}) {
  const { t } = useTranslation(["medicine"])

  if (loading) {
    return <SkeletonPrescribingPage.ListSectionRows />
  }

  if (isIdle) {
    return null
  }

  if (!variants.length) {
    return <CatalogEmptyState variant="empty" />
  }

  return (
    <List dense disablePadding sx={{ py: 0.5 }}>
      {variants.map((variant) => {
        const name = variant.medicine?.name || variant.product?.web_name || "—"
        const packaging = variant.packaging || variant.packing || ""
        const isFrequent = frequentVariantIds?.has(variant.id)
        const isSelected = selectedVariantId === variant.id
        const stock = Number(variant.in_stock ?? 0)

        return (
          <ListItemButton
            key={variant.id}
            selected={isSelected}
            onClick={() => onSelectVariant(variant)}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              border: "1px solid",
              borderColor: isSelected ? "primary.main" : "divider",
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 0 }}>
                  {isFrequent && <StarIcon sx={{ fontSize: 16, color: "warning.main", flexShrink: 0 }} />}
                  <Typography variant="body2" fontWeight={500} noWrap title={name}>
                    {name}
                  </Typography>
                </Box>
              }
              secondary={packaging || undefined}
            />
            <Chip
              size="small"
              label={stock > 0 ? t("medicine:inStockLabel", { count: stock }) : t("medicine:outOfStockLabel")}
              color={stock > 0 ? "success" : "error"}
              sx={{ ml: 1, flexShrink: 0 }}
            />
          </ListItemButton>
        )
      })}
    </List>
  )
}
