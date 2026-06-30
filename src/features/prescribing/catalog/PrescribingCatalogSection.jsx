import { Box, Stack, Pagination } from "@mui/material"
import { useContext, useEffect, useMemo, useRef } from "react"
import { useTranslation } from "react-i18next"
import UserContext from "../../../lib/context/UserContext"
import SchemaModels from "../../../lib/schema"
import usePrescribingCatalog from "./hooks/usePrescribingCatalog"
import useStoreCategoryTree from "./hooks/useStoreCategoryTree"
import CatalogPanel from "./CatalogPanel"
import { usePrescribingSearchFocus } from "../hooks/usePrescribingSearchFocus"
import SkeletonPrescribingPage from "../../../modules/common/components/skeletons/pages/prescribing-prescribing-page"

const DEFAULT_ROOT_SLUG = "thuoc"

export default function PrescribingCatalogSection({ onAddMedicineLineItem, medicinesSubmit }) {
  const { tReady } = useTranslation(["prescription-detail", "yup-validate", "modal", "medicine", "product"])
  const { user } = useContext(UserContext)
  const { medicineLineItemSchema } = SchemaModels()
  const searchInputRef = useRef(null)

  usePrescribingSearchFocus(searchInputRef)

  const { tree: categoryTree, loading: categoryTreeLoading } = useStoreCategoryTree({
    enabled: Boolean(user),
  })
  const prescribingCatalog = usePrescribingCatalog({ enabled: Boolean(user) })
  const { handleRootCategoryChange, paramsFilter } = prescribingCatalog

  const { medicineUnits, page, handleChangePage, pagination, medicineLoading } = prescribingCatalog

  useEffect(() => {
    if (!categoryTree.length || paramsFilter.rootCate) return
    const defaultRoot =
      categoryTree.find((c) => c.slug === DEFAULT_ROOT_SLUG) ??
      categoryTree.find((c) => c.name === "Thuốc")
    if (defaultRoot) {
      handleRootCategoryChange(defaultRoot.id, { silent: true })
    }
  }, [categoryTree, paramsFilter.rootCate, handleRootCategoryChange])

  const availableStockMap = useMemo(() => {
    const map = new Map()
    medicineUnits.forEach((unit) => {
      const reservedBase =
        medicinesSubmit
          ?.filter((item) => item.id === unit.id)
          .reduce(
            (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.quantityInBase) || 1),
            0
          ) ?? 0
      map.set(unit.id, Math.max(0, Number(unit.in_stock ?? 0) - reservedBase))
    })
    return map
  }, [medicineUnits, medicinesSubmit])

  if (!tReady && medicineLoading) {
    return <SkeletonPrescribingPage.ListSection />
  }

  const showPagination =
    !medicineLoading && pagination.sizeNumber >= 2 && prescribingCatalog.hasSearchIntent

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <CatalogPanel
        variants={prescribingCatalog.medicineUnits}
        loading={prescribingCatalog.medicineLoading}
        isIdle={prescribingCatalog.isIdle}
        paramsFilter={prescribingCatalog.paramsFilter}
        categoryTree={categoryTree}
        categoryTreeLoading={categoryTreeLoading}
        inStockOnly={prescribingCatalog.inStockOnly}
        onKeywordChange={prescribingCatalog.handleKeywordChange}
        onRootCategoryChange={prescribingCatalog.handleRootCategoryChange}
        onCategoryChange={prescribingCatalog.handleCategoryChange}
        onClearCategories={prescribingCatalog.handleClearCategories}
        onInStockOnlyChange={prescribingCatalog.handleInStockOnlyChange}
        onSubmitFilter={prescribingCatalog.handleOnSubmitFilter}
        schema={medicineLineItemSchema}
        onAddToPrescription={onAddMedicineLineItem}
        availableStockMap={availableStockMap}
        searchInputRef={searchInputRef}
      />
      {showPagination ? (
        <Box sx={{ flexShrink: 0, pt: 1.5, pb: 0.5 }}>
          <Stack>
            <Pagination
              count={pagination.sizeNumber}
              variant="outlined"
              sx={{ margin: "0 auto" }}
              page={page}
              onChange={handleChangePage}
              size="small"
            />
          </Stack>
        </Box>
      ) : null}
    </Box>
  )
}
