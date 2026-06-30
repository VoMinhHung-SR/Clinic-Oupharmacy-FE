import { Box, Button, Collapse, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import FilterListIcon from "@mui/icons-material/FilterList"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import SearchCombobox from "./SearchCombobox"
import CatalogCategoryNav from "./CatalogCategoryNav"
import CatalogCompactList from "./CatalogCompactList"
import CatalogEmptyState from "./CatalogEmptyState"
import MedicineQuickAccess from "./MedicineQuickAccess"
import MedicineQuickAdd from "./MedicineQuickAdd"

export default function CatalogPanel({
  variants,
  loading,
  isIdle,
  paramsFilter,
  categoryTree,
  categoryTreeLoading,
  onRootCategoryChange,
  onClearCategories,
  inStockOnly,
  onKeywordChange,
  onCategoryChange,
  onInStockOnlyChange,
  onSubmitFilter,
  schema,
  onAddToPrescription,
  availableStockMap,
  searchInputRef,
  prefs,
  prefsLoading,
  frequentVariantIds,
  boostVariants,
  selectedVariant,
  selectionPrefill,
  onSelectVariant,
  onSelectPrefEntry,
  onClearSelection,
}) {
  const { t } = useTranslation(["prescription-detail", "medicine", "common"])
  const [showAdvanced, setShowAdvanced] = useState(false)

  const showBrowseList =
    !isIdle && !selectedVariant && (paramsFilter.kw || "").trim().length < 2
  const showIdleQuickAccess = isIdle && !selectedVariant
  const categoryId = paramsFilter.cate && paramsFilter.cate !== 0 ? paramsFilter.cate : undefined

  return (
    <Box
      sx={{
        flex: "1 1 auto",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box sx={{ flexShrink: 0, pb: 0.5 }} role="search" aria-label={t("medicine:search")}>
        <SearchCombobox
          keyword={paramsFilter.kw}
          onKeywordChange={onKeywordChange}
          inputRef={searchInputRef}
          frequentVariantIds={frequentVariantIds}
          boostVariants={boostVariants}
          onSelectVariant={onSelectVariant}
          inStockOnly={inStockOnly}
          categoryId={categoryId}
        />

        {selectedVariant ? (
          <MedicineQuickAdd
            variant={selectedVariant}
            prefill={selectionPrefill}
            schema={schema}
            availableStockMap={availableStockMap}
            onAdd={onAddToPrescription}
            onClose={onClearSelection}
            onAdded={onClearSelection}
            searchInputRef={searchInputRef}
          />
        ) : null}

        <Button
          type="button"
          variant="text"
          size="small"
          startIcon={<FilterListIcon fontSize="small" />}
          onClick={() => setShowAdvanced((v) => !v)}
          sx={{ mb: 0.5, textTransform: "none", minHeight: 28, py: 0 }}
        >
          {t("medicine:advancedFilters")}
        </Button>

        <Collapse in={showAdvanced}>
          <Box sx={{ mb: 1.5 }}>
            <CatalogCategoryNav
              tree={categoryTree}
              loading={categoryTreeLoading}
              rootCategoryId={paramsFilter.rootCate}
              selectedCategoryId={paramsFilter.cate}
              onRootCategoryChange={onRootCategoryChange}
              onCategoryChange={onCategoryChange}
              onClearCategories={onClearCategories}
              inStockOnly={inStockOnly}
              onInStockOnlyChange={onInStockOnlyChange}
            />
            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault()
                const fd = new FormData(e.currentTarget)
                onSubmitFilter({
                  kw: paramsFilter.kw,
                  rootCate: paramsFilter.rootCate,
                  cate: paramsFilter.cate,
                  price: fd.get("price") || "all",
                })
              }}
              sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center", mt: 1 }}
            >
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>{t("medicine:price")}</InputLabel>
                <Select name="price" label={t("medicine:price")} defaultValue={paramsFilter.price ?? "all"}>
                  <MenuItem value="all">{t("medicine:all")}</MenuItem>
                  <MenuItem value="asc">{t("common:asc")}</MenuItem>
                  <MenuItem value="desc">{t("common:desc")}</MenuItem>
                </Select>
              </FormControl>
              <Button type="submit" variant="outlined" size="small">
                {t("medicine:search")}
              </Button>
            </Box>
          </Box>
        </Collapse>
      </Box>

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
        }}
      >
        {showIdleQuickAccess && (
          <>
            <CatalogEmptyState variant="idle" compact />
            <MedicineQuickAccess
              prefs={prefs}
              loading={prefsLoading}
              onSelectEntry={onSelectPrefEntry}
            />
          </>
        )}

        {showBrowseList && (
          <CatalogCompactList
            variants={variants}
            loading={loading}
            isIdle={isIdle}
            frequentVariantIds={frequentVariantIds}
            onSelectVariant={onSelectVariant}
            selectedVariantId={selectedVariant?.id}
          />
        )}
      </Box>
    </Box>
  )
}
