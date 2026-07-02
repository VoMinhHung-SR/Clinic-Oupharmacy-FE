import { enrichVariantForPrescribing, getVariantDisplayName } from "../../../lib/adapters/storeProduct"

/** Stable key for merge: same variant + sale unit → one draft row. */
export const draftLineKey = (item) => `${item.id}:${item.productVariantUnitId ?? ""}`

export const buildDraftLine = (enriched, data) => ({
  id: enriched.id,
  medicineUnitId: enriched.id,
  productVariantId: enriched.id,
  productVariantUnitId: enriched.product_variant_unit_id,
  quantityInBase: Number(enriched.quantity_in_base) || 1,
  medicineName: enriched.product_name ?? getVariantDisplayName(enriched),
  packaging: enriched.selectedUnitName ?? enriched.packaging ?? "",
  uses: data.uses,
  quantity: parseInt(data.quantity, 10),
  inStock: enriched.in_stock,
  unitPrice: Number(enriched.selectedUnitPrice) || 0,
})

/**
 * @returns {{ ok: true, line: object } | { ok: false, reason: string }}
 */
export const mergeVariantIntoDraftLines = (lines, medicineUnit, data) => {
  if (!medicineUnit?.id || !data || medicineUnit.id === -1) {
    return { ok: false, reason: "invalid_input" }
  }

  const enriched = enrichVariantForPrescribing(
    medicineUnit,
    medicineUnit.selectedSaleUnitId ?? medicineUnit.product_variant_unit_id ?? null
  )

  if (!enriched.product_variant_unit_id) {
    return { ok: false, reason: "missing_unit" }
  }

  const key = draftLineKey({
    id: enriched.id,
    productVariantUnitId: enriched.product_variant_unit_id,
  })

  const existingIndex = lines.findIndex((item) => draftLineKey(item) === key)

  if (existingIndex >= 0) {
    const item = lines[existingIndex]
    const merged = {
      ...item,
      uses: data.uses,
      inStock: enriched.in_stock,
      quantity: parseInt(item.quantity, 10) + parseInt(data.quantity, 10),
      productVariantUnitId: enriched.product_variant_unit_id,
      quantityInBase: enriched.quantity_in_base,
      packaging: enriched.selectedUnitName ?? item.packaging,
      unitPrice: Number(enriched.selectedUnitPrice) || item.unitPrice || 0,
    }
    const next = [...lines]
    next[existingIndex] = merged
    return { ok: true, lines: next }
  }

  return { ok: true, lines: [...lines, buildDraftLine(enriched, data)] }
}
