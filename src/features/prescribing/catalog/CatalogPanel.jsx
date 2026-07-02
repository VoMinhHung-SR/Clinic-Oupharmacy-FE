import { Box, Button, Collapse } from "@mui/material"
import FilterListIcon from "@mui/icons-material/FilterList"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import SearchCombobox from "./SearchCombobox"
import CatalogCategoryNav from "./CatalogCategoryNav"
import CatalogCompactList from "./CatalogCompactList"
import CatalogEmptyState from "./CatalogEmptyState"
import MedicineQuickAccess from "./MedicineQuickAccess"
import MedicineQuickAdd from "./MedicineQuickAdd"
import { PRESCRIBING_MIN_SEARCH_LEN } from "../constants"

export default function CatalogPanel({
  variants,
  loading,
  isIdle,
  paramsFilter,
  categoryTree,
  categoryTreeLoading,
  onRootCategoryChange,
  onClearCategories,
  onKeywordChange,
  onCategoryChange,
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
  hasBrowseIntent = false,
}) {
  const { t } = useTranslation(["prescription-detail", "medicine", "common"])
  const [showAdvanced, setShowAdvanced] = useState(false)

  const kwActive = (paramsFilter.kw || "").trim().length >= PRESCRIBING_MIN_SEARCH_LEN
  const showBrowseList = hasBrowseIntent && !kwActive
  const showIdleQuickAccess = isIdle && !selectedVariant
  const showSearchBrowseHint = hasBrowseIntent && kwActive && !selectedVariant
  const showResultsPanel = showBrowseList || showIdleQuickAccess || showSearchBrowseHint
  const categoryId = paramsFilter.cate && paramsFilter.cate !== 0 ? paramsFilter.cate : undefined
  const hasQuickSuggestions =
    !prefsLoading && ((prefs?.frequent?.length ?? 0) > 0 || (prefs?.recent?.length ?? 0) > 0)

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
              onSearch={() =>
                onSubmitFilter({
                  kw: paramsFilter.kw,
                  rootCate: paramsFilter.rootCate,
                  cate: paramsFilter.cate,
                })
              }
            />
          </Box>
        </Collapse>
      </Box>

      {showResultsPanel ? (
        <Box
          sx={{
            flex: 1,
            minHeight: showIdleQuickAccess ? { xs: 200, md: 240 } : 120,
            display: showIdleQuickAccess ? "flex" : "block",
            flexDirection: showIdleQuickAccess ? "column" : undefined,
            alignItems: showIdleQuickAccess ? "center" : undefined,
            justifyContent: showIdleQuickAccess ? "center" : undefined,
            overflowY: "auto",
            overflowX: "hidden",
            WebkitOverflowScrolling: "touch",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "divider",
            mt: 0.5,
            px: 1.5,
            py: showIdleQuickAccess ? 2 : 0,
          }}
        >
          {showIdleQuickAccess && (
            <>
              <CatalogEmptyState variant="idle" compact centered shortHint={hasQuickSuggestions} />
              <Box sx={{ width: "100%", maxWidth: 720, mt: 0.5 }}>
                <MedicineQuickAccess
                  prefs={prefs}
                  loading={prefsLoading}
                  onSelectEntry={onSelectPrefEntry}
                />
              </Box>
            </>
          )}

          {showSearchBrowseHint && (
            <CatalogEmptyState variant="idle" compact />
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
      ) : null}
    </Box>
  )
}
