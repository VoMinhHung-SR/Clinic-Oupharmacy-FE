import { yupResolver } from "@hookform/resolvers/yup"
import { Box, Button, Chip, FormControl, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import AddIcon from "@mui/icons-material/Add"
import React, { useState, useEffect } from "react"
import { getMedicineUnitImageUrl } from "../../../../lib/utils/medicineUnitImage"
import {
  enrichVariantForPrescribing,
  getMaxSaleQuantity,
  resolveProductVariantUnitId,
} from "../../../../lib/adapters/storeProduct"

const MedicineLineItem = ({ units, medicine, schema, onAddToPrescription, availableStockMap, gridTemplate }) => {
  const { t } = useTranslation(["prescription-detail", "yup-validate", "modal", "medicine"])
  const [selectedVariantId, setSelectedVariantId] = useState(units?.[0]?.id ?? null)
  const [selectedSaleUnitId, setSelectedSaleUnitId] = useState(null)

  const medicineUnit = units?.find((u) => u.id === selectedVariantId) ?? units?.[0]
  const saleUnitOptions = Array.isArray(medicineUnit?.unit_options) ? medicineUnit.unit_options : []
  const hasMultipleVariants = Array.isArray(units) && units.length > 1
  const hasMultipleSaleUnits = saleUnitOptions.length > 1

  useEffect(() => {
    const firstId = units?.[0]?.id
    if (firstId != null && !units?.some((u) => u.id === selectedVariantId)) {
      setSelectedVariantId(firstId)
    }
  }, [units, selectedVariantId])

  useEffect(() => {
    if (!medicineUnit) return
    setSelectedSaleUnitId(resolveProductVariantUnitId(medicineUnit))
  }, [medicineUnit?.id])

  const { register, handleSubmit, formState: { errors }, reset, setError } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { uses: "", quantity: "" },
  })

  const RUNNING_OUT_THRESHOLD = 20

  const baseStockAvailable =
    medicineUnit != null && availableStockMap
      ? availableStockMap.get(medicineUnit.id)
      : medicineUnit?.in_stock
  const maxSaleQty = getMaxSaleQuantity(medicineUnit, selectedSaleUnitId, baseStockAvailable)
  const stockNum = maxSaleQty !== null && maxSaleQty !== undefined ? Number(maxSaleQty) : null

  const enrichedPreview = medicineUnit
    ? enrichVariantForPrescribing(medicineUnit, selectedSaleUnitId)
    : null
  const name =
    (medicine && typeof medicine === "object" && medicine.name) ? medicine.name
    : (medicineUnit?.medicine && typeof medicineUnit.medicine === "object" && medicineUnit.medicine.name) ? medicineUnit.medicine.name
    : ""
  const packagingLabel =
    enrichedPreview?.selectedUnitName ?? medicineUnit?.packaging ?? medicineUnit?.default_unit_name ?? ""

  const onSubmit = (data) => {
    if (!medicineUnit) return
    const qty = parseInt(data.quantity, 10)
    if (qty > maxSaleQty) {
      setError("quantity", {
        type: "custom",
        message: t("yup-validate:yupQuantityOverStock"),
      })
      return
    }
    reset()
    onAddToPrescription(
      enrichVariantForPrescribing(medicineUnit, selectedSaleUnitId),
      data
    )
  }

  const rowSx = {
    ...(gridTemplate || {}),
    width: "100%",
    minWidth: 0,
    py: 1.5,
    mb: 1,
    minHeight: 64,
    borderRadius: 1,
    "&:hover": { bgcolor: "action.hover" },
    border: "1px solid",
    borderColor: "divider",
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box key={medicineUnit?.id ?? "line"} sx={rowSx}>
        <Box sx={{ display: "flex", alignItems: "center", minWidth: 0, overflow: "hidden" }}>
          <img
            src={getMedicineUnitImageUrl(medicineUnit)}
            alt={name}
            width={48}
            height={48}
            style={{ objectFit: "contain", flexShrink: 0 }}
          />
          <Box sx={{ flex: 1, minWidth: 0, pl: 1 }}>
            <Typography variant="body2" fontWeight={500} noWrap title={name}>{name}</Typography>
            {stockNum !== null && (
              <Box sx={{ mt: 0.5, display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap" }}>
                {stockNum === 0 ? (
                  <>
                    <Chip size="small" label={t("medicine:outOfStockLabel")} color="error" sx={{ height: 22 }} />
                    <Typography component="span" variant="caption" color="text.secondary" sx={{ cursor: "pointer", textDecoration: "underline" }} title={t("medicine:orderStockLabel")}>
                      {t("medicine:orderStockLabel")}
                    </Typography>
                  </>
                ) : stockNum <= RUNNING_OUT_THRESHOLD ? (
                  <Chip size="small" label={t("medicine:runningOutLabel", { count: stockNum })} color="warning" sx={{ height: 22 }} />
                ) : (
                  <Chip size="small" label={t("medicine:inStockLabel", { count: stockNum })} color="success" sx={{ height: 22 }} />
                )}
              </Box>
            )}
            {(errors.uses?.message || errors.quantity?.message) && (
              <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2, py: 0, listStyle: "disc" }}>
                {errors.uses?.message && <Box component="li" sx={{ typography: "caption", color: "error.main" }}>{errors.uses.message}</Box>}
                {errors.quantity?.message && <Box component="li" sx={{ typography: "caption", color: "error.main" }}>{errors.quantity.message}</Box>}
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, alignItems: "center", justifyContent: "center", minWidth: 0, overflow: "hidden" }}>
          {hasMultipleVariants ? (
            <FormControl size="small" fullWidth>
              <Select
                labelId={`variant-${medicine?.id}`}
                value={selectedVariantId ?? ""}
                onChange={(e) => setSelectedVariantId(Number(e.target.value))}
                aria-label={t("medicine:packaging")}
              >
                {units.map((u) => {
                  const base = availableStockMap?.get(u.id) ?? u.in_stock ?? 0
                  const defaultUnit = resolveProductVariantUnitId(u)
                  const maxQty = getMaxSaleQuantity(u, defaultUnit, base)
                  return (
                    <MenuItem key={u.id} value={u.id}>
                      {u.packaging || u.default_unit_name || "—"} (SL: {maxQty})
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          ) : null}

          {hasMultipleSaleUnits ? (
            <FormControl size="small" fullWidth>
              <Select
                labelId={`sale-unit-${medicineUnit?.id}`}
                value={selectedSaleUnitId ?? ""}
                onChange={(e) => setSelectedSaleUnitId(Number(e.target.value))}
                aria-label={t("medicine:packaging")}
              >
                {saleUnitOptions.map((opt) => {
                  const base = availableStockMap?.get(medicineUnit.id) ?? medicineUnit.in_stock ?? 0
                  const maxQty = getMaxSaleQuantity(medicineUnit, opt.unit_id, base)
                  return (
                    <MenuItem key={opt.unit_id} value={opt.unit_id}>
                      {opt.unit_name || "—"} (SL: {maxQty})
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          ) : !hasMultipleVariants ? (
            <Typography variant="body2" color="text.secondary" noWrap title={packagingLabel || "—"}>
              {packagingLabel || "—"}
            </Typography>
          ) : null}
        </Box>

        <Box sx={{ minWidth: 0, display: "flex", justifyContent: "center" }}>
          <TextField
            size="small"
            variant="outlined"
            id={`medicine-uses-${medicineUnit?.id}`}
            name="uses"
            type="text"
            error={!!errors.uses}
            inputProps={{ "aria-label": t("prescription-detail:uses"), "aria-invalid": !!errors.uses }}
            {...register("uses")}
            sx={{ width: "100%", maxWidth: 96 }}
          />
        </Box>

        <Box sx={{ minWidth: 0, display: "flex", justifyContent: "center" }}>
          <TextField
            size="small"
            variant="outlined"
            id={`medicine-quantity-${medicineUnit?.id}`}
            type="number"
            name="quantity"
            InputLabelProps={{ shrink: true }}
            error={!!errors.quantity}
            inputProps={{ "aria-label": t("prescription-detail:quantity"), "aria-invalid": !!errors.quantity }}
            {...register("quantity")}
            sx={{ width: "100%", maxWidth: 72 }}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minWidth: 0, overflow: "hidden" }}>
          <Tooltip title={t("prescription-detail:addMedicine")} followCursor>
            <Button
              variant="contained"
              color="success"
              size="small"
              type="submit"
              aria-label={t("prescription-detail:addMedicine")}
              sx={{
                minWidth: 0,
                width: 40,
                height: 40,
                p: 0,
                borderRadius: 1,
                "& .MuiSvgIcon-root": { fontSize: 20 },
              }}
            >
              <AddIcon />
            </Button>
          </Tooltip>
        </Box>
      </Box>
    </form>
  )
}

export default React.memo(MedicineLineItem)
