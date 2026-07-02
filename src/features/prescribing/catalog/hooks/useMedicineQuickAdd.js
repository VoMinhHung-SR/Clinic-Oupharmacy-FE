import { useCallback, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  enrichVariantForPrescribing,
  getMaxSaleQuantity,
  resolveProductVariantUnitId,
} from "../../../../lib/adapters/storeProduct"

/**
 * Quick-add form for one store ProductVariant row.
 * Sale units come from BE `unit_options` (ProductVariantUnit) — Phase 2a / storeApp SoT.
 * Variant (packing) is fixed by the catalog/search row the doctor already selected.
 */
export default function useMedicineQuickAdd({
  variant,
  prefill,
  schema,
  availableStockMap,
  onAdd,
  onSuccess,
}) {
  const [selectedSaleUnitId, setSelectedSaleUnitId] = useState(null)

  const saleUnitOptions = useMemo(
    () => (Array.isArray(variant?.unit_options) ? variant.unit_options : []),
    [variant?.unit_options]
  )
  const hasMultipleSaleUnits = saleUnitOptions.length > 1

  const { register, handleSubmit, formState: { errors }, reset, setError } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { uses: "", quantity: "" },
  })

  useEffect(() => {
    if (!variant) return
    const unitId =
      prefill?.productVariantUnitId ?? resolveProductVariantUnitId(variant)
    setSelectedSaleUnitId(unitId)
    reset({
      uses: prefill?.uses ?? "",
      quantity: prefill?.quantity ?? "",
    })
  }, [variant?.id, prefill, reset, variant])

  const baseStockAvailable =
    variant != null && availableStockMap
      ? availableStockMap.get(variant.id)
      : variant?.in_stock
  const maxSaleQty = variant
    ? getMaxSaleQuantity(variant, selectedSaleUnitId, baseStockAvailable)
    : 0

  const enrichedPreview = variant
    ? enrichVariantForPrescribing(variant, selectedSaleUnitId)
    : null

  const onSubmit = useCallback(
    (data) => {
      if (!variant) return
      onAdd(enrichVariantForPrescribing(variant, selectedSaleUnitId), data)
      reset({ uses: "", quantity: "" })
      onSuccess?.()
    },
    [variant, onAdd, selectedSaleUnitId, reset, onSuccess]
  )

  return {
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
  }
}
