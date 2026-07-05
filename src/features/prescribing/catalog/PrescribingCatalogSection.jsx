import { Box, Stack, Pagination } from "@mui/material"
import { useContext, useEffect, useMemo, useRef } from "react"
import UserContext from "../../../lib/context/UserContext"
import SchemaModels from "../../../lib/schema"
import usePrescribingCatalog from "./hooks/usePrescribingCatalog"
import useStoreCategoryTree from "./hooks/useStoreCategoryTree"
import usePrescriberMedicinePrefs from "./hooks/usePrescriberMedicinePrefs"
import useDiagnosisMedicineSuggestions from "./hooks/useDiagnosisMedicineSuggestions"
import useMedicinePicker from "./hooks/useMedicinePicker"
import { excludeVariantIds } from "./mergeQuickAccessEntries"
import CatalogPanel from "./CatalogPanel"
import { usePrescribingSearchFocus } from "../hooks/usePrescribingSearchFocus"

const DEFAULT_ROOT_SLUG = "thuoc"

export default function PrescribingCatalogSection({
  diagnosisId,
  onAddMedicineLineItem,
  medicinesSubmit,
}) {
  const { user } = useContext(UserContext)
  const { medicineLineItemSchema } = SchemaModels()
  const searchInputRef = useRef(null)

  usePrescribingSearchFocus(searchInputRef)

  const { prefs, loading: prefsLoading, frequentVariantIds, getPrefillForVariant, boostVariants } =
    usePrescriberMedicinePrefs({ enabled: Boolean(user) })

  const {
    suggestions: diagnosisSuggestions,
    loading: diagnosisSuggestionsLoading,
    meta: diagnosisSuggestionsMeta,
  } = useDiagnosisMedicineSuggestions({
      diagnosisId,
      enabled: Boolean(user && diagnosisId),
    })

  const draftVariantIds = useMemo(
    () => new Set((medicinesSubmit ?? []).map((item) => item.id).filter(Boolean)),
    [medicinesSubmit]
  )

  const visibleDiagnosisSuggestions = useMemo(
    () => excludeVariantIds(diagnosisSuggestions, draftVariantIds),
    [diagnosisSuggestions, draftVariantIds]
  )

  const l1VariantIds = useMemo(
    () => new Set(visibleDiagnosisSuggestions.map((e) => e.product_variant_id)),
    [visibleDiagnosisSuggestions]
  )

  const l2ExcludeVariantIds = useMemo(() => {
    const ids = new Set(draftVariantIds)
    l1VariantIds.forEach((id) => ids.add(id))
    return ids
  }, [draftVariantIds, l1VariantIds])

  const { selectedVariant, selectionPrefill, selectVariant, selectPrefEntry, clearSelection } =
    useMedicinePicker({ getPrefillForVariant })

  const { tree: categoryTree, loading: categoryTreeLoading } = useStoreCategoryTree({
    enabled: Boolean(user),
  })
  const prescribingCatalog = usePrescribingCatalog({ enabled: Boolean(user) })
  const { handleRootCategoryChange, paramsFilter } = prescribingCatalog
  const didAutoRoot = useRef(false)

  const { medicineUnits, page, handleChangePage, pagination, medicineLoading } = prescribingCatalog

  const displayVariants = useMemo(
    () => boostVariants(medicineUnits),
    [medicineUnits, boostVariants]
  )

  useEffect(() => {
    if (didAutoRoot.current || !categoryTree.length || paramsFilter.rootCate) return
    const defaultRoot =
      categoryTree.find((c) => c.slug === DEFAULT_ROOT_SLUG) ??
      categoryTree.find((c) => c.name === "Thuốc")
    if (defaultRoot) {
      didAutoRoot.current = true
      handleRootCategoryChange(defaultRoot.id, { silent: true })
    }
  }, [categoryTree, paramsFilter.rootCate, handleRootCategoryChange])

  const availableStockMap = useMemo(() => {
    const map = new Map()
    const unitsForStock = [...medicineUnits]
    if (selectedVariant && !unitsForStock.some((u) => u.id === selectedVariant.id)) {
      unitsForStock.push(selectedVariant)
    }
    unitsForStock.forEach((unit) => {
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
  }, [medicineUnits, medicinesSubmit, selectedVariant])

  const showPagination =
    !medicineLoading &&
    pagination.sizeNumber >= 2 &&
    prescribingCatalog.hasSearchIntent

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
        variants={displayVariants}
        loading={prescribingCatalog.medicineLoading}
        isIdle={prescribingCatalog.isIdle}
        paramsFilter={prescribingCatalog.paramsFilter}
        categoryTree={categoryTree}
        categoryTreeLoading={categoryTreeLoading}
        onKeywordChange={prescribingCatalog.handleKeywordChange}
        onRootCategoryChange={prescribingCatalog.handleRootCategoryChange}
        onCategoryChange={prescribingCatalog.handleCategoryChange}
        onClearCategories={prescribingCatalog.handleClearCategories}
        onSubmitFilter={prescribingCatalog.handleOnSubmitFilter}
        schema={medicineLineItemSchema}
        onAddToPrescription={onAddMedicineLineItem}
        availableStockMap={availableStockMap}
        searchInputRef={searchInputRef}
        prefs={prefs}
        prefsLoading={prefsLoading}
        diagnosisSuggestions={visibleDiagnosisSuggestions}
        diagnosisSuggestionsLoading={diagnosisSuggestionsLoading}
        diagnosisSuggestionsMeta={diagnosisSuggestionsMeta}
        l2ExcludeVariantIds={l2ExcludeVariantIds}
        frequentVariantIds={frequentVariantIds}
        boostVariants={boostVariants}
        selectedVariant={selectedVariant}
        selectionPrefill={selectionPrefill}
        onSelectVariant={selectVariant}
        onSelectPrefEntry={selectPrefEntry}
        onClearSelection={clearSelection}
        hasBrowseIntent={prescribingCatalog.hasBrowseIntent}
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
