import { Box } from "@mui/material"
import SkeletonPrescribingPage from "../../../modules/common/components/skeletons/pages/prescribing-prescribing-page"
import MedicineLineItem from "../../../modules/pages/ProductComponents/MedicineLineItem"
import CatalogEmptyState from "./CatalogEmptyState"

const LIST_GRID = {
  display: "grid",
  gridTemplateColumns: "minmax(140px, 2fr) minmax(80px, 1fr) 96px 72px 44px",
  gap: 2,
  alignItems: "center",
  minWidth: 0,
}

export default function CatalogVariantList({
  variants,
  loading,
  isIdle,
  schema,
  onAddToPrescription,
  availableStockMap,
  listHeader,
}) {
  return (
    <>
      {listHeader}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          borderRadius: 1,
          border: "1px solid",
          borderColor: "divider",
          mt: 0.5,
          px: 1.5,
          flexShrink: 0,
          "&::-webkit-scrollbar": { width: 8 },
          "&::-webkit-scrollbar-track": { bgcolor: "action.hover", borderRadius: 1 },
          "&::-webkit-scrollbar-thumb": { bgcolor: "action.selected", borderRadius: 1 },
        }}
      >
        {loading && <SkeletonPrescribingPage.ListSectionRows />}

        {!loading && isIdle && <CatalogEmptyState variant="idle" />}

        {!loading && !isIdle && variants.length === 0 && (
          <CatalogEmptyState variant="empty" />
        )}

        {!loading &&
          !isIdle &&
          variants.map((variant) => (
            <MedicineLineItem
              key={variant.id}
              units={[variant]}
              medicine={variant.medicine}
              schema={schema}
              onAddToPrescription={onAddToPrescription}
              availableStockMap={availableStockMap}
              gridTemplate={LIST_GRID}
            />
          ))}
      </Box>
    </>
  )
}

export { LIST_GRID }
