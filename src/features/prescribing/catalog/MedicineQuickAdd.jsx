import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
import { alpha } from "@mui/material/styles"
import { useTranslation } from "react-i18next"
import useMedicineQuickAdd from "./hooks/useMedicineQuickAdd"
import StockStatusBadge from "./StockStatusBadge"
import { getVariantDisplayName, getVariantPackingTotal } from "../../../lib/adapters/storeProduct"
import { prescribingInsetPanelSx } from "../layout/prescribingChrome"

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
    selectedSaleUnit,
  } = useMedicineQuickAdd({
    variant,
    prefill,
    schema,
    availableStockMap,
    onAdd,
    onSuccess: handleSuccess,
  })

  if (!variant) return null

  const name = getVariantDisplayName(variant)
  /** Gray subtitle = variant packing total (store `packing` field), not sale-unit name. */
  const packingTotalLabel = getVariantPackingTotal(variant)
  const saleUnitLabel =
    selectedSaleUnit?.unit_name || variant.default_unit_name || "—"
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
    <Box
      component="form"
      onSubmit={handleSubmit(submitWithStockCheck)}
      sx={(theme) => ({
        ...prescribingInsetPanelSx,
        p: { xs: 1.25, sm: 1.5 },
        bgcolor: alpha(theme.palette.primary.main, 0.06),
        borderColor: alpha(theme.palette.primary.main, 0.28),
      })}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ lineHeight: 1.35 }} title={name}>
            {t("medicine:quickAddTitle", { name })}
          </Typography>
          {packingTotalLabel ? (
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.25 }}>
              {packingTotalLabel}
            </Typography>
          ) : null}
          {showLastUsed && (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.25 }}>
              {t("medicine:quickAddLastUsed")}
            </Typography>
          )}
        </Box>
        {stockNum !== null ? <StockStatusBadge count={stockNum} /> : null}
        <IconButton size="small" onClick={onClose} aria-label={t("medicine:quickAddClose")} sx={{ mt: -0.25 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

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
            <InputLabel id="quick-add-sale-unit-label">{t("medicine:saleUnit")}</InputLabel>
            <Select
              labelId="quick-add-sale-unit-label"
              label={t("medicine:saleUnit")}
              value={selectedSaleUnitId ?? ""}
              onChange={(e) => setSelectedSaleUnitId(Number(e.target.value))}
            >
              {saleUnitOptions.map((opt) => (
                <MenuItem key={opt.unit_id} value={opt.unit_id}>
                  {opt.unit_name || "—"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <TextField
            size="small"
            fullWidth
            label={t("medicine:saleUnit")}
            value={saleUnitLabel}
            inputProps={{ readOnly: true, "aria-label": t("medicine:saleUnit") }}
            sx={{
              "& .MuiInputBase-input": { cursor: "default" },
            }}
          />
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
    </Box>
  )
}
