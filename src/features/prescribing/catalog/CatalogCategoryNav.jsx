import {
  Box,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Switch,
  Tooltip,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

const findRoot = (tree, rootId) => tree.find((c) => c.id === rootId) ?? null

const findLevel2Parent = (root, cateId) => {
  if (!root?.level1?.length || !cateId) return { level1: null, level2: null }
  for (const l1 of root.level1) {
    const l2 = l1.level2?.find((item) => item.id === cateId)
    if (l2) return { level1: l1, level2: l2 }
    if (l1.id === cateId) return { level1: l1, level2: null }
  }
  return { level1: null, level2: null }
}

const selectSx = { minWidth: 0, flex: "1 1 140px", maxWidth: { xs: "100%", sm: 280 } }

/**
 * Compact category toolbar — selects thay chip cloud để tiết kiệm chiều cao cho danh sách thuốc.
 */
export default function CatalogCategoryNav({
  tree,
  loading,
  rootCategoryId,
  selectedCategoryId,
  onRootCategoryChange,
  onCategoryChange,
  onClearCategories,
  inStockOnly,
  onInStockOnlyChange,
}) {
  const { t } = useTranslation(["medicine"])

  const root = useMemo(() => findRoot(tree, rootCategoryId), [tree, rootCategoryId])
  const { level1: activeL1, level2: activeL2 } = useMemo(
    () => findLevel2Parent(root, selectedCategoryId),
    [root, selectedCategoryId]
  )

  const level2Options = activeL1?.level2 ?? []
  const showLevel2 = level2Options.length > 0
  const hasFilter = Boolean(rootCategoryId || selectedCategoryId)

  if (loading) {
    return (
      <Box sx={{ mb: 1 }}>
        <Skeleton variant="rounded" height={40} />
      </Box>
    )
  }

  if (!tree?.length) return null

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 1,
        mb: 1,
      }}
      role="group"
      aria-label={t("medicine:category")}
    >
      <FormControl size="small" sx={{ ...selectSx, flex: "0 1 160px", maxWidth: 200 }}>
        <InputLabel id="prescribing-l0-label">{t("medicine:category")}</InputLabel>
        <Select
          labelId="prescribing-l0-label"
          label={t("medicine:category")}
          value={rootCategoryId ? String(rootCategoryId) : ""}
          onChange={(e) => {
            const raw = e.target.value
            onRootCategoryChange(raw === "" ? 0 : Number(raw))
          }}
        >
          <MenuItem value="">{t("medicine:all")}</MenuItem>
          {tree.map((level0) => (
            <MenuItem key={level0.id} value={String(level0.id)}>
              {level0.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {root?.level1?.length ? (
        <FormControl size="small" sx={selectSx}>
          <InputLabel id="prescribing-l1-label">{t("medicine:subcategory")}</InputLabel>
          <Select
            labelId="prescribing-l1-label"
            label={t("medicine:subcategory")}
            value={activeL1 ? String(activeL1.id) : ""}
            onChange={(e) => {
              const raw = e.target.value
              onCategoryChange(raw === "" ? 0 : Number(raw))
            }}
            displayEmpty
          >
            <MenuItem value="">
              <em>{t("medicine:pickSubcategory")}</em>
            </MenuItem>
            {root.level1.map((level1) => (
              <MenuItem key={level1.id} value={String(level1.id)}>
                {level1.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : null}

      {showLevel2 ? (
        <FormControl size="small" sx={{ ...selectSx, flex: "1 1 120px", maxWidth: 220 }}>
          <InputLabel id="prescribing-l2-label">{t("medicine:subcategoryDetail")}</InputLabel>
          <Select
            labelId="prescribing-l2-label"
            label={t("medicine:subcategoryDetail")}
            value={activeL2 ? String(activeL2.id) : ""}
            onChange={(e) => {
              const raw = e.target.value
              onCategoryChange(raw === "" ? activeL1?.id ?? 0 : Number(raw))
            }}
          >
            <MenuItem value="">{t("medicine:allInGroup", { name: activeL1?.name ?? "" })}</MenuItem>
            {level2Options.map((level2) => (
              <MenuItem key={level2.id} value={String(level2.id)}>
                {level2.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : null}

      <FormControlLabel
        sx={{ m: 0, flexShrink: 0, "& .MuiFormControlLabel-label": { fontSize: "0.8125rem" } }}
        control={
          <Switch
            size="small"
            checked={Boolean(inStockOnly)}
            onChange={(e) => onInStockOnlyChange(e.target.checked)}
            inputProps={{ "aria-label": t("medicine:inStockOnly") }}
          />
        }
        label={t("medicine:inStockOnly")}
      />

      {hasFilter ? (
        <Tooltip title={t("medicine:clearCategoryFilter")}>
          <IconButton size="small" onClick={onClearCategories} aria-label={t("medicine:clearCategoryFilter")}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : null}
    </Box>
  )
}
