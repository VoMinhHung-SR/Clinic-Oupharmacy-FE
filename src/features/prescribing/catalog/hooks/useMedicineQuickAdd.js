import { useCallback, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  enrichVariantForPrescribing,
  getMaxSaleQuantity,
  hasMultipleVariants,
  resolveProductEntityId,
  resolveProductVariantUnitId,
} from "../../../../lib/adapters/storeProduct"
import { fetchVariantsByProductId } from "../../api/storeCatalog"

/**
 * Form + sale-unit state for the single quick-add panel.
 * When search dedupes to one card per product, loads sibling variants for packing pick.
 */
export default function useMedicineQuickAdd({
  variant,
  prefill,
  schema,
  availableStockMap,
  onAdd,
  onSuccess,
}) {
  const [activeVariant, setActiveVariant] = useState(variant)
  const [siblingVariants, setSiblingVariants] = useState(null)
  const [siblingsLoading, setSiblingsLoading] = useState(false)
  const [selectedSaleUnitId, setSelectedSaleUnitId] = useState(null)

  useEffect(() => {
    if (!variant) {
      setActiveVariant(null)
      setSiblingVariants(null)
      return
    }

    setActiveVariant(variant)

    const productId = resolveProductEntityId(variant)
    if (!hasMultipleVariants(variant) || !productId) {
      setSiblingVariants(null)
      return
    }

    let cancelled = false
    setSiblingsLoading(true)
    fetchVariantsByProductId(productId)
      .then((res) => {
        if (cancelled) return
        const items = res?.data?.results ?? []
        if (items.length > 1) {
          setSiblingVariants(items)
          const match = items.find((item) => item.id === variant.id) ?? items[0]
          setActiveVariant(match)
        } else {
          setSiblingVariants(null)
        }
      })
      .catch(() => {
        if (!cancelled) setSiblingVariants(null)
      })
      .finally(() => {
        if (!cancelled) setSiblingsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [variant])

  const saleUnitOptions = useMemo(
    () => (Array.isArray(activeVariant?.unit_options) ? activeVariant.unit_options : []),
    [activeVariant?.unit_options]
  )
  const hasSaleUnits = saleUnitOptions.length > 0
  const showVariantPicker = Boolean(siblingVariants && siblingVariants.length > 1)

  const { register, handleSubmit, formState: { errors }, reset, setError } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { uses: "", quantity: "" },
  })

  useEffect(() => {
    if (!activeVariant) return
    const unitId =
      prefill?.productVariantUnitId ?? resolveProductVariantUnitId(activeVariant)
    setSelectedSaleUnitId(unitId)
    reset({
      uses: prefill?.uses ?? "",
      quantity: prefill?.quantity ?? "",
    })
  }, [activeVariant?.id, prefill, reset, activeVariant])

  const baseStockAvailable =
    activeVariant != null && availableStockMap
      ? availableStockMap.get(activeVariant.id)
      : activeVariant?.in_stock
  const maxSaleQty = activeVariant
    ? getMaxSaleQuantity(activeVariant, selectedSaleUnitId, baseStockAvailable)
    : 0

  const enrichedPreview = activeVariant
    ? enrichVariantForPrescribing(activeVariant, selectedSaleUnitId)
    : null

  const onSubmit = useCallback(
    (data) => {
      if (!activeVariant) return
      onAdd(enrichVariantForPrescribing(activeVariant, selectedSaleUnitId), data)
      reset({ uses: "", quantity: "" })
      onSuccess?.()
    },
    [activeVariant, onAdd, selectedSaleUnitId, reset, onSuccess]
  )

  const selectSiblingVariant = useCallback((variantId) => {
    const next = siblingVariants?.find((item) => item.id === variantId)
    if (next) setActiveVariant(next)
  }, [siblingVariants])

  return {
    register,
    handleSubmit,
    errors,
    setError,
    onSubmit,
    activeVariant,
    selectedSaleUnitId,
    setSelectedSaleUnitId,
    saleUnitOptions,
    hasSaleUnits,
    maxSaleQty,
    enrichedPreview,
    siblingVariants,
    showVariantPicker,
    siblingsLoading,
    selectSiblingVariant,
  }
}
