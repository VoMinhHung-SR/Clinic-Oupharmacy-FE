import { yupResolver } from "@hookform/resolvers/yup"
import { Box, Button, Chip, FormControl, InputLabel, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import AddIcon from "@mui/icons-material/Add"
import React, { useState, useEffect } from "react"
import { getMedicineUnitImageUrl } from "../../../../lib/utils/medicineUnitImage"

const MedicineLineItem = ({ units, medicine, schema, onAddToPrescription, availableStockMap, gridTemplate }) => {
  const { t } = useTranslation(["prescription-detail", "yup-validate", "modal", "medicine"])
  const [selectedOption, setSelectedOption] = useState(units?.[0]?.id ?? null)
  useEffect(() => {
    const firstId = units?.[0]?.id
    if (firstId != null && !units?.some((u) => u.id === selectedOption)) setSelectedOption(firstId)
  }, [units, selectedOption])
  const { register, handleSubmit, formState: { errors }, reset, setError } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { uses: "", quantity: "" },
  })

  const RUNNING_OUT_THRESHOLD = 20

  const medicineUnit = units?.find((u) => u.id === selectedOption) ?? units?.[0]
  const availableStock = medicineUnit != null && availableStockMap ? availableStockMap.get(medicineUnit.id) : undefined
  const stockNum = availableStock !== undefined && availableStock !== null ? Number(availableStock) : null
  const name =
    (medicine && typeof medicine === "object" && medicine.name) ? medicine.name
    : (medicineUnit?.medicine && typeof medicineUnit.medicine === "object" && medicineUnit.medicine.name) ? medicineUnit.medicine.name
    : ""
  const packaging = medicineUnit?.packaging ?? ""
  const hasMultiplePackages = Array.isArray(units) && units.length > 1

  const onSubmit = (data) => {
    if (!medicineUnit) return
    const inStock = medicineUnit.in_stock ?? 0
    if (parseInt(data.quantity, 10) > parseInt(inStock, 10)) {
      setError("quantity", {
        type: "custom",
        message: t("yup-validate:yupQuantityOverStock"),
      })
      return
    }
    reset()
    onAddToPrescription(medicineUnit, data)
  }

  const rowSx = {
    ...(gridTemplate || {}),
    width: "100%",
    px: 1.5,
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
        <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
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
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", minHeight: 40, justifyContent: "center" }}>
          {hasMultiplePackages ? (
            <FormControl size="small" fullWidth>
              <InputLabel id={`package-size-${medicine?.id}`}>{t("medicine:packaging")}</InputLabel>
              <Select
                labelId={`package-size-${medicine?.id}`}
                value={selectedOption ?? ""}
                label={t("medicine:packaging")}
                onChange={(e) => setSelectedOption(Number(e.target.value))}
                aria-label={t("medicine:packaging")}
              >
                {units.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.packaging || "—"} (SL: {availableStockMap?.get(u.id) ?? u.in_stock ?? 0})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Typography variant="body2" color="text.secondary" noWrap title={packaging || "—"}>
              {packaging || "—"}
            </Typography>
          )}
        </Box>

        <Box>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            id={`medicine-uses-${medicineUnit?.id}`}
            name="uses"
            type="text"
            inputProps={{ "aria-label": t("prescription-detail:uses") }}
            {...register("uses")}
          />
          {errors.uses?.message && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.uses.message}</Typography>
          )}
        </Box>

        <Box>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            id={`medicine-quantity-${medicineUnit?.id}`}
            type="number"
            name="quantity"
            InputLabelProps={{ shrink: true }}
            inputProps={{ "aria-label": t("prescription-detail:quantity") }}
            {...register("quantity")}
          />
          {errors.quantity?.message && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.quantity.message}</Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Tooltip title={t("prescription-detail:addMedicine")} followCursor>
            <Button variant="contained" color="success" size="small" type="submit" aria-label={t("prescription-detail:addMedicine")}>
              <AddIcon />
            </Button>
          </Tooltip>
        </Box>
      </Box>
    </form>
  )
}

export default React.memo(MedicineLineItem)