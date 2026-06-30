import { Box, Button, Collapse, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import FilterListIcon from "@mui/icons-material/FilterList"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import CatalogSearchBar from "./CatalogSearchBar"
import CatalogCategoryNav from "./CatalogCategoryNav"
import CatalogVariantList, { LIST_GRID } from "./CatalogVariantList"

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
}) {
  const { t } = useTranslation(["prescription-detail", "medicine", "common"])
  const [showAdvanced, setShowAdvanced] = useState(false)

  const listHeader = (
    <Box
      sx={{
        ...LIST_GRID,
        py: 1,
        pl: 1.5,
        pr: 2.5,
        borderBottom: 1,
        borderColor: "divider",
        typography: "body2",
        fontWeight: 600,
      }}
    >
      <Box sx={{ textAlign: "left" }}>{t("prescription-detail:medicineName")}</Box>
      <Box sx={{ textAlign: "center" }}>{t("medicine:packaging")}</Box>
      <Box sx={{ textAlign: "center" }}>{t("prescription-detail:uses")}</Box>
      <Box sx={{ textAlign: "center" }}>{t("prescription-detail:quantity")}</Box>
      <Box sx={{ textAlign: "center" }} />
    </Box>
  )

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
        <CatalogSearchBar
          keyword={paramsFilter.kw}
          onKeywordChange={onKeywordChange}
          inputRef={searchInputRef}
        />
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
        <Button
          type="button"
          variant="text"
          size="small"
          startIcon={<FilterListIcon fontSize="small" />}
          onClick={() => setShowAdvanced((v) => !v)}
          sx={{ mb: 0.5, mt: -0.5, textTransform: "none", minHeight: 28, py: 0 }}
        >
          {t("medicine:filter")}
        </Button>
        <Collapse in={showAdvanced}>
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
            sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center", mb: 1.5 }}
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
        </Collapse>
      </Box>

      <CatalogVariantList
        variants={variants}
        loading={loading}
        isIdle={isIdle}
        schema={schema}
        onAddToPrescription={onAddToPrescription}
        availableStockMap={availableStockMap}
        listHeader={!isIdle && (loading || variants.length > 0) ? listHeader : null}
      />
    </Box>
  )
}
