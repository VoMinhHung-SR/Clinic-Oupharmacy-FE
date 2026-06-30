import { useCallback, useEffect, useMemo, useState } from "react"
import { fetchPrescriberMedicinePrefs } from "../../api/prescribingPrefs"
import { normalizeStoreVariant } from "../../model/mapStoreVariant"

const mapPrefEntry = (entry) => ({
  ...entry,
  variant: entry?.variant ? normalizeStoreVariant(entry.variant) : null,
})

/**
 * Loads doctor frequent/recent medicines from mainApp aggregation (zero migration).
 */
export default function usePrescriberMedicinePrefs({ enabled = true } = {}) {
  const [prefs, setPrefs] = useState({ frequent: [], recent: [] })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!enabled) return undefined
    let cancelled = false
    setLoading(true)
    fetchPrescriberMedicinePrefs()
      .then((res) => {
        if (cancelled) return
        const data = res?.data ?? { frequent: [], recent: [] }
        setPrefs({
          frequent: (data.frequent || []).map(mapPrefEntry).filter((e) => e.variant),
          recent: (data.recent || []).map(mapPrefEntry).filter((e) => e.variant),
        })
      })
      .catch(() => {
        if (!cancelled) setPrefs({ frequent: [], recent: [] })
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [enabled])

  const frequentVariantIds = useMemo(
    () => new Set(prefs.frequent.map((e) => e.product_variant_id)),
    [prefs.frequent]
  )

  const getPrefillForVariant = useCallback(
    (variantId) => {
      const entry = [...prefs.frequent, ...prefs.recent].find(
        (e) => e.product_variant_id === variantId
      )
      if (!entry) return null
      return {
        uses: entry.uses ?? "",
        quantity: entry.quantity != null ? String(entry.quantity) : "",
        productVariantUnitId: entry.product_variant_unit_id ?? null,
      }
    },
    [prefs.frequent, prefs.recent]
  )

  const boostVariants = useCallback(
    (variants) => {
      if (!variants?.length || frequentVariantIds.size === 0) return variants
      const boosted = []
      const rest = []
      variants.forEach((v) => {
        if (frequentVariantIds.has(v.id)) boosted.push(v)
        else rest.push(v)
      })
      return [...boosted, ...rest]
    },
    [frequentVariantIds]
  )

  return { prefs, loading, frequentVariantIds, getPrefillForVariant, boostVariants }
}
