import { Box, Button, Collapse, Stack } from "@mui/material"
import FilterListIcon from "@mui/icons-material/FilterList"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import SearchCombobox from "./SearchCombobox"
import CatalogCategoryNav from "./CatalogCategoryNav"
import CatalogCompactList from "./CatalogCompactList"
import PrescribingIdlePanel from "./PrescribingIdlePanel"
import DiagnosisMedicineSuggestions from "./DiagnosisMedicineSuggestions"
import MedicineQuickAdd from "./MedicineQuickAdd"
import { PRESCRIBING_MIN_SEARCH_LEN } from "../constants"
import { prescribingFilterButtonSx, prescribingInsetPanelSx } from "../layout/prescribingChrome"

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
  diagnosisSuggestions,
  diagnosisSuggestionsLoading,
  diagnosisSuggestionsMeta,
  l2ExcludeVariantIds,
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
  const quickAddOpen = Boolean(selectedVariant)
  const isBaseIdle = isIdle && !hasBrowseIntent

  const showIdleLayout = isBaseIdle
  const showCatalogList = !showIdleLayout && (kwActive || hasBrowseIntent)
  const showResultsPanel = showIdleLayout || showCatalogList
  const showDiagnosisSuggestions = isBaseIdle && !quickAddOpen

  const hasDiagnosisSuggestions =
    !diagnosisSuggestionsLoading && (diagnosisSuggestions?.length ?? 0) > 0

  const categoryId = paramsFilter.cate && paramsFilter.cate !== 0 ? paramsFilter.cate : undefined

  return (
    <Box
      sx={{
        flex: "1 1 auto",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <Box sx={{ flexShrink: 0 }} role="search" aria-label={t("medicine:search")}>
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <SearchCombobox
              keyword={paramsFilter.kw}
              onKeywordChange={onKeywordChange}
              inputRef={searchInputRef}
              frequentVariantIds={frequentVariantIds}
              boostVariants={boostVariants}
              onSelectVariant={onSelectVariant}
              categoryId={categoryId}
              noMargin
            />
          </Box>
          <Button
            type="button"
            variant={showAdvanced ? "contained" : "outlined"}
            size="small"
            startIcon={<FilterListIcon />}
            onClick={() => setShowAdvanced((v) => !v)}
            aria-expanded={showAdvanced}
            sx={{
              flexShrink: 0,
              mt: 0.25,
              ...prescribingFilterButtonSx,
            }}
          >
            {t("medicine:advancedFilters")}
          </Button>
        </Stack>

        {quickAddOpen ? (
          <Box sx={{ mt: 1, width: "100%" }}>
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
          </Box>
        ) : null}

        {showDiagnosisSuggestions && hasDiagnosisSuggestions ? (
          <Box sx={{ mt: 1, width: "100%" }}>
            <DiagnosisMedicineSuggestions
              suggestions={diagnosisSuggestions}
              meta={diagnosisSuggestionsMeta}
              onSelectEntry={onSelectPrefEntry}
            />
          </Box>
        ) : null}

        <Collapse in={showAdvanced}>
          <Box sx={{ my: 2 }}>
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
            minHeight: { xs: 140, md: 160 },
            width: "100%",
            mt: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            overflow: "hidden",
            bgcolor: "background.paper",
            ...prescribingInsetPanelSx,
          }}
        >
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              overflowX: "hidden",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {showIdleLayout ? (
              <PrescribingIdlePanel
                prefs={prefs}
                prefsLoading={prefsLoading}
                onSelectEntry={onSelectPrefEntry}
                l2ExcludeVariantIds={l2ExcludeVariantIds}
              />
            ) : null}

            {showCatalogList ? (
              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  p: 1.5,
                }}
              >
                <CatalogCompactList
                  variants={variants}
                  loading={loading}
                  frequentVariantIds={frequentVariantIds}
                  onSelectVariant={onSelectVariant}
                  selectedVariantId={selectedVariant?.id}
                />
              </Box>
            ) : null}
          </Box>
        </Box>
      ) : null}
    </Box>
  )
}
