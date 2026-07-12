import { useCallback, useState } from "react"

/**
 * Selected variant + prefill for the single quick-add surface.
 */
export default function useMedicinePicker({ getPrefillForVariant } = {}) {
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [selectionPrefill, setSelectionPrefill] = useState(null)

  const selectVariant = useCallback(
    (variant, explicitPrefill = null) => {
      if (!variant) return
      const prefill = explicitPrefill ?? getPrefillForVariant?.(variant.id) ?? null
      setSelectedVariant(variant)
      setSelectionPrefill(prefill)
    },
    [getPrefillForVariant]
  )

  const selectPrefEntry = useCallback(
    (entry) => {
      if (!entry?.variant) return
      const prefillAllowed = entry.prefill_allowed === true
      selectVariant(entry.variant, {
        uses: prefillAllowed ? (entry.uses ?? "") : "",
        quantity: prefillAllowed && entry.quantity != null ? String(entry.quantity) : "",
        productVariantUnitId: prefillAllowed
          ? (entry.product_variant_unit_id ?? null)
          : null,
      })
    },
    [selectVariant]
  )

  const clearSelection = useCallback(() => {
    setSelectedVariant(null)
    setSelectionPrefill(null)
  }, [])

  return {
    selectedVariant,
    selectionPrefill,
    selectVariant,
    selectPrefEntry,
    clearSelection,
  }
}
