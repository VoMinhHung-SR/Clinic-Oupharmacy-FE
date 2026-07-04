/** Max chips shown before "show more". */
export const QUICK_ACCESS_VISIBLE_LIMIT = 6

/** Truncate chip label; full text goes in tooltip. */
export const QUICK_ACCESS_LABEL_MAX = 32

export const truncateQuickAccessLabel = (text, max = QUICK_ACCESS_LABEL_MAX) => {
  if (!text) return ""
  const trimmed = String(text).trim()
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max - 1)}…`
}

const pickNewerIso = (a, b) => {
  const ta = a ? Date.parse(a) : 0
  const tb = b ? Date.parse(b) : 0
  if (!ta && !tb) return a || b
  return tb >= ta ? b : a
}

/**
 * Merge frequent + recent prefs into one ranked list (deduped by variant id).
 */
export function mergeQuickAccessEntries(frequent = [], recent = []) {
  const frequentIds = new Set(
    frequent.map((e) => e.product_variant_id).filter((id) => id != null)
  )
  const byId = new Map()

  const upsert = (entry) => {
    const id = entry?.product_variant_id
    if (id == null) return
    const prev = byId.get(id)
    if (!prev) {
      byId.set(id, { ...entry, isFrequent: frequentIds.has(id) })
      return
    }
    byId.set(id, {
      ...prev,
      ...entry,
      variant: entry.variant ?? prev.variant,
      prescribe_count: Math.max(prev.prescribe_count ?? 0, entry.prescribe_count ?? 0),
      last_prescribed_at: pickNewerIso(prev.last_prescribed_at, entry.last_prescribed_at),
      uses: entry.uses ?? prev.uses,
      quantity: entry.quantity ?? prev.quantity,
      product_variant_unit_id: entry.product_variant_unit_id ?? prev.product_variant_unit_id,
      isFrequent: prev.isFrequent || frequentIds.has(id),
    })
  }

  frequent.forEach(upsert)
  recent.forEach(upsert)

  return Array.from(byId.values()).sort((a, b) => {
    const countDiff = (b.prescribe_count ?? 0) - (a.prescribe_count ?? 0)
    if (countDiff !== 0) return countDiff
    const ta = a.last_prescribed_at ? Date.parse(a.last_prescribed_at) : 0
    const tb = b.last_prescribed_at ? Date.parse(b.last_prescribed_at) : 0
    return tb - ta
  })
}

/** Remove entries whose variant id is in excludeIds (draft lines, L1 overlap). */
export function excludeVariantIds(entries = [], excludeIds = []) {
  const exclude = excludeIds instanceof Set ? excludeIds : new Set(excludeIds)
  if (!exclude.size) return entries
  return entries.filter((e) => e?.product_variant_id != null && !exclude.has(e.product_variant_id))
}
