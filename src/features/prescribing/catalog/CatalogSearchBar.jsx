import { InputAdornment, TextField } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import { useTranslation } from "react-i18next"

export default function CatalogSearchBar({ keyword, onKeywordChange, inputRef }) {
  const { t } = useTranslation(["medicine"])

  return (
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      inputRef={inputRef}
      value={keyword ?? ""}
      onChange={(e) => onKeywordChange(e.target.value)}
      placeholder={t("medicine:searchPlaceholder")}
      sx={{ mb: 1 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" fontSize="small" />
          </InputAdornment>
        ),
        sx: { bgcolor: "background.paper", borderRadius: 1 },
      }}
      inputProps={{
        "aria-label": t("medicine:search"),
        title: t("medicine:searchKeyboardHint"),
      }}
    />
  )
}
