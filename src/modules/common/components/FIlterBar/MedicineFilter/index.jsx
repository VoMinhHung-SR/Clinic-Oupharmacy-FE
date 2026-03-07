import { useState } from "react"
import { TextField, FormControl, InputLabel, Select, MenuItem, Button, Box, Tooltip, Collapse, InputAdornment } from "@mui/material"
import FilterListIcon from "@mui/icons-material/FilterList"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import SearchIcon from "@mui/icons-material/Search"

const MedicineFilter = (props) => {
  const { t } = useTranslation(["yup-validate", "medicine", "common"])
  const [showFilter, setShowFilter] = useState(false)
  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      kw: props.kw ?? "",
      cate: props.cateFilter ?? 0,
      price: props.price ?? "all",
    },
  })

  const categories = props.categories
  const prescribingSearch = props.prescribingSearch === true

  const onSubmit = (data) => props.onSubmit(data)

  if (prescribingSearch) {
    return (
      <Box sx={{ width: "100%", mb: 2 }}>
        <form onSubmit={methods.handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder={t("medicine:searchPlaceholder")}
              {...methods.register("kw")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: { bgcolor: "background.paper", borderRadius: 1 },
              }}
              sx={{ flex: "1 1 200px", maxWidth: 480 }}
            />
            <Tooltip title={t("medicine:search")} followCursor>
              <Button type="submit" variant="contained" color="primary" sx={{ minWidth: 44 }}>
                <SearchIcon />
              </Button>
            </Tooltip>
            <Button
              type="button"
              variant="outlined"
              size="small"
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilter((v) => !v)}
              aria-expanded={showFilter}
            >
              {t("medicine:filter")}
            </Button>
          </Box>
          <Collapse in={showFilter} sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>{t("medicine:category")}</InputLabel>
                <Select label={t("medicine:category")} {...methods.register("cate")}>
                  <MenuItem value={0}>{t("medicine:all")}</MenuItem>
                  {categories?.map((c) => (
                    <MenuItem key={`medicineUnit_filter_cate_${c.id}`} value={c.id}>{c.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>{t("medicine:price")}</InputLabel>
                <Select label={t("medicine:price")} {...methods.register("price")}>
                  <MenuItem value="all">{t("medicine:all")}</MenuItem>
                  <MenuItem value="asc">{t("common:asc")}</MenuItem>
                  <MenuItem value="desc">{t("common:desc")}</MenuItem>
                </Select>
              </FormControl>
              <Button type="submit" variant="outlined" color="primary" size="small">
                {t("medicine:search")}
              </Button>
            </Box>
          </Collapse>
        </form>
      </Box>
    )
  }

  return (
    <Box sx={{ px: 1, width: "100%" }}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12, marginTop: 16, marginBottom: 12 }}
      >
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>{t("medicine:category")}</InputLabel>
          <Select label={t("medicine:category")} {...methods.register("cate")}>
            <MenuItem value={0}>{t("medicine:all")}</MenuItem>
            {categories?.map((c) => (
              <MenuItem key={`medicineUnit_filter_cate_${c.id}`} value={c.id}>{c.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>{t("medicine:price")}</InputLabel>
          <Select label={t("medicine:price")} {...methods.register("price")}>
            <MenuItem value="all">{t("medicine:all")}</MenuItem>
            <MenuItem value="asc">{t("common:asc")}</MenuItem>
            <MenuItem value="desc">{t("common:desc")}</MenuItem>
          </Select>
        </FormControl>
        <TextField size="small" variant="outlined" label={t("medicine:medicineName")} {...methods.register("kw")} />
        <Tooltip title={t("medicine:search")} followCursor>
          <Button type="submit" variant="outlined" color="success" sx={{ minWidth: 44 }}>
            <SearchIcon fontSize="medium" />
          </Button>
        </Tooltip>
      </form>
    </Box>
  )
}

export default MedicineFilter