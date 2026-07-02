import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

const L2_ALL = "__all__"
const ROOT_ALL = "__all__"

const normalizeId = (id) => {
  if (id == null || id === "" || id === 0) return null
  const n = Number(id)
  return Number.isFinite(n) ? n : null
}

const findRoot = (tree, rootId) => {
  const target = normalizeId(rootId)
  if (target == null) return null
  return tree.find((c) => normalizeId(c.id) === target) ?? null
}

const findLevel2Parent = (root, cateId) => {
  const target = normalizeId(cateId)
  if (!root?.level1?.length || target == null) return { level1: null, level2: null }
  for (const l1 of root.level1) {
    const l1Id = normalizeId(l1.id)
    const l2 = l1.level2?.find((item) => normalizeId(item.id) === target)
    if (l2) return { level1: l1, level2: l2 }
    if (l1Id === target) return { level1: l1, level2: null }
  }
  return { level1: null, level2: null }
}

const fieldSx = { minWidth: 0, width: "100%" }

/**
 * Category browse filters for prescribing — price/stock filters omitted (EMR focus).
 */
export default function CatalogCategoryNav({
  tree,
  loading,
  rootCategoryId,
  selectedCategoryId,
  onRootCategoryChange,
  onCategoryChange,
  onClearCategories,
  onSearch,
}) {
  const { t } = useTranslation(["medicine"])

  const root = useMemo(() => findRoot(tree, rootCategoryId), [tree, rootCategoryId])
  const { level1: activeL1, level2: activeL2 } = useMemo(
    () => findLevel2Parent(root, selectedCategoryId),
    [root, selectedCategoryId]
  )

  const level2Options = activeL1?.level2 ?? []
  const showLevel2 = level2Options.length > 0
  const hasFilter = Boolean(normalizeId(rootCategoryId) || normalizeId(selectedCategoryId))
  const level1Value = activeL1 ? String(activeL1.id) : ""
  const level2Value = activeL2 ? String(activeL2.id) : L2_ALL
  const rootValue = normalizeId(rootCategoryId) ? String(rootCategoryId) : ROOT_ALL

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
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(3, minmax(0, 1fr)) auto",
        },
        gap: 1,
        alignItems: "center",
        mb: 1,
      }}
      role="group"
      aria-label={t("medicine:category")}
    >
      <FormControl size="small" sx={fieldSx}>
        <InputLabel id="prescribing-l0-label" shrink>
          {t("medicine:category")}
        </InputLabel>
        <Select
          labelId="prescribing-l0-label"
          label={t("medicine:category")}
          value={rootValue}
          onChange={(e) => {
            const raw = e.target.value
            onRootCategoryChange(raw === ROOT_ALL ? 0 : Number(raw))
          }}
          renderValue={(selected) => {
            if (selected === ROOT_ALL) {
              return (
                <Typography component="span" variant="body2" color="text.secondary">
                  {t("medicine:all")}
                </Typography>
              )
            }
            const item = tree.find((c) => String(c.id) === selected)
            return item?.name ?? selected
          }}
        >
          <MenuItem value={ROOT_ALL}>{t("medicine:all")}</MenuItem>
          {tree.map((level0) => (
            <MenuItem key={level0.id} value={String(level0.id)}>
              {level0.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {root?.level1?.length ? (
        <FormControl size="small" sx={fieldSx}>
          <InputLabel id="prescribing-l1-label" shrink>
            {t("medicine:subcategory")}
          </InputLabel>
          <Select
            key={`l1-${rootCategoryId}`}
            labelId="prescribing-l1-label"
            label={t("medicine:subcategory")}
            value={level1Value}
            onChange={(e) => {
              const raw = e.target.value
              onCategoryChange(raw === "" ? 0 : Number(raw))
            }}
            displayEmpty
            renderValue={(selected) => {
              if (!selected) {
                return (
                  <Typography component="span" variant="body2" color="text.secondary">
                    {t("medicine:pickSubcategory")}
                  </Typography>
                )
              }
              const item = root.level1.find((l1) => String(l1.id) === selected)
              return item?.name ?? selected
            }}
          >
            {root.level1.map((level1) => (
              <MenuItem key={level1.id} value={String(level1.id)}>
                {level1.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : null}

      {showLevel2 ? (
        <FormControl size="small" sx={fieldSx}>
          <InputLabel id="prescribing-l2-label" shrink>
            {t("medicine:subcategoryDetail")}
          </InputLabel>
          <Select
            key={`l2-${activeL1?.id ?? "none"}`}
            labelId="prescribing-l2-label"
            label={t("medicine:subcategoryDetail")}
            value={level2Value}
            onChange={(e) => {
              const raw = e.target.value
              onCategoryChange(raw === L2_ALL ? activeL1?.id ?? 0 : Number(raw))
            }}
            renderValue={(selected) => {
              if (selected === L2_ALL) {
                return t("medicine:allInGroup", { name: activeL1?.name ?? "" })
              }
              const item = level2Options.find((l2) => String(l2.id) === selected)
              return item?.name ?? selected
            }}
          >
            <MenuItem value={L2_ALL}>{t("medicine:allInGroup", { name: activeL1?.name ?? "" })}</MenuItem>
            {level2Options.map((level2) => (
              <MenuItem key={level2.id} value={String(level2.id)}>
                {level2.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : null}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1,
          gridColumn: { xs: "1 / -1", md: "auto" },
        }}
      >
        {onSearch ? (
          <Button type="button" variant="outlined" size="small" onClick={onSearch}>
            {t("medicine:search")}
          </Button>
        ) : null}

        {hasFilter ? (
          <Tooltip title={t("medicine:clearCategoryFilter")}>
            <IconButton size="small" onClick={onClearCategories} aria-label={t("medicine:clearCategoryFilter")}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : null}
      </Box>
    </Box>
  )
}
