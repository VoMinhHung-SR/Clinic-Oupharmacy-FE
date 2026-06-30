import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
import { useTranslation } from "react-i18next"
import useMedicineQuickAdd from "./hooks/useMedicineQuickAdd"

export default function MedicineQuickAdd({
  variant,
  prefill,
  schema,
  availableStockMap,
  onAdd,
  onClose,
  onAdded,
  searchInputRef,
}) {
  const { t } = useTranslation(["prescription-detail", "yup-validate", "medicine"])

  const handleSuccess = () => {
    onAdded?.()
    onClose?.()
    searchInputRef?.current?.focus()
  }

  const {
    register,
    handleSubmit,
    errors,
    setError,
    onSubmit,
    selectedSaleUnitId,
    setSelectedSaleUnitId,
    saleUnitOptions,
    hasMultipleSaleUnits,
    maxSaleQty,
    enrichedPreview,
  } = useMedicineQuickAdd({
    variant,
    prefill,
    schema,
    availableStockMap,
    onAdd,
    onSuccess: handleSuccess,
  })

  if (!variant) return null

  const name = variant.medicine?.name || variant.product?.web_name || ""
  const packagingLabel =
    enrichedPreview?.selectedUnitName ?? variant.packaging ?? variant.default_unit_name ?? ""
  const stockNum = maxSaleQty !== null && maxSaleQty !== undefined ? Number(maxSaleQty) : null
  const showLastUsed = Boolean(prefill?.uses)

  const submitWithStockCheck = (data) => {
    const qty = parseInt(data.quantity, 10)
    if (qty > maxSaleQty) {
      setError("quantity", {
        type: "custom",
        message: t("yup-validate:yupQuantityOverStock"),
      })
      return
    }
    onSubmit(data)
  }

  return (
    <Paper
      component="form"
      variant="outlined"
      onSubmit={handleSubmit(submitWithStockCheck)}
      sx={{ p: 1.5, mb: 1, bgcolor: "action.hover", borderColor: "primary.light" }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1, mb: 1 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={600} noWrap title={name}>
            {t("medicine:quickAddTitle", { name })}
          </Typography>
          {showLastUsed && (
            <Typography variant="caption" color="text.secondary">
              {t("medicine:quickAddLastUsed")}
            </Typography>
          )}
        </Box>
        <IconButton size="small" onClick={onClose} aria-label={t("medicine:quickAddClose")}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {stockNum !== null && (
        <Box sx={{ mb: 1 }}>
          {stockNum === 0 ? (
            <Chip size="small" label={t("medicine:outOfStockLabel")} color="error" />
          ) : (
            <Chip size="small" label={t("medicine:inStockLabel", { count: stockNum })} color="success" />
          )}
        </Box>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 88px 1fr auto" },
          gap: 1,
          alignItems: "start",
        }}
      >
        {hasMultipleSaleUnits ? (
          <FormControl size="small" fullWidth>
            <Select
              value={selectedSaleUnitId ?? ""}
              onChange={(e) => setSelectedSaleUnitId(Number(e.target.value))}
              aria-label={t("medicine:packaging")}
            >
              {saleUnitOptions.map((opt) => (
                <MenuItem key={opt.unit_id} value={opt.unit_id}>
                  {opt.unit_name || "—"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ alignSelf: "center" }}>
            {packagingLabel || "—"}
          </Typography>
        )}

        <TextField
          size="small"
          type="number"
          label={t("prescription-detail:quantity")}
          error={!!errors.quantity}
          helperText={errors.quantity?.message}
          inputProps={{ "aria-label": t("prescription-detail:quantity") }}
          {...register("quantity")}
        />

        <TextField
          size="small"
          label={t("prescription-detail:uses")}
          error={!!errors.uses}
          helperText={errors.uses?.message}
          inputProps={{ "aria-label": t("prescription-detail:uses") }}
          {...register("uses")}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(submitWithStockCheck)()
            }
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="success"
          size="small"
          startIcon={<AddIcon />}
          sx={{ alignSelf: "center", whiteSpace: "nowrap" }}
        >
          {t("prescription-detail:addMedicine")}
        </Button>
      </Box>
    </Paper>
  )
}
